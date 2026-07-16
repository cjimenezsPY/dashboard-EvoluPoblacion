import * as XLSX from "xlsx";

export function transformarDatos(hoja) {

    const matriz = XLSX.utils.sheet_to_json(hoja, {
        header: 1,
        defval: ""
    });

    const filaPeriodos = matriz[0];

    // ==========================
    // Descubrir los períodos
    // ==========================

    const periodos = [];

    for (let c = 2; c < filaPeriodos.length; c += 3) {

        const texto = filaPeriodos[c];

        if (!texto) continue;

        periodos.push({
            nombreOriginal: texto,
            periodo: convertirPeriodo(texto),
            colPoblacion: c,
            colTitular: c + 1,
            colDerecho: c + 2
        });

    }

    console.table(periodos);

    // ==========================
    // Construir resultado
    // ==========================

    const resultado = [];

    for (let f = 2; f < matriz.length; f++) {

        const fila = matriz[f];

        if (!fila[1]) continue;

        const registro = {
            code: String(fila[0]),
            name: fila[1],
            group: "",
            data: {}
        };

        for (const p of periodos) {

            registro.data[p.periodo] = {
                poblacion: Number(fila[p.colPoblacion]) || 0,
                titular: Number(fila[p.colTitular]) || 0,
                derechohabiente: Number(fila[p.colDerecho]) || 0
            };

        }

        resultado.push(registro);

    }

    console.table(
        resultado.map(r => ({
            codigo: r.code,
            nombre: r.name
        }))
    );

    return resultado;

}

function convertirPeriodo(texto) {

    texto = texto.toUpperCase();

    const meses = {
        ENERO: "01",
        FEBRERO: "02",
        MARZO: "03",
        ABRIL: "04",
        MAYO: "05",
        JUNIO: "06",
        JULIO: "07",
        AGOSTO: "08",
        SETIEMBRE: "09",
        SEPTIEMBRE: "09",
        OCTUBRE: "10",
        NOVIEMBRE: "11",
        DICIEMBRE: "12"
    };

    texto = texto.replace(".", "");

    const partes = texto.split(" ");

    const mes = meses[partes[0]];
    const anio = partes[1];

    return `${anio}-${mes}`;

}