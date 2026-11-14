import zipfile, pathlib, xml.etree.ElementTree as E
from PIL import Image, ImageOps, ImageDraw
root=pathlib.Path('.')
z=zipfile.ZipFile(root/'references/TZ_Mikhailovskoe_v2_2030_Codex.docx')
r=E.fromstring(z.read('word/document.xml')); ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
ps=[''.join(t.text or '' for t in p.findall('.//w:t',ns)) for p in r.findall('.//w:p',ns)]
(root/'docs/requirements-extracted.txt').write_text('\n'.join(ps),encoding='utf-8')
f=zipfile.ZipFile(root/'references/Untitled.fig'); dest=root/'docs/figma-assets'; dest.mkdir(exist_ok=True)
items=[]
for n in f.namelist():
 if n.startswith('images/') and not n.endswith('/'):
  try:
   import io
   im=Image.open(io.BytesIO(f.read(n))); i=len(items); im.save(dest/f'{i:02d}.png'); items.append((n,im.copy()))
  except Exception: pass
for start in range(0,len(items),24):
 sheet=Image.new('RGB',(1200,((min(24,len(items)-start)+3)//4)*210),'#eeeae2'); draw=ImageDraw.Draw(sheet)
 for i,(_,im) in enumerate(items[start:start+24],start):
  x=((i-start)%4)*300;y=((i-start)//4)*210; thumb=ImageOps.contain(im.convert('RGB'),(288,177));sheet.paste(thumb,(x,y));draw.text((x+4,y+181),f'{i:02d} | {im.width} x {im.height}',fill='black')
 sheet.save(root/f'docs/contact-{start//24}.jpg')
(root/'docs/figma-assets-index.txt').write_text('\n'.join(f'{i:02d} {n}' for i,(n,_) in enumerate(items)),encoding='utf-8')
print('Figma images:',len(items))
print('\n'.join(ps)[11500:23500])
