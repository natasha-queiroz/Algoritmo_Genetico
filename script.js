const cores = [
    'rgb(255, 0, 0)',   // Vermelho
    'rgb(0, 128, 0)',   // Verde
    'rgb(0, 0, 255)',   // Azul
    'rgb(255, 165, 0)', // Laranja
    'rgb(128, 0, 128)', // Roxo
    'rgb(255, 192, 203)',// Rosa
    'rgb(0, 195, 255)',
    'rgb(0, 0, 0)',
    'rgb(128, 128, 128)',
    'rgb(165, 42, 42)'
];

let populacao = [];
let filhosCrossover = [];  // Array para armazenar as 4 cores geradas pelo crossover

function gerarPopulacao() {
    const container = document.getElementById('besouros');
    container.innerHTML = '';
    populacao = [];

    for (let i = 0; i < 10; i++) {
        let besouro = document.createElement('div');
        besouro.classList.add('besouro');
        besouro.style.backgroundColor = cores[i];
        container.appendChild(besouro);
        populacao.push(cores[i]);
    }
    desenharRoleta();
}

function desenharRoleta() {
    const canvas = document.getElementById('roleta');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const setores = cores.length;
    const angulo = (2 * Math.PI) / setores;

    for (let i = 0; i < setores; i++) {
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.arc(100, 100, 100, i * angulo, (i + 1) * angulo);
        ctx.closePath();
        ctx.fillStyle = cores[i];
        ctx.fill();
    }
}


function girarRoleta() {
    const selectionDiv = document.getElementById('selection');
    selectionDiv.innerHTML = ''; // Limpa antes de adicionar novos besouros
    populacao = []; // Limpa a população antes de gerar novos besouros

    for (let i = 0; i < 6; i++) { // Executa exatamente 6 vezes
        const setorSelecionado = Math.floor(Math.random() * cores.length);
        const corSelecionada = cores[setorSelecionado];

        let besouroSelecionado = document.createElement('div');
        besouroSelecionado.classList.add('besouro');
        besouroSelecionado.style.backgroundColor = corSelecionada;
        selectionDiv.appendChild(besouroSelecionado);

        populacao.push(corSelecionada); // Armazena os besouros gerados na população
    }
}

// cria nova geração
function generateNewGeneration() {
    if (populacao.length < 2) {
        alert("Selecione pelo menos 2 besouros antes de gerar a nova geração!");
        return;
    }

    // Selecionando dois pais a partir da população gerada pela roleta
    const pais = [selecionarPorRoleta(), selecionarPorRoleta()];

    // Gerando os 4 filhos com os diferentes tipos de crossover
    const filhoCrossover1 = crossoverColor(pais[0], pais[1]);
    const filhoCrossover2 = crossoverUniforme(pais[0], pais[1]);
    const filhoCrossover3 = crossoverAritmetico(pais[0], pais[1]);
    const filhoCrossover4 = crossoverAritmetico(pais[0], pais[1]);

    // Armazenando as cores dos filhos gerados
    filhosCrossover = [filhoCrossover1, filhoCrossover2, filhoCrossover3, filhoCrossover4];

    // Aplicando mutação (10% de chance de mudar a cor)
    if (Math.random() < 0.1) {
        filhosCrossover.push(cores[Math.floor(Math.random() * cores.length)]);
    }

    // Atualizando a exibição dos filhos gerados
    document.getElementById('p1_point1').style.backgroundColor = pais[0];
    document.getElementById('p2_point1').style.backgroundColor = pais[1];
    document.getElementById('F_point1').style.backgroundColor = filhoCrossover1;

    document.getElementById('p1_point2').style.backgroundColor = pais[0];
    document.getElementById('p2_point2').style.backgroundColor = pais[1];
    document.getElementById('F_point2').style.backgroundColor = filhoCrossover2;

    
    // Aplicando crossover uniforme
    let filhoUniforme = crossoverUniforme(pais[0], pais[1]);
    document.getElementById('p1_uniforme').style.backgroundColor = pais[0];
    document.getElementById('p2_uniforme').style.backgroundColor = pais[1];
    document.getElementById('F_uniforme').style.backgroundColor = filhoCrossover3;

    // Aplicando crossover aritmético
    let filhoAritmetico = crossoverAritmetico(pais[0], pais[1]);
    document.getElementById('p1_aritmetico').style.backgroundColor = pais[0];
    document.getElementById('p2_aritmetico').style.backgroundColor = pais[1];
    document.getElementById('F_aritmetico').style.backgroundColor = filhoCrossover4;

    console.log("Pais selecionados:", pais[0], pais[1]);
    console.log("Filhos gerados:", filhosCrossover);

    // Atualizando a exibição das cores dos filhos
    document.getElementById('novaGeracao1').style.backgroundColor = filhoCrossover1;
    document.getElementById('novaGeracao2').style.backgroundColor = filhoCrossover2;
    document.getElementById('novaGeracao3').style.backgroundColor = filhoCrossover3;
    document.getElementById('novaGeracao4').style.backgroundColor = filhoCrossover4;

    document.getElementById('original1').style.backgroundColor = filhoCrossover1;
    document.getElementById('original2').style.backgroundColor = filhoCrossover2;
    document.getElementById('original3').style.backgroundColor = filhoCrossover3;
    
}

