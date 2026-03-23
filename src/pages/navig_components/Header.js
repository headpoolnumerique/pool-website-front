import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

export default function Header({ toggleVisibility, logo }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/").then(() => {
      window.location.reload(); // Force full page reload
    });
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="header-container">
      <header className="header">
        <div className="logo-wrapper" onClick={handleLogoClick}>
        <Image
          src={logo || "/logo_pool.jpeg"}
          alt="Logo"
          width={100}
          height={100}
          style={{ cursor: "pointer" }}
        />
        </div>

        {/* Hamburger button for mobile */}
        <button className="hamburger" onClick={toggleMenu}>
          <span className={menuOpen ? "bar open" : "bar"}></span>
          <span className={menuOpen ? "bar open" : "bar"}></span>
          <span className={menuOpen ? "bar open" : "bar"}></span>
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <div>
            <Link href="/cours" className="nav-link" onClick={() => setMenuOpen(false)}>
              Cours
            </Link>
          </div>
          <div>
            <Link href="/cours-passeport" className="nav-link" onClick={() => setMenuOpen(false)}>
              Cours Passeport
            </Link>
          </div>
          <div>
            <Link href="/events" className="nav-link" onClick={() => setMenuOpen(false)}>
              Events
            </Link>
          </div>
          <div>
            <Link href="/repositories" className="nav-link" onClick={() => setMenuOpen(false)}>
              Repositories
            </Link>
          </div>
          <div>
            <Link href="/bookings" className="nav-link" onClick={() => setMenuOpen(false)}>
              Bookings
            </Link>
          </div>
        </nav>
      </header>
    </div>
  );
}
