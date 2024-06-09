import socket

def udp_send(ex_name):
    udp_ip = "127.0.0.1"
    udp_port = 420
    message = ex_name.encode()
    print("udp target ip: %s" % udp_ip)
    print("udp target port: %s" % udp_port)
    print("message: %s" % message)
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
        sock.sendto(message, (udp_ip, udp_port))
