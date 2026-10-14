"use client";
// Panel → Temporada: Automática (por fechas), Encendida o Apagada. Encendida / Apagada valen
// hasta el fin de esa temporada y luego vuelven solas a Automática (lo decide el servidor).
import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarClock, Eye, EyeOff, Power, RefreshCw, Sparkles } from "lucide-react";

type Mode = "auto" | "on" | "off";
interface SeasonAdmin {
  success: boolean;
  season: string | null;
  mode: Mode;
  source: "calendar" | "panel";
  until: string | null;
  override: { mode: Mode; season: string; setAt: string; until: string } | null;
  target: { id: string; start: string; end: string } | null;
  history: { id: number; action: string; detail: { mode?: Mode; previous?: Mode; until?: string | null }; at: string }[];
  error?: string;
}

const NAMES: Record<string, string> = { halloween: "Halloween 🎃" };
const MODE_LABEL: Record<Mode, string> = { auto: "Automática", on: "Encendida", off: "Apagada" };

const card = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16 };

// Fechas en hora de Lima. `end` es exclusivo (00:00 del día siguiente): se muestra el minuto anterior.
const fmt = (iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = { dateStyle: "long", timeStyle: "short" }) =>
  iso ? new Date(iso).toLocaleString("es-PE", { timeZone: "America/Lima", hourCycle: "h23", ...opts }) : "—";
const lastMinute = (iso: string) => new Date(Date.parse(iso) - 60_000).toISOString();

