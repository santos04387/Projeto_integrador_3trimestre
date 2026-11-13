
const matriz = document.getElementById("matriz");

const simbolos = {
    feliz: [
        "00111100",
        "01000010",
        "10100101",
        "10000001",
        "10100101",
        "10011001",
        "01000010",
        "00111100"
    ],
    alerta: [
        "00011000",
        "00011000",
        "00011000",
        "00011000",
        "00011000",
        "00000000",
        "00011000",
        "00011000"
    ],
    ajuda: [
        "00011000",
        "00111100",
        "01111110",
        "11011011",
        "00011000",
        "00011000",
        "00011000",
        "00011000"
    ]
};

// Criar os 64 LEDs uma única vez
for (let i = 0; i < 64; i++) {
    const led = document.createElement("div");
    led.classList.add("led");
    matriz.appendChild(led);
}

// Mostrar os símbolos
function mostrarSimbolo(nome) {
    const desenho = simbolos[nome];
    if (!desenho) return;

    const leds = matriz.querySelectorAll(".led");

    leds.forEach((led, index) => {
        const linha = Math.floor(index / 8);
        const coluna = index % 8;

        led.classList.toggle(
            "aceso",
            desenho[linha][coluna] === "1"
        );
    });
}

// Símbolo inicial
mostrarSimbolo("feliz");

// Código Morse SOS
let reproduzindo = false;

async function reproduzirMorse() {
    if (reproduzindo) return;

    reproduzindo = true;

    const resultado = document.getElementById("morseResultado");
    const leds = matriz.querySelectorAll(".led");

    const sinais = [
        ".", ".", ".", " ",
        "-", "-", "-", " ",
        ".", ".", "."
    ];

    resultado.textContent = "Transmitindo SOS...";

    for (const sinal of sinais) {
        if (sinal === " ") {
            await new Promise(resolve => setTimeout(resolve, 500));
            continue;
        }

        resultado.textContent =
            sinal === "." ? "Ponto: sinal curto" : "Traço: sinal longo";

        const duracao = sinal === "." ? 250 : 750;

        leds.forEach(led => led.classList.add("aceso"));

        await new Promise(resolve => setTimeout(resolve, duracao));

        leds.forEach(led => led.classList.remove("aceso"));

        await new Promise(resolve => setTimeout(resolve, 250));
    }

    resultado.textContent = "SOS transmitido: ... --- ...";

    mostrarSimbolo("feliz");
    reproduzindo = false;
}

// Atualizar o display
function atualizarDisplay() {
    const mensagem = document.getElementById("mensagem").value.trim();

    if (!mensagem) {
        alert("Digite uma mensagem primeiro!");
        return;
    }

    document.getElementById("linha1").textContent =
        mensagem.substring(0, 16).toUpperCase();

    document.getElementById("linha2").textContent =
        "MENSAGEM RECEBIDA";
}
// --- 1. DADOS INICIAIS DA TABELA (EXATOS DA IMAGEM) ---
let medicoes = [
    { local: "perto da sala de aula", data: "13/11/2026 - 07:55", db: 96, contexto: "alunos conversando" },
    { local: "mesa de ping pong", data: "13/11/2026 - 07:57", db: 94, contexto: "ninguem estava no local" },
    { local: "refeitorio", data: "13/11/2026 - 07:59", db: 107, contexto: "local estava vazio" },
    { local: "patio da escola", data: "13/11/2026 - 08:01", db: 98, contexto: "tinha alguns alunos" },
    { local: "sala do xerox", data: "13/11/2026 - 08:02", db: 105, contexto: "a sala estava vazia" }
];

