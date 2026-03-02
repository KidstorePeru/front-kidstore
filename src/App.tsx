// src/App.tsx
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header         from "./components/layout/Header";
import CartDrawer     from "./components/cart/CartDrawer";
import Footer         from "./components/layout/Footer";
import FortniteSubNav from "./components/layout/FortniteSubNav";

import Home  from "./pages/Home";
import Terms from "./pages/Terms";

/* ================= CATEGORÍAS ================= */
import Fortnite from "./pages/Fortnite";
import WildRift from "./pages/WildRift";
import Roblox   from "./pages/Roblox";
import Marvel   from "./pages/Marvel";
import Pokemon  from "./pages/Pokemon";
import Genshin  from "./pages/Genshin";
import Zzz      from "./pages/Zzz";
import Honkai   from "./pages/Honkai";
import Wuwa     from "./pages/Wuwa";
import Honor    from "./pages/Honor";
import Discord  from "./pages/Discord";

/* ================= FORTNITE SUBPÁGINAS ================= */
import FortniteAgregarBots  from "./pages/fortnite/FortniteAgregarBots";
import FortniteRecargaPavos from "./pages/fortnite/FortniteRecargaPavos";
import FortnitePaquetes     from "./pages/fortnite/FortnitePaquetes";
import FortnitePaseBatalla  from "./pages/fortnite/FortnitePaseBatalla";

/* ================= CUENTA ================= */
import AccountDashboard from "./pages/AccountDashboard";
import AccountLogin     from "./pages/account/AccountLogin";
import AccountRegister  from "./pages/account/AccountRegister";

/* ================= ADMIN ================= */
import AdminDashboard from "./pages/admin/AdminDashboard";

/* ================= CARRITO ================= */
import Checkout    from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

import { useAuth } from "./context/AuthContext";

// altura header ≈ 88px, subnav fortnite ≈ 45px
const HEADER_H   = "88px";
const SUBNAV_H   = "45px";
const TOTAL_FN_H = `calc(${HEADER_H} + ${SUBNAV_H})`;

const AppLayout = ({ onCartClick }: { onCartClick: () => void }) => {
  const { isAdmin } = useAuth();
  const location    = useLocation();

  const isFortnite = !isAdmin && location.pathname.startsWith("/fortnite");

  return (
    <>
      {!isAdmin && <Header onCartClick={onCartClick} />}

      {/* SubNav Fortnite — fixed justo debajo del header */}
      {isFortnite && (
        <div
          className="fixed left-0 w-full z-40"
          style={{ top: HEADER_H }}
        >
          <FortniteSubNav />
        </div>
      )}

      <main
        className={isAdmin ? "" : "min-h-screen bg-transparent"}
        style={
          isAdmin
            ? {}
            : { paddingTop: isFortnite ? TOTAL_FN_H : HEADER_H }
        }
      >
        <Routes>
          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* LEGALES */}
          <Route path="/terminos-y-condiciones" element={<Terms />} />

          {/* ── CUENTA ── */}
          <Route path="/mi-cuenta"          element={<AccountDashboard />} />
          <Route path="/mi-cuenta/login"    element={<AccountLogin />} />
          <Route path="/mi-cuenta/register" element={<AccountRegister />} />

          {/* ── ADMIN ── */}
          <Route path="/kidstore-admin" element={<AdminDashboard />} />

          {/* ── FORTNITE ── */}
          <Route path="/fortnite"                 element={<Fortnite />} />
          <Route path="/fortnite/agregar-bots"    element={<FortniteAgregarBots />} />
          <Route path="/fortnite/recarga-pavos"   element={<FortniteRecargaPavos />} />
          <Route path="/fortnite/paquetes"        element={<FortnitePaquetes />} />
          <Route path="/fortnite/pase-de-batalla" element={<FortnitePaseBatalla />} />

          {/* ── CATEGORÍAS ── */}
          {/* ── <Route path="/wild-rift"         element={<WildRift />} />
          <Route path="/roblox"            element={<Roblox />} />
          <Route path="/marvel-rivals"     element={<Marvel />} />
          <Route path="/pokemon-go"        element={<Pokemon />} />
          <Route path="/genshin-impact"    element={<Genshin />} />
          <Route path="/zenless-zone-zero" element={<Zzz />} />
          <Route path="/wuthering-waves"   element={<Wuwa />} />
          <Route path="/honkai-star-rail"  element={<Honkai />} />
          <Route path="/honor-of-kings"    element={<Honor />} />
          <Route path="/discord"           element={<Discord />} />  ── */}

          <Route path="/pokemon-go"        element={<Pokemon />} />
          
          {/* ── CHECKOUT ── */}
          <Route path="/checkout"         element={<Checkout />} />
          <Route path="/orden-confirmada" element={<OrderSuccess />} />

          {/* 404 */}
          <Route path="*" element={
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-white">
              <h1 className="text-6xl font-black mb-4" style={{ fontFamily: "BurbankBig" }}>404</h1>
              <p className="text-gray-400 text-lg">Página no encontrada</p>
            </div>
          } />
        </Routes>
      </main>

      {!isAdmin && <Footer />}
    </>
  );
};

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <AppLayout onCartClick={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default App;
