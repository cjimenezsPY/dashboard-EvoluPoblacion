import { useEffect, useState } from "react";
import Header from "./components/Header";
import EvolucionAsegurados from "./EvolucionAsegurados";
import { obtenerDashboard } from "./services/dashboardDataService";

function App() {

  const [rawSeries, setRawSeries] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    async function iniciar() {

      try {

        setCargando(true);

        const datos = await obtenerDashboard();

        console.table(
          datos.map(d => ({
            codigo: d.code,
            nombre: d.name
          }))
        );

        setRawSeries(datos);

      } catch (err) {

        console.error(err);

        setError("No fue posible leer el archivo Excel.");

      } finally {

        setCargando(false);

      }

    }

    iniciar();

  }, []);

  if (cargando) {

    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 22,
          fontWeight: "bold"
        }}
      >
        Cargando Dashboard...
      </div>
    );

  }

  if (error) {

    return (
      <div
        style={{
          color: "red",
          padding: 40,
          fontSize: 18
        }}
      >
        {error}
      </div>
    );

  }

  const ultimoPeriodo =
    rawSeries.length > 0
      ? Object.keys(rawSeries[0].data)[0]
      : "";

  const totalSeries = rawSeries.length;

  return (

  <div
    style={{
      maxWidth: 1600,
      margin: "0 auto",
      padding: 24
    }}
  >

    <Header
      ultimoPeriodo={ultimoPeriodo}
      totalSeries={totalSeries}
    />

    <EvolucionAsegurados
      rawSeries={rawSeries}
    />

  </div>

);

}

export default App;