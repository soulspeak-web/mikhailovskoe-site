from pathlib import Path
p=Path('src/pages/Pages.jsx');s=p.read_text(encoding='utf-8');a=s.index('export function History()');b=s.index('export function Concept()',a);s=s[:a]+'export { default as History } from "./History";\n'+s[b:]
s='import ProjectImage from "../components/ProjectImage";\nimport { EnquiryForm } from "../components/EnquiryForm";\n'+s
s=s.replace('spaces, periods, galleries','spaces, galleries')
needle='        <div className="concept-hero">'
s=s.replace(needle,'''        <section className="editorial-split concept-introduction"><div><Eyebrow>Реставрация и новое использование</Eyebrow><h2>Бережное продолжение</h2><p className="lead">Театральная традиция Шереметевых стала отправной точкой для проекта кинорезиденции.</p><p>Для фасадов предлагается сохранить исторические слои и укрепить повреждённую штукатурку. Отдельные интерьеры планируется приспособить под кинозалы и общественные функции.</p><p>Главный дом объединяет культурные и резидентские пространства. Во флигеле предусмотрено кафе, в парке — амфитеатр у белокаменной лестницы.</p></div><figure><ProjectImage src="estate-front.webp" className="editorial-image" alt="Существующее состояние усадьбы со стороны парка"/><figcaption>Существующее состояние · материалы проекта</figcaption></figure></section>
''' + needle)
s=s.replace('src: "masterplan.webp",','src: "masterplan.webp", diagram: true,')
s=s.replace('title="Территория и генеральный план" />','title="Территория и генеральный план" />\n<p className="section-deck">Геометрические аллеи регулярного парка переходят в дорожки пейзажной части. В проекте предусмотрены розарий, декоративный пруд и площадка для кинопоказов.</p>')
needle='src: "masterplan.webp", diagram: true,'
idx=s.index(needle);start=s.rfind('              {',0,idx)
s=s[:start]+'''              {src:"park-plan.png", title:"Генеральный план парка", caption:"Проектное предложение команды; не схема действующих маршрутов.", diagram:true},
              {src:"zoning.webp", title:"Функциональное зонирование", caption:"Главный дом · рабочая схема", diagram:true},
'''+s[start:]
s=s.replace('<img\n                className="editorial-image"\n                src={asset(space.image)}\n                alt="Главный дом. Существующее состояние"\n              />','<figure><ProjectImage className="editorial-image" src={space.image} alt={`${space.title} · ${space.imageNote}`} /><figcaption>{space.imageNote}</figcaption></figure>')
s=s.replace('<p className="lead">{space.description}</p>','<p className="lead">{space.detail || space.description}</p>')
s=s.replace('"Точное размещение уточняется"','space.location || "Точное размещение уточняется"')
a=s.index('          {slug === "main" ? (');b=s.index('        </section>',a)
s=s[:a]+'''          {space.gallery?.length ? <Gallery items={space.gallery}/> : <Placeholder label="Нужны план помещения и фотографии пространства"/>}
'''+s[b:]
# Keep the original resident form semantics but use the richer accessible validation from v2.
s=s.replace('  const [sent, setSent] = useState(false);\n','')
a=s.index('          <form',s.index('export function Residents'));b=s.index('          </form>',a)+len('          </form>');s=s[:a]+'          <EnquiryForm resident/>\n'+s[b:]
# Visitor enquiry lives behind a disclosure; core visit information and FAQ stay in place.
a=s.index('export function Residents');idx=s.rfind('      </div>',0,a)
s=s[:idx]+'''        <details className="source-note demo-disclosure"><summary>Как будет выглядеть обращение · демо</summary><EnquiryForm excursions={openingEvents.filter(e=>e.category==='Экскурсии')}/></details>
'''+s[idx:]
p.write_text(s,encoding='utf-8')
p=Path('src/components/EnquiryForm.jsx');s=Path('docs/version2/src/components/EnquiryForm.jsx').read_text(encoding='utf-8')
s=s.replace('label: "Имя", autoComplete: "name"','label: "Вымышленное имя", autoComplete: "off"').replace('label: "Электронная почта", type: "email", autoComplete: "email", placeholder: "name@example.com"','label: "Тестовая почта", type: "email", autoComplete: "off", placeholder: "author@example.invalid"')
s=s.replace('<p>Отправка пока недоступна.</p>','<p role="status">Демонстрация завершена. Поля очищены. Заявка никуда не отправлена и не сохранена.</p>')
s=s.replace('className="enquiry-fields" noValidate','className="enquiry-fields" autoComplete="off" noValidate')
s=s.replace('"Проверить вопрос" : "Проверить заявку"','"Проверить демо-вопрос" : "Проверить демо-заявку"')
s=s.replace('"Заявка на резиденцию" : "Запись и вопросы"','"Демо-заявка на резиденцию" : "Демо обращения"')
s=s.replace('      {!resident && (','      <p className="form-disclaimer">Демонстрация: данные не отправляются и не сохраняются. Используйте вымышленное имя и тестовую почту. Приём заявок и запись на события не открыты.</p>\n      {!resident && (')
s=s.replace('>Записаться на экскурсию<','>Экскурсия<').replace('>Задать вопрос<','>Вопрос<')
p.write_text(s,encoding='utf-8')
