import java.util.*;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.util.Base64;

public class ProjetoIntegrador {

    private static final Scanner sc = new Scanner(System.in);
    private static final SecureRandom random = new SecureRandom();

    // ==========================================
    // ATIVIDADE 1 - COFRE DIGITAL
    // ==========================================

    public static byte[] gerarChave(String senha, byte[] salt)
            throws Exception {

        PBEKeySpec spec = new PBEKeySpec(
            senha.toCharArray(), salt, 200000, 256
        );

        try {
            SecretKeyFactory factory =
                SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");

            return factory.generateSecret(spec).getEncoded();
        } finally {
            spec.clearPassword();
        }
    }

    private static byte[] sha256(byte[] dados) throws Exception {
        return MessageDigest.getInstance("SHA-256").digest(dados);
    }

    private static byte[] concatenar(byte[] a, byte[] b) {
        byte[] resultado = Arrays.copyOf(a, a.length + b.length);
        System.arraycopy(b, 0, resultado, a.length, b.length);
        return resultado;
    }

    public static String criptografar(String mensagem, String senha)
            throws Exception {

        byte[] salt = new byte[16];
        random.nextBytes(salt);

        byte[] chave = gerarChave(senha, salt);
        byte[] dados = mensagem.getBytes(StandardCharsets.UTF_8);
        byte[] resultado = new byte[dados.length];

        for (int inicio = 0, contador = 0;
             inicio < dados.length;
             inicio += 32, contador++) {

            byte[] contadorBytes = ByteBuffer.allocate(8)
                .putLong(contador).array();

            byte[] bloco = sha256(concatenar(chave, contadorBytes));

            int tamanho = Math.min(32, dados.length - inicio);

            for (int i = 0; i < tamanho; i++) {
                resultado[inicio + i] =
                    (byte) (dados[inicio + i] ^ bloco[i]);
            }
        }

        byte[] verificacaoCompleta =
            sha256(concatenar(chave, dados));

        byte[] verificacao =
            Arrays.copyOf(verificacaoCompleta, 16);

        byte[] pacote = concatenar(
            concatenar(salt, resultado), verificacao
        );

        return Base64.getUrlEncoder().encodeToString(pacote);
    }

    public static String descriptografar(String codigo, String senha) {
        try {
            byte[] pacote = Base64.getUrlDecoder().decode(codigo);

            if (pacote.length < 32) {
                return "Código inválido.";
            }

            byte[] salt = Arrays.copyOfRange(pacote, 0, 16);

            byte[] dados = Arrays.copyOfRange(
                pacote, 16, pacote.length - 16
            );

            byte[] verificacao = Arrays.copyOfRange(
                pacote, pacote.length - 16, pacote.length
            );

            byte[] chave = gerarChave(senha, salt);
            byte[] resultado = new byte[dados.length];

            for (int inicio = 0, contador = 0;
                 inicio < dados.length;
                 inicio += 32, contador++) {

                byte[] contadorBytes = ByteBuffer.allocate(8)
                    .putLong(contador).array();

                byte[] bloco =
                    sha256(concatenar(chave, contadorBytes));

                int tamanho = Math.min(32, dados.length - inicio);

                for (int i = 0; i < tamanho; i++) {
                    resultado[inicio + i] =
                        (byte) (dados[inicio + i] ^ bloco[i]);
                }
            }

            byte[] testeCompleto =
                sha256(concatenar(chave, resultado));

            byte[] teste = Arrays.copyOf(testeCompleto, 16);

            if (!MessageDigest.isEqual(teste, verificacao)) {
                return "Senha incorreta ou código alterado.";
            }

            return StandardCharsets.UTF_8.newDecoder()
                .decode(java.nio.ByteBuffer.wrap(resultado))
                .toString();

        } catch (Exception e) {
            return "Não foi possível descriptografar o código.";
        }
    }

    private static String lerSenha(String mensagem) {
        System.out.print(mensagem);

        java.io.Console console = System.console();

        if (console != null) {
            char[] senha = console.readPassword();
            return senha == null ? "" : new String(senha);
        }

        // Alternativa para IDEs sem console disponível.
        return sc.nextLine();
    }

