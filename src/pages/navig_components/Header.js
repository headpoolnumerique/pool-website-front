import Link from "next/link";
import { useRouter } from "next/router";

export default function Header({ toggleVisibility }) {

  const router = useRouter();
  console.log(router.pathname, "--");

  let dynamicStyling = () => {
    if(router.pathname === "/"){
      return {}
    }else{
      return {
        borderBottom: "1px solid black"
      }
    }
  }
  

  return (
    <div className="header-container">
      {/* Header with Navigation */}
      <header 
      style={dynamicStyling()}
      className="header">
        <div className="button-container">
          <button onClick={toggleVisibility} className="toggle-button">
            TOGGLE VISUALS
          </button>
        </div>
        <nav>
          <div>
            <img src="./public/logo_pool.jpeg" />
          </div>
          <Link href="/cours" className="nav-link">
            Cours
          </Link>
          <Link href="/cours-passeport" className="nav-link">
            Cours Passeport
          </Link>
          <Link href="/presentation" className="nav-link">
            Presentation
          </Link>
          <Link href="/repositories" className="nav-link">
            Repositories
          </Link>
          <Link href="/bookings" className="nav-link">
            Bookings
          </Link>
        </nav>
      </header>
    </div>
  );
}
