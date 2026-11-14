from PIL import Image
from pathlib import Path
import shutil,re,json
p=Path('public/assets'); p.mkdir(parents=True,exist_ok=True)
assets={'estate':309,'archive-main':219,'archive-wing':28,'archive-hall':75,'estate-front':69,'detail':92,'facades':86,'model':117,'floor-plan':136,'masterplan':266}
for name,i in assets.items():
 im=Image.open(f'docs/figma-assets/{i:02d}.png').convert('RGB'); im.thumbnail((1800,1400)); im.save(p/f'{name}.webp',quality=86)
shutil.copy('references/логотип.svg',p/'brand.svg');shutil.copy('references/logo.svg',p/'mark.svg')
im=Image.open('references/9. Айдентика.png')
for name,box in {'merch-tickets':(590,170,1036,492),'merch-postcards':(1070,176,1536,493),'merch-stickers':(30,802,579,1055)}.items(): im.crop(box).save(p/f'{name}.webp',quality=90)
lines=Path('docs/requirements-extracted.txt').read_text(encoding='utf-8').splitlines(); events=[];day='28';active=False
for i,line in enumerate(lines):
 if line.startswith('28 сентября 2030 •'): active=True;day='28'
 if line.startswith('29 сентября 2030 •'): day='29'
 m=re.match(r'(\d\d:\d\d)–(\d\d:\d\d)\s*\|\s*(.+)',line)
 if active and m:
  events.append(dict(id=f'opening-{len(events)+1:02d}',slug=f'opening-{len(events)+1:02d}',date=f'2030-09-{day}',startTime=m[1],endTime=m[2],title=m[3],venue=lines[i+1].replace('Площадка: ',''),fullDescription=lines[i+2],status='planned'))
cats=['Церемонии','Экскурсии','Экскурсии','Кинопоказы','Кинопоказы','Кинопоказы','Кинопоказы','Мастер-классы','Детские программы','Мастер-классы','Мастер-классы','Лекции и дискуссии','Лекции и дискуссии','Вечерняя программа','Вечерняя программа','Индустриальные события','Мастер-классы','Лекции и дискуссии','Кинопоказы','Мастер-классы','Лекции и дискуссии','Детские программы','Мастер-классы','Экскурсии','Лекции и дискуссии','Лекции и дискуссии','Церемонии','Кинопоказы']
for e,c in zip(events,cats): e.update(category=c,shortDescription=e['fullDescription'],audience='Уточняется',coverImage=None,accessType='Условия уточняются',registrationRequired=None,externalLink=None)
Path('src/data/opening.json').write_text(json.dumps(events,ensure_ascii=False,indent=2),encoding='utf-8')
print('Events:',len(events),'day 1:',sum(e['date'].endswith('28') for e in events),'day 2:',sum(e['date'].endswith('29') for e in events))
