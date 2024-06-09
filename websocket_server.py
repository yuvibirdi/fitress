from flask import Flask
from flask_socketio import SocketIO

import socket

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')

# UDP server function
def udp_send(ex_name):
    udp_ip = "localhost"
    udp_port = 420
    message = ex_name.encode()
    print("udp target ip: %s" % udp_ip)
    print("udp target port: %s" % udp_port)
    print("message: %s" % message)
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
        sock.sendto(message, (udp_ip, udp_port))

# WebSocket event handler
@socketio.on('connect')
def handle_connect():
    print('WebSocket client connected')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
    print("something maybe worked")
