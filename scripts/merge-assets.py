from pathlib import Path
from PIL import Image
import json,zipfile,io,shutil
root=Path('.');v2=root/'docs/version2';assets=root/'public/assets'
for name in ['park.webp','park-plan.webp','wing-scheme.webp','film.webp']:
 shutil.copy(v2/'public/assets'/name,assets/name)
im=Image.open(v2/'public/assets/archive.png');im.save(assets/'archive-cyclists.webp',quality=88)
indices={191:'portrait-krechetnikov',310:'portrait-sergey',22:'portrait-sheremetev',83:'portrait-sultanov',53:'sanatorium',50:'estate-painting',262:'wing-concept',122:'wing-detail',278:'zoning'}
lines=(root/'docs/figma-assets-index.txt').read_text(encoding='utf-8').splitlines();z=zipfile.ZipFile(root/'references/Untitled.fig')
for i,name in indices.items():
 im=Image.open(io.BytesIO(z.read(lines[i].split(' ',1)[1]))).convert('RGB');im.thumbnail((1800,1400));im.save(assets/(name+'.webp'),quality=88);print(name,im.size)
# Responsive variants only downsample actual original files; do not upscale.
for name in ['estate','estate-front','park','archive-cyclists','archive-main','wing-concept','wing-detail']:
 im=Image.open(assets/(name+'.webp'))
 for width in [480,960]:
  if im.width>width:
   out=im.copy();out.thumbnail((width,9999));out.save(assets/f'{name}-{width}.webp',quality=83)
report={}
for p in assets.glob('*.webp'):
 im=Image.open(p);report[p.name]={'width':im.width,'height':im.height,'bytes':p.stat().st_size}
(root/'src/data/imageDimensions.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
shutil.copy(v2/'src/data/projectSpaces.js',root/'src/data/projectSpaces.js')
shutil.copy(v2/'src/data/history.js',root/'src/data/history-v2.js')
a=json.loads((root/'src/data/opening.json').read_text(encoding='utf-8'));b=json.loads((v2/'src/data/opening.json').read_text(encoding='utf-8'));print('Opening identical:',a==b)
