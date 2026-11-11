// Função simples para interagir com o usuário ao clicar nos botões
function explorar(area) {
    alert(`Você clicou para explorar a área de ${area}! \nEsse espaço está pronto para receber seus novos projetos.`);
    
    // Futuramente, você pode trocar o alert por uma transição de página ou abertura de modal:
    // window.location.href = `./${area.toLowerCase()}.html`;
}

// Efeito de scroll suave para os links do menu
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

