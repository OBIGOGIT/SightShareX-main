#!/usr/bin/env python3

import sys
import setproctitle
setproctitle.setproctitle("sharing_info")
from ros_manager import ROSManager
from planning.local_path_planner import LocalPathPlanner
from perception.obstacle_handler import ObstacleHandler
from control.control import Control
from hd_map.map import MAP

from transmitter.simulator import Simulator

def main():
    if len(sys.argv) != 3 :
        type = 'sim'
        map_name = 'Solbat'
    else:
        type = str(sys.argv[1])#sim, ego, target
        map_name = str(sys.argv[2])
    
    map = MAP(map_name)
    local_path_planner  = LocalPathPlanner(map)
    obstacle_handler = ObstacleHandler(local_path_planner.phelper)
    control = Control()
    
    if type == 'ego' or type == 'target':
        simulator = None
    else:
        simulator = Simulator(map_name)
    
    ros_manager = ROSManager(type, map, local_path_planner, obstacle_handler, control, simulator=simulator)
    ros_manager.execute()

if __name__=="__main__":
    main()