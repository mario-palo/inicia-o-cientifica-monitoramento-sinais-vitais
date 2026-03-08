export default async function historicoLoader() {
    const userId = localStorage.getItem("selected_user_id");

    // Se não tiver ID, retorna vazio em vez de tentar o fetch
    if (!userId) {
        console.warn("Loader: Nenhum userId encontrado no localStorage");
        return []; 
    }

    try {
        const response = await fetch(`http://localhost:8080/historico/geral?userId=${userId}`);
        
        if (!response.ok) {
            console.error(`Erro na API: Status ${response.status}`);
            return []; // Retorna array vazio em vez de dar throw
        }
        
        return await response.json();
    } catch (error) {
        console.error("Erro de conexão com o servidor:", error);
        return []; // Retorna vazio para o componente não quebrar
    }
}