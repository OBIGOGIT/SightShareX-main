import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Load data
data = pd.read_csv("../log/target_data_20241112_211533.csv")

# Define the rotation function
rotation_angle = 88.35

def rotate_points(x, y, angle):
    angle_rad = np.radians(angle)  
    x = np.array(x)  
    y = np.array(y)  
    x_rotated = x * np.cos(angle_rad) - y * np.sin(angle_rad)
    y_rotated = x * np.sin(angle_rad) + y * np.cos(angle_rad)
    return x_rotated, y_rotated

# Offset data to start from (0,0)
data["x"] = data["x"] - data["x"].iloc[0]
data["y"] = data["y"] - data["y"].iloc[0]

# Apply rotation
data["x_rotated"], data["y_rotated"] = rotate_points(data["x"], data["y"], rotation_angle)

state_change_index = data[data["state"] != 0].index[0]
# Get the subset of data 10 points before and after the state change
subset_data = data.iloc[max(state_change_index - 7, 0): state_change_index + 7]

# Initialize the plot
plt.figure(figsize=(10, 6))
plt.title("Path of the Car")
plt.xlabel("East (m)")
plt.ylabel("North (m)")
plt.grid()

# Variable to track if a state change has occurred
state_changed = False

# Plot path with color changes based on state
for i in range(1, len(subset_data)):
    # Check if the state has changed
    if not state_changed and subset_data['state'].iloc[i] != subset_data['state'].iloc[i - 1]:
        state_changed = True  # Mark that the state has changed
    
    # Set color to red if state has changed, otherwise blue
    color = 'r' if state_changed else 'b'
    plt.plot([subset_data["x_rotated"].iloc[i - 1], subset_data["x_rotated"].iloc[i]], 
             [subset_data["y_rotated"].iloc[i - 1], subset_data["y_rotated"].iloc[i]], color=color)

plt.tight_layout()
plt.show()