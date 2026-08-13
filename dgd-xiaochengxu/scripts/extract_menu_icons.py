from PIL import Image
import numpy as np
import os
from collections import deque

# 配置
src_path = r"C:\Users\Administrator\Desktop\Screenshot_20260813005015.png"
out_dir = r"C:\Users\Administrator\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a7c175a110339bb9077c1e5\dgd-xiaochengxu\images\menu-icons"
names = [
    "shizhan", "duanshipin", "yinliu", "dianshang", "wenan",
    "zimeiti", "shequn", "qita", "mianfei", "quanbu"
]

os.makedirs(out_dir, exist_ok=True)


def find_largest_component(mask):
    """找到掩码中最大的连通区域，返回其像素坐标列表"""
    H, W = mask.shape
    visited = np.zeros_like(mask, dtype=bool)
    largest = []

    for y in range(H):
        for x in range(W):
            if not mask[y, x] or visited[y, x]:
                continue
            # BFS
            queue = deque([(y, x)])
            visited[y, x] = True
            component = []
            while queue:
                py, px = queue.popleft()
                component.append((py, px))
                # 8 邻域
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        if dy == 0 and dx == 0:
                            continue
                        ny, nx = py + dy, px + dx
                        if 0 <= ny < H and 0 <= nx < W and mask[ny, nx] and not visited[ny, nx]:
                            visited[ny, nx] = True
                            queue.append((ny, nx))
            if len(component) > len(largest):
                largest = component

    return largest


img = Image.open(src_path).convert("RGBA")
arr = np.array(img)
H, W = arr.shape[:2]

# 非白色掩码：RGB 任一通道不是 255 或 alpha 不透明
mask = np.any(arr[:, :, :3] != 255, axis=2) | (arr[:, :, 3] < 250)

rows, cols = 2, 5
cell_h = H / rows
cell_w = W / cols

for idx, name in enumerate(names):
    r = idx // cols
    c = idx % cols

    y1 = int(r * cell_h)
    y2 = int((r + 1) * cell_h)
    x1 = int(c * cell_w)
    x2 = int((c + 1) * cell_w)

    cell_mask = mask[y1:y2, x1:x2]
    if not np.any(cell_mask):
        print(f"Warning: empty cell {name}")
        continue

    # 在单元格内找最大连通区域（即彩色圆形图标）
    pixels = find_largest_component(cell_mask)
    if len(pixels) < 50:
        print(f"Warning: component too small {name}")
        continue

    # 计算圆心和半径
    ys = np.array([p[0] for p in pixels])
    xs = np.array([p[1] for p in pixels])
    cy_rel = int(ys.mean())
    cx_rel = int(xs.mean())

    # 半径：取中心到所有像素的最大距离，并留出少量边距
    dists = np.sqrt((xs - cx_rel) ** 2 + (ys - cy_rel) ** 2)
    radius = int(dists.max())

    # 转换到原图坐标
    cx = cx_rel + x1
    cy = cy_rel + y1

    # 以圆心为中心切正方形
    x1c = cx - radius
    y1c = cy - radius
    x2c = cx + radius
    y2c = cy + radius

    crop = img.crop((x1c, y1c, x2c, y2c))
    crop_arr = np.array(crop)

    # 圆形遮罩：圆外透明
    size = radius * 2
    yy, xx = np.ogrid[:size, :size]
    circle_mask = (xx - radius) ** 2 + (yy - radius) ** 2 <= radius ** 2
    crop_arr[~circle_mask] = [255, 255, 255, 0]

    # 缩放到 240x240，Retina 高清
    out_img = Image.fromarray(crop_arr)
    out_img = out_img.resize((240, 240), Image.LANCZOS)

    out_path = os.path.join(out_dir, f"{name}.png")
    out_img.save(out_path)
    print(f"Saved {out_path} ({len(pixels)} pixels, radius {radius})")

print("Done.")
