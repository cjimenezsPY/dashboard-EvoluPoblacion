import { COLORS } from "../styles/colors";

function Sidebar() {

  return (

    <aside
      style={{
        width: 320,
        background: "#ffffff",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}
    >

      <h3
        style={{
          marginTop: 0,
          marginBottom: 20,
          color: "#1e3a8a",
          fontSize: 20
        }}
      >
        Tipo de Seguro
      </h3>

      <div>

        <Grupo
          color={COLORS.regulares}
          titulo="ASEGURADOS REGULARES"
          items={[
            "Trabajador Activo",
            "Pensionista",
            "Trabajador del Hogar",
            "Pescador Artesanal",
            "CAS"
          ]}
        />

        <Grupo
          color={COLORS.agrarios}
          titulo="ASEGURADOS REGULARES - AGRARIOS"
          items={[
            "Agrario Dependiente",
            "Agrario Independiente",
            "Actividad Acuícola"
          ]}
        />

        <Grupo
          color={COLORS.potestativos}
          titulo="SEGUROS POTESTATIVOS"
          items={[
            "Protección Total",
            "EsSalud Independiente",
            "+ Salud"
          ]}
        />

        <Grupo
          color={COLORS.otras}
          titulo="OTRAS COBERTURAS"
          items={[
            "Solicitante de Pensión",
            "Beneficiario Ley 30478"
          ]}
        />

        <Grupo
          color={COLORS.total}
          titulo="TOTAL"
          items={[]}
        />

      </div>

    </aside>

  );

}

function Grupo({ color, titulo, items }) {

  return (

    <div style={{ marginBottom: 24 }}>

      <div
        style={{
          color,
          fontWeight: "bold",
          marginBottom: 10
        }}
      >
        ● {titulo}
      </div>

      {items.map(item => (

        <div
          key={item}
          style={{
            marginLeft: 18,
            marginBottom: 6,
            color: "#555",
            fontSize: 14
          }}
        >
          • {item}
        </div>

      ))}

    </div>

  );

}

export default Sidebar;