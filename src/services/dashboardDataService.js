import { cargarExcel } from "./excelService";
import { transformarDatos } from "./transformarDatos";

export async function obtenerDashboard() {

    const hoja = await cargarExcel();

    const datos = transformarDatos(hoja);

    return datos;

}