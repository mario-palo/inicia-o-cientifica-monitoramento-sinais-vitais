export default async function historicoLoader() {
    
    const userId = localStorage.getItem("selected_user_id");

    if (!userId) return []; 

    const response = await fetch(`http://localhost:8080/historico/geral?userId=${userId}`);
    
    if (!response.ok) throw new Error("Erro ao buscar dados do usuário");
    
    return response.json();
}