import numpy as np 
arr = np.array([5, 10, 15]) 
two_d = arr.reshape(1, -1) 
print("2D Array:") 
print(two_d) 
print("Shape:", two_d.shape) 
