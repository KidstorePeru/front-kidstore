// Script en línea del <head>: decide la temporada ANTES de pintar (sin parpadeo) con la misma
// regla que initialSeason(): vista previa de la pestaña > última respuesta del servidor vigente >
// fechas (hora de Lima). Luego SeasonProvider lo confirma con el servidor.
import { CACHE_KEY, PREVIEW_KEY, PREVIEW_PARAM, SEASONS } from "./calendar";

export function seasonBootScript(cssVersion: string): string {
  const cfg = JSON.stringify({ seasons: SEASONS, cacheKey: CACHE_KEY, previewKey: PREVIEW_KEY, param: PREVIEW_PARAM, v: cssVersion });
  return `(function(c){try{
if(location.pathname.indexOf("/admin")===0)return;
var now=Date.now(),off=5*36e5,ids=c.seasons.map(function(s){return s.id});
function mid(y,m,d){return Date.UTC(y,m-1,d)+off}
function byDate(t){var y=new Date(t-off).getUTCFullYear();for(var i=0;i<c.seasons.length;i++){var s=c.seasons[i];for(var k=y-1;k<=y;k++){var st=mid(k,s.start.month,s.start.day),ey=s.end.month<s.start.month?k+1:k,en=mid(ey,s.end.month,s.end.day)+864e5;if(t>=st&&t<en)return s.id}}return null}
var p=new URLSearchParams(location.search).get(c.param),pv=null;
if(p!==null){p=p.trim().toLowerCase();pv=(p==="ninguna"||p==="none"||p==="off")?"none":(ids.indexOf(p)>=0?p:(p==="auto"||p==="")?"auto":null);
if(pv==="auto"){sessionStorage.removeItem(c.previewKey)}else if(pv){sessionStorage.setItem(c.previewKey,JSON.stringify(pv))}}
var prev=null;try{prev=JSON.parse(sessionStorage.getItem(c.previewKey)||"null")}catch(e){}
var cache=null;try{cache=JSON.parse(localStorage.getItem(c.cacheKey)||"null")}catch(e){}
var season;
if(prev==="none")season=null;else if(prev&&ids.indexOf(prev)>=0)season=prev;
else if(cache&&(cache.until===null||now<cache.until))season=cache.season;else season=byDate(now);
if(season&&ids.indexOf(season)>=0){document.documentElement.setAttribute("data-season",season);
var l=document.createElement("link");l.id="season-css";l.rel="stylesheet";l.href="/seasons/"+season+".css?v="+c.v;document.head.appendChild(l)}
}catch(e){}})(${cfg});`;
}
