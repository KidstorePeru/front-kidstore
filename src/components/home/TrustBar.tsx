"use client";

import { useT } from "@/i18n";

export default function TrustBar() {
  const t = useT();

  const items = [
    { icon: "⚡", text: t.trust.instantDelivery },
    { icon: "🔒", text: t.trust.securePayment },
    { icon: "🎮", text: t.trust.gamesAvailable },
    { icon: "💬", text: t.trust.support },
  ];

  return (
    <div
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        transition: "background 0.35s ease, border-color 0.35s ease",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-3">
        <ul className="flex items-center justify-center gap-6 md:gap-12 flex-wrap list-none m-0 p-0">
          {items.map((item) => (
            <li key={item.text} className="flex items-center gap-2">
              <span className="text-sm" aria-hidden="true">{item.icon}</span>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-subtle)" }}
              >
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
