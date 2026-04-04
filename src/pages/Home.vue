<script setup lang="ts">
import InputNumber from 'primevue/inputnumber';
import Line from '@/components/Line.vue';
import { computed, onMounted, ref, watch } from "vue";
import Highcharts from 'highcharts';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { Divider } from 'primevue';
import { CDIClient, IPCAClient, PoupancaClient, SelicClient } from '@/classes/API';
import { CDI } from '@/classes/CDI';
import { Selic } from '@/classes/Selic';
import { IPCA } from '@/classes/IPCA';
import Skeleton from 'primevue/skeleton';
import { Poupanca } from '@/classes/Poupanca';


// Diretiva
const vAutofocus = {
    mounted: (el: any): void => {
        el.children[0].focus()
    }
};

/**
 * Representa uma opção de investimento comparada na calculadora.
 */
type InvestmentOption = {
    nome: string;
    rent: number;
    receber: number;
    imposto: boolean;
};

const inicial = ref<number>(1000);
const aporte = ref<number>(100);
const meses = ref<number>(12);
const freqJuros = ref<string>('M');

const versao = ref<{ major: number, minor: number, revision: number }>(
    { major: 1, minor: 0, revision: 0 }
);

const autor = {
    nome: 'Franchescolle Dadalto',
    email: 'ffdadalto@gmail.com'
};

const rentCDB = ref<number>(13);
const rentLCI_LCA = ref<number>(12.00);
const rentaPoup = ref<number>(0.7);

const auxRentCDB = ref<number>(rentCDB.value);
const auxRentLCI_LCA = ref<number>(rentLCI_LCA.value);
const auxRentaPoup = ref<number>(rentaPoup.value);

// Carrega índices e monta o gráfico quando o componente estiver pronto
onMounted(() => {
    renderChart();
    carregaSelic();
    carregaCDI();
    carregaIPCA();
    carregaPoupanca();
});

const clientSelic = new SelicClient();
const dadosSelic = ref<Selic[]>([]);
const loadingSelic = ref<boolean>(true);
const carregaSelic = async () => {
    loadingSelic.value = true;
    try {
        dadosSelic.value = await clientSelic.getAll();
    } catch (error) {
        console.error('Erro ao carregar SELIC', error);
        dadosSelic.value = [];
    } finally {
        loadingSelic.value = false;
    }
};
const valorSelic = computed((): string | undefined => {
    if (!dadosSelic.value) return undefined;
    return dadosSelic.value.map(x => x.valor).sum()!.toFixed(2);
});

const clientCDI = new CDIClient();
const dadosCDI = ref<CDI[]>([]);
const loadingCDI = ref<boolean>(true);
const carregaCDI = async () => {
    loadingCDI.value = true;
    try {
        dadosCDI.value = await clientCDI.getAll();
    } catch (error) {
        console.error('Erro ao carregar CDI', error);
        dadosCDI.value = [];
    } finally {
        loadingCDI.value = false;
    }
};
const valorCDI = computed((): string | undefined => {
    if (!dadosCDI.value) return undefined;
    return dadosCDI.value.slice(-13, -1).map(x => x.VALVALOR).sum()!.toFixed(2);
});

const clientIPCA = new IPCAClient();
const dadosIPCA = ref<IPCA[]>([]);
const loadingIPCA = ref<boolean>(true);
const carregaIPCA = async () => {
    loadingIPCA.value = true;
    try {
        dadosIPCA.value = await clientIPCA.getAll();
    } catch (error) {
        console.error('Erro ao carregar IPCA', error);
        dadosIPCA.value = [];
    } finally {
        loadingIPCA.value = false;
    }
};
const valorIPCA = computed((): string | undefined => {
    if (!dadosIPCA.value) return undefined;
    return dadosIPCA.value.slice(-13, -1).map(x => x.VALVALOR).sum()!.toFixed(2);
});

const clientPoupanca = new PoupancaClient();
const dadosPoupanca = ref<Poupanca[]>([]);
const loadingPoupanca = ref<boolean>(true);
const carregaPoupanca = async () => {
    loadingPoupanca.value = true;
    try {
        dadosPoupanca.value = await clientPoupanca.getAll();
    } catch (error) {
        console.error('Erro ao carregar Poupança', error);
        dadosPoupanca.value = [];
    } finally {
        loadingPoupanca.value = false;
    }
};
const valorPoupanca = computed((): string | undefined => {
    if (!dadosPoupanca.value) return undefined;
    return dadosPoupanca.value.map(x => x.valor).sum()!.toFixed(2);
});


