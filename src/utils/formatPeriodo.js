const meses = {
    "01": "Enero",
    "02": "Febrero",
    "03": "Marzo",
    "04": "Abril",
    "05": "Mayo",
    "06": "Junio",
    "07": "Julio",
    "08": "Agosto",
    "09": "Setiembre",
    "10": "Octubre",
    "11": "Noviembre",
    "12": "Diciembre"
};

export function formatPeriodo(periodo) {

    if (!periodo) return "";

    const [anio, mes] = periodo.split("-");

    return `${meses[mes]} ${anio}`;

}