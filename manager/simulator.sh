#!/bin/bash

cd ../sharing_info
python3 main.py ego Solbat True &
cd ../ui/visualizer
python3 visualizer.py ego & 
cd ../
python3 ui.py ego