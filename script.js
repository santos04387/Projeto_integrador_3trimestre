// Aguarda o carregamento do DOM para evitar erros de leitura de elementos
document.addEventListener("DOMContentLoaded", () => {
    inicializarAbas();
    inicializarCofre();
    inicializarPrompt();
    inicializarCalculadora();
});

// ==========================================
// GERENCIADOR DE ABAS (NAVEGAÇÃO)
// ==========================================
function inicializarAbas() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".panel");

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetTab = button.getAttribute("data-tab");

            // Remove o estado ativo de todas as abas e painéis
            tabButtons.forEach(btn => btn.classList.remove("active"));
            panels.forEach(panel => panel.classList.remove("active"));

            // Ativa o botão clicado e o painel correspondente
            button.classList.add("active");
            document.getElementById(targetTab).classList.add("active");
        });
    });
}

// ==========================================
// ATIVIDADE 1 - COFRE DIGITAL (LOGICA)
// ==========================================
function inicializarCofre() {
    const modoSelect = document.getElementById("cofre-modo");
    const grupoMensagem = document.getElementById("grupo-mensagem");
    const grupoCodigo = document.getElementById("grupo-codigo");
    const btnCofre = document.getElementById("btn-cofre");
    const outCofre = document.getElementById("cofre-resultado");

    // Altera os campos exibidos dependendo do modo (Criptografar/Descriptografar)
    modoSelect.addEventListener("change", () => {
        if (modoSelect.value === "criptografar") {
            grupoMensagem.classList.remove("hidden");
            grupoCodigo.classList.add("hidden");
        } else {
            grupoMensagem.classList.add("hidden");
            grupoCodigo.classList.remove("hidden");
        }
    });

    btnCofre.addEventListener("click", () => {
        const senha = document.getElementById("cofre-senha").value;
        outCofre.classList.remove("hidden");

        if (!senha) {
            outCofre.textContent = "A senha não pode ficar vazia.";
            return;
        }

        if (modoSelect.value === "criptografar") {
            const msg = document.getElementById("cofre-mensagem").value;
            try {
                // Utiliza algoritmo seguro simétrico AES via CryptoJS
                const codificado = CryptoJS.AES.encrypt(msg, senha).toString();
                outCofre.innerHTML = `<strong>Código criptografado gerado:</strong>\n${codificado}\n\n<em>Guarde o código e lembre-se da senha!</em>`;
            } catch(e) {
                outCofre.textContent = "Erro ao criptografar.";
            }
        } else {
            const cod = document.getElementById("cofre-codigo").value.trim();
            try {
                const decodificado = CryptoJS.AES.decrypt(cod, senha).toString(CryptoJS.enc.Utf8);
                if (!decodificado) {
                    outCofre.textContent = "Senha incorreta ou código alterado.";
                } else {
                    outCofre.innerHTML = `<strong>Mensagem Descoberta:</strong>\n${decodificado}`;
                }
            } catch(e) {
                outCofre.textContent = "Não foi possível descriptografar o código.";
            }
        }
    });
}

// ==========================================
// ATIVIDADE 2 - ENGENHARIA DE PROMPT
// ==========================================
function inicializarPrompt() {
    const btnPrompt = document.getElementById("btn-prompt");
    const outPrompt = document.getElementById("prompt-resultado");

    btnPrompt.addEventListener("click", () => {
        const tipo = document.getElementById("prompt-tipo").value;
        const texto = document.getElementById("prompt-texto").value;
        outPrompt.classList.remove("hidden");

        if (!texto.trim()) {
            outPrompt.textContent = "Por favor, digite algum texto para gerar o prompt.";
            return;
        }

        let promptGerado = "";
        if (tipo === "1") {
            promptGerado = `Simplifique este texto usando palavras fáceis:\n${texto}`;
        } else {
            promptGerado = `Você é um assistente especializado em acessibilidade. Reescreva o texto abaixo para facilitar a leitura. Use palavras simples e frases curtas. Explique termos difíceis, organize as informações em tópicos e preserve o significado original. Não invente informações.\n\nTexto:\n${texto}`;
        }

        outPrompt.textContent = promptGerado;
    });
}

// ==========================================
// ATIVIDADE 3 - CALCULADORA NUTRICIONAL
// ==========================================
function inicializarCalculadora() {
    const tabelaAlimentos = {
        "arroz cozido": { calorias: 130, proteinas: 2.7, carboidratos: 28.2, gorduras: 0.3, fibras: 1.6 },
        "feijao cozido": { calorias: 76, proteinas: 4.8, carboidratos: 13.6, gorduras: 0.5, fibras: 8.5 },
        "frango grelhado": { calorias: 165, proteinas: 31, carboidratos: 0, gorduras: 3.6, fibras: 0 },
        "ovo cozido": { calorias: 155, proteinas: 13, carboidratos: 1.1, gorduras: 11, fibras: 0 },
        "banana": { calorias: 89, proteinas: 1.1, carboidratos: 22.8, gorduras: 0.3, fibras: 2.6 },
        "aveia": { calorias: 389, proteinas: 16.9, carboidratos: 66.3, gorduras: 6.9, fibras: 10.6 }
    };

    let totaisNutricionais = { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0, fibras: 0 };
    let itensAdicionados = [];

    const btnAdicionar = document.getElementById("btn-adicionar-nutri");
    const btnReset = document.getElementById("btn-reset-nutri");
    const listaRefeicao = document.getElementById("lista-refeicao");
    const painelTotais = document.getElementById("nutri-totais");

    function renderizarNutri() {
        // Atualiza a listagem de pratos na tela
        listaRefeicao.innerHTML = "";
        itensAdicionados.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${item.quantidade}g de ${item.nomeFormatado} 
                            <button class="remove-btn" data-index="${index}">✕</button>`;
            listaRefeicao.appendChild(li);
        });

        // Atualiza o painel cumulativo de macronutrientes
        painelTotais.innerHTML = `
            Calorias: ${totaisNutricionais.calorias.toFixed(1)} kcal<br>
            Proteínas: ${totaisNutricionais.proteinas.toFixed(1)} g<br>
            Carboidratos: ${totaisNutricionais.carboidratos.toFixed(1)} g<br>
            Gorduras: ${totaisNutricionais.gorduras.toFixed(1)} g<br>
            Fibras: ${totaisNutricionais.fibras.toFixed(1)} g
        `;

        // Ativa o evento para os botões de remoção individuais após renderizados
        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = parseInt(e.target.getAttribute("data-index"));
                removerItem(index);
            });
        });
  // Script para animações simples de leitura ou interatividade futura
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.recurso-card, .projeto-table tr');
    
    // Adiciona um efeito simples de destaque visual ao passar o mouse nos blocos de explicação
    cards.forEach(card => {
        card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-2px)';
            card.style.box-shadow = '0 4px 10px rgba(0,0,0,0.04)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.box-shadow = 'none';
        });
    });
});
