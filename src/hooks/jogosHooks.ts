export interface JogoType {
    id?: number;
    nome: string;
    plataforma: string;
    contas?: number;
    licencas?: number;
    livres?: number;
    preco_primaria?: number;
    preco_primaria_ps5?: number;
    preco_secundaria?: number;
    revenda_primaria?: number;
    revenda_primaria_ps5?: number;
    revenda_secundaria?: number;
    preco_store?: number;
    preco_promo?: number;
    preco_c1?: number;
    imagem?: string;
    data_promo?: string | null;
    sku_primaria?: string;
    sku_primaria_ps5?: string;
    sku_secundaria?: string;
    genero?: string;
    idioma?: string;
    obs?: string;
}