def udp_send(ex_name):
    print(ex_name)
    UDP_IP = "127.0.0.1"
    UDP_PORT = 69420
    MESSAGE = (ex_name).encode()
    print("UDP target IP: %s" % UDP_IP)
    print("UDP target port: %s" % UDP_PORT)
    print("message: %s" % MESSAGE)
    sock = socket.socket(socket.AF_INET, # Internet
                        socket.SOCK_DGRAM) # UDP
    sock.sendto(MESSAGE, (UDP_IP, UDP_PORT))
