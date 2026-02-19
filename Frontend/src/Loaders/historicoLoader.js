export default async function historicoLoader() {
    const response = await fetch(`http://localhost:8080/historico/temperatura`);
    
    if (!response.ok) {
        throw new Error("Não foi possível carregar o histórico");
    }

    return response.json();
};