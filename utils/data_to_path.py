import pandas as pd
import matplotlib.pyplot as plt

# Load data
data = pd.read_csv("../log/ego_data_20241112_211345.csv")

# Initialize the plot
plt.figure(figsize=(10, 6))
plt.title("Path of the Car (ENU Coordinates)")
plt.xlabel("East (m)")
plt.ylabel("North (m)")
plt.grid()

# Variable to track if a state change has occurred
state_changed = False

# Plot path with color changes based on state
for i in range(1, len(data)):
    # Check if the state has changed
    if not state_changed and data['state'].iloc[i] != data['state'].iloc[i - 1]:
        state_changed = True  # Mark that the state has changed
    
    # Set color to red if state has changed, otherwise blue
    color = 'r' if state_changed else 'b'
    plt.plot([data["x"].iloc[i - 1], data["x"].iloc[i]], [data["y"].iloc[i - 1], data["y"].iloc[i]], color=color)

plt.tight_layout()
plt.show()
