function Header({ ultimoPeriodo, cantidadPeriodos }) {
  return (
    <header
      style={{
        background: "#ffffff",
        borderRadius: "14px",
        padding: "24px 32px",
        marginBottom: "24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h1
        style={{
          margin: 0,
          color: "#1e3a8a",
          fontSize: "32px",
          fontWeight: "700",
        }}
      >
        Observatorio de Población Asegurada
      </h1>

      <p
        style={{
          marginTop: "8px",
          marginBottom: "22px",
          color: "#555",
          fontSize: "18px",
        }}
      >
        Evolución de la población asegurada según tipo de seguro
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          fontSize: "14px",
          color: "#666",
        }}
      >
        <span>
          <strong>Actualizado:</strong> {ultimoPeriodo}
        </span>

        <span>
          <strong>Períodos disponibles:</strong> {cantidadPeriodos}
        </span>
      </div>
    </header>
  );
}

export default Header;