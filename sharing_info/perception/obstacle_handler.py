import numpy as np
import math


class ObstacleHandler:
    def __init__(self):
        self.setting_values()

    def setting_values(self):
        self.local_pose = None
        self.prev_local_pose = None
        self.current_heading = 0.0

    def update_value(self, local_pose, heading):
        self.local_pose = local_pose
        self.current_heading = heading
        if self.prev_local_pose is None:
            self.prev_local_pose = self.local_pose
    
    def check_dimension(self, dimension):
        if dimension[0] > 2 and dimension[1] > 1.5 :
            return True
        else:
            return False

    def object2enu(self,  obs_pose):
        rad = np.radians(self.current_heading)

        nx = math.cos(rad) * obs_pose[0] - math.sin(rad) * obs_pose[1]
        ny = math.sin(rad) * obs_pose[0] + math.cos(rad) * obs_pose[1]

        obj_x = self.local_pose[0] + nx
        obj_y = self.local_pose[1] + ny

        return obj_x, obj_y
    
    def filtering_by_lane_num(self, lane_num, fred_d):
        if lane_num == 1:
            if -1.45< fred_d < 4.15:
                return True
            else:
                return False
        elif lane_num == 2:
            if -4.15 < fred_d < 4.15:
                return True
            else:
                return False
        elif lane_num == 3:
            if -4.15 < fred_d < 1.5:
                return True
            else:
                return False
            
    def distance(self, x1, y1, x2, y2):
        return np.sqrt((x2-x1)**2+(y2-y1)**2)

    def object2frenet(self, obs_enu):  

        n_x = self.local_pose[0] - self.prev_local_pose[0]
        n_y = self.local_pose[1] - self.prev_local_pose[1]
        x_x = obs_enu[0] - self.prev_local_pose[0]
        x_y = obs_enu[1] - self.prev_local_pose[1]

        if (n_x*n_x+n_y*n_y) > 0:
            proj_norm = (x_x*n_x+x_y*n_y)/(n_x*n_x+n_y*n_y)
        else:
            proj_norm = 0
        proj_x = proj_norm*n_x
        proj_y = proj_norm*n_y
        
        frenet_d = self.distance(x_x, x_y, proj_x, proj_y)

        normal_x, normal_y = n_y, -n_x
        dot_product = normal_x * x_x + normal_y * x_y
        if dot_product < 0:
            frenet_d *= -1

        self.prev_local_pose = self.local_pose
        return frenet_d
