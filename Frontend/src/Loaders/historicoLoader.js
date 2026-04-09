export default async function historicoLoader() {
    const userId = localStorage.getItem("selected_user_id");

    if (!userId) {
        console.warn("Loader: Nenhum userId encontrado no localStorage");
        return []; 
    }

    const agora = new Date();
    const ontem = new Date();
    ontem.setHours(ontem.getHours() - 24);

    const formatarParaSQL = (data) => data.toISOString().slice(0, 19).replace('T', ' ');
    
    const inicio = formatarParaSQL(ontem);
    const fim = formatarParaSQL(agora);

    try {
        const url = `http://localhost:8080/historico/geral/${userId}?inicio=${inicio}&fim=${fim}`;
        console.log("Buscando histórico na URL:", url);

        const response = await fetch(url);
        
        if (!response.ok) {
            console.error(`Erro na API: Status ${response.status}`);
            return []; 
        }
        
        const dados = await response.json();
        console.log("Dados recebidos do histórico:", dados.length, "pontos");
        return dados;

    } catch (error) {
        console.error("Erro de conexão com o servidor:", error);
        return []; 
    }
}