function renderizarTabela() {
    const tbody = document.getElementById('tabela-corpo');
    tbody.innerHTML = '';

    medicoes.forEach((item, index) => {
        let classeCor = '';
        if (item.db < 60) classeCor = 'baixo';
        else if (item.db <= 85) classeCor = 'moderado';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="local-cell">${item.local}</td>
            <td style="color: var(--text-muted);">${item.data}</td>
            <td><span class="db-badge ${classeCor}">${item.db} dB</span></td>
            <td style="color: var(--text-muted);">${item.contexto}</td>
            <td style="text-align: center;">
                <button class="btn-delete" title="Remover registro" onclick="removerMedicao(${index})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    atualizarEstatisticas();
}

function atualizarEstatisticas() {
    const elMedia = document.getElementById('media-geral');
    const elRuidoso = document.getElementById('local-ruidoso');
    const elSilencioso = document.getElementById('local-silencioso');

    if (medicoes.length === 0) {
        elMedia.innerText = "0.0 dB";
        elRuidoso.innerText = "-";
        elSilencioso.innerText = "-";
        return;
    }

    let soma = 0;
    let maior = medicoes[0];
    let menor = medicoes[0];

    medicoes.forEach(m => {
        soma += m.db;
        if (m.db > maior.db) maior = m;
        if (m.db < menor.db) menor = m;
    });

    const media = soma / medicoes.length;
    elMedia.innerText = `${media.toFixed(1)} dB`;
    elRuidoso.innerText = `${maior.local} (${maior.db} dB)`;
    elSilencioso.innerText = `${menor.local} (${menor.db} dB)`;
}

function toggleFormulario() {
    const form = document.getElementById('form-medicao');
    form.style.display = form.style.display === 'grid' ? 'none' : 'grid';
}

function adicionarMedicao() {
    const localInput = document.getElementById('input-local').value.trim();
    const dbInput = parseFloat(document.getElementById('input-db').value);
    const contextoInput = document.getElementById('input-contexto').value.trim();

    if (!localInput || isNaN(dbInput) || dbInput <= 0) {
        alert("Por favor, preencha o local e um valor válido em decibéis (dB).");
        return;
    }

    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();
    const hora = String(agora.getHours()).padStart(2, '0');
    const min = String(agora.getMinutes()).padStart(2, '0');
    const dataFormatada = `${dia}/${mes}/${ano} - ${hora}:${min}`;

    medicoes.push({
        local: localInput,
        data: dataFormatada,
        db: dbInput,
        contexto: contextoInput || "sem observações"
    });

    document.getElementById('input-local').value = '';
    document.getElementById('input-db').value = '';
    document.getElementById('input-contexto').value = '';
    document.getElementById('form-medicao').style.display = 'none';

    renderizarTabela();
}

function removerMedicao(index) {
    medicoes.splice(index, 1);
    renderizarTabela();
}

// --- 2. SIMULADOR VISUAL DA ONDA SONORA (CANVAS) ---
const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');
const sliderAmp = document.getElementById('slider-amp');
const sliderFreq = document.getElementById('slider-freq');

let fase = 0;

function atualizarDiagnostico() {
    const db = parseInt(sliderAmp.value);
    const freq = parseInt(sliderFreq.value);

    document.getElementById('val-amp').innerText = `${db} dB`;
    document.getElementById('val-freq').innerText = `${freq} Hz`;

    const titulo = document.getElementById('diag-titulo');
    const impacto = document.getElementById('diag-impacto');
    const labelAmp = document.getElementById('label-amp');
    const labelFreq = document.getElementById('label-freq');

    if (db < 55) {
        titulo.innerText = "Som Confortável / Silencioso";
        titulo.style.color = "var(--success)";
        impacto.innerText = "Ambiente ideal para concentração e aprendizado.";
        labelAmp.innerText = "Baixa Amplitude (Som Fraco)";
    } else if (db <= 80) {
        titulo.innerText = "Som Moderado";
        titulo.style.color = "var(--cyan)";
        impacto.innerText = "Pode gerar leve fadiga após longos períodos.";
        labelAmp.innerText = "Amplitude Moderada";
    } else {
        titulo.innerText = "Ruído Intenso / Risco Auditivo";
        titulo.style.color = "var(--danger)";
        impacto.innerText = "Prejudica a concentração e pode causar danos auditivos.";
        labelAmp.innerText = "Alta Amplitude (Som Forte)";
    }

    if (freq < 300) {
        labelFreq.innerText = "Baixa Frequência (Som Grave)";
    } else if (freq <= 700) {
        labelFreq.innerText = "Média Frequência";
    } else {
        labelFreq.innerText = "Alta Frequência (Som Agudo)";
    }
}

function desenharOnda() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Linha central de referência
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1;
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Onda senoidal
    const db = parseInt(sliderAmp.value);
    const freq = parseInt(sliderFreq.value);
    const amplitudePixels = ((db - 15) / 105) * (canvas.height / 2 - 12);
    const frequenciaOnda = (freq / 1000) * 0.08 + 0.015;

    ctx.beginPath();
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 3;

    for (let x = 0; x < canvas.width; x++) {
        const y = (canvas.height / 2) + Math.sin(x * frequenciaOnda + fase) * amplitudePixels;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    fase += 0.05;
    requestAnimationFrame(desenharOnda);
}

sliderAmp.addEventListener('input', atualizarDiagnostico);
sliderFreq.addEventListener('input', atualizarDiagnostico);

// Inicializa tudo
renderizarTabela();
atualizarDiagnostico();
desenharOnda();
