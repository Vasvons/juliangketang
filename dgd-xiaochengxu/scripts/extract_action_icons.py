import os
from PIL import Image, ImageFilter

SRC = r'C:\Users\Administrator\Desktop\Screenshot_20260813030453.png'
OUT_DIR = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'images'))

img = Image.open(SRC).convert('RGB')

# 精确 bbox，放大到高清并锐化（放大 4 倍以上，目标宽度 96px）
icons = {
    'action-icon-home':       (17, 15, 37, 35, 96),   # 首页（房子，21x21）
    'action-icon-service':    (79, 16, 97, 33, 96),   # 客服（19x18）
    'action-icon-activation': (140, 15, 158, 35, 96), # 卡密激活（钥匙+锁，19x21）
}

for name, (x1, y1, x2, y2, target_w) in icons.items():
    box = img.crop((x1, y1, x2 + 1, y2 + 1))
    w, h = box.size
    scale = target_w / w
    box = box.resize((target_w, round(h * scale)), Image.Resampling.LANCZOS)
    box = box.filter(ImageFilter.UnsharpMask(radius=2, percent=180, threshold=2))
    out = os.path.join(OUT_DIR, f'{name}.png')
    box.save(out)
    print('saved', out, box.size, 'from', (w, h), 'scale x%.1f' % scale)
