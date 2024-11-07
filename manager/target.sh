#!/bin/bash

cd ../sharing_info
python3 main.py target Solbat 0 &
cd ../v2x
python3 main.py target 0 &
cd ../ui/visualizer
python3 visualizer.py target &
cd ../
python3 ui.py target &
cd ../utils
# python3 obigo_control.py target &
python3 make_data.py target &
cd ~/Documents
rosbag record /target/CommunicationPerformance /target/EgoShareInfo /target/TargetShareInfo  /novatel/oem7/inspva /novatel/oem7/odom /target/user_input /target/simulator_input