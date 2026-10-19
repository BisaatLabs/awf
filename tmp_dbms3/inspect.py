from PIL import Image
import numpy as np
from pathlib import Path
starts={2:111,3:109,5:114,7:243,8:119,10:117,12:117,16:115,18:117,20:114}
for n,x in starts.items():
 a=np.array(Image.open(f'tmp_dbms3/image{n}.png').convert('RGB')); w=145 if n==7 else 72; h=28 if n==7 else 27
 mask=(a[:h,x:x+w].max(2)<100); ys,xs=np.where(mask)
 print(n,(x+int(xs.min()),int(ys.min()),int(xs.max()-xs.min()+1),int(ys.max()-ys.min()+1)))
a=np.array(Image.open(r'C:\Users\bilal\.codex\generated_images\01a13cd7-24bd-72b3-aabf-abf50c2898e9\exec-0fe724b7-6525-4ad9-983a-502005b9a425.png').convert('RGB'))
y,x=np.where(a[10:56,300:500].max(2)<100); print('generated',(300+int(x.min()),10+int(y.min()),int(x.max()-x.min()+1),int(y.max()-y.min()+1)))
