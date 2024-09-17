const axios = require('axios');
const dotenv = require('dotenv');
const readlineSync = require('readline-sync');

dotenv.config();

console.log('Chave API:', process.env.OPENAI_API_KEY);

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const chatWithGPT = async (messages) => {
    try {
        const response = await axios.post(OPENAI_API_URL, {
            model: "gpt-4o", // Usando gpt-3.5-turbo
            messages
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
                'OpenAI-Organization': process.env.OPENAI_ORGANIZATION_ID
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error:', error.message);
        console.error('Response data:', error.response ? error.response.data : 'No response data');
        return null;
    }
};

const startChat = async () => {
    const messages = [];

    // Prompt inicial mais completo com instruções para sugerir um hiperfoco específico ao final
    messages.push({
        role: "system",
        content: `Você é um agente especializado em identificar o hiperfoco, habilidades e os interesses de pessoas autistas. 
                  Sua tarefa é interagir com o usuário, fazendo quantas perguntas forem necessárias para que você entenda de maneira nítida e coerente qual o hiperfoco, habilidades e interesses do usuário. Seja objetiva em seus questionamentos pois, a partir das perguntas que fizer e do mapeamento que efetuar pelas perguntas, professores irão adaptar materiais didáticos, conteúdos e atividades para esses usuários. Para entender seu hiperfoco, considere que o hiperfoco de uma pessoa pode ser qualquer coisa, mesmo as coisas mais impossíveis como filmes em específicos como "Meu malvado favorito" objetos como uma geladeira ou até animais, como um caso de um autista com hiperfoco em baleias. Faça uma busca global e mapeie dessa base o hiperfoco do usuario, sem limitações e então, ao final da conversa, seu papel é avaliar qual área de hiperfoco o usuário tem maior afinidade, de forma clara e direta, como "Seu hiperfoco é Design". Sem esquecer de mencionar de maneira objetiva as habilidades e interesses predominantes desse usuário.
                  Conduza a conversa com empatia e sensibilidade, formulando suas próprias perguntas para descobrir o hiperfoco do usuário e chegando a uma conclusão clara, coerente e concisa. 
                  Comece perguntando o nome do autista, e depois siga para as perguntas que julgar necessário até atingir sua missão principal.
Chame-o sempre pelo nome e siga o tom de conversa Cortez, educado, mas objetivo e considere que depois vou precisar desse mapeamento que fizer de forma detalhada`
    });

    console.log("Bem-vindo! Vou fazer algumas perguntas para entender melhor seus interesses. Digite 'exit' para sair.");

    while (true) {
        const userMessage = readlineSync.question('Você: ');

        if (userMessage.toLowerCase() === 'exit') {
            console.log('Até logo!');
            break;
        }

        messages.push({ role: "user", content: userMessage });

        const gptResponse = await chatWithGPT(messages);

        if (gptResponse) {
            messages.push({ role: "assistant", content: gptResponse });
            console.log(`Agente: ${gptResponse}`);
        }

        // Verifica se a IA chegou a uma conclusão sobre o hiperfoco
        if (gptResponse && gptResponse.toLowerCase().includes("seu hiperfoco é")) {
            console.log("Conversa concluída.");
            break;
        }
    }
};

startChat();
