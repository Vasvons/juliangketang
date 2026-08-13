from PIL import Image, ImageDraw, ImageFont
import os
import math

base_dir = r"C:\Users\Administrator\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a7c175a110339bb9077c1e5\dgd-xiaochengxu\images"
os.makedirs(base_dir, exist_ok=True)

# 1. 默认头像：白底黑笑脸（参考图样式）
size = 240
img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
draw = ImageDraw.Draw(img)
# 白圆底
draw.ellipse([0, 0, size, size], fill=(255, 255, 255, 255), outline=(230, 230, 230, 255), width=2)
# 黑色眼睛（椭圆）
draw.ellipse([88, 95, 108, 125], fill=(30, 30, 30, 255))
draw.ellipse([132, 95, 152, 125], fill=(30, 30, 30, 255))
# 黑色微笑弧线
draw.arc([82, 105, 158, 175], start=20, end=160, fill=(30, 30, 30, 255), width=7)

img.save(os.path.join(base_dir, 'avatar-default.png'))


# 2. VIP 卡片背景：银色金属 + 斜向高光 + VIP 水印 + 右侧徽章
w, h = 750, 500
img = Image.new('RGBA', (w, h), (255, 255, 255, 0))
draw = ImageDraw.Draw(img)

# 基础银色渐变：左上亮银 -> 右下深银
for y in range(h):
    for x in range(w):
        t = (x * 0.6 + y) / (w * 0.6 + h)
        t = max(0, min(1, t))
        # 银灰冷色
        r = int(225 - 45 * t)
        g = int(228 - 42 * t)
        b = int(235 - 35 * t)
        img.putpixel((x, y), (r, g, b, 255))

# 斜向高光带（金属反光）
overlay = Image.new('RGBA', (w, h), (255, 255, 255, 0))
overlay_draw = ImageDraw.Draw(overlay)
for i in range(-h, w + h):
    # 主高光
    d = (i - w * 0.25)
    alpha = int(70 * math.exp(-(d ** 2) / (2 * 140 ** 2)))
    overlay_draw.line([(max(0, i), 0), (max(0, i) - h, h)], fill=(255, 255, 255, alpha), width=4)
    # 次高光
    d2 = (i - w * 0.62)
    alpha2 = int(35 * math.exp(-(d2 ** 2) / (2 * 100 ** 2)))
    overlay_draw.line([(max(0, i), 0), (max(0, i) - h, h)], fill=(255, 255, 255, alpha2), width=3)
img = Image.alpha_composite(img, overlay)

# 暗部阴影（增加层次）
shadow = Image.new('RGBA', (w, h), (255, 255, 255, 0))
shadow_draw = ImageDraw.Draw(shadow)
for i in range(-h, w + h):
    d = (i - w * 0.85)
    alpha = int(50 * math.exp(-(d ** 2) / (2 * 180 ** 2)))
    shadow_draw.line([(max(0, i), 0), (max(0, i) - h, h)], fill=(60, 65, 80, alpha), width=5)
img = Image.alpha_composite(img, shadow)

draw = ImageDraw.Draw(img)

# VIP 半透明水印字样
for idx, font_path in enumerate([
    "C:\\Windows\\Fonts\\arialbd.ttf",
    "C:\\Windows\\Fonts\\Arial.ttf"
]):
    try:
        font = ImageFont.truetype(font_path, 190)
        break
    except:
        font = ImageFont.load_default()

bbox = draw.textbbox((0, 0), "VIP", font=font)
tw = bbox[2] - bbox[0]
th = bbox[3] - bbox[1]
draw.text((40, (h - th) // 2 + 20), "VIP", fill=(140, 145, 155, 10), font=font)

# 右侧 VIP 徽章：白色圆形底 + 灰色菱形 V
cx, cy, r = 600, h // 2, 70
draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(255, 255, 255, 245), outline=(180, 185, 195, 200), width=3)

# 画菱形 V 背景
diamond = [(cx, cy-46), (cx+44, cy-12), (cx, cy+46), (cx-44, cy-12)]
draw.polygon(diamond, fill=(200, 205, 215, 255))

# V 字
for v_font_path in ["C:\\Windows\\Fonts\\arialbd.ttf", "C:\\Windows\\Fonts\\Arial.ttf"]:
    try:
        v_font = ImageFont.truetype(v_font_path, 52)
        break
    except:
        v_font = ImageFont.load_default()

bbox = draw.textbbox((0, 0), "V", font=v_font)
vw = bbox[2] - bbox[0]
vh = bbox[3] - bbox[1]
draw.text((cx - vw/2, cy - vh/2 + 4), "V", fill=(110, 115, 125, 255), font=v_font)

# 圆角遮罩
mask = Image.new('L', (w, h), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.rounded_rectangle([0, 0, w, h], radius=48, fill=255)
img.putalpha(mask)

img.save(os.path.join(base_dir, 'vip-card-bg.png'))

print('activation assets v3 generated')