// Referência para o elemento DOM onde o gráfico será renderizado
const chartContainer = ref<HTMLElement | null>(null);
let chartInstance: Highcharts.Chart | null = null; // Referência para a instância do gráfico

const investimentos = ref<InvestmentOption[]>([
    { nome: 'LCI e LCA', rent: rentLCI_LCA.value, receber: inicial.value, imposto: false },
    { nome: 'CDB', rent: rentCDB.value, receber: inicial.value, imposto: true },
    { nome: 'Poupança', rent: rentaPoup.value, receber: inicial.value, imposto: false },
]);

/**
 * Mantém a lista de investimentos sempre ordenada pelo valor a receber
 * para evitar duplicação de lógica no gráfico.
 */
const sortedInvestments = computed<InvestmentOption[]>(() =>
    [...investimentos.value].orderByDescending((i) => i.receber)
);

const investmentCategories = computed(() => sortedInvestments.value.map((i) => i.nome));
const investmentValues = computed(() => sortedInvestments.value.map((i) => i.receber));

// Opções do gráfico de barras na horizontal
const getChartOptions = (): Highcharts.Options => ({
    chart: {
        type: 'bar', // Tipo de gráfico de barras na horizontal
        backgroundColor: '' // Deixa o fundo do gráfico transparente
    },
    title: {
        text: ''
    },
    legend: {
        enabled: false // Desabilita a legenda, removendo a opção de desmarcar a série
    },
    tooltip: {
        enabled: false // Desabilita o tooltip
    },
    xAxis: {
        categories: investmentCategories.value, // Categorias do eixo X
        title: {
            text: ''
        },
        labels: {
            enabled: true, // Habilita os rótulos do eixo X
            style: {
                color: '#333', // Cor da fonte
                fontSize: '12px', // Tamanho da fonte
                fontFamily: 'Arial', // Tipo de fonte
            }
        },
        gridLineWidth: 0, // Remove as linhas de grade no eixo X
        lineWidth: 0 // Remove a linha do eixo X
    },
    yAxis: {
        title: {
            text: '' // Desabilita o título do eixo Y
        },
        labels: {
            enabled: false // Desabilita os rótulos do eixo X
        },
        gridLineWidth: 0, // Remove as linhas de grade no eixo Y
        lineWidth: 0, // Remove a linha do eixo Y
        minorGridLineWidth: 0, // Remove as linhas de grade menores
        tickWidth: 0, // Remove as linhas de marcação dos ticks
    },
    plotOptions: {
        series: {
            borderWidth: 0, // Remove as bordas das barras

            dataLabels: {
                enabled: true, // Habilita os rótulos
                formatter: function () {
                    // Formata o valor da série como moeda BRL
                    return new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(this.y as number);
                },
                style: {
                    color: 'white', // Cor do texto dos rótulos
                    fontSize: '14px', // Tamanho da fonte dos rótulos
                    textOutline: 'none' // Remove o contorno (bordas) do texto
                },
                align: 'right', // Alinha os rótulos ao centro horizontalmente
                inside: true, // Garante que os rótulos fiquem dentro das barras
            }
        }
    },
    credits: {
        enabled: false // Remove a marca d'água (logotipo) do Highcharts
    },
    series: [
        {
            name: '',
            type: 'bar',
            data: investmentValues.value, // Dados da série
            showInLegend: false // Garante que a série não será exibida na legenda
        }
    ]
});

const renderChart = () => {
    // Recalcula os rendimentos antes de atualizar o gráfico
    calcularRendimentos();
    if (!chartContainer.value) {
        return;
    }

    if (chartInstance) {
        // Atualiza os dados da série existente
        chartInstance.series[0].setData(investmentValues.value);
        chartInstance.xAxis[0].setCategories(investmentCategories.value);
    } else {
        // Cria o gráfico se ainda não foi criado
        chartInstance = Highcharts.chart(chartContainer.value as HTMLElement, getChartOptions());
    }
}

const calcularRendimentos = () => {
    // Reinicializa os valores dos investimentos
    investimentos.value = [
        { nome: 'LCI e LCA', rent: rentLCI_LCA.value, receber: inicial.value, imposto: false },
        { nome: 'CDB', rent: rentCDB.value, receber: inicial.value, imposto: true },
        { nome: 'Poupança', rent: rentaPoup.value, receber: inicial.value, imposto: false },
    ];

    for (let i = 0; i < investimentos.value.length; i++) {
        for (let j = 0; j < meses.value; j++) {
            const investimento = investimentos.value[i];

            if (j !== 0) {
                investimento.receber += aporte.value;
            }

            const valorJuros = investimento.receber * (investimento.rent / 12 / 100);
            investimento.receber += valorJuros;
        }
    }
};

