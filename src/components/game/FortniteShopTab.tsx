"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Search, X, ShoppingCart, MessageCircle, Zap, Clock, Check } from "lucide-react";
import { useFortniteShop, FortniteEntry } from "@/hooks/useFortniteShop";
import { useFortniteExchangeRate } from "@/hooks/useFortniteExchangeRate";
import { useCart } from "@/context/CartContext";
import { usePreferences } from "@/context/PreferencesContext";
import { useT } from "@/i18n";

// ── Hora de reset de la tienda: 19:00 Lima (UTC-5) ───────
// Fortnite rota la tienda a las 19:00 ET; Lima también es UTC-5 → coinciden
function getNextResetCountdown(): string {
  const now      = new Date();
  const utcMs    = now.getTime() + now.getTimezoneOffset() * 60000;
  const lima     = new Date(utcMs - 5 * 3600000);
  const next     = new Date(lima);
  next.setHours(19, 0, 0, 0);
  if (lima.getHours() >= 19) next.setDate(next.getDate() + 1);
  const diff = next.getTime() - lima.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}
function useResetCountdown() {
  const [t, setT] = useState(getNextResetCountdown);
  useEffect(() => { const id = setInterval(() => setT(getNextResetCountdown()), 1000); return () => clearInterval(id); }, []);
  return t;
}

const VBUCK_IMG = "https://fortnite-api.com/images/vbuck.png";
const WA_NUMBER = "51983454837";

// ── Utilidades de color ────────────────────────────────────
function hexToRgb(hex: string): [number,number,number] {
  const h = String(hex||"000000").replace("#","").slice(0,6).padEnd(6,"0");
  const n = parseInt(h,16);
  return [(n>>16)&255,(n>>8)&255,n&255];
}
const RARITY_GRADIENTS: Record<string,string> = {
  epic:      "linear-gradient(to bottom, #2a0060, #5a008a)",
  legendary: "linear-gradient(to bottom, #3a2000, #8a4a00)",
  dc:        "linear-gradient(to bottom, #001535, #003B8E)",
  icon:      "linear-gradient(to bottom, #004050, #009090)",
  marvel:    "linear-gradient(to bottom, #3a0008, #900020)",
  rare:      "linear-gradient(to bottom, #001a40, #004a90)",
  uncommon:  "linear-gradient(to bottom, #0a200a, #1a5a1a)",
  shadow:    "linear-gradient(to bottom, #1a0040, #4a1080)",
  common:    "linear-gradient(to bottom, #0f1828, #1a2a50)",
};
const RARITY_COLORS: Record<string,string> = {
  epic:"#b94aff", legendary:"#f5a623", dc:"#007af1", icon:"#00e5ff",
  marvel:"#ed1d24", rare:"#2a9fff", uncommon:"#2db551", shadow:"#9b59b6",
  slurp:"#00e5c4", frozen:"#93d9ff", common:"#7f8c8d",
};
function getCardGradient(entry: FortniteEntry): string {
  const c = (entry as any).colors;
  if (c) {
    const c1 = String(c.color1||"001535").slice(0,6);
    const c2 = c.color2 ? String(c.color2).slice(0,6) : null;
    const c3 = String(c.color3||c.color1||"003B8E").slice(0,6);
    return c2 ? `linear-gradient(to bottom, #${c1}, #${c2}, #${c3})` : `linear-gradient(to bottom, #${c1}, #${c3})`;
  }
  return RARITY_GRADIENTS[getRarity(entry)] || RARITY_GRADIENTS.common;
}
function getRarity(entry: FortniteEntry): string {
  if (!entry.brItems?.length) return "uncommon";
  const bv = (entry.brItems[0] as any).series?.backendValue?.toLowerCase()||"";
  if (bv.includes("dcuse"))       return "dc";
  if (bv.includes("marvel"))      return "marvel";
  if (bv.includes("creatorcol"))  return "icon";
  if (bv.includes("shadow"))      return "shadow";
  if (bv.includes("slurp"))       return "slurp";
  if (bv.includes("frozen"))      return "frozen";
  return entry.brItems[0].rarity?.value?.toLowerCase()||"uncommon";
}
function getTrackArt(entry: FortniteEntry): string|null {
  const art = (entry.tracks?.[0] as any)?.albumArt;
  if (!art) return null;
  return art.startsWith("//") ? "https:"+art : art;
}
function getCardImages(entry: FortniteEntry): { images: string[]; isSlideshow: boolean } {
  const SLIDESHOW_TYPES = new Set(["outfit","pickaxe","glider"]);
  const isRealBundle = (entry.brItems?.length??0)>=3
    ||(entry.bundle?.name||"").toLowerCase().includes("lote")
    ||(entry.bundle?.name||"").toLowerCase().includes("bundle");
  const itemType  = entry.brItems?.[0]?.type?.value||"";
  const canSlide  = isRealBundle||SLIDESHOW_TYPES.has(itemType);
  const nda       = (entry as any).newDisplayAsset;
  const brRenders = ((nda?.renderImages||[]) as any[])
    .filter((r:any)=>r.productTag==="Product.BR"&&r.image)
    .map((r:any)=>r.image as string);
  const fallback = entry.bundle?.image||entry.brItems?.[0]?.images?.featured||entry.brItems?.[0]?.images?.icon||getTrackArt(entry)||VBUCK_IMG;
  if (canSlide&&brRenders.length>=2) return { images:brRenders, isSlideshow:true };
  return { images:[brRenders[0]||fallback], isSlideshow:false };
}
function getBestImage(entry: FortniteEntry): string {
  const nda  = (entry as any).newDisplayAsset;
  const juno = ((nda?.renderImages||[]) as any[]).find((r:any)=>r.productTag==="Product.Juno")?.image;
  const br0  = ((nda?.renderImages||[]) as any[]).find((r:any)=>r.productTag==="Product.BR")?.image;
  return entry.bundle?.image||juno||br0||entry.brItems?.[0]?.images?.featured||entry.brItems?.[0]?.images?.icon||getTrackArt(entry)||VBUCK_IMG;
}
function isBundle(entry: FortniteEntry): boolean {
  if (!entry.bundle) return false;
  if ((entry.brItems?.length??0)>=3) return true;
  const n=(entry.bundle.name||"").toLowerCase();
  return n.includes("lote")||n.includes("bundle")||n.includes("pack");
}
function isJamSection(entries: FortniteEntry[]): boolean {
  return entries.every(e=>e.tracks?.length&&!e.brItems?.length);
}
function getSectionGlow(group: {entries:FortniteEntry[]}) {
  for (const e of group.entries) {
    const c=(e as any).colors;
    if (c) {
      const [r1,g1,b1]=hexToRgb(String(c.color1||"1a2a50").slice(0,6));
      const [r3,g3,b3]=hexToRgb(String(c.color3||c.color1||"0d1a36").slice(0,6));
      return { r1,g1,b1,r3,g3,b3 };
    }
  }
  return { r1:26,g1:42,b1:80,r3:8,g3:15,b3:32 };
}
function groupEntries(entries: FortniteEntry[]) {
  const map: Record<string,{id:string;name:string;rank:number;entries:FortniteEntry[]}> = {};
  entries.forEach(e=>{
    const id=e.layout?.id??"__other__";
    const name=e.layout?.name??"Destacados";
    const rank=e.layout?.rank??0;
    if (!map[id]) map[id]={id,name,rank,entries:[]};
    map[id].entries.push(e);
  });
  return Object.values(map)
    .sort((a,b)=>b.rank-a.rank)
    .map(g=>({...g,entries:g.entries.sort((a,b)=>(b.sortPriority??0)-(a.sortPriority??0))}));
}

