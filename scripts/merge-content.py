from pathlib import Path
p=Path('src/data/projectSpaces.js');s=p.read_text(encoding='utf-8').replace("image: 'wing.webp'","image: 'wing-concept.webp'").replace("image: 'archive.png'","image: 'archive-cyclists.webp'").replace("image: 'masterplan.webp'","image: 'park-plan.webp'");p.write_text(s,encoding='utf-8')
p=Path('src/data/content.js');s=p.read_text(encoding='utf-8');s='import { projectSpaces, spaceImages } from "./projectSpaces.js";\n'+s;s=s.replace('["/history", "Об усадьбе"]','["/history", "История"]');start=s.index('export const spaces =');end=s.index('export const galleries =',start)
s=s[:start]+'''export const spaces = rows.map(([slug,title,category,description,image],i)=>{
  const project=projectSpaces.find(p=>p.id===(slug==='main'?'main-house':slug));
  const gallery=(project?.gallery||[]).map(key=>{const item=spaceImages[key];return {src:item.image,title:item.title,caption:item.note||(item.diagram?'Проектная схема · материалы предзащиты':'Из материалов проекта; атрибуция уточняется'),diagram:!!item.diagram}});
  return {slug,title,category,description:project?.summary||description,detail:project?.detail,location:project?.location,gallery,
    image:slug==='main'?'estate.webp':slug==='wing'?'wing-concept.webp':slug==='park'?'park.webp':null,
    imageNote:slug==='wing'?'Проектная визуализация':slug==='park'?'Фото парка · ЛЮБИТЕль / CC BY-SA 4.0':slug==='main'?'Существующее состояние':null,
    number:String(i+1).padStart(2,'0')};
});
''' + s[end:]
s=s.replace('history: [','history: [\n {src:"archive-cyclists.webp",title:"Катание на велосипедах в Михайловском",caption:"Ламберг, 1880-е. Московский музей-усадьба «Останкино».",source:"https://russiainphoto.ru/photos/146713/",contain:true},',1)
for name in ['facades.webp','model.webp','floor-plan.webp']:s=s.replace(f'src: "{name}",',f'src: "{name}", diagram: true,')
p.write_text(s,encoding='utf-8')
p=Path('.gitignore');s=p.read_text();s+='\ndocs/version2/\ndocs/version1-before-merge.zip\ndocs/v2-contact-*.jpg\n';p.write_text(s)
