import numpy as np
from PIL import Image
import itertools

img = Image.open(r'C:\Users\Administrator\Desktop\Screenshot_20260813030453.png').convert('RGB')
a = np.array(img)
R, G, B = a[:, :, 0].astype(int), a[:, :, 1].astype(int), a[:, :, 2].astype(int)

# 绿色"获取资源"按钮
green = (G > 150) & (G > R + 40) & (G > B + 40)
gx = np.where(green.any(axis=0))[0]
gy = np.where(green.any(axis=1))[0]
print('green x', gx.min(), gx.max(), 'y', gy.min(), gy.max())

# 深色像素（图标/文字）
dark = (R < 150) & (G < 150) & (B < 150)
dx = np.where(dark.any(axis=0))[0]
dy = np.where(dark.any(axis=1))[0]
print('dark x', dx.min(), dx.max(), 'y', dy.min(), dy.max())

# 深色列分组，找图标/文字的横向区间
grp = []
for k, g in itertools.groupby(enumerate(dx), lambda t: t[1] - t[0]):
    grp.append([v for _, v in g])
print('dark col groups (>2 width):')
for g in grp:
    if g[-1] - g[0] > 2:
        print('  ', g[0], g[-1], 'width', g[-1]-g[0]+1)

# 每列的平均灰度，用于看整体结构
print('per-column min brightness (0=dark):')
for x in range(0, a.shape[1], 10):
    col = a[:, x].astype(int)
    print(x, int(col.min(axis=0).mean()))
