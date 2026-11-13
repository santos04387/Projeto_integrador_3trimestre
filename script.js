
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
