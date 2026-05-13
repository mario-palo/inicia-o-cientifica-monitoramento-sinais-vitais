import asyncio
import struct
import json
import websockets
from bleak import BleakScanner, BleakClient

DEVICE_NAME = "ESP32_TEMP"
CHAR_UUID = "00005678-0000-1000-8000-00805f9b34fb"

WS_SERVER = 'ws://localhost:8080/ws'

ws = None

# =========================
# PARSE
# =========================
def parse_data(data):
    if len(data) != 16:
        return None

    t = struct.unpack_from("<I", data, 0)[0]
    temp = struct.unpack_from("<f", data, 4)[0]
    red = struct.unpack_from("<I", data, 8)[0]
    ir = struct.unpack_from("<I", data, 12)[0]

    if red < 10000 or ir < 10000:
        print("📌 Coloque o dedo no sensor...")
        return None

    return {
        "timestamp": t,
        "temp": temp,
        "red": red,
        "ir": ir
    }

# =========================
# WEBSOCKET SEND
# =========================
async def send_ws(data):
    global ws
    if ws:
        await ws.send(json.dumps(data))

# =========================
# NOTIFY BLE
# =========================
def notification_handler(sender, data):
    parsed = parse_data(data)

    if parsed:
        print(parsed)

        asyncio.create_task(send_ws(parsed))

# =========================
# FIND DEVICE
# =========================
async def find_device():
    print("🔍 Procurando ESP32...")

    devices = await BleakScanner.discover()

    for d in devices:
        if d.name == DEVICE_NAME:
            return d.address

    return None

# =========================
# MAIN
# =========================
async def run():
    global ws

    ws = await websockets.connect(WS_SERVER)
    print("🌐 WebSocket conectado")

    while True:
        addr = await find_device()

        if not addr:
            await asyncio.sleep(2)
            continue

        try:
            async with BleakClient(addr) as client:
                print("🔗 BLE conectado")

                await client.start_notify(CHAR_UUID, notification_handler)

                while True:
                    await asyncio.sleep(1)

        except Exception as e:
            print("Erro:", e)
            await asyncio.sleep(2)

asyncio.run(run())