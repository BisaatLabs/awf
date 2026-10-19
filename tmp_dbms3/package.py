from pathlib import Path
from zipfile import ZipFile
from PIL import Image
import numpy as np
src=Path(r'C:\Users\bilal\Downloads\dbms3.docx')
out=Path('dbms3_updated.docx')
edits={f'word/media/{p.name}':p for p in Path('tmp_dbms3/edited').glob('*.png')}
with ZipFile(src) as z, ZipFile(out,'w') as dest:
 for entry in z.infolist(): dest.writestr(entry,edits[entry.filename].read_bytes() if entry.filename in edits else z.read(entry.filename))
with ZipFile(src) as before,ZipFile(out) as after:
 changed=[n for n in before.namelist() if before.read(n)!=after.read(n)]
 assert set(changed)==set(edits)
 for name in changed:
  import io
  a=np.array(Image.open(io.BytesIO(before.read(name))).convert('RGB'))
  b=np.array(Image.open(io.BytesIO(after.read(name))).convert('RGB'))
  assert a.shape==b.shape
  ys,xs=np.where(np.any(a!=b,axis=2))
  assert ys.max()<30
  print(name,'changed only label region',int(xs.min()),int(ys.min()),int(xs.max()),int(ys.max()))
 print('All document XML and non-target images unchanged. Output:',out.resolve())
