from pathlib import Path
import zipfile,json,io,hashlib
from PIL import Image,ImageOps,ImageDraw
root=Path.cwd(); dest=root/'docs/version2'; dest.mkdir(exist_ok=True)
z=zipfile.ZipFile('C:/Users/breez/Downloads/mikhailovskoe-site2-updated.zip')
for n in z.namelist():
 parts=Path(n).parts[1:]
 if not parts or n.endswith('/'):continue
 target=(dest/Path(*parts)).resolve()
 if not target.is_relative_to(dest.resolve()):raise ValueError(n)
 target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(z.read(n))
backup=root/'docs/version1-before-merge.zip'
if not backup.exists():
 with zipfile.ZipFile(backup,'w',zipfile.ZIP_DEFLATED) as out:
  for folder in ['src','public','tests']:
   for p in (root/folder).rglob('*'):
    if p.is_file():out.write(p,p.relative_to(root))
  for name in ['README.md','package.json','package-lock.json','vite.config.js','index.html']:out.write(root/name,name)
imgs=[]
for p in (dest/'public/assets').iterdir():
 try:
  im=Image.open(p);imgs.append((p.name,im.copy()));print(p.name,im.size,p.stat().st_size)
 except:pass
for start in range(0,len(imgs),20):
 sheet=Image.new('RGB',(1200,((min(20,len(imgs)-start)+3)//4)*220),'#efebe2');d=ImageDraw.Draw(sheet)
 for j,(name,im) in enumerate(imgs[start:start+20]):
  x=j%4*300;y=j//4*220;t=ImageOps.contain(im.convert('RGB'),(285,175));sheet.paste(t,(x,y));d.text((x+4,y+180),name,fill='black');d.text((x+4,y+198),str(im.size),fill='black')
 sheet.save(root/f'docs/v2-contact-{start//20}.jpg')
