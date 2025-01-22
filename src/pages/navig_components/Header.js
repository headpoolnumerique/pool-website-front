import Link from "next/link";

export default function Header() {
  return (
    <div>
      {/* Header with Navigation */}
      <header style={{ padding: "1rem", backgroundColor: "#f0f0f0", textAlign: "center" }}>
        <nav>
        <Link href="/cours" style={{ margin: "0 1rem" }}>
            Cours
          </Link>
          <Link href="/cours-passeport" style={{ margin: "0 1rem" }}>
            Cours Passeport
          </Link>
          <Link href="/presentation" style={{ margin: "0 1rem" }}>
            Presentation
          </Link>
          <Link href="/repositories" style={{ margin: "0 1rem" }}>
            Repositories
          </Link>
          <Link href="/bookings" style={{ margin: "0 1rem" }}>
            Bookings
          </Link>
        </nav>
      </header>
    </div>
  );
}