export default function TabTemporada() {
  const [data, setData] = useState<SeasonAdmin | null>(null);
  const [saving, setSaving] = useState<Mode | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const hasData = useRef(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin-season", { cache: "no-store" });
      const json = (await res.json()) as SeasonAdmin;
      if (!res.ok || !json.success) throw new Error(json.error || `Error ${res.status}`);
      hasData.current = true;
      setData(json);
      setMsg((m) => (m && !m.ok ? null : m));
    } catch (err) {
      // Si ya hay datos en pantalla, un fallo al refrescar no tapa lo que se ve.
      if (!hasData.current) setMsg({ text: err instanceof Error ? err.message : "No se pudo leer la temporada.", ok: false });
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function choose(mode: Mode) {
    setSaving(mode);
    setMsg(null);
    try {
      const res = await fetch("/api/admin-season", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      const json = (await res.json()) as SeasonAdmin;
      if (!res.ok || !json.success) throw new Error(json.error || `Error ${res.status}`);
      hasData.current = true;
      setData(json);
      setMsg({ text: `Modo «${MODE_LABEL[mode]}» guardado. La web lo aplica en menos de un minuto.`, ok: true });
    } catch (err) {
      setMsg({ text: err instanceof Error ? err.message : "No se pudo guardar.", ok: false });
    } finally {
      setSaving(null);
    }
  }

  const target = data?.target;
  const name = target ? NAMES[target.id] ?? target.id : "la próxima temporada";
  const endText = target ? fmt(lastMinute(target.end)) : "—";
  const modes: { id: Mode; title: string; icon: React.ReactNode; desc: string; tag?: string }[] = [
    {
      id: "auto", title: "Automática (por fechas)", icon: <CalendarClock size={18} />, tag: "Recomendado",
      desc: target ? `${name} se enciende el ${fmt(target.start, { dateStyle: "long" })} a las 00:00 y se apaga sola el ${endText} (hora de Lima).` : "Sigue el calendario.",
    },
    { id: "on", title: "Encendida", icon: <Power size={18} />, desc: `Se ve desde ahora aunque no hayan empezado las fechas. Dura hasta el ${endText} y luego vuelve sola a Automática.` },
    { id: "off", title: "Apagada", icon: <EyeOff size={18} />, desc: `La web se ve con su diseño de siempre hasta el ${endText}; luego vuelve sola a Automática.` },
  ];

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Estado actual */}
      <div className="p-5" style={card}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.45)" }}>Ahora en la web</p>
            <p className="text-lg font-bold mt-1 text-white flex items-center gap-2">
              <Sparkles size={18} style={{ color: data?.season ? "#FB923C" : "rgba(255,255,255,0.4)" }} />
              {data ? (data.season ? `Temporada de ${NAMES[data.season] ?? data.season}` : "Diseño de siempre") : "Cargando…"}
            </p>
            {data && (
              <p className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                Modo: <strong className="text-white">{MODE_LABEL[data.mode]}</strong>
                {data.override
                  ? <> · hasta el {fmt(lastMinute(data.override.until))} (elegido el {fmt(data.override.setAt)})</>
                  : data.until ? <> · {data.season ? "se apaga" : "próximo cambio"}: {fmt(data.season ? lastMinute(data.until) : data.until)}</> : null}
              </p>
            )}
          </div>
          <button onClick={() => void load()} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
            <RefreshCw size={12} /> Actualizar
          </button>
        </div>
      </div>

      {/* Modos */}
      <div className="p-5 space-y-3" style={card}>
        <p className="text-sm font-bold text-white">Modo de la temporada</p>
        {modes.map((m) => {
          const active = data?.mode === m.id;
          return (
            <button key={m.id} type="button" disabled={!data || saving !== null} onClick={() => void choose(m.id)}
              aria-pressed={active}
              className="w-full text-left flex items-start gap-3 p-4 rounded-xl transition-all disabled:opacity-60"
              style={{
                background: active ? "rgba(170,145,255,0.12)" : "rgba(255,255,255,0.03)",
                border: `1.5px solid ${active ? "#AA91FF" : "rgba(255,255,255,0.08)"}`,
              }}>
              <span className="mt-0.5" style={{ color: active ? "#AA91FF" : "rgba(255,255,255,0.5)" }}>{m.icon}</span>
              <span className="flex-1">
                <span className="flex items-center gap-2 text-[14px] font-bold text-white">
                  {m.title}
                  {m.tag && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(74,222,128,0.12)", color: "#4ADE80" }}>{m.tag}</span>}
                  {active && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(170,145,255,0.18)", color: "#C4B2FF" }}>Activo</span>}
                </span>
                <span className="block text-[12.5px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{m.desc}</span>
              </span>
              {saving === m.id && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin text-white" />}
            </button>
          );
        })}
        {msg && (
          <p role="status" className="text-[13px] px-3 py-2 rounded-lg"
            style={{ background: msg.ok ? "rgba(74,222,128,0.1)" : "rgba(239,68,68,0.1)", color: msg.ok ? "#4ADE80" : "#FCA5A5" }}>
            {msg.text}
          </p>
        )}
      </div>

      {/* Vista previa solo para ti */}
      <div className="p-5" style={card}>
        <p className="text-sm font-bold text-white flex items-center gap-2"><Eye size={16} /> Vista previa (solo en tu pestaña)</p>
        <p className="text-[12.5px] mt-1 mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
          No cambia nada para los clientes: la pestaña recuerda la vista previa hasta que la cierres.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { q: "halloween", label: "🎃 Ver con Halloween" },
            { q: "ninguna", label: "Ver sin temporada" },
            { q: "auto", label: "Volver a lo normal" },
          ].map((p) => (
            <a key={p.q} href={`/?temporada=${p.q}`} target="_blank" rel="noopener noreferrer"
              className="text-xs font-semibold px-3 py-2 rounded-lg hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)" }}>
              {p.label}
            </a>
          ))}
        </div>
      </div>

      {/* Registro de cambios */}
      <div className="p-5" style={card}>
        <p className="text-sm font-bold text-white mb-2">Últimos cambios (registro de auditoría)</p>
        {!data?.history.length ? (
          <p className="text-[12.5px]" style={{ color: "rgba(255,255,255,0.5)" }}>Sin cambios todavía.</p>
        ) : (
          <ul className="space-y-1.5">
            {data.history.map((h) => (
              <li key={h.id} className="text-[12.5px] flex flex-wrap gap-x-2" style={{ color: "rgba(255,255,255,0.65)" }}>
                <span style={{ color: "rgba(255,255,255,0.45)" }}>{fmt(h.at, { dateStyle: "medium", timeStyle: "short" })}</span>
                <span>
                  {MODE_LABEL[h.detail.previous ?? "auto"]} → <strong className="text-white">{MODE_LABEL[h.detail.mode ?? "auto"]}</strong>
                  {h.detail.until ? ` (hasta el ${fmt(lastMinute(h.detail.until), { dateStyle: "medium", timeStyle: "short" })})` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
