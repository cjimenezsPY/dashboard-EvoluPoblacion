export function formatNumero(valor) {

    if (valor === null || valor === undefined)
        return "-";

    return new Intl.NumberFormat("es-PE").format(valor);

}