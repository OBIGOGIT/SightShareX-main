#!/bin/bash

cd ../sharing_info
python3 main.py target Solbat 1 1&
cd ../ui/visualizer
python3 visualizer.py target &
cd ../
python3 ui.py target 