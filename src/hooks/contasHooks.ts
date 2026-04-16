export interface ContaType {
    id?: number;
    email: string;
    senha: string;
    fa_codigos?: string;
    store_id?: string;
    conta_pai_id?: number | null;
    ultimo_acesso?: string | null;
    referencia_externa?: string;
    data_nascimento?: string | null;
    custo_aquisicao?: number;
    data_aquisicao?: string | null;
    pais_origem?: string;
    saldo_disponivel?: number;
}