from PIL import Image, ImageDraw, ImageFont
import os

base_dir = r"C:\Users\Administrator\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a7c175a110339bb9077c1e5\dgd-xiaochengxu\images"
os.makedirs(base_dir, exist_ok=True)

# 1. 默认笑脸头像（白色圆形 + 黑色笑脸）
size = 200
img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
draw = ImageDraw.Draw(img)
# 白圆
draw.ellipse([4, 4, size-4, size-4], fill=(255, 255, 255, 255), outline=(220, 220, 220, 255), width=2)
# 眼睛
draw.ellipse([70, 80, 88, 98], fill=(40, 40, 40, 255))
draw.ellipse([112, 80, 130, 98], fill=(40, 40, 40, 255))
# 微笑弧线
draw.arc([64, 90, 136, 150], start=0, end=180, fill=(40, 40, 40, 255), width=4)
img.save(os.path.join(base_dir, 'avatar-default.png'))

# 2. VIP 皇冠图标（带 V 的盾牌/皇冠）
size = 160
img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
draw = ImageDraw.Draw(img)
# 外圆
draw.ellipse([10, 10, size-10, size-10], fill=(255, 255, 255, 230), outline=(180, 180, 180, 200), width=4)
# 皇冠
crown_points = [(80, 38), (104, 58), (124, 50), (118, 88), (80, 100), (42, 88), (36, 50), (56, 58)]
draw.polygon(crown_points, fill=(200, 200, 200, 255))
# V 字
try:
    font = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", 48)
except:
    font = ImageFont.load_default()
bbox = draw.textbbox((0, 0), "V", font=font)
text_w = bbox[2] - bbox[0]
text_h = bbox[3] - bbox[1]
draw.text(((size - text_w) / 2, 58), "V", fill=(120, 120, 120, 255), font=font)
img.save(os.path.join(base_dir, 'vip-crown.png'))

print('activation assets generated')
