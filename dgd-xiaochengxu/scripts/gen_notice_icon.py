from PIL import Image, ImageDraw
import os

dir_path = r"C:\Users\Administrator\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a7c175a110339bb9077c1e5\dgd-xiaochengxu\images"
os.makedirs(dir_path, exist_ok=True)

img = Image.new('RGBA', (64, 64), (255, 255, 255, 0))
draw = ImageDraw.Draw(img)

# 喇叭主体
points = [(12, 24), (22, 24), (32, 14), (32, 50), (22, 40), (12, 40)]
draw.polygon(points, outline='#999999', width=4)

# 喇叭口弧线
draw.arc([38, 18, 52, 46], start=-70, end=70, fill='#999999', width=4)

img.save(os.path.join(dir_path, 'icon-notice.png'))
print('icon-notice.png saved')
