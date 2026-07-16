import { useEffect, useState } from "react";
import EvolucionAsegurados from "./EvolucionAsegurados";
import { cargarExcel } from "./services/excelService";
import { transformarDatos } from "./services/transformarDatos";

function App() {

  const [rawSeries, setRawSeries] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    async function iniciar() {

      try {

        setCargando(true);

        const hoja = await cargarExcel();

        const datos = transformarDatos(hoja);

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

  return (

    <EvolucionAsegurados
      rawSeries={rawSeries}
    />

  );

}

export default App;