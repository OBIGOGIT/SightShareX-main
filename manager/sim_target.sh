#!/bin/bash

cd ../sharing_info
python3 main.py target Solbat 1 3&
cd ../v2x
python3 main.py target 2 out&
cd ../ui/visualizer
python3 visualizer.py target &
cd ../
python3 ui.py target &
cd ../utils
python3 make_data.py target