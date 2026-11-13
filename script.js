
// MATRIZ DE LEDS

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

// Cria os 64 LEDs

for (let i = 0; i < 64; i++) {
    const led = document.createElement("div");
    led.classList.add("led");
    matriz.appendChild(led);
}

// Mostra os desenhos

function mostrarSimbolo(nome) {
    const desenho = simbolos[nome];
    const leds = document.querySelectorAll(".led");

    leds.forEach((led, index) => {
        const linha = Math.floor(index / 8);
        const coluna = index % 8;

        if (desenho[linha][coluna] === "1") {
            led.classList.add("aceso");
        } else {
            led.classList.remove("aceso");
        }
    });
}

// Símbolo inicial

mostrarSimbolo("feliz");


// CÓDIGO MORSE

const sequenciaSOS = [
    ".", ".", ".",
    "-",
    "-", "-",
    ".", ".", "."
];

let reproduzindo = false;

async function reproduzirMorse() {
    if (reproduzindo) return;

    reproduzindo = true;

    const resultado = document.getElementById("morseResultado");
    const leds = document.querySelectorAll(".led");

    resultado.textContent = "Transmitindo SOS...";

    for (let sinal of sequenciaSOS) {
        resultado.textContent =
            sinal === "." ? "Sinal curto (ponto)" : "Sinal longo (traço)";

        const duracao = sinal === "." ? 250 : 750;

        // Simulação visual do sinal luminoso
        leds.forEach(led => led.classList.add("aceso"));

        await new Promise(resolve =>
            setTimeout(resolve, duracao)
        );

        leds.forEach(led => led.classList.remove("aceso"));

        await new Promise(resolve =>
            setTimeout(resolve, 300)
        );
    }

    resultado.textContent = "SOS transmitido: ... --- ...";

    mostrarSimbolo("feliz");

    reproduzindo = false;
}


// DISPLAY LCD

function atualizarDisplay() {
    const mensagem = document.getElementById("mensagem").value;

    if (mensagem.trim() === "") {
        alert("Digite uma mensagem primeiro!");
        return;
    }

    document.getElementById("linha1").textContent =
        mensagem.substring(0, 16).toUpperCase();

    document.getElementById("linha2").textContent =
        "MENSAGEM RECEBIDA";
}
