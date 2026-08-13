from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os
import math

base_dir = r"C:\Users\Administrator\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a7c175a110339bb9077c1e5\dgd-xiaochengxu\images"
os.makedirs(base_dir, exist_ok=True)

# 1. 更精致的用户头像（卡通人）
size = 240
img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
draw = ImageDraw.Draw(img)
# 白圆
draw.ellipse([6, 6, size-6, size-6], fill=(255, 255, 255, 255), outline=(230, 230, 230, 255), width=3)

# 头发（黑色刘海）
hair_points = [
    (40, 90), (60, 55), (90, 45), (120, 42), (150, 45), (180, 55), (200, 90),
    (200, 120), (190, 100), (170, 75), (140, 68), (120, 70), (100, 68), (70, 75),
    (50, 100), (40, 120)
]
draw.polygon(hair_points, fill=(30, 30, 30, 255))

# 眼睛（椭圆）
draw.ellipse([78, 110, 98, 130], fill=(30, 30, 30, 255))
draw.ellipse([142, 110, 162, 130], fill=(30, 30, 30, 255))
# 高光
draw.ellipse([84, 114, 92, 122], fill=(255, 255, 255, 255))
draw.ellipse([148, 114, 156, 122], fill=(255, 255, 255, 255))

# 腮红
for x, y in [(60, 150), (180, 150)]:
    draw.ellipse([x-12, y-8, x+12, y+8], fill=(255, 200, 200, 80))

# 微笑
draw.arc([80, 130, 160, 180], start=0, end=180, fill=(30, 30, 30, 255), width=5)

img.save(os.path.join(base_dir, 'avatar-default.png'))


# 2. VIP 卡片背景（银色金属光泽）
w, h = 750, 360
img = Image.new('RGBA', (w, h), (255, 255, 255, 0))
draw = ImageDraw.Draw(img)

# 基础银色渐变（对角线）
for y in range(h):
    for x in range(w):
        # 对角线位置 0-1
        t = (x + y) / (w + h)
        # 银色：亮-暗-亮
        if t < 0.5:
            k = t * 2
            base = (235 - 20*k, 235 - 20*k, 240 - 20*k)
        else:
            k = (t - 0.5) * 2
            base = (215 + 20*k, 215 + 20*k, 220 + 20*k)
        img.putpixel((x, y), tuple(int(v) for v in base) + (255,))

# 金属光泽高光（斜向）
for i in range(-100, w + h + 100, 3):
    x0, y0 = max(0, i), max(0, -i)
    x1, y1 = min(w, i + h), min(h, w - i)
    # 只在中间区域加高光
    pass

# 用渐变叠加高光
overlay = Image.new('RGBA', (w, h), (255, 255, 255, 0))
overlay_draw = ImageDraw.Draw(overlay)
# 左上到右下的高光带
for i in range(0, w + h, 2):
    alpha = int(40 * math.exp(-((i - (w+h)*0.35) ** 2) / (2 * 150 ** 2)))
    overlay_draw.line([(max(0, i), max(0, -i)), (min(w, i + h), min(h, w - i))], fill=(255, 255, 255, alpha), width=3)

img = Image.alpha_composite(img, overlay)

# 叠加暗部增加金属感
shadow = Image.new('RGBA', (w, h), (255, 255, 255, 0))
shadow_draw = ImageDraw.Draw(shadow)
for i in range(0, w + h, 2):
    alpha = int(30 * math.exp(-((i - (w+h)*0.75) ** 2) / (2 * 180 ** 2)))
    shadow_draw.line([(max(0, i), max(0, -i)), (min(w, i + h), min(h, w - i))], fill=(80, 80, 90, alpha), width=4)

img = Image.alpha_composite(img, shadow)
draw = ImageDraw.Draw(img)

# VIP 半透明字样
try:
    font = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", 170)
except:
    font = ImageFont.load_default()
draw.text((20, 60), "VIP", fill=(0, 0, 0, 12), font=font)

# 右侧皇冠 V 图标
cx, cy, r = 620, 180, 70
draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(255, 255, 255, 230), outline=(160, 160, 170, 180), width=5)
# 皇冠
crown = [(cx, cy-45), (cx+35, cy-18), (cx+55, cy-28), (cx+48, cy+15), (cx, cy+35), (cx-48, cy+15), (cx-55, cy-28), (cx-35, cy-18)]
draw.polygon(crown, fill=(180, 180, 190, 255))
# V
try:
    v_font = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", 55)
except:
    v_font = ImageFont.load_default()
bbox = draw.textbbox((0, 0), "V", font=v_font)
vw = bbox[2] - bbox[0]
vh = bbox[3] - bbox[1]
draw.text((cx - vw/2, cy - vh/2 + 5), "V", fill=(120, 120, 130, 255), font=v_font)

# 圆角矩形遮罩
mask = Image.new('L', (w, h), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.rounded_rectangle([0, 0, w, h], radius=40, fill=255)
img.putalpha(mask)

img.save(os.path.join(base_dir, 'vip-card-bg.png'))

print('activation assets v2 generated')
