import moment from "moment";

export class Formatar {

  moeda = (valor: number | undefined): string => {
    if (valor == undefined) return "R$ 0,00";

    return valor.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  };

  numero = (valor: number | string | undefined, decimais?: number): string => {
    if (valor == undefined) return "0";

    return valor.toLocaleString("pt-BR", {
      minimumFractionDigits: decimais,
      maximumFractionDigits: decimais,
    });
  };

  porcentagem = (valor: number | undefined): string => {
    if (valor == undefined) return "0%";
    return valor + "%";
  };

  data = (valor: Date | undefined, formato?: string): string => {
    if (valor == undefined) return "";

    return moment(valor)
      .locale("pt-br")
      .format(formato ?? "DD/MM/YYYY");
  };

  // Retorna a data com o horario
  dataCompleta = (valor: Date | undefined): string => {
    if (valor == undefined) return "";

    var auxData = `${moment(valor).locale("pt-br").format("DD/MM/YYYY")} às ${moment(valor).locale("pt-br").format("HH:mm:ss")}`;

    return auxData;
  };

  boolean = (valor: boolean | undefined): string => {
    if (valor === undefined || valor === false) return "Não";
    return "Sim";
  };
}

const Instance = new Formatar();

export default Instance;
