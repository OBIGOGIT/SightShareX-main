#!/bin/bash

cd ../sharing_info
python3 main.py ego Solbat 1 3&
cd ../v2x
python3 main.py ego 1 out&
cd ../ui/visualizer
python3 visualizer.py ego &
cd ../
python3 ui.py ego &
cd ../utils
python3 make_data.py ego 