const dialog = ref<boolean>(false);
const openConfig = () => {
    dialog.value = true;
};

const save = () => {
    rentCDB.value = auxRentCDB.value;
    rentLCI_LCA.value = auxRentLCI_LCA.value;
    rentaPoup.value = auxRentaPoup.value;
    dialog.value = false;
    renderChart();
};

const valoresInvestidos = computed((): number => {
    return inicial.value + (aporte.value * meses.value);
});

// Recalcula o gráfico sempre que os parâmetros principais forem alterados
watch([inicial, aporte, meses], () => renderChart());
watch([rentCDB, rentLCI_LCA, rentaPoup], () => renderChart());

const goSimulacao = () => {
    const simulacao = document.getElementById('simulacao-investimento');
    if (simulacao) {
        simulacao.scrollIntoView({ behavior: 'smooth' });
    }
};

</script>

<template>
    <div id="main" class="mt-3">
        <div class="row">
            <div class="col-12 col-md-12 col-lg-6">
                <h1 class="teste">Que aplicação rende mais?</h1>
                <!-- <p class="sub-title">Veja quanto seu dinheiro pode render ao simular investimentos em Tesouro Direto,
                    CDBs,
                    LCIs
                    e LCAs, fundos
                    DI
                    e compare com o retorno da poupança e a variação da inflação.</p> -->
                <p class="sub-title">Explore como seu dinheiro pode crescer simulando investimentos em Tesouro Direto,
                    CDBs, LCIs, LCAs e fundos DI. Compare os resultados com o rendimento da poupança e a oscilação da
                    inflação.</p>
                <div class="quadro-investimento mt-4">
                    <div class="row gx-5 gy-4">
                        <div class="col-12 col-md-6 col-lg-6">
                            <label for="currency-us" class="font-bold block mb-2">Investimento Inicial</label>
                            <InputNumber v-model="inicial" size="large" mode="currency" currency="BRL"
                                locale="pt-BR" fluid :min="0.01" v-autofocus />
                        </div>
                        <div class="col-12 col-md-6 col-lg-6">
                            <label for="currency-us" class="font-bold block mb-2">Aportes mensais</label>
                            <InputNumber v-model="aporte" size="large" mode="currency" currency="BRL" locale="pt-BR"
                                fluid :min="0.01" />
                        </div>
                        <div class="col-12 col-md-4 col-lg-4">
                            <label for="currency-us" class="font-bold block mb-2">Período de aplicação</label>
                            <InputNumber v-model="meses" mode="decimal" showButtons :min="1" :max="100"
                                suffix=" meses" fluid size="large" />
                        </div>
                        <div class="col-12 col-md-4 col-lg-4">
                            <label for="currency-us" class="font-bold block mb-2">Pegamentos dos juros</label>
                            <div class="radio">
                                <div>
                                    <RadioButton disabled v-model="freqJuros" value="M" />
                                    <label class="ms-2">Mensal</label>
                                </div>
                                <div>
                                    <RadioButton disabled v-model="freqJuros" value="A" />
                                    <label class="ms-2">Anual</label>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-4 col-lg-4 d-flex justify-content-end align-items-start">
                            <Button pt:root:class="botao botao-config" @click="openConfig()"><i
                                    class="fa-sharp-duotone fa-solid fa-gears"></i></Button>
                        </div>
                    </div>
                </div>
                <Line></Line>
                <div id="quadro-indices">
                    <div class="row gy-4 gx-2">
                        <div class="col-12 col-md-6 col-lg-4">
                            <div class="quadro-input">
                                <h6>Selic (a.a.)</h6>
                                <Skeleton v-if="loadingSelic" height="2rem" width="7rem" class=""></Skeleton>
                                <h5 v-else>{{ $formatar.numero(valorSelic, 2) }} %</h5>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 col-lg-4">
                            <div class="quadro-input">
                                <h6>CDI (a.a.)</h6>
                                <Skeleton v-if="loadingCDI" height="2rem" width="7rem" class=""></Skeleton>
                                <h5 v-else>{{ $formatar.numero(valorCDI, 2) }} %</h5>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 col-lg-4">
                            <div class="quadro-input">
                                <h6>IPCA (a.a.)</h6>
                                <Skeleton v-if="loadingIPCA" height="2rem" width="7rem" class=""></Skeleton>
                                <h5 v-else>{{ $formatar.numero(valorIPCA, 2) }} %</h5>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 col-lg-4">
                            <div class="quadro-input">
                                <h6>Poupança (a.m.)</h6>
                                <Skeleton v-if="loadingPoupanca" height="2rem" width="7rem" class=""></Skeleton>
                                <h5 v-else>{{ $formatar.numero(valorPoupanca, 2) }} %</h5>
                            </div>
                        </div>
                        <!-- <div class="col-12 col-md-6 col-lg-4">
                            <div class="quadro-input">
                                <h6>Rentabilidade do CDB (a.a.)</h6>
                                <h5>{{ rentCDB.toFixed(2) }} %</h5>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 col-lg-4">
                            <div class="quadro-input">
                                <h6>Rentabilidade da LCI/LCA (a.a.)</h6>
                                <h5>{{ rentLCI_LCA.toFixed(2) }} %</h5>
                            </div>
                        </div> -->
                        <div class="col-12">
                            <p class="aviso mb-5">Esses são os parâmetros padrőes utilizados na sua simulação. Você
                                pode
                                alterá-los
                                e refazer os
                                cálculos para
                                uma simulação avançada.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-12 col-lg-6">
                <div class="quadro-grafico">
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="line"></div>
                    </div>
                    <h1>Calculadora de Renda Fixa</h1>
                    <p class="descricao-grafico">Descubra o potencial de rendimento do seu dinheiro ao simular
                        aplicações em Tesouro Direto, CDBs, LCIs, LCAs e fundos DI. Compare esses retornos com a
                        rentabilidade da poupança e a variação da inflação.</p>
                    <div ref="chartContainer" style="height: 200px;"></div> <!-- Div para renderizar o gráfico -->
                    <Button class="mt-4" pt:root:class="botao" @click="goSimulacao()"><i
                            class="fa-solid fa-calculator"></i>Ver
                        simulação</Button>
                </div>
            </div>
        </div>
        <div id="simulacao-investimento" class="simulacao">
            <h3>Simulação do investimento</h3>
            <Line></Line>
            <div class="cabecalho d-flex justify-content-between">
                <div>
                    <p class="m-0">Valor inicial investido:</p>
                    <h5 class="valores">{{ $formatar.moeda(inicial) }}</h5>
                </div>
                <Divider layout="vertical" />
                <div>
                    <p class="m-0">Aportes mensais:</p>
                    <h5 class="valores">{{ $formatar.moeda(aporte) }}</h5>
                </div>
                <Divider layout="vertical" />
                <div>
                    <p class="m-0">Período de aplicação:</p>
                    <h5 class="valores">{{ meses }} meses</h5>
                </div>
                <Divider layout="vertical" />
                <div>
                    <p class="m-0">Soma dos valores investidos:</p>
                    <h5 class="valores">{{ $formatar.moeda(valoresInvestidos) }}</h5>
                </div>
            </div>
        </div>
    </div>
    <div>
        <span style="font-style: italic;font-size: 10px;">{{ `Versão: ${versao.major}.${versao.minor}.${versao.revision} | ${autor.nome} (${autor.email})` }}</span>
    </div>

    <Dialog v-model:visible="dialog" modal header="Configurar índices" :style="{ width: '400px' }">
        <template #header>
            <div>
                <h4><i class="fa-sharp-duotone fa-solid fa-gears me-2"></i>Configurar índices</h4>
            </div>
        </template>
        <div class="row g-3 py-2 px-4">
            <div class="col-12">
                <label for="currency-us" class="font-bold block mb-2">CDB (a.a.)</label>
                <InputNumber v-model="auxRentCDB" size="large" fluid :minFractionDigits="2" :maxFractionDigits="2"
                    :min="0.01" :max="100" locale="pt-BR" />
            </div>
            <div class="col-12">
                <label for="currency-us" class="font-bold block mb-2">LC (a.a.)</label>
                <InputNumber v-model="auxRentLCI_LCA" size="large" fluid :minFractionDigits="2"
                    :maxFractionDigits="2" :min="0.01" :max="100" locale="pt-BR" />
            </div>
            <div class="col-12">
                <label for="currency-us" class="font-bold block mb-2">Poupança (a.a.)</label>
                <InputNumber v-model="auxRentaPoup" size="large" fluid :minFractionDigits="2"
                    :maxFractionDigits="2" :min="0.01" :max="100" locale="pt-BR" />
            </div>
        </div>
        <template #footer>
            <Button label="Cancel" text severity="danger" @click="dialog = false" autofocus />
            <Button label="Save" outlined severity="primary" @click="save()" autofocus />
        </template>
    </Dialog>
</template>

<style scoped>
.grafico {
    width: 100%;
    height: 30rem;
}

.botao {
    background-color: #472f92;
    border-color: #472f92;
}

.botao:hover {
    background-color: #6643d1 !important;
    border-color: #6643d1 !important;
}

.botao-config {
    margin-bottom: 10px;
    width: 40px;
    height: 40px;
}
</style>