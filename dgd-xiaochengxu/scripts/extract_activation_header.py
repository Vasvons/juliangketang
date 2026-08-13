from PIL import Image, ImageDraw
import os
import shutil

src = r"C:\Users\Administrator\Desktop\Screenshot_20260813020521.png"
out_dir = r"C:\Users\Administrator\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a7c175a110339bb9077c1e5\dgd-xiaochengxu\images"
os.makedirs(out_dir, exist_ok=True)

img = Image.open(src).convert('RGBA')
w, h = img.size  # (426, 313)

# 精确坐标（基于像素分析）
# 头像白色圆：x=182-244, y=22-85
# 等级标签文字：x=146-279, y=98-115
# 弧形两侧深色底部：y=237
# VIP卡片：x=31-394, y=151-312
# 卡片内"普通用户"：x=165-260, y=198-222
# 卡片内右侧徽章：x=340-362, y=210-225
# 卡片内"卡密激活"按钮：x=169-256, y=255-289

HEADER_BOTTOM = 237      # header 底部（弧形两侧深色结束）
CARD_LEFT, CARD_TOP, CARD_RIGHT, CARD_BOTTOM = 31, 151, 394, 312


def fill_masked_region(image, mask):
    """用垂直方向最近非 mask 像素的颜色填充 mask 区域（保留水平渐变）。"""
    arr = image.load()
    mask_arr = mask.load()
    for x in range(image.width):
        bg_pixels = [(y, arr[x, y]) for y in range(image.height) if mask_arr[x, y] == 0]
        if len(bg_pixels) < 2:
            continue
        for y in range(image.height):
            if mask_arr[x, y] == 255:
                up = max((py for py, _ in bg_pixels if py < y), default=None)
                down = min((py for py, _ in bg_pixels if py > y), default=None)
                if up is not None and down is not None:
                    du = y - up
                    dd = down - y
                    total = du + dd
                    arr[x, y] = tuple(int((c1 * dd + c2 * du) / total)
                                      for c1, c2 in zip(arr[x, up], arr[x, down]))
                elif up is not None:
                    arr[x, y] = arr[x, up]
                elif down is not None:
                    arr[x, y] = arr[x, down]


# ===== 1. 切 VIP 卡片 =====
vip_card = img.crop((CARD_LEFT, CARD_TOP, CARD_RIGHT, CARD_BOTTOM))

# 清除卡片内的文字、徽章、按钮
vip_mask = Image.new('L', vip_card.size, 0)
vip_mask_draw = ImageDraw.Draw(vip_mask)
# "普通用户"文字
vip_mask_draw.rectangle([165 - CARD_LEFT, 198 - CARD_TOP, 260 - CARD_LEFT, 222 - CARD_TOP], fill=255)
# 右侧徽章（VIP标志）
vip_mask_draw.rectangle([340 - CARD_LEFT, 210 - CARD_TOP, 362 - CARD_LEFT, 225 - CARD_TOP], fill=255)
# "卡密激活"按钮（白色胶囊按钮 + 文字，含底部圆角，扩大到 y=302）
vip_mask_draw.rectangle([165 - CARD_LEFT, 252 - CARD_TOP, 260 - CARD_LEFT, 302 - CARD_TOP], fill=255)

fill_masked_region(vip_card, vip_mask)
vip_card.save(os.path.join(out_dir, 'vip-card-bg.png'))


# ===== 1.5 切头像（白底黑笑脸，从参考图切出并放大）=====
avatar_cx, avatar_cy, avatar_r = 213, 53, 31
avatar = img.crop((avatar_cx - avatar_r, avatar_cy - avatar_r,
                   avatar_cx + avatar_r, avatar_cy + avatar_r))
avatar = avatar.resize((240, 240), Image.Resampling.LANCZOS)
avatar.save(os.path.join(out_dir, 'avatar-default.png'))


# ===== 2. 切 header 背景（顶部深色 + 完整弧形）=====
header = img.crop((0, 0, w, HEADER_BOTTOM))

# 清除头像圆、等级标签、卡片区域（卡片区域会被 vip-card 图覆盖）
header_mask = Image.new('L', header.size, 0)
header_mask_draw = ImageDraw.Draw(header_mask)
# 头像白色圆（稍微扩大）
header_mask_draw.ellipse([178, 18, 248, 88], fill=255)
# 等级标签
header_mask_draw.rectangle([140, 92, 286, 120], fill=255)
# 卡片区域（中间部分，会被 vip-card 图覆盖）
header_mask_draw.rectangle([CARD_LEFT, CARD_TOP, CARD_RIGHT - 1, HEADER_BOTTOM - 1], fill=255)

fill_masked_region(header, header_mask)
header.save(os.path.join(out_dir, 'activation-header-bg.png'))


# ===== 3. 复制到 v2 文件名 =====
shutil.copy(os.path.join(out_dir, 'activation-header-bg.png'), os.path.join(out_dir, 'activation-header-bg-v2.png'))
shutil.copy(os.path.join(out_dir, 'vip-card-bg.png'), os.path.join(out_dir, 'vip-card-bg-v2.png'))

print('extracted:')
print(f'  activation-header-bg.png / v2: {header.size}')
print(f'  vip-card-bg.png / v2: {vip_card.size}')

scale = 750 / w
print(f'\nscale (750rpx / {w}px) = {scale:.4f}')
print(f'header height rpx: {header.height * scale:.1f}')
print(f'vip card width rpx: {vip_card.width * scale:.1f}')
print(f'vip card height rpx: {vip_card.height * scale:.1f}')
print(f'vip card margin-top rpx: {-(HEADER_BOTTOM - CARD_TOP) * scale:.1f}')
print(f'vip card margin-left/right rpx: {CARD_LEFT * scale:.1f}')