// ── Countdown por ítem ─────────────────────────────────────
function useCountdown(outDate?: string) {
  const calc = ()=>{
    if (!outDate) return null;
    const diff=new Date(outDate).getTime()-Date.now();
    if (diff<=0) return null;
    const d=Math.floor(diff/86400000), h=Math.floor((diff%86400000)/3600000), m=Math.floor((diff%3600000)/60000), s=Math.floor((diff%60000)/1000);
    if (d>0) return `${d}d ${h}h ${m}m`;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  };
  const [t,setT]=useState<string|null>(calc);
  useEffect(()=>{ const id=setInterval(()=>setT(calc()),1000); return ()=>clearInterval(id); },[outDate]);
  return t;
}

const TILE_SPAN: Record<string,number> = { Size_1_x_1:1, Size_2_x_1:2, Size_3_x_1:3, Size_4_x_1:4 };
const AR_BY_SPAN: Record<number,string> = { 1:"0.628", 2:"1.27", 3:"1.92", 4:"2.5886" };

// ══════════════════════════════════════════════════════════
// ITEM CARD
// ══════════════════════════════════════════════════════════
const SLIDE_MS = 3000;

function ItemCard({ entry, vbucksToSoles, sym, formatPrice, lang, onClick }: {
  entry: FortniteEntry; vbucksToSoles:(v:number)=>string; sym:string; formatPrice:(p:number)=>string; lang:string; onClick:(e:FortniteEntry)=>void;
}) {
  const { images, isSlideshow } = getCardImages(entry);
  const [activeIdx,setActiveIdx]=useState(0);
  const activeRef=useRef(0), timerRef=useRef<any>(null), timeoutRef=useRef<any>(null);

  useEffect(()=>{
    activeRef.current=0; setActiveIdx(0);
    clearInterval(timerRef.current); clearTimeout(timeoutRef.current);
    if (!isSlideshow||images.length<2) return;
    timeoutRef.current=setTimeout(()=>{
      timerRef.current=setInterval(()=>{ const n=(activeRef.current+1)%images.length; activeRef.current=n; setActiveIdx(n); },SLIDE_MS);
    },Math.random()*SLIDE_MS);
    return ()=>{ clearInterval(timerRef.current); clearTimeout(timeoutRef.current); };
  },[isSlideshow,images.length,images[0]]);

  const bundle    =isBundle(entry);
  const itemType  =entry.brItems?.[0]?.type?.value||"";
  const isOutfit  =["outfit","pet","convertible"].includes(itemType);
  const hasSale   =entry.finalPrice<entry.regularPrice;
  const countdown =useCountdown(entry.outDate);
  const span      =TILE_SPAN[entry.tileSize]??1;
  const isBig     =span>1;
  const gradient  =getCardGradient(entry);
  const soles     =vbucksToSoles(entry.finalPrice);
  const name      =bundle?entry.bundle!.name:(entry.brItems?.[0]?.name||entry.tracks?.[0]?.title||"—");
  const typeDisplay=bundle?(lang === "EN" ? "Bundle" : "Lote"):(entry.brItems?.[0]?.type?.displayValue||(entry.tracks?.length?(lang === "EN" ? "Song" : "Canción"):""));
  const brItem    =entry.brItems?.[0];
  const series    =(brItem as any)?.series?.value||null;
  const rarityDisp=brItem?.rarity?.displayValue||"";

  return (
    <div style={{ position:"relative", padding:6, minWidth:0, gridColumn:span>1?`span ${span}`:undefined, animation:"fn-fadeInUp .3s ease both" }}
      onClick={()=>onClick(entry)}>
      <div className="fn-card" style={{
        position:"relative", width:"100%", aspectRatio:AR_BY_SPAN[span],
        borderRadius:16, overflow:"hidden", cursor:"pointer",
        background:"#0a1020", boxShadow:"0 4px 20px rgba(0,0,0,.35)",
        outline:"2px solid transparent", outlineOffset:-2,
        transition:"outline .15s ease, transform .2s cubic-bezier(.25,.46,.45,.94), box-shadow .2s",
      }}>
        {/* Gradiente rareza */}
        <div style={{ position:"absolute", inset:0, backgroundImage:gradient }}/>

        {/* Imagen con máscara LEVE — como la oficial */}
        <div style={{
          position:"absolute", inset:0, overflow:"hidden", borderRadius:"inherit",
          WebkitMaskImage:"linear-gradient(to bottom, black 0%, black 68%, transparent 90%)",
          maskImage:"linear-gradient(to bottom, black 0%, black 68%, transparent 90%)",
        }}>
          {images.map((img,i)=>(
            <img key={img} src={img} alt={name} loading={i===0?"eager":"lazy"}
              style={{
                position:"absolute", inset:0, width:"100%", height:"100%",
                objectFit:isBig?"cover":isOutfit?"cover":"contain" as any,
                objectPosition:isBig?"30% 10%":isOutfit?"50% 0%":"center center",
                transform:`scale(${isBig?1:1.18})`,
                transformOrigin:isOutfit&&!isBig?"top center":"center center",
                opacity:i===activeIdx?1:0, transition:"opacity 0.5s ease",
              }}
              onError={e=>{ (e.target as HTMLImageElement).src=VBUCK_IMG; }}
            />
          ))}
        </div>

        {/* Badge venta */}
        {hasSale&&entry.banner?.value&&(
          <div style={{
            position:"absolute", top:9, left:9, zIndex:6,
            fontFamily:"'Readex Pro', sans-serif",
            fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:6, textTransform:"uppercase" as const,
            background:"#ffe600", color:"#000", boxShadow:"0 2px 8px rgba(0,0,0,.5)",
          }}>{entry.banner.value}</div>
        )}

        {/* Timer */}
        {countdown&&(
          <div style={{
            position:"absolute", top:9, right:9, zIndex:6,
            display:"flex", alignItems:"center", gap:4,
            fontFamily:"'Manrope', sans-serif", fontSize:10, fontWeight:700,
            color:"rgba(255,255,255,.95)", background:"rgba(0,0,0,.45)",
            backdropFilter:"blur(6px)", padding:"3px 8px", borderRadius:20,
            border:"1px solid rgba(255,255,255,.15)", fontVariantNumeric:"tabular-nums",
          }}>
            <Clock size={9} strokeWidth={2.5}/> {countdown}
          </div>
        )}

        {/* Info inferior — gradiente LEVE */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0,
          padding:"12px 13px 13px", zIndex:4,
          background:"none",
        }}>
          {(series||rarityDisp)&&(
            <div style={{
              display:"inline-block", fontFamily:"'Manrope', sans-serif",
              fontSize:9, fontWeight:700, letterSpacing:".8px", textTransform:"uppercase" as const,
              padding:"2px 7px", borderRadius:4, marginBottom:5,
              background:"rgba(255,255,255,.12)", color:"rgba(255,255,255,.75)",
              border:"1px solid rgba(255,255,255,.18)",
            }}>{series||rarityDisp}</div>
          )}

          {/* Nombre — Readex Pro para títulos */}
          <div style={{
            fontFamily:"'Readex Pro', sans-serif",
            fontSize:isBig?24:19, fontWeight:700, color:"#fff",
            lineHeight:1.15, display:"-webkit-box", WebkitLineClamp:2,
            WebkitBoxOrient:"vertical", overflow:"hidden",
            textShadow:"0 2px 8px rgba(0,0,0,.9)", marginBottom:2,
          }}>{name}</div>

          {/* Tipo — Manrope */}
          {typeDisplay&&(
            <div style={{
              fontFamily:"'Manrope', sans-serif", fontSize:11, fontWeight:600,
              color:"rgba(255,255,255,.6)", textTransform:"uppercase" as const,
              letterSpacing:".6px", marginBottom:8,
            }}>{typeDisplay}</div>
          )}

          {/* Precio */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:6 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" as const }}>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <img src={VBUCK_IMG} width={15} height={15} alt="V" style={{ filter:"drop-shadow(0 0 4px rgba(0,212,255,.6))", flexShrink:0 }}/>
                {hasSale&&<span style={{ fontFamily:"'Readex Pro', sans-serif", fontSize:11, color:"rgba(255,255,255,.38)", textDecoration:"line-through" }}>{entry.regularPrice.toLocaleString()}</span>}
                <span style={{ fontFamily:"'Readex Pro', sans-serif", fontSize:21, fontWeight:700, color:"#fff", lineHeight:1 }}>{entry.finalPrice.toLocaleString()}</span>
              </div>
              <div style={{ width:1, height:14, background:"rgba(255,255,255,.25)", flexShrink:0 }}/>
              <span style={{ fontFamily:"'Readex Pro', sans-serif", fontSize:20, fontWeight:700, color:"#ffffff", lineHeight:1, textShadow:"0 0 10px rgba(74,222,128,.35)" }}>
                {sym} {soles}
              </span>
            </div>
            <button onClick={ev=>{ ev.stopPropagation(); onClick(entry); }}
              style={{
                flexShrink:0, width:32, height:32, borderRadius:"50%",
                border:"2px solid rgba(255,255,255,.5)", background:"rgba(0,0,0,.3)",
                color:"#fff", cursor:"pointer", backdropFilter:"blur(4px)",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
              <ShoppingCart size={13} strokeWidth={2.5}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// TRACK CARD
// ══════════════════════════════════════════════════════════
function TrackCard({ entry, vbucksToSoles, sym, formatPrice, lang, onClick }: {
  entry:FortniteEntry; vbucksToSoles:(v:number)=>string; sym:string; formatPrice:(p:number)=>string; lang:string; onClick:(e:FortniteEntry)=>void;
}) {
  const track=entry.tracks?.[0];
  if (!track) return null;
  const art=(getTrackArt(entry)||VBUCK_IMG), title=(track as any).title||"—", artist=(track as any).artist||"";
  const soles=vbucksToSoles(entry.finalPrice);
  return (
    <div style={{ padding:6, minWidth:0, animation:"fn-fadeInUp .3s ease both" }}>
      <div className="fn-card" style={{ position:"relative", width:"100%", aspectRatio:"0.627", borderRadius:16, overflow:"hidden", cursor:"pointer", background:"#0f1628", boxShadow:"0 4px 20px rgba(0,0,0,.35)", outline:"2px solid transparent", outlineOffset:-2, transition:"outline .15s, transform .2s, box-shadow .2s" }}
        onClick={()=>onClick(entry)}>
        <img src={art} alt={title} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} onError={e=>{ (e.target as HTMLImageElement).src=VBUCK_IMG; }}/>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"55%", background:"linear-gradient(0deg, rgba(0,0,0,.88) 0%, transparent 100%)" }}/>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"10px 14px 14px" }}>
          <div style={{ fontFamily:"'Manrope', sans-serif", fontSize:10, color:"rgba(255,255,255,.6)", textTransform:"uppercase" as const, letterSpacing:".5px", marginBottom:2 }}>{artist}</div>
          <div style={{ fontFamily:"'Readex Pro', sans-serif", fontSize:15, fontWeight:700, color:"#fff", lineHeight:1.2, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", textShadow:"0 1px 4px rgba(0,0,0,.7)" }}>{title}</div>
          <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:6 }}>
            <img src={VBUCK_IMG} width={13} height={13} alt="V"/>
            <span style={{ fontFamily:"'Readex Pro', sans-serif", fontSize:13, fontWeight:700, color:"#fff" }}>{entry.finalPrice.toLocaleString()}</span>
            <span style={{ fontFamily:"'Readex Pro', sans-serif", fontSize:12, fontWeight:700, color:"#4ade80", marginLeft:2 }}>{sym} {soles}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// SECTION
// ══════════════════════════════════════════════════════════
function ShopSection({ group, vbucksToSoles, sym, formatPrice, lang, onItemClick }: {
  group:{id:string;name:string;rank:number;entries:FortniteEntry[]};
  vbucksToSoles:(v:number)=>string; sym:string; formatPrice:(p:number)=>string; lang:string; onItemClick:(e:FortniteEntry)=>void;
}) {
  const isJam=isJamSection(group.entries);
  const { r1,g1,b1 }=getSectionGlow(group);
  return (
    <section id={`fn-sec-${group.id}`} style={{ position:"relative", padding:"24px 0 36px", width:"100%" }}>
      {/* Glow muy sutil */}
      <div style={{ position:"absolute", top:"0%", left:"50%", transform:"translateX(-50%)", width:"55%", height:"35%", borderRadius:"50%", pointerEvents:"none", zIndex:0, filter:"blur(80px)", opacity:0.06, background:`rgb(${r1},${g1},${b1})` }}/>

      {/* Título — Readex Pro como los demás títulos de la web */}
      <h2 style={{
        position:"relative", zIndex:2,
        fontFamily:"'Readex Pro', sans-serif",
        fontSize:"clamp(16px, 1.8vw, 32px)", fontWeight:700,
        textTransform:"uppercase" as const, letterSpacing:"0.5px",
        color:"var(--text)", lineHeight:1,
        maxWidth:1380, margin:"0 auto 4px", padding:"0 6px",
      }}>{group.name}</h2>

      {/* Grid */}
      <div className="fn-grid" style={{
        position:"relative", zIndex:2,
        display:"grid", gridTemplateColumns:"repeat(4, minmax(0, 1fr))",
        gridAutoFlow:"dense", gap:0,
        maxWidth:1380, width:"100%", margin:"0 auto",
      }}>
        {isJam
          ? group.entries.map(e=><TrackCard key={e.offerId} entry={e} vbucksToSoles={vbucksToSoles} sym={sym} formatPrice={formatPrice} lang={lang} onClick={onItemClick}/>)
          : group.entries.map(e=><ItemCard  key={e.offerId} entry={e} vbucksToSoles={vbucksToSoles} sym={sym} formatPrice={formatPrice} lang={lang} onClick={onItemClick}/>)
        }
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════
// MODAL — diseño KidStore, sin blur overlay, 3 botones,
//         usuario Epic obligatorio
// ══════════════════════════════════════════════════════════
function ShopModal({ entry, onClose, vbucksToSoles, vbucksToPen, sym, formatPrice, referentialNote, lang }: {
  entry:FortniteEntry; onClose:()=>void; vbucksToSoles:(v:number)=>string; vbucksToPen:(v:number)=>number; sym:string; formatPrice:(p:number)=>string; referentialNote:string; lang:string;
}) {
  const { addItem, isInCart }=useCart();
  const router=useRouter();
  const [epicUser,    setEpicUser]    = useState("");
  const [epicErr,     setEpicErr]     = useState("");
  const [cartAdded,   setCartAdded]   = useState(false);
  const countdown=useCountdown(entry.outDate);

  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{ if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown",h);
    document.body.style.overflow="hidden";
    return ()=>{ window.removeEventListener("keydown",h); document.body.style.overflow=""; };
  },[onClose]);

  const bundle     =isBundle(entry);
  const rarity     =getRarity(entry);
  const color      =RARITY_COLORS[rarity]||"#7986a3";
  const gradient   =getCardGradient(entry);
  const img        =getBestImage(entry);
  const brItem     =entry.brItems?.[0];
  const series     =(brItem as any)?.series?.value||null;
  const rarityLabel=brItem?.rarity?.displayValue||rarity;
  const hasSale    =entry.finalPrice<entry.regularPrice;
  const soles      =vbucksToSoles(entry.finalPrice);
  const solesOld   =hasSale?vbucksToSoles(entry.regularPrice):null;
  const name       =bundle?entry.bundle!.name:entry.tracks?.[0]?.title??(brItem?.name||"—");
  const type       =entry.tracks?.[0]
    ? `${(entry.tracks[0] as any).artist||""}`
    : bundle?(lang === "EN" ? "Special bundle" : "Lote especial"):(brItem?.type?.displayValue||"");
  const desc=brItem?.description||"";

  const waMsg=encodeURIComponent(
    lang === "EN"
      ? `Hi! I want to buy:\n🎮 *${name}*\n${type?`📦 ${type}\n`:""}🪙 ${entry.finalPrice.toLocaleString()} V-Bucks\n💰 ${sym} ${soles}\n\nCan you help me?`
      : `Hola! Quiero comprar:\n🎮 *${name}*\n${type?`📦 ${type}\n`:""}🪙 ${entry.finalPrice.toLocaleString()} V-Bucks\n💰 ${sym} ${soles}\n\n¿Puedes ayudarme?`
  );

  function validateUser(): boolean {
    if (!epicUser.trim()) { setEpicErr(lang === "EN" ? "Enter your Epic Games username." : "Ingresa tu nombre de usuario de Epic Games."); return false; }
    return true;
  }

  function handleAddCart() {
    if (!validateUser()) return;
    addItem({
      slug: entry.offerId, name, img:getBestImage(entry),
      price:vbucksToPen(entry.finalPrice),
      priceOld:hasSale?vbucksToPen(entry.regularPrice):vbucksToPen(entry.finalPrice),
      region:"Global", format:`${entry.finalPrice.toLocaleString()} V-Bucks`,
      tabLabel:"Tienda",
      orderData:{ user: epicUser.trim() },
    });
    setCartAdded(true);
    setTimeout(()=>setCartAdded(false),2500);
  }

  function handleBuyNow() {
    if (!validateUser()) return;
    // Solo añade si no está ya en el carrito
    if (!isInCart(entry.offerId)) {
      addItem({
        slug: entry.offerId, name, img:getBestImage(entry),
        price:vbucksToPen(entry.finalPrice),
        priceOld:hasSale?vbucksToPen(entry.regularPrice):vbucksToPen(entry.finalPrice),
        region:"Global", format:`${entry.finalPrice.toLocaleString()} V-Bucks`,
        tabLabel:"Tienda",
        orderData:{ user: epicUser.trim() },
      });
    }
    router.push("/checkout");
  }

  return (
    /* Overlay sin blur — solo fondo semitransparente suave */
    <div
      style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,.38)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}
    >
      <div style={{
        position:"relative", width:"100%", maxWidth:900, maxHeight:"92vh",
        borderRadius:20, overflow:"hidden",
        background:"var(--card)", border:"1px solid var(--border)",
        boxShadow:"0 20px 60px rgba(0,0,0,.2)",
        display:"flex", flexDirection:"column",
      }} className="fn-modal-wrap">
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:"1px solid var(--border)", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:9, height:9, borderRadius:"50%", background:color, boxShadow:`0 0 8px ${color}`, flexShrink:0 }}/>
            <div>
              <p style={{ fontFamily:"'Manrope', sans-serif", fontSize:10, fontWeight:600, letterSpacing:"1.2px", textTransform:"uppercase" as const, color:"var(--text-subtle)", margin:0 }}>
                {type||rarityLabel}
              </p>
              <h2 style={{ fontFamily:"'Readex Pro', sans-serif", fontSize:20, fontWeight:700, color:"var(--text)", margin:0, lineHeight:1.15 }}>
                {name}
              </h2>
            </div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:10, border:"1px solid var(--border)", background:"var(--surface)", color:"var(--text-muted)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:14 }}>✕</button>
        </div>

        {/* Body */}
        <div className="fn-modal-body" style={{ display:"flex", flex:1, overflowY:"auto", minHeight:0 }}>

          {/* Imagen — panel grande, imagen completa sin recortar */}
          <div className="fn-modal-img" style={{
            width: 300, minWidth: 300, flexShrink: 0,
            position: "relative", backgroundImage: gradient,
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            <img src={img} alt={name} style={{
              position: "relative", zIndex: 2,
              width: "100%", height: "100%",
              objectFit: "contain",
              objectPosition: "center center",
              filter: "drop-shadow(0 8px 32px rgba(0,0,0,.6))",
              padding: "12px",
            }} onError={e=>{ (e.target as HTMLImageElement).src=VBUCK_IMG; }}/>
            {/* Fade hacia var(--card) — sin negro */}
            {/* Fade lateral quitado — sin difuminado */}
            <div style={{ position:"absolute", top:12, left:12, zIndex:5, fontFamily:"'Manrope', sans-serif", fontSize:9, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" as const, padding:"3px 10px", borderRadius:20, background:`${color}22`, border:`1px solid ${color}66`, color }}>{series||rarityLabel}</div>
            {countdown&&(
              <div style={{ position:"absolute", bottom:12, left:12, zIndex:5, display:"flex", alignItems:"center", gap:4, fontFamily:"'Manrope', sans-serif", fontSize:10, fontWeight:700, color:"#fff", background:"rgba(0,0,0,.5)", backdropFilter:"blur(6px)", padding:"4px 10px", borderRadius:20, border:"1px solid rgba(255,255,255,.15)" }}>
                <Clock size={9}/> {countdown}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex:1, padding:"18px 20px 18px 14px", display:"flex", flexDirection:"column", gap:10, overflowY:"auto" }}>

            {desc&&<p style={{ fontFamily:"'Manrope', sans-serif", fontSize:13, color:"var(--text-muted)", lineHeight:1.6, margin:0 }}>{desc}</p>}

            {bundle&&(entry.brItems?.length??0)>1&&(
              <div>
                <p style={{ fontFamily:"'Manrope', sans-serif", fontSize:10, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" as const, color:"var(--text-subtle)", margin:"0 0 6px" }}>{lang === "EN" ? "Bundle contents" : "Contenido del lote"}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {entry.brItems!.map(it=>(
                    <div key={it.id} style={{ background:"var(--surface)", border:"1px solid var(--border)", padding:"4px 10px", borderRadius:8 }}>
                      <div style={{ fontFamily:"'Readex Pro', sans-serif", fontSize:11, fontWeight:700, color:"var(--text)" }}>{it.name}</div>
                      <div style={{ fontFamily:"'Manrope', sans-serif", fontSize:9, color:"var(--text-subtle)", textTransform:"uppercase" as const, letterSpacing:".5px" }}>{it.type?.displayValue||""}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {entry.giftable&&<span style={{ fontFamily:"'Manrope', sans-serif", fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, background:"rgba(0,210,100,.1)", color:"#10b981", border:"1px solid rgba(0,210,100,.2)" }}>{lang === "EN" ? "🎁 Giftable" : "🎁 Regalable"}</span>}
              {hasSale&&entry.banner?.value&&<span style={{ fontFamily:"'Manrope', sans-serif", fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, background:"rgba(255,200,0,.1)", color:"#f59e0b", border:"1px solid rgba(255,200,0,.2)" }}>🏷 {entry.banner.value}</span>}
            </div>

            <div style={{ flex:1 }}/>

            {/* Precio */}
            <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:"12px 16px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" as const, marginBottom:4 }}>
                <img src={VBUCK_IMG} width={20} height={20} alt="V" style={{ filter:"drop-shadow(0 0 5px rgba(0,212,255,.5))", flexShrink:0 }}/>
                {hasSale&&<span style={{ fontFamily:"'Readex Pro', sans-serif", fontSize:13, color:"var(--text-subtle)", textDecoration:"line-through" }}>{entry.regularPrice.toLocaleString()}</span>}
                <span style={{ fontFamily:"'Readex Pro', sans-serif", fontSize:24, fontWeight:700, color:"var(--text)", lineHeight:1 }}>{entry.finalPrice.toLocaleString()}</span>
                <span style={{ fontFamily:"'Manrope', sans-serif", fontSize:10, color:"var(--text-subtle)", textTransform:"uppercase" as const, letterSpacing:"1px" }}>V-Bucks</span>
                <div style={{ width:1, height:18, background:"var(--border)", flexShrink:0 }}/>
                {solesOld&&<span style={{ fontFamily:"'Readex Pro', sans-serif", fontSize:13, color:"var(--text-subtle)", textDecoration:"line-through" }}>{sym} {solesOld}</span>}
                <span style={{ fontFamily:"'Readex Pro', sans-serif", fontSize:22, fontWeight:700, color:"#4ade80", lineHeight:1 }}>{sym} {soles}</span>
              </div>
              <p style={{ fontFamily:"'Manrope', sans-serif", fontSize:10, color:"var(--text-subtle)", margin:0 }}>{referentialNote}</p>
            </div>

            {/* Campo usuario Epic — requerido para carrito y comprar ahora */}
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              <label style={{ fontFamily:"'Manrope', sans-serif", fontSize:11, fontWeight:600, color:"var(--text-subtle)", letterSpacing:".5px" }}>
                {lang === "EN" ? "Epic Games Username" : "Usuario de Epic Games"} <span style={{ color:"#ef4444" }}>*</span>
              </label>
              <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
                <svg style={{ position:"absolute", left:12, color:"var(--text-subtle)", pointerEvents:"none" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  type="text"
                  placeholder={lang === "EN" ? "Ex: YourEpicName" : "Ej: TuNombreEpic"}
                  value={epicUser}
                  onChange={e=>{ setEpicUser(e.target.value); setEpicErr(""); }}
                  onKeyDown={e=>e.key==="Enter"&&handleBuyNow()}
                  style={{
                    width:"100%", padding:"10px 12px 10px 36px", borderRadius:10,
                    background:"var(--surface)", border:`1.5px solid ${epicErr?"rgba(239,68,68,.5)":"var(--border)"}`,
                    color:"var(--text)", fontFamily:"'Manrope', sans-serif", fontSize:14,
                    outline:"none", boxSizing:"border-box", transition:"border-color .15s",
                  }}
                  onFocus={e=>(e.currentTarget.style.borderColor="var(--brand)")}
                  onBlur={e=>(e.currentTarget.style.borderColor=epicErr?"rgba(239,68,68,.5)":"var(--border)")}
                />
              </div>
              {epicErr&&<span style={{ fontFamily:"'Manrope', sans-serif", fontSize:11, color:"#ef4444" }}>{epicErr}</span>}
              <p style={{ fontFamily:"'Manrope', sans-serif", fontSize:10, color:"var(--text-subtle)", margin:0 }}>
                {lang === "EN" ? "Required to send you the item as a gift in Fortnite." : "Necesario para enviarte el ítem como regalo en Fortnite."}
              </p>
            </div>

            {/* 3 BOTONES */}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>

              {/* 1. Añadir al carrito */}
              <button onClick={handleAddCart} style={{
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                height:46, borderRadius:12, border:"none", cursor:"pointer", width:"100%",
                fontFamily:"'Manrope', sans-serif", fontWeight:700, fontSize:14,
                background:cartAdded?"linear-gradient(135deg,#059669,#10b981)":"linear-gradient(135deg,#7C3AED,#5B21B6)",
                color:"#fff",
                boxShadow:cartAdded?"0 4px 16px rgba(16,185,129,.3)":"0 4px 16px rgba(124,58,237,.35)",
                transition:"all .2s",
              }}>
                {cartAdded?<Check size={16}/>:<ShoppingCart size={16}/>}
                {cartAdded ? (lang === "EN" ? "Added to cart!" : "¡Añadido al carrito!") : (lang === "EN" ? "Add to cart" : "Agregar al carrito")}
              </button>

              {/* 2. Comprar ahora */}
              <button onClick={handleBuyNow} style={{
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                height:46, borderRadius:12, border:"none", cursor:"pointer", width:"100%",
                fontFamily:"'Manrope', sans-serif", fontWeight:700, fontSize:14,
                background:"linear-gradient(135deg,#ffe600,#ffa800)",
                color:"#000", boxShadow:"0 4px 16px rgba(255,200,0,.3)",
                transition:"all .2s",
              }}>
                <Zap size={16}/>
                {lang === "EN" ? "Buy now" : "Comprar ahora"}
              </button>

              {/* 3. Comprar por WhatsApp */}
              <a href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                style={{
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  height:46, borderRadius:12, textDecoration:"none", width:"100%",
                  fontFamily:"'Manrope', sans-serif", fontWeight:700, fontSize:14,
                  background:"linear-gradient(135deg,#25D366,#128C7E)",
                  color:"#fff", boxShadow:"0 4px 16px rgba(37,211,102,.2)",
                }}>
                <MessageCircle size={16}/>
                {lang === "EN" ? "Buy via WhatsApp" : "Comprar por WhatsApp"}
              </a>
            </div>

          
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// FLOATING NAVIGATION PANEL — secciones clicables, sticky
// ══════════════════════════════════════════════════════════
function NavPanel({ groups, lang }: { groups: { id: string; name: string }[]; lang: string }) {
  const [open,    setOpen]    = useState(false);
  const [active,  setActive]  = useState("");
  const panelRef              = useRef<HTMLDivElement>(null);

  // Cerrar al click fuera
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Detectar sección activa según scroll
  useEffect(() => {
    const h = () => {
      for (let i = groups.length - 1; i >= 0; i--) {
        const el = document.getElementById(`fn-sec-${groups[i].id}`);
        if (el && el.getBoundingClientRect().top <= 140) {
          setActive(groups[i].id);
          return;
        }
      }
      if (groups.length > 0) setActive(groups[0].id);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, [groups]);

  function scrollTo(id: string) {
    const el = document.getElementById(`fn-sec-${id}`);
    if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); }
    setActive(id);
    setOpen(false);
  }

  if (groups.length === 0) return null;

  return (
    <div ref={panelRef} style={{
      position: "fixed",
      right: 16, top: "50%", transform: "translateY(-50%)",
      zIndex: 90,
      display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8,
    }}>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        title={lang === "EN" ? "Section navigation" : "Navegación de secciones"}
        style={{
          width: 40, height: 40, borderRadius: 12,
          background: "var(--brand)", color: "#fff",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(124,58,237,.45)",
          flexShrink: 0,
        }}
      >
        {open
          ? <X size={16} strokeWidth={2.5}/>
          : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        }
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: 14, overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,.25)",
          minWidth: 200, maxWidth: 240,
          maxHeight: "60vh", overflowY: "auto",
          animation: "fn-slideIn .18s ease",
        }}>
          {/* Header */}
          <div style={{
            padding: "10px 14px 8px",
            borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontFamily:"'Manrope', sans-serif", fontSize:10, fontWeight:700, letterSpacing:"1.2px", textTransform:"uppercase" as const, color:"var(--text-subtle)" }}>
              {lang === "EN" ? "Navigation" : "Navegación"}
            </span>
            <button onClick={() => setOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-subtle)", display:"flex", padding:2 }}>
              <X size={13}/>
            </button>
          </div>

          {/* Lista de secciones */}
          <div style={{ padding: "6px 0" }}>
            {groups.map(g => (
              <button
                key={g.id}
                onClick={() => scrollTo(g.id)}
                style={{
                  width: "100%", padding: "9px 14px",
                  background: active === g.id ? "rgba(124,58,237,.1)" : "transparent",
                  border: "none", cursor: "pointer", textAlign: "left",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                  transition: "background .12s",
                }}
                onMouseEnter={e => { if (active !== g.id) (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}
                onMouseLeave={e => { if (active !== g.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <span style={{
                  fontFamily:"'Readex Pro', sans-serif", fontSize:11, fontWeight:700,
                  textTransform:"uppercase" as const, letterSpacing:"0.5px",
                  color: active === g.id ? "var(--brand)" : "var(--text-muted)",
                  lineHeight: 1.3,
                }}>
                  {g.name}
                </span>
                {active === g.id && (
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"var(--brand)", flexShrink:0 }}/>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════
export default function FortniteShopTab() {
  const { currencySymbol, formatPrice, lang } = usePreferences();
  const { vbucksToSoles, vbucksToPen, referentialNote } = useFortniteExchangeRate();
  const t = useT();

  // Sync shop language with web language, allow manual override
  const webLang: "es-419"|"en" = lang === "EN" ? "en" : "es-419";
  const [manualLang, setManualLang] = useState<"es-419"|"en"|null>(null);
  const shopLang = manualLang ?? webLang;
  useEffect(() => { setManualLang(null); }, [lang]);

  const { data, loading, error, reload } = useFortniteShop(shopLang);
  const [selected, setSelected]          = useState<FortniteEntry|null>(null);
  const [search,   setSearch]            = useState("");
  const resetCountdown                   = useResetCountdown();

  const groups = useMemo(()=>{
    if (!data) return [];
    const all=groupEntries(data.entries);
    if (!search.trim()) return all;
    const q=search.toLowerCase();
    return all.map(g=>({
      ...g,
      entries:g.entries.filter(e=>{
        const n=e.bundle?.name??e.brItems?.[0]?.name??e.tracks?.[0]?.title??"";
        return n.toLowerCase().includes(q);
      }),
    })).filter(g=>g.entries.length>0);
  },[data,search]);

  const totalItems=data?.entries.length??0;
  const dateStr=data?.date
    ? new Date(data.date).toLocaleDateString(shopLang === "en" ? "en-US" : "es-419",{ weekday:"long", day:"numeric", month:"long", year:"numeric" })
    : "";

  // Loading
  if (loading) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:380, gap:16 }}>
      <style>{`@keyframes fn-spin { to { transform:rotate(360deg); } }`}</style>
      <div style={{ width:40, height:40, borderRadius:"50%", border:"3px solid var(--border)", borderTopColor:"var(--brand)", animation:"fn-spin .7s linear infinite" }}/>
      <p style={{ fontFamily:"'Manrope', sans-serif", fontSize:13, fontWeight:600, color:"var(--text-subtle)", letterSpacing:2, textTransform:"uppercase" as const }}>{lang === "EN" ? "Loading shop..." : "Cargando tienda..."}</p>
    </div>
  );

  // Error
  if (error) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:380, gap:12, textAlign:"center", padding:24 }}>
      <div style={{ fontSize:44 }}>⚠️</div>
      <p style={{ fontFamily:"'Readex Pro', sans-serif", fontSize:16, fontWeight:700, color:"var(--text)" }}>{lang === "EN" ? "Error loading shop" : "Error al cargar la tienda"}</p>
      <p style={{ fontFamily:"'Manrope', sans-serif", fontSize:13, color:"var(--text-subtle)" }}>{error}</p>
      <button onClick={reload} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 24px", background:"var(--brand)", color:"#fff", border:"none", borderRadius:10, fontFamily:"'Manrope', sans-serif", fontWeight:700, fontSize:14, cursor:"pointer" }}>
        <RefreshCw size={14}/> {lang === "EN" ? "Retry" : "Reintentar"}
      </button>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes fn-fadeInUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:none } }
        @keyframes fn-spin     { to { transform:rotate(360deg); } }
        @keyframes fn-slideIn  { from { opacity:0; transform:translateX(16px) } to { opacity:1; transform:none } }
        @media (hover:hover) {
          .fn-card:hover { outline:2px solid rgba(255,255,255,.82) !important; transform:scale(1.022) translateY(-2px) !important; box-shadow:0 12px 36px rgba(0,0,0,.5) !important; z-index:10 !important; position:relative !important; }
        }
        @media (max-width:1100px) { .fn-grid { grid-template-columns:repeat(3,minmax(0,1fr)) !important; } }
        @media (max-width:700px)  { .fn-grid { grid-template-columns:repeat(2,minmax(0,1fr)) !important; } }
        @media (max-width:600px) {
          .fn-header { padding:12px 12px !important; }
          .fn-header-title { font-size:18px !important; }
          .fn-search-wrap { max-width:100% !important; }
        }
        @media (max-width:640px) {
          .fn-modal-body  { flex-direction:column !important; overflow-y:auto !important; }
          .fn-modal-img   { width:100% !important; min-width:unset !important; height:200px !important; flex-shrink:0 !important; }
          .fn-modal-info  { padding:12px 14px 14px !important; }
          .fn-modal-wrap  { max-height:96vh !important; border-radius:14px !important; }
        }
      `}</style>

      {/* ── HEADER ──────────────────────────────────────── */}
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, padding:"20px 24px", marginBottom:20 }}>

        {/* Título grande y centrado */}
        <div style={{ textAlign:"center", marginBottom:16 }}>
          <p style={{ fontFamily:"'Manrope', sans-serif", fontSize:11, fontWeight:600, letterSpacing:"1.5px", textTransform:"uppercase" as const, color:"var(--brand)", margin:"0 0 6px" }}>
            🛒 {lang === "EN" ? `Official shop · ${totalItems} items available` : `Tienda oficial · ${totalItems} ítems disponibles`}
          </p>
          <h2 style={{ fontFamily:"'Readex Pro', sans-serif", fontSize:28, fontWeight:700, color:"var(--text)", margin:"0 0 4px", lineHeight:1.2 }}>
            {lang === "EN" ? "Fortnite Item Shop" : "Tienda de objetos de Fortnite"}
          </h2>
          {dateStr&&(
            <p style={{ fontFamily:"'Manrope', sans-serif", fontSize:14, color:"var(--text-muted)", margin:"0 0 10px", textTransform:"capitalize" as const }}>
              {dateStr}
            </p>
          )}
          {/* Contador reset */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 14px", borderRadius:20, background:"var(--surface)", border:"1px solid var(--border)" }}>
            <Clock size={11} style={{ color:"var(--brand)" }}/>
            <span style={{ fontFamily:"'Manrope', sans-serif", fontSize:11, fontWeight:600, color:"var(--text-muted)" }}>{lang === "EN" ? "New items in" : "Nuevos artículos en"}</span>
            <span style={{ fontFamily:"'Readex Pro', sans-serif", fontSize:14, fontWeight:700, color:"var(--brand)", fontVariantNumeric:"tabular-nums", letterSpacing:"0.5px" }}>{resetCountdown}</span>
          </div>
        </div>

        {/* Buscador centrado */}
        <div style={{ position:"relative", maxWidth:500, margin:"0 auto" }}>
          <Search size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"var(--text-subtle)", pointerEvents:"none" }}/>
          <input
            type="text"
            placeholder={lang === "EN" ? "Search item in shop..." : "Buscar ítem en la tienda..."}
            value={search}
            onChange={e=>setSearch(e.target.value)}
            style={{
              width:"100%", padding:"10px 38px 10px 40px", borderRadius:12,
              background:"var(--surface)", border:"1px solid var(--border)",
              color:"var(--text)", fontFamily:"'Manrope', sans-serif", fontSize:14,
              outline:"none", boxSizing:"border-box", transition:"border-color .15s",
            }}
            onFocus={e=>(e.currentTarget.style.borderColor="var(--brand)")}
            onBlur={e=>(e.currentTarget.style.borderColor="var(--border)")}
          />
          {search&&(
            <button onClick={()=>setSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--text-subtle)", display:"flex", alignItems:"center", justifyContent:"center", padding:4 }}>
              <X size={14}/>
            </button>
          )}
        </div>

        {/* Lang toggle + Refresh */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontFamily:"'Manrope', sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.8px", textTransform:"uppercase" as const, color:"var(--text-subtle)" }}>
              {lang === "EN" ? "Shop" : "Tienda"}
            </span>
            <div style={{ display:"flex", gap:3, background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10, padding:3 }}>
              {([
                { code:"es-419" as const, flag:"🇪🇸", label:"ES" },
                { code:"en"     as const, flag:"🇺🇸", label:"EN" },
              ]).map(l => (
                <button key={l.code} onClick={() => setManualLang(l.code)}
                  title={l.code === "es-419" ? (lang === "EN" ? "Spanish" : "Español") : "English"}
                  style={{
                    display:"flex", alignItems:"center", gap:4,
                    padding:"4px 10px", borderRadius:7, border:"none", cursor:"pointer",
                    fontFamily:"'Manrope', sans-serif", fontSize:11, fontWeight:700,
                    background: shopLang === l.code ? "var(--brand)" : "transparent",
                    color:      shopLang === l.code ? "#fff" : "var(--text-subtle)",
                    transition: "all .15s",
                  }}>
                  <span>{l.flag}</span><span>{l.label}</span>
                </button>
              ))}
            </div>
            {manualLang && (
              <button onClick={() => setManualLang(null)} title={lang === "EN" ? "Sync with website language" : "Sincronizar con idioma de la web"}
                style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-subtle)", fontSize:10, fontFamily:"'Manrope', sans-serif", padding:0 }}>
                ↺ auto
              </button>
            )}
          </div>
          <button onClick={reload} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:8, border:"1px solid var(--border)", background:"var(--surface)", color:"var(--text-subtle)", cursor:"pointer", fontFamily:"'Manrope', sans-serif", fontSize:12, fontWeight:600 }}>
            <RefreshCw size={12}/> {lang === "EN" ? "Refresh" : "Actualizar"}
          </button>
        </div>
      </div>

      {/* ── SECCIONES ────────────────────────────────────── */}
      <div style={{ margin:"0 -1rem" }}>
        {groups.map(group=>(
          <ShopSection key={group.id} group={group} vbucksToSoles={vbucksToSoles} sym={currencySymbol} formatPrice={formatPrice} lang={lang} onItemClick={setSelected}/>
        ))}
      </div>

      {groups.length===0&&search&&(
        <div style={{ textAlign:"center", padding:"48px 24px" }}>
          <p style={{ fontFamily:"'Readex Pro', sans-serif", fontSize:15, fontWeight:700, color:"var(--text-subtle)" }}>
            {lang === "EN" ? <>No results for &ldquo;{search}&rdquo;</> : <>No se encontró &ldquo;{search}&rdquo;</>}
          </p>
        </div>
      )}

      {/* Panel de navegación flotante */}
      <NavPanel groups={groups.map(g=>({ id:g.id, name:g.name }))} lang={lang}/>

      {selected&&(
        <ShopModal entry={selected} onClose={()=>setSelected(null)} vbucksToSoles={vbucksToSoles} vbucksToPen={vbucksToPen} sym={currencySymbol} formatPrice={formatPrice} referentialNote={referentialNote} lang={lang}/>
      )}
    </>
  );
}