    public static void cofreDigital() {
        while (true) {
            System.out.println("\n--- COFRE DIGITAL ---");
            System.out.println("1 - Criptografar mensagem");
            System.out.println("2 - Descriptografar mensagem");
            System.out.println("3 - Voltar ao menu principal");
            System.out.print("Escolha: ");

            String opcao = sc.nextLine().trim();

            if (opcao.equals("1")) {
                System.out.print("Digite sua mensagem: ");
                String mensagem = sc.nextLine();

                String senha = lerSenha("Crie uma senha: ");

                if (senha.isEmpty()) {
                    System.out.println("A senha não pode ficar vazia.");
                    continue;
                }

                try {
                    System.out.println("\nCódigo criptografado:");
                    System.out.println(criptografar(mensagem, senha));
                    System.out.println(
                        "Guarde o código e lembre-se da senha!"
                    );
                } catch (Exception e) {
                    System.out.println("Erro ao criptografar.");
                }

            } else if (opcao.equals("2")) {
                System.out.print("Cole o código criptografado: ");
                String codigo = sc.nextLine().trim();

                String senha = lerSenha("Digite a senha: ");

                System.out.println(descriptografar(codigo, senha));

            } else if (opcao.equals("3")) {
                break;

            } else {
                System.out.println("Opção inválida.");
            }
        }
    }

    // ==========================================
    // ATIVIDADE 2 - ENGENHARIA DE PROMPT
    // ==========================================

    public static void engenhariaPrompt() {
        while (true) {
            System.out.println("\n--- ENGENHARIA DE PROMPT ---");
            System.out.println("1 - Criar prompt simples");
            System.out.println("2 - Criar prompt detalhado");
            System.out.println("3 - Voltar ao menu principal");
            System.out.print("Escolha: ");

            String opcao = sc.nextLine().trim();

            if (opcao.equals("3")) {
                break;
            }

            if (!opcao.equals("1") && !opcao.equals("2")) {
                System.out.println("Opção inválida.");
                continue;
            }

            System.out.print(
                "Digite o texto que deseja simplificar: "
            );
            String texto = sc.nextLine();

            String prompt;

            if (opcao.equals("1")) {
                prompt =
                    "Simplifique este texto usando palavras fáceis:\n"
                    + texto;

            } else {
                prompt =
                    "Você é um assistente especializado em acessibilidade. "
                    + "Reescreva o texto abaixo para facilitar a leitura. "
                    + "Use palavras simples e frases curtas. "
                    + "Explique termos difíceis, organize as informações "
                    + "em tópicos e preserve o significado original. "
                    + "Não invente informações.\n\nTexto:\n"
                    + texto;
            }

            System.out.println("\n--- PROMPT GERADO ---");
            System.out.println(prompt);

            System.out.println(
                "\nCopie o prompt e envie a uma IA para obter a resposta."
            );

            System.out.println(
                "Este módulo prepara instruções, mas não se conecta "
                + "automaticamente a um modelo de IA."
            );
        }
    }

    // ==========================================
    // ATIVIDADE 3 - CALCULADORA NUTRICIONAL
    // ==========================================

    private static final Map<String, Map<String, Double>> alimentos =
        new LinkedHashMap<>();

    static {
        adicionarAlimento(
            "arroz cozido", 130, 2.7, 28.2, 0.3, 1.6
        );
        adicionarAlimento(
            "feijao cozido", 76, 4.8, 13.6, 0.5, 8.5
        );
        adicionarAlimento(
            "frango grelhado", 165, 31, 0, 3.6, 0
        );
        adicionarAlimento(
            "ovo cozido", 155, 13, 1.1, 11, 0
        );
        adicionarAlimento(
            "banana", 89, 1.1, 22.8, 0.3, 2.6
        );
        adicionarAlimento(
            "aveia", 389, 16.9, 66.3, 6.9, 10.6
        );
    }

    private static void adicionarAlimento(
            String nome,
            double calorias,
            double proteinas,
            double carboidratos,
            double gorduras,
            double fibras) {

        Map<String, Double> nutrientes = new LinkedHashMap<>();

        nutrientes.put("calorias", calorias);
        nutrientes.put("proteinas", proteinas);
        nutrientes.put("carboidratos", carboidratos);
        nutrientes.put("gorduras", gorduras);
        nutrientes.put("fibras", fibras);

        alimentos.put(nome, nutrientes);
    }

