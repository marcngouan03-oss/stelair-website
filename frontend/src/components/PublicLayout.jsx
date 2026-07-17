import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CookieConsent from "./CookieConsent";
import CartDrawer from "./CartDrawer";

export default function PublicLayout() {
  return (
    <>
      <div className="grain-overlay" />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
      <CartDrawer />
    </>
  );
}
