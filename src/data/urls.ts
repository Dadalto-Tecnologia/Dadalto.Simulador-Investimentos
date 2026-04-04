const URL_SELIC = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados?formato=json&dataInicial=01/11/2023&dataFinal=31/10/2024';
const URL_CDI = `http://ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='BM12_TJCDI12')`;
const URL_IPCA = `http://ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='PRECOS12_IPCAG12')`;
const URL_POUPANCA = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.25/dados/ultimos/1?formato=json';

export { URL_SELIC, URL_CDI, URL_IPCA, URL_POUPANCA };