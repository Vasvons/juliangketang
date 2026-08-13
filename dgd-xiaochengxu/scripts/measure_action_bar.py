import numpy as np
from PIL import Image
import itertools

img = Image.open(r'C:\Users\Administrator\Desktop\Screenshot_20260813030453.png').convert('RGB')
a = np.array(img).astype(int)
R, G, B = a[:, :, 0], a[:, :, 1], a[:, :, 2]

# 绿色按钮精确边界
green = (G > 150) & (G > R + 40) & (G > B + 40)
gx = np.where(green.any(axis=0))[0]
gy = np.where(green.any(axis=1))[0]
print('green button bbox: x', gx.min(), gx.max(), 'y', gy.min(), gy.max())

# 绿色按钮纯色值（取中心点）
print('green color center:', a[gy.min()+15, (gx.min()+gx.max())//2].tolist())

# 图标区域（左半 x 0..203），深色像素
left = a[:, :204]
gray = left.astype(int).mean(axis=2)
dark = gray < 120
dx = np.where(dark.any(axis=0))[0]
dy = np.where(dark.any(axis=1))[0]
print('left dark region: x', dx.min(), dx.max(), 'y', dy.min(), dy.max())

# 按列分组找图标
grp = []
for k, g in itertools.groupby(enumerate(dx), lambda t: t[1] - t[0]):
    grp.append([v for _, v in g])
print('icon x-groups (w>2):')
for g in grp:
    if g[-1] - g[0] > 2:
        print('   x', g[0], '-', g[-1], 'w', g[-1]-g[0]+1)

# 文字标签（灰色，L<180，y 38..50）
print('text label columns (y38-50, L<180):')
for x in range(0, 204):
    cnt = int((gray[38:50, x] < 180).sum())
    if cnt > 0:
        print('   x', x, 'cnt', cnt)
