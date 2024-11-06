#!/usr/bin/env python
from libs.socket_handler_b import SocketHandlerB

class V2VSharingB:
    def __init__(self, type, interface):
        self.socket_handler = SocketHandlerB(type, interface)
        self.IP = '192.168.1.124' if type == 'ego' else '192.168.1.125'
 
    
    def set_obu(self):
        if self.socket_handler.connect(self.IP) < 0:
            print("[V2V SharingB] Connection Failed")
            return -1
        if self.socket_handler.register() < 0:
            print("[V2V SharingB] Registratino Failed")
            return -1
        if  self.socket_handler.set_tx() < 0:
            print("[V2V SharingB] Tx Setting Failed")
            return -1
        if  self.socket_handler.set_rx() < 0:
            print("[V2V SharingB] Rx Setting Failed")
            return -1
        return 1


    def do_tx(self, state, paths, obstacles):
        return self.socket_handler.tx(state, paths, obstacles)

    def do_rx(self):
        return self.socket_handler.rx()

    def do_calc(self):
        return self.socket_handler.calc_comm()

    def do_calc_rate(self, Hz):
        return self.socket_handler.calc_rate(Hz)