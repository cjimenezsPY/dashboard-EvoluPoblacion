import * as XLSX from "xlsx";

export async function cargarExcel() {

    const respuesta = await fetch("/DatosPoblacionDashboard.xlsx");

    const buffer = await respuesta.arrayBuffer();

    const workbook = XLSX.read(buffer, {
        type: "array"
    });

    const hoja = workbook.Sheets[workbook.SheetNames[0]];

    return hoja;
}