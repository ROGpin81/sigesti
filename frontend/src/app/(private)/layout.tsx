export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: "220px",
          background: "#1f2937",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>SIGESTI</h2>

        <nav style={{ marginTop: "20px" }}>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/tickets">Tickets</a></li>
            <li><a href="/usuarios">Usuarios</a></li>
            <li><a href="/perfil">Perfil</a></li>
            <li><a href="/estadisticas">Estadísticas</a></li>
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "30px" }}>
        {children}
      </main>
    </div>
  );
}