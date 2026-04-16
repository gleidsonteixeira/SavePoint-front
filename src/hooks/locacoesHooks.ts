export interface LocacaoType {
    id?: number;
    data_inicio: string;
    data_fim?: string | null;
    licenca_id: number;
    referencia_externa?: string;
    valor_pago?: number;
    origem?: string;
    yampi_id?: number;
    cliente_id: number;
}