function selecionarPorRoleta() {
    return populacao[Math.floor(Math.random() * populacao.length)];
}

// Converte 'rgb(r, g, b)' para um array de valores [r, g, b]
function rgbToArray(rgb) {
    return rgb.match(/\d+/g).map(Number);
}

// Converte um array [r, g, b] para string 'rgb(r, g, b)'
function arrayToRgb(arr) {
    return `rgb(${arr[0]}, ${arr[1]}, ${arr[2]})`;
}

// Faz a média entre duas cores RGB
function crossoverColor(color1, color2) {
    let rgb1 = rgbToArray(color1);
    let rgb2 = rgbToArray(color2);

    let newR = Math.floor((rgb1[0] + rgb2[0]) / 2);
    let newG = Math.floor((rgb1[1] + rgb2[1]) / 2);
    let newB = Math.floor((rgb1[2] + rgb2[2]) / 2);

    return arrayToRgb([newR, newG, newB]);
}


// Realiza o Crossover uniforme para cores RGB
function crossoverUniforme(color1, color2) {
    let rgb1 = rgbToArray(color1);
    let rgb2 = rgbToArray(color2);

    const filho = rgb1.map((comp, i) => Math.random() < 0.5 ? comp : rgb2[i]);
    
    return arrayToRgb(filho);
}

// Realiza o Crossover Aritmético
function crossoverAritmetico(color1, color2, alpha = 0.5) {
    let rgb1A = rgbToArray(color1);
    let rgb2A = rgbToArray(color2);
    
    let filhoAritmetico = [
        Math.round(alpha * rgb1A[0] + (1 - alpha) * rgb2A[0]), // R
        Math.round(alpha * rgb1A[1] + (1 - alpha) * rgb2A[1]), // G
        Math.round(alpha * rgb1A[2] + (1 - alpha) * rgb2A[2])  // B
    ];

    return arrayToRgb(filhoAritmetico);
}


// Aplica mutação aleatória em um único canal de cor, usando as cores dos filhos
function mutacaoAleatoria() {
    let filhoSelecionado = filhosCrossover[Math.floor(Math.random() * filhosCrossover.length)];
    let chave = ["R", "G", "B"][Math.floor(Math.random() * 4)];
    let novoBesouro = rgbToArray(filhoSelecionado);
    novoBesouro[chave] = Math.floor(Math.random() * 255);

    atualizarCor(document.getElementById("resultadoAleatorio"), arrayToRgb(novoBesouro));
}

// Aplica uma pequena variação em um canal de cor, usando as cores dos filhos
function mutacaoPequena() {
    let filhoSelecionado = filhosCrossover[Math.floor(Math.random() * filhosCrossover.length)];
    let chave = ["R", "G", "B"][Math.floor(Math.random() * 50)];
    let variacao = Math.floor(Math.random() * 4) + 10; // Pequena variação de -10 a +10
    let novoBesouro = rgbToArray(filhoSelecionado);
    novoBesouro[chave] = Math.max(0, Math.min(255, novoBesouro[chave] + variacao));

    atualizarCor(document.getElementById("resultadoPequena"), arrayToRgb(novoBesouro));
}

// Aplica uma mutação reduzindo gradualmente os valores de RGB, usando as cores dos filhos
function mutacaoDirigida() {
    let filhoSelecionado = filhosCrossover[Math.floor(Math.random() * filhosCrossover.length)];
    let novoBesouro = rgbToArray(filhoSelecionado);
    novoBesouro[0] = Math.max(0, novoBesouro[0] - Math.floor(Math.random() * 20));
    novoBesouro[1] = Math.max(0, novoBesouro[1] - Math.floor(Math.random() * 20));
    novoBesouro[2] = Math.max(0, novoBesouro[2] - Math.floor(Math.random() * 20));

    atualizarCor(document.getElementById("resultadoDirigida"), arrayToRgb(novoBesouro));
}

// Atualiza a exibição das cores do besouro
function atualizarCor(elemento, cor) {
    elemento.style.backgroundColor = cor;
}

// Atualiza a exibição inicial
// let besouro = { R: 255, G: 0, B: 0 };  // Exemplo básico de besouro
atualizarCor(document.getElementById("resultadoOriginal"), arrayToRgb([besouro.R, besouro.G, besouro.B]));



function atualizarExibicao() {
    const container = document.getElementById('besouros');
    container.innerHTML = '';

    for (let i = 0; i < populacao.length; i++) {
        let besouro = document.createElement('div');
        besouro.classList.add('besouro');
        besouro.style.backgroundColor = populacao[i];
        container.appendChild(besouro);
    }
}