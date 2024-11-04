
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import map_config
from pyproj import Proj, Transformer

# Load the CSV data
data = pd.read_csv("../log/target_data_20241104_150742_3.csv")

# Constants
EARTH_RADIUS = 6378137.0  # in meters

proj_wgs84 = Proj(proj='latlong', datum='WGS84') 
base_lla = map_config.get_base_lla("Solbat")
proj_enu = Proj(proj='aeqd', datum='WGS84', lat_0=base_lla[0], lon_0=base_lla[1], h_0=base_lla[2])
geo2enu_transformer = Transformer.from_proj(proj_wgs84, proj_enu)

# Conversion to ENU coordinates
def latlon_to_enu(lat, lon):
    e,n,u =  geo2enu_transformer.transform(lon, lat, 5)
    return e,n

# Apply the ENU conversion
enu_coordinates = data.apply(lambda row: latlon_to_enu(row["latitude"], row["longitude"]), axis=1)
data["east"], data["north"] = zip(*enu_coordinates)
print(enu_coordinates)
# Plotting
time = range(len(data))  # seconds based on the number of rows

# 1. Path (ENU coordinates)
plt.figure(figsize=(10, 6))
plt.plot(data["east"], data["north"], linestyle='-', color='b')
plt.title("Path of the Car (ENU Coordinates)")
plt.xlabel("East (m)")
plt.ylabel("North (m)")
plt.grid()

# 2. Other variables vs time
fig, axs = plt.subplots(8, 1, figsize=(10, 24), sharex=True)
fig.suptitle("Car Data Over Time (1-second intervals)", y=1.02)

# Car Heading
axs[0].plot(time, data["car_heading"], linestyle='-')
axs[0].set_ylabel("Car Heading (degrees)")
axs[0].grid()

# Car Velocity
axs[1].plot(time, data["car_velocity"], linestyle='-')
axs[1].set_ylabel("Car Velocity (m/s)")
axs[1].grid()

# Lateral Acceleration
axs[2].plot(time, data["lateral_acc"], linestyle='-')
axs[2].set_ylabel("Lateral Acceleration (m/s²)")
axs[2].grid()

# Longitudinal Acceleration
axs[3].plot(time, data["longitudinal_acc"], linestyle='-')
axs[3].set_ylabel("Longitudinal Acceleration (m/s²)")
axs[3].grid()

# Packet Rate
axs[4].plot(time, data["packet_rate"], linestyle='-')
axs[4].set_xlabel("Time (s)")
axs[4].set_ylabel("Packet Rate (Hz)")
axs[4].grid()

axs[5].plot(time, data["rtt"], linestyle='-')
axs[5].set_ylabel("RTT (ms)")
axs[5].grid()

axs[6].plot(time, data["speed"], linestyle='-')
axs[6].set_ylabel("Speed (m/s)")
axs[6].grid()

axs[7].plot(time, data["car_distance"], linestyle='-')
axs[7].set_xlabel("Time (s)")
axs[7].set_ylabel("Car Distance (m)")
axs[7].grid()


plt.tight_layout()
plt.show()