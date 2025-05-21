import sys
import cv2

def modify_image(image):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    image = cv2.GaussianBlur(image, (5, 5), 0)
    image = cv2.Canny(image, 50, 150)
    return image

print('Arguments count: ', len(sys.argv))
print('Arguments: ', sys.argv)

input_path = sys.argv[1]
output_path = (sys.argv[2] if len(sys.argv) == 3 else "output.jpg")

print('Input path: ', input_path)
print('Output path: ', output_path)

image = cv2.imread(input_path)
print('Image loaded')

modified_image = modify_image(image)
print('Image modified')

cv2.imwrite(output_path, modified_image)
print('Image saved')
