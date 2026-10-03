import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Check, ChevronLeft, ChevronRight, MapPin, Menu, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { wedding } from "@/content/wedding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkout, CART_KEY } from "./Checkout";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function FloralMark() {
  return <div className="floral-mark" aria-hidden="true"><span>❧</span><i /><span>❧</span></div>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="section-heading"><FloralMark /><h2>{children}</h2></div>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <>
    <header className={`site-header ${solid ? "is-solid" : ""}`}>
      <nav aria-label="Navegação principal">
        {wedding.navigation.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}
      </nav>
      <Button variant="header" size="icon" className="mobile-menu-button" aria-label="Abrir menu" onClick={() => setOpen(true)}><Menu /></Button>
    </header>
    <div className={`mobile-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <Button variant="ghost" size="icon" aria-label="Fechar menu" onClick={() => setOpen(false)}><X /></Button>
      <div className="drawer-monogram">{wedding.couple.initials}</div>
      <nav aria-label="Navegação para celular">
        {wedding.navigation.map(([label, id]) => <button key={id} onClick={() => { setOpen(false); scrollTo(id); }}>{label}</button>)}
      </nav>
    </div>
  </>;
}

function Hero() {
  return <section id="home" className="hero" style={{ "--hero-desktop": `url(${wedding.hero.desktop})`, "--hero-mobile": `url(${wedding.hero.mobile})` } as React.CSSProperties}>
    <div className="hero-content animate-fade-in">
      <div className="monogram"><span>{wedding.couple.initials}</span></div>
      <h1>{wedding.couple.first} <small>e</small> {wedding.couple.second}</h1>
      <time dateTime={wedding.dateISO}>{wedding.dateLabel}</time>
    </div>
    <div className="paper-edge" />
  </section>;
}

function Welcome() {
  return <section className="welcome content-width">{wedding.welcome.map((text, i) => <p key={text} className={i === 0 ? "quote" : ""}>{text}</p>)}</section>;
}

function Countdown() {
  const target = new Date(wedding.dateISO).getTime();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const distance = now === null ? 0 : Math.max(0, target - now);
  const parts = [Math.floor(distance / 86400000), Math.floor(distance / 3600000) % 24, Math.floor(distance / 60000) % 60, Math.floor(distance / 1000) % 60];
  return <section className="countdown-band"><div className="countdown-inner"><h2>Contagem Regressiva</h2><div className="countdown-grid">
    {parts.map((value, i) => <div className="countdown-card" key={i}><strong>{String(value).padStart(2, "0")}</strong><span>{["dias", "horas", "minutos", "segundos"][i]}</span></div>)}
  </div></div></section>;
}

function Story() {
  const [slide, setSlide] = useState(0);
  const total = wedding.story.gallery.length;
  return <section id="nossa-historia" className="content-section content-width">
    <SectionTitle>{wedding.story.title}</SectionTitle>
    <img className="story-portrait" src={wedding.story.portrait} alt="Lucas e Cherlane" />
    <div className="story-copy">{wedding.story.paragraphs.map((p) => <p key={p}>{p.split("\n").map((s, i) => <span key={s}>{i > 0 && <br />}{s}</span>)}</p>)}</div>
    <div className="gallery" aria-label="Galeria do casal">
      <img src={wedding.story.gallery[slide]} alt={`Foto ${slide + 1} de Lucas e Cherlane`} />
      <Button size="icon" variant="gallery" className="gallery-prev" aria-label="Foto anterior" onClick={() => setSlide((slide - 1 + total) % total)}><ChevronLeft /></Button>
      <Button size="icon" variant="gallery" className="gallery-next" aria-label="Próxima foto" onClick={() => setSlide((slide + 1) % total)}><ChevronRight /></Button>
      <div className="gallery-dots">{wedding.story.gallery.map((_, i) => <button key={i} className={i === slide ? "active" : ""} aria-label={`Ir para foto ${i + 1}`} onClick={() => setSlide(i)} />)}</div>
    </div>
  </section>;
}

function PlaceSections() {
  return <>
    <section id="cerimonia" className="content-section content-width"><SectionTitle>{wedding.ceremony.title}</SectionTitle><img className="place-image ceremony-image" src={wedding.ceremony.image} alt="Altar da Igreja São Benedito" /><div className="place-copy">{wedding.ceremony.paragraphs.map(p => <p key={p}>{p}</p>)}<p><strong>{wedding.ceremony.when}</strong><br />{wedding.ceremony.address}</p></div><Button variant="outline" asChild><a href={wedding.ceremony.map} target="_blank" rel="noreferrer"><MapPin />Ver no mapa</a></Button></section>
    <section id="recepcao" className="content-section content-width"><SectionTitle>{wedding.reception.title}</SectionTitle><img className="place-image reception-image" src={wedding.reception.image} alt="Entrada do Espaço Old" /><div className="place-copy"><p>{wedding.reception.text}</p><p>{wedding.reception.note}</p></div><Button variant="outline" asChild><a href={wedding.reception.map} target="_blank" rel="noreferrer"><MapPin />Ver no mapa</a></Button></section>
  </>;
}

function GiftList() {
  const [sort, setSort] = useState("az"); const [visible, setVisible] = useState(12); const [cart, setCart] = useState<string[]>([]); const [cartOpen, setCartOpen] = useState(false); const [checkout, setCheckout] = useState(false);
  useEffect(() => { try { const saved = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]"); if (Array.isArray(saved)) setCart(saved.filter((n) => wedding.gifts.some(g => g.name === n))); } catch { /* ignore */ } }, []);
  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart]);
  const gifts = useMemo(() => [...wedding.gifts].sort((a,b) => {
    const aTest = a.name.startsWith("Item de teste");
    const bTest = b.name.startsWith("Item de teste");
    if (aTest !== bTest) return aTest ? -1 : 1;
    return sort === "low" ? a.price-b.price : sort === "high" ? b.price-a.price : a.name.localeCompare(b.name);
  }), [sort]);
  const total = wedding.gifts.filter(g => cart.includes(g.name)).reduce((sum,g) => sum+g.price,0);
  const removeFromCart = (name: string) => setCart((current) => current.filter((item) => item !== name));
  const toggleGift = (name: string) => setCart((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  return <section id="presentes" className="gifts-section content-width"><SectionTitle>Lista de Presentes</SectionTitle>
    <div className="gift-toolbar"><Button variant="outline" onClick={() => setCartOpen(!cartOpen)}><ShoppingBag />{cart.length ? `Ver carrinho (${cart.length})` : "Carrinho vazio"}</Button><label>Ordenar lista por:<select value={sort} onChange={e => setSort(e.target.value)}><option value="az">A–Z</option><option value="low">Menor preço</option><option value="high">Maior preço</option></select></label></div>
    {cartOpen && <div className="cart-panel"><div><strong>Meu carrinho</strong><span>{cart.length ? `${cart.length} ${cart.length === 1 ? "presente" : "presentes"}` : "Seu carrinho está vazio"}</span></div>{cart.map(name => { const gift = wedding.gifts.find((item) => item.name === name); if (!gift) return null; return <div className="cart-row" key={name}><div><span>{name}</span><strong>{money.format(gift.price)}</strong></div><Button variant="ghost" size="sm" aria-label={`Remover ${name}`} onClick={() => removeFromCart(name)}><Trash2 />Remover</Button></div>})}{cart.length > 0 && <><div className="cart-subtotal"><span>Subtotal ({cart.length} {cart.length === 1 ? "item" : "itens"})</span><strong>{money.format(total)}</strong></div><div className="cart-total"><span>Total no Pix</span><strong>{money.format(total)}</strong></div><Button className="cart-checkout" onClick={() => setCheckout(true)}>Finalizar e presentear</Button><p>Pix sem acréscimo ou cartão de crédito via Mercado Pago.</p></>}</div>}
    {checkout && <Checkout cart={cart} onClose={() => setCheckout(false)} />}
    <div className="gift-grid">{gifts.slice(0,visible).map(g => { const selected=cart.includes(g.name); return <article className={`gift-card ${g.name.startsWith("Item de teste") ? "gift-card-test" : ""}`} key={g.name}><img src={g.image} alt={g.name} loading="lazy" /><div><h3>{g.name}</h3><strong>{money.format(g.price)}</strong><Button onClick={() => toggleGift(g.name)} variant={selected ? "secondary" : "default"}>{selected ? <><Trash2 />Remover</> : <><Plus />Presentear</>}</Button></div></article>})}</div>
    {visible < gifts.length && <Button variant="outline" onClick={() => setVisible(gifts.length)}>Ver mais presentes</Button>}
  </section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="field"><span>{label}</span>{children}</label>; }

function Forms() {
  const [rsvpSent,setRsvpSent]=useState(false); const [messageSent,setMessageSent]=useState(false); const [attending,setAttending]=useState("sim");
  const submit=(setter:(v:boolean)=>void)=>(e:FormEvent)=>{e.preventDefault(); setter(true);};
  return <>
    <section id="rsvp" className="form-section content-width"><SectionTitle>Confirme sua presença</SectionTitle>{rsvpSent ? <div className="success"><Check /><h3>Tudo certo!</h3><p>Sua resposta foi registrada neste dispositivo.</p></div> : <form onSubmit={submit(setRsvpSent)}><Field label="Nome completo"><Input required placeholder="Insira seu nome completo" /></Field><fieldset><legend>Você irá ao evento?</legend><label><input type="radio" name="attendance" checked={attending==="sim"} onChange={()=>setAttending("sim")} /> Sim</label><label><input type="radio" name="attendance" checked={attending==="nao"} onChange={()=>setAttending("nao")} /> Não</label></fieldset>{attending==="sim" && <div className="form-columns"><Field label="Quantidade de adultos incluindo você"><select><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></Field><Field label="Quantidade de crianças"><select><option>0</option><option>1</option><option>2</option><option>3</option></select></Field></div>}<Field label="E-mail"><Input type="email" required placeholder="exemplo@email.com" /><small>Você receberá a confirmação de presença neste e-mail.</small></Field><Field label="Telefone para contato"><Input type="tel" required placeholder="(11) 99999-9999" /></Field><Field label="Observações"><Textarea rows={4} /></Field><label className="checkbox"><input type="checkbox" required /> Declaro que li e concordo com os termos e a política de privacidade.</label><Button type="submit">Confirmar presença</Button></form>}</section>
    <section id="recados" className="form-section content-width"><SectionTitle>Deixe seu recado</SectionTitle>{messageSent ? <div className="success"><Check /><h3>Recado recebido!</h3><p>Obrigado pelo carinho.</p></div> : <form onSubmit={submit(setMessageSent)}><Field label="Seu nome"><Input required /></Field><Field label="E-mail"><Input type="email" /></Field><Field label="Recado"><Textarea required rows={6} maxLength={900} /></Field><label className="checkbox"><input type="checkbox" required /> Declaro que li e concordo com os termos e a política de privacidade.</label><Button type="submit">Enviar recado</Button></form>}</section>
  </>;
}

export function WeddingSite() { return <div className="wedding-site"><Header /><main><Hero /><Welcome /><Countdown /><Story /><PlaceSections /><GiftList /><Forms /></main><footer><FloralMark /><p>{wedding.couple.first} & {wedding.couple.second}</p><span>{wedding.dateLabel}</span></footer></div>; }