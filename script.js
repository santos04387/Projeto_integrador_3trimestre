// ==========================================
// MÓDULO 1 - COFRE DIGITAL (Cifra Simples Alternativa para Web)
// ==========================================
// Nota: O JavaScript nativo de navegador não possui o método exato pbkdf2_hmac estruturado de forma idêntica ao Python de forma simples.
// Criamos uma lógica correspondente de Cifra XOR + Codificação Base64 baseada em chave para simular perfeitamente o comportamento no front-end.

function extrairChave(senha) {
    let codigoChave = 0;
    for (let i = 0; i < senha.length; i++) {
        codigoChave += senha.charCodeAt(i);
    }
    return codigoChave || 42;
}

function executarCriptografar() {
    const msg = document.getElementById("cofre-mensagem").value;
    const senha = document.getElementById("cofre-senha").value;
    const resBox = document.getElementById("cofre-resultado");

    if (!msg || !senha) {
        alert("Preencha a mensagem e a senha!");
        return;
    }

    let chave = extrairChave(senha);
    let resultado = "";

    for (let i = 0; i < msg.length; i++) {
        let charCode = msg.charCodeAt(i) ^ (chave % 255);
        resultado += String.fromCharCode(charCode);
    }

    let b64 = btoa(unescape(encodeURIComponent(resultado)));
    resBox.innerText = `Código Gerado:\n${b64}`;
    resBox.classList.remove("hidden");
}

function executarDescriptografar() {
    const codigo = document.getElementById("cofre-mensagem").value;
    const senha = document.getElementById("cofre-senha").value;
    const resBox = document.getElementById("cofre-resultado");

    if (!codigo || !senha) {
        alert("Preencha o código codificado no campo de mensagem e digite a senha!");
        return;
    }

    try {
        let decodificado = decodeURIComponent(escape(atob(codigo)));
        let chave = extrairChave(senha);
        let original = "";

        for (let i = 0; i < decodificado.length; i++) {
            let charCode = decodificado.charCodeAt(i) ^ (chave % 255);
            original += String.fromCharCode(charCode);
        }

        resBox.innerText = `Mensagem Descoberta:\n${original}`;
    } catch (e) {
        resBox.innerText = "Erro: Código inválido ou senha incorreta.";
    }
    resBox.classList.remove("hidden");
}


// ==========================================
// MÓDULO 2 - ENGENHARIA DE PROMPT
// ==========================================
function gerarPrompt(tipo) {
    const texto = document.getElementById("prompt-texto").value;
    const resBox = document.getElementById("prompt-resultado");

    if (!texto.strip && texto.trim() === "") {
        alert("Por favor, digite um texto primeiro.");
        return;
    }

    let promptFinal = "";

    if (tipo === 1) {
        promptFinal = `Simplifique este texto usando palavras fáceis:\n${texto}`;
    } else {
        promptFinal = `Você é um assistente especializado em acessibilidade. Reescreva o texto abaixo para facilitar a leitura. Use palavras simples e frases curtas. Explique termos difíceis, organize as informações em tópicos e preserve o significado original. Não invente informações.\n\nTexto:\n${texto}`;
    }

    resBox.innerText = promptFinal;
    resBox.classList.remove("hidden");
}


// ==========================================
// MÓDULO 3 - CALCULADORA NUTRICIONAL
// ==========================================
const tabelaAlimentos = {
    "arroz cozido": { calorias: 130, proteinas: 2.7, carboidratos: 28.2, gorduras: 0.3, fibras: 1.6 },
    "feijao cozido": { calorias: 76, proteinas: 4.8, carboidratos: 13.6, gorduras: 0.5, fibras: 8.5 },
    "frango grelhado": { calorias: 165, proteinas: 31, carboidratos: 0, gorduras: 3.6, fibras: 0 },
    "ovo cozido": { calorias: 155, proteinas: 13, carboidratos: 1.1, gorduras: 11, fibras: 0 },
    "banana": { calorias: 89, proteinas: 1.1, carboidratos: 22.8, gorduras: 0.3, fibras: 2.6 },
    "aveia": { calorias: 389, proteinas: 16.9, carboidratos: 66.3, gorduras: 6.9, fibras: 10.6 }
};

let totaisNutricionais = { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0, fibras: 0 };

function adicionarAlimento() {
    const alimentoSel = document.getElementById("nutri-alimento").value;
    const gramasInput = document.getElementById("nutri-gramas").value;
    const gramas = parseFloat(gramasInput);

    if (isNaN(gramas) || gramas <= 0) {
        alert("Digite uma quantidade de gramas válida e maior que zero.");
        return;
    }

    const fator = gramas / 100;
    const dadosAlimento = tabelaAlimentos[alimentoSel];

    totaisNutricionais.calorias += dadosAlimento.calorias * fator;
    totaisNutricionais.proteinas += dadosAlimento.proteinas * factor || dadosAlimento.proteinas * fator;
    totaisNutricionais.carboidratos += dadosAlimento.carboidratos * fator;
    totaisNutricionais.gorduras += dadosAlimento.gorduras * fator;
    totaisNutricionais.fibras += dadosAlimento.fibras * fator;

    atualizarPainelNutricional();
    document.getElementById("nutri-gramas").value = ""; 
}

function atualizarPainelNutricional() {
    document.getElementById("n-cal").innerText = totaisNutricionais.calorias.toFixed(1);
    document.getElementById("n-prot").innerText = totaisNutricionais.proteinas.toFixed(1);
    document.getElementById("n-carb").innerText = totaisNutricionais.carboidratos.toFixed(1);
    document.getElementById("n-gord").innerText = totaisNutricionais.gorduras.toFixed(1);
    document.getElementById("n-fib").innerText = totaisNutricionais.fibras.toFixed(1);
}

function limparNutri() {
    totaisNutricionais = { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0, fibras: 0 };
    atualizarPainelNutricional();
}

// Scroll suave nos links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
    });
});
