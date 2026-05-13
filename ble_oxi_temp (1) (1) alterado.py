import asyncio
import struct
import time
from bleak import BleakScanner, BleakClient

DEVICE_NAME = "ESP32_TEMP"
CHAR_UUID = "00005678-0000-1000-8000-00805f9b34fb"


class MyDelegate:
    def __init__(self):
        self.warned = False

    def handle_data(self, data):
        try:
            if len(data) == 16:
                t, temp, red, ir = struct.unpack('<IfII', data)

                # 🔍 DETECÇÃO DE DEDO
                if ir < 50000 and red < 50000:
                    if not self.warned:
                        print("📌 Coloque o dedo no sensor...")
                        self.warned = True
                else:
                    self.warned = False
                    print(f"⏱ {t} | 🌡 {temp:.2f} °C | RED {red} | IR {ir}")

            else:
                print("Tamanho inesperado:", len(data), data)

        except Exception as e:
            print("Erro:", e)


delegate = MyDelegate()


def notification_handler(sender, data):
    delegate.handle_data(data)


async def find_device():
    print("🔍 Procurando ESP32...")

    devices = await BleakScanner.discover(timeout=5.0)

    for d in devices:
        if d.name and DEVICE_NAME in d.name:
            print(f"✅ Encontrado: {d.name} [{d.address}]")
            return d.address

    return None


async def run():
    while True:
        addr = await find_device()

        if addr is None:
            print("❌ Não encontrado. Tentando novamente...")
            await asyncio.sleep(2)
            continue

        print("🔗 Conectando...")

        try:
            async with BleakClient(addr) as client:
                print("📡 Conectado!")

                await client.start_notify(CHAR_UUID, notification_handler)

                while True:
                    await asyncio.sleep(1)

        except Exception as e:
            print("⚠️ Desconectado ou erro:", e)
            print("🔄 Tentando reconectar...\n")
            await asyncio.sleep(2)


asyncio.run(run())