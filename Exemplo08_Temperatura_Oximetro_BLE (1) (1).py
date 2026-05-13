from machine import Pin, I2C, Timer
import ubluetooth
import struct
import time
import utime

# ======================
# I2C (MAX30102)
# ======================
i2c2 = I2C(1, scl=Pin(26), sda=Pin(25), freq=400000)

MAX30102_ADDR = 0x57

def write_reg(reg, value):
    i2c2.writeto_mem(MAX30102_ADDR, reg, bytes([value]))

# ======================
# I2C (MLX90614)
# ======================
i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=100000)

MLX_ADDR = 0x5A
TEMP_REG = 0x07

def read_mlx_temp():
    try:
        data = i2c.readfrom_mem(MLX_ADDR, TEMP_REG, 3)
        temp_raw = data[0] | (data[1] << 8)
        temp_c = (temp_raw * 0.02) - 273.15
        return temp_c
    except:
        return None

# ======================
# BLE
# ======================
ble = ubluetooth.BLE()
ble.active(True)

SERVICE_UUID = ubluetooth.UUID(0x1234)
CHAR_UUID = ubluetooth.UUID(0x5678)

CHAR = (CHAR_UUID, ubluetooth.FLAG_NOTIFY | ubluetooth.FLAG_READ)
SERVICE = (SERVICE_UUID, (CHAR,))
((char_handle,),) = ble.gatts_register_services((SERVICE,))

connections = set()

# ======================
# Advertising
# ======================
def advertising_payload(name=None):
    payload = bytearray()

    def _append(adv_type, value):
        payload.extend(bytes((len(value) + 1, adv_type)) + value)

    _append(0x01, b'\x06')
    if name:
        _append(0x09, name.encode())

    return payload

DEVICE_NAME = "ESP32_TEMP"
adv_data = advertising_payload(name=DEVICE_NAME)

def start_advertising():
    ble.gap_advertise(500_000, adv_data)
    print("📡 Advertising...")

# ======================
# IRQ
# ======================
def irq(event, data):
    if event == 1:  # CONNECT
        conn_handle, _, _ = data
        connections.add(conn_handle)
        print("✅ Conectado:", conn_handle)

    elif event == 2:  # DISCONNECT
        conn_handle, _, _ = data
        connections.discard(conn_handle)
        print("❌ Desconectado:", conn_handle)
        start_advertising()

ble.irq(irq)
start_advertising()

# ======================
# Timer
# ======================
read_flag = False

def timer_callback(t):
    global read_flag
    read_flag = True

timer = Timer(0)
timer.init(period=20, mode=Timer.PERIODIC, callback=timer_callback)

# ======================
# Setup MAX30102
# ======================
def init_max30102():
    # 1. Reset do sensor
    write_reg(0x09, 0x40)
    utime.sleep_ms(100)
    
    # 2. Configuração do Modo: 0x03 para SpO2 (Red + IR)
    write_reg(0x09, 0x03)
    
    # 3. SpO2 Config: ADC range 4096nA, Sample Rate 100Hz, Pulse Width 411us
    write_reg(0x0A, 0x27)
    
    # 4. Corrente dos LEDs (~7mA para teste)
    write_reg(0x0C, 0x24) # LED1 (Vermelho)
    write_reg(0x0D, 0x24) # LED2 (IR)
    
    # 5. Limpar ponteiros do FIFO
    write_reg(0x04, 0x00) # FIFO Write Pointer
    write_reg(0x05, 0x00) # Overflow Counter
    write_reg(0x06, 0x00) # FIFO Read Pointer

def read_fifo():
    # O FIFO armazena 3 bytes por canal (Red e IR) = 6 bytes no total
    data = i2c2.readfrom_mem(MAX30102_ADDR, 0x07, 6)
    
    # Combina os bytes para formar inteiros de 18-bits
    red = (data[0] << 16 | data[1] << 8 | data[2]) & 0x03FFFF
    ir = (data[3] << 16 | data[4] << 8 | data[5]) & 0x03FFFF
    
    return red, ir

# Inicializa
init_max30102()

# ======================
# Loop
# ======================
print("🚀 Iniciado")

cont = 1
temp = 0
while True:
    if read_flag:
        read_flag = False

        if cont == 4:
            temp = read_mlx_temp()
            cont = 1

        # Verifica se há dados disponíveis no registrador de status
        status = i2c2.readfrom_mem(MAX30102_ADDR, 0x00, 1)[0]
        
        # Se o bit de "New Data" (A_FULL ou PPG_RDY) estiver ativo
        red, ir = read_fifo()

        if temp is not None:
            t = utime.ticks_ms()
            # print("🌡", temp)
            if red > 10000: # Filtro simples para ignorar ruído se não houver dedo
                
                print(f"Instant: {t} | RED: {red} | IR: {ir} | Temp: {temp}")
            else:
                print("Coloque o dedo no sensor...")
            
            data = struct.pack('<IfII', t, temp, red, ir)

            # 🔥 importante
            ble.gatts_write(char_handle, data)

            for conn in connections:
                try:
                    ble.gatts_notify(conn, char_handle)
                except:
                    pass

        cont = cont + 1


