export default async function historicoLoader() {
    const userId = localStorage.getItem("selected_user_id");

    if (!userId) {
        return [];
    }

    const agora = new Date();
    const ontem = new Date(agora);
    ontem.setDate(ontem.getDate() - 1);

    const formatarParaSQL = (data) => data.toISOString().slice(0, 19).replace('T', ' ');

    const inicio = formatarParaSQL(ontem);
    const fim = formatarParaSQL(agora);

    try {
        const params = new URLSearchParams({ inicio, fim });
        const url = `http://localhost:8080/historico/geral/${userId}?${params.toString()}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        return [];
    }
}