    public static void calculadoraNutricional() {
        Map<String, Double> totais = new LinkedHashMap<>();

        totais.put("calorias", 0.0);
        totais.put("proteinas", 0.0);
        totais.put("carboidratos", 0.0);
        totais.put("gorduras", 0.0);
        totais.put("fibras", 0.0);

        System.out.println("\n--- CALCULADORA NUTRICIONAL ---");
        System.out.println("Alimentos disponíveis:");

        for (String nome : alimentos.keySet()) {
            System.out.println("- " + nome.substring(0, 1).toUpperCase()
                + nome.substring(1));
        }

        System.out.println("\nDigite 'fim' quando terminar.");

        while (true) {
            System.out.print("\nNome do alimento: ");
            String nome = sc.nextLine().trim().toLowerCase();

            if (nome.equals("fim")) {
                break;
            }

            if (!alimentos.containsKey(nome)) {
                System.out.println(
                    "Alimento não encontrado. Tente novamente."
                );
                continue;
            }

            double quantidade;

            try {
                System.out.print("Quantidade em gramas: ");

                String entrada = sc.nextLine().trim()
                    .replace(',', '.');

                quantidade = Double.parseDouble(entrada);

                if (!Double.isFinite(quantidade) || quantidade <= 0) {
                    System.out.println(
                        "Digite uma quantidade maior que zero."
                    );
                    continue;
                }

            } catch (NumberFormatException e) {
                System.out.println(
                    "Digite uma quantidade numérica válida."
                );
                continue;
            }

            double fator = quantidade / 100.0;
            Map<String, Double> nutrientes = alimentos.get(nome);

            for (String nutriente : totais.keySet()) {
                double novoTotal = totais.get(nutriente)
                    + nutrientes.get(nutriente) * fator;

                totais.put(nutriente, novoTotal);
            }

            System.out.printf(
                Locale.forLanguageTag("pt-BR"),
                "%.1f g de %s adicionados.%n",
                quantidade, nome
            );
        }

        System.out.println("\n--- RESUMO NUTRICIONAL ---");

        System.out.printf(
            Locale.forLanguageTag("pt-BR"),
            "Calorias: %.1f kcal%n", totais.get("calorias")
        );

        System.out.printf(
            Locale.forLanguageTag("pt-BR"),
            "Proteínas: %.1f g%n", totais.get("proteinas")
        );

        System.out.printf(
            Locale.forLanguageTag("pt-BR"),
            "Carboidratos: %.1f g%n", totais.get("carboidratos")
        );

        System.out.printf(
            Locale.forLanguageTag("pt-BR"),
            "Gorduras: %.1f g%n", totais.get("gorduras")
        );

        System.out.printf(
            Locale.forLanguageTag("pt-BR"),
            "Fibras: %.1f g%n", totais.get("fibras")
        );

        System.out.println(
            "\nValores aproximados para fins educativos."
        );
        System.out.println(
            "O resultado não substitui orientação nutricional."
        );
    }

    // ==========================================
    // MENU PRINCIPAL - PROJETO INTEGRADO
    // ==========================================

    public static void main(String[] args) {
        while (true) {
            System.out.println("\n====================================");
            System.out.println(" PROJETO: TECNOLOGIA, ÉTICA E SAÚDE");
            System.out.println("====================================");
            System.out.println("1 - Cofre Digital (Criptografia)");
            System.out.println("2 - Inteligência Artificial (Prompts)");
            System.out.println("3 - Calculadora Nutricional");
            System.out.println("4 - Sair");
            System.out.print("Escolha uma atividade: ");

            String opcao = sc.nextLine().trim();

            switch (opcao) {
                case "1":
                    cofreDigital();
                    break;

                case "2":
                    engenhariaPrompt();
                    break;

                case "3":
                    calculadoraNutricional();
                    break;

                case "4":
                    System.out.println(
                        "Obrigado por utilizar o projeto!"
                    );
                    sc.close();
                    return;

                default:
                    System.out.println(
                        "Opção inválida. Escolha de 1 a 4."
                    );
            }
        }
    }
}