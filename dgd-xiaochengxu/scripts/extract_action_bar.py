import os
from PIL import Image

SRC = r'C:\Users\Administrator\Desktop\Screenshot_20260813030453.png'
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'images')
OUT_DIR = os.path.abspath(OUT_DIR)

img = Image.open(SRC).convert('RGB')
w, h = img.size
print('src size', img.size)

# 底部 y=57 是深色边缘行（截图下边界），裁掉，保留 0..56 共 57px 高内容
CROP_BOTTOM = 57
clean = img.crop((0, 0, w, CROP_BOTTOM))

# 放大 3 倍，提升在 750rpx 宽度下的清晰度
scale = 3
clean = clean.resize((w * scale, CROP_BOTTOM * scale), Image.Resampling.LANCZOS)

out = os.path.join(OUT_DIR, 'course-action-bar.png')
clean.save(out)
print('saved', out, clean.size)
