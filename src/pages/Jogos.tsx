import { App, Button, Divider, Form, Input, InputNumber, Modal, Popconfirm, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { BiPencil, BiTrash } from "react-icons/bi";
import { type JogoType } from "../hooks/jogosHooks";
import { AXIOS } from "../services";

const Jogos = () => {
    const [modalCriar, setModalCriar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const { notification } = App.useApp();
    const [jogos, setJogos] = useState<JogoType[]>([]);
    const [formEditar] = Form.useForm();
    const [formCriar] = Form.useForm();
    const plataforma = Form.useWatch("plataforma", formCriar)
    async function buscar() {
        const response = await AXIOS.get("/jogos");
        setJogos(response.data);
    }

    async function criar(dados: JogoType) {
        const response = await AXIOS.post("/jogos", dados);

        if (response.status === 500) {
            notification.error({
                description: response.data.mensagem,
                placement: "bottomRight"
            });
            return;
        }

        notification.success({
            description: response.data.mensagem,
            placement: "bottomRight"
        });

        setModalCriar(false);
        buscar();
    }

    async function editar(dados: JogoType) {
        const response = await AXIOS.put(`/jogos/${dados.id}`, dados);

        if (response.status === 500) {
            notification.error({
                description: response.data.mensagem,
                placement: "bottomRight"
            });
            return;
        }

        notification.success({
            description: response.data.mensagem,
            placement: "bottomRight"
        });

        setModalEditar(false);
        buscar();
    }

    async function deletar(id: number) {
        const response = await AXIOS.delete(`/jogos/${id}`);

        if (response.status === 500) {
            notification.error({
                description: response.data.mensagem,
                placement: "bottomRight"
            });
            return;
        }

        notification.success({
            description: response.data.mensagem,
            placement: "bottomRight"
        });

        buscar();
    }

    useEffect(() => {
        buscar();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-azul-total">Jogos</h1>
                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => setModalCriar(true)}
                >
                    Novo Jogo
                </Button>
            </div>

            <Table dataSource={jogos} rowKey={"id"} scroll={{ x: "max-content" }}>
                <Table.Column key="id" dataIndex="id" title="Id" />
                <Table.Column key="nome" dataIndex="nome" title="Nome" />
                <Table.Column key="plataforma" dataIndex="plataforma" title="Plataforma" />
                <Table.Column key="preco_primaria" dataIndex="preco_primaria" title="Primária" />
                <Table.Column key="preco_secundaria" dataIndex="preco_secundaria" title="Secundária" />
                <Table.Column key="sku_primaria" dataIndex="sku_primaria" title="SKU Primária" />
                <Table.Column key="sku_secundaria" dataIndex="sku_secundaria" title="SKU Secundária" />
                <Table.Column key="genero" dataIndex="genero" title="Gênero" />

                <Table.Column
                    title="Ações"
                    render={(_, linha: JogoType) => (
                        <div className="flex gap-2">
                            <Button
                                icon={<BiPencil />}
                                shape="circle"
                                onClick={() => {
                                    formEditar.setFieldsValue({ ...linha });
                                    setModalEditar(true);
                                }}
                            />
                            <Popconfirm
                                title="Aviso"
                                description="Deseja realmente apagar o jogo?"
                                okText="Sim"
                                cancelText="Não"
                                onConfirm={() => deletar(linha.id!)}
                            >
                                <Button icon={<BiTrash />} shape="circle" />
                            </Popconfirm>
                        </div>
                    )}
                />
            </Table>

            <Modal
                title="Novo Jogo"
                open={modalCriar}
                footer={null}
                onCancel={() => setModalCriar(false)}
            >
                <Form layout="vertical" form={formCriar} onFinish={criar}>

                    <Form.Item
                        label="Nome"
                        name="nome"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Plataforma"
                        name="plataforma"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}
                    >
                        <Select
                            options={[
                                {
                                    label: "PS3",
                                    value: "PS3",
                                },
                                {
                                    label: "PS4",
                                    value: "PS4",
                                },
                                {
                                    label: "PS5",
                                    value: "PS5",
                                },
                                {
                                    label: "PS4/PS5",
                                    value: "PS4/PS5",
                                },
                                {
                                    label: "Xbox 360",
                                    value: "Xbox 360",
                                },
                                {
                                    label: "Xbox One / Series",
                                    value: "Xbox One / Series",
                                },
                                {
                                    label: "Xbox Series X|S",
                                    value: "Xbox Series X|S",
                                },
                                {
                                    label: "Nintendo Switch",
                                    value: "Nintendo Switch",
                                },
                            ]}
                        />

                    </Form.Item>
                    <Form.Item label="Gênero" name="genero">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Idioma" name="idioma">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Imagem" name="imagem">
                        <Input />
                    </Form.Item>

                    <Divider titlePlacement="left">Preços Base</Divider>
                    <div className="grid grid-cols-3 gap-4">
                        <Form.Item label="Preço Store" name="preco_store">
                            <InputNumber className="w-full!" min={0} step={0.01} />
                        </Form.Item>

                        <Form.Item label="Preço Promo" name="preco_promo">
                            <InputNumber className="w-full!" min={0} step={0.01} />
                        </Form.Item>

                        <Form.Item label="Preço C1" name="preco_c1">
                            <InputNumber className="w-full!" min={0} step={0.01} />
                        </Form.Item>

                        <Form.Item label="Custo Primária" name="preco_c1">
                            <InputNumber className="w-full!" min={0} step={0.01} />
                        </Form.Item>

                        <Form.Item label="Custo Secundária" name="preco_c1">
                            <InputNumber className="w-full!" min={0} step={0.01} />
                        </Form.Item>

                        <Form.Item label="Data Promo" name="data_promo">
                            <Input type="date" />
                        </Form.Item>

                    </div>
                    <Divider titlePlacement="left">Varejo</Divider>
                    <div className="grid grid-cols-3 gap-4">
                        <Form.Item label="Preço Primária" name="preco_primaria">
                            <InputNumber className="w-full!" min={0} step={0.01} disabled={plataforma == "PS5"} />
                        </Form.Item>

                        <Form.Item label="Preço Primária PS5" name="preco_primaria_ps5">
                            <InputNumber className="w-full!" min={0} step={0.01} disabled={plataforma == "PS3" || plataforma == "Xbox 360" || plataforma == "Xbox One / Series" || plataforma == "Xbox Series X|S" || plataforma == "Nintendo Switch"} />
                        </Form.Item>

                        <Form.Item label="Preço Secundária" name="preco_secundaria">
                            <InputNumber className="w-full!" min={0} step={0.01} disabled={plataforma == "PS3" || plataforma == "Xbox 360" || plataforma == "Xbox One / Series" || plataforma == "Xbox Series X|S"} />
                        </Form.Item>
                    </div>

                    <Divider titlePlacement="left">Revenda</Divider>
                    <div className="grid grid-cols-3 gap-4">
                        <Form.Item label="Primária R1" name="revenda_primaria">
                            <InputNumber className="w-full!" min={0} step={0.01} disabled={plataforma == "PS5"} />
                        </Form.Item>

                        <Form.Item label="Primária PS5 R1" name="revenda_primaria_ps5">
                            <InputNumber className="w-full!" min={0} step={0.01} disabled={plataforma == "PS3" || plataforma == "Xbox 360" || plataforma == "Xbox One / Series" || plataforma == "Xbox Series X|S" || plataforma == "Nintendo Switch"} />
                        </Form.Item>

                        <Form.Item label="Secundária R1" name="revenda_secundaria">
                            <InputNumber className="w-full!" min={0} step={0.01} disabled={plataforma == "PS3" || plataforma == "Xbox 360" || plataforma == "Xbox One / Series" || plataforma == "Xbox Series X|S"} />
                        </Form.Item>

                    </div>

                    <Divider titlePlacement="left">Integração</Divider>
                    <Form.Item label="SKU Primária" name="sku_primaria">
                        <Input />
                    </Form.Item>

                    <Form.Item label="SKU Primária PS5" name="sku_primaria_ps5">
                        <Input />
                    </Form.Item>

                    <Form.Item label="SKU Secundária" name="sku_secundaria">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Observações" name="obs">
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Button type="primary" htmlType="submit">Criar</Button>
                </Form>
            </Modal>

            <Modal
                title="Editar Jogo"
                open={modalEditar}
                footer={null}
                onCancel={() => setModalEditar(false)}
            >
                <Form layout="vertical" onFinish={editar} form={formEditar}>
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Nome"
                        name="nome"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Plataforma"
                        name="plataforma"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Jogos" name="Jogos">
                        <InputNumber className="w-full" min={0} />
                    </Form.Item>

                    <Form.Item label="Licenças" name="licencas">
                        <InputNumber className="w-full" min={0} />
                    </Form.Item>

                    <Form.Item label="Livres" name="livres">
                        <InputNumber className="w-full" min={0} />
                    </Form.Item>

                    <Form.Item label="Preço Primária" name="preco_primaria">
                        <InputNumber className="w-full" min={0} step={0.01} />
                    </Form.Item>

                    <Form.Item label="Preço Primária PS5" name="preco_primaria_ps5">
                        <InputNumber className="w-full" min={0} step={0.01} />
                    </Form.Item>

                    <Form.Item label="Preço Secundária" name="preco_secundaria">
                        <InputNumber className="w-full" min={0} step={0.01} />
                    </Form.Item>

                    <Form.Item label="Revenda Primária" name="revenda_primaria">
                        <InputNumber className="w-full" min={0} step={0.01} />
                    </Form.Item>

                    <Form.Item label="Revenda Primária PS5" name="revenda_primaria_ps5">
                        <InputNumber className="w-full" min={0} step={0.01} />
                    </Form.Item>

                    <Form.Item label="Revenda Secundária" name="revenda_secundaria">
                        <InputNumber className="w-full" min={0} step={0.01} />
                    </Form.Item>

                    <Form.Item label="Preço Store" name="preco_store">
                        <InputNumber className="w-full" min={0} step={0.01} />
                    </Form.Item>

                    <Form.Item label="Preço Promo" name="preco_promo">
                        <InputNumber className="w-full" min={0} step={0.01} />
                    </Form.Item>

                    <Form.Item label="Preço C1" name="preco_c1">
                        <InputNumber className="w-full" min={0} step={0.01} />
                    </Form.Item>

                    <Form.Item label="Imagem" name="imagem">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Data Promo" name="data_promo">
                        <Input type="date" />
                    </Form.Item>

                    <Form.Item label="SKU Primária" name="sku_primaria">
                        <Input />
                    </Form.Item>

                    <Form.Item label="SKU Primária PS5" name="sku_primaria_ps5">
                        <Input />
                    </Form.Item>

                    <Form.Item label="SKU Secundária" name="sku_secundaria">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Gênero" name="genero">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Idioma" name="idioma">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Observações" name="obs">
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Button type="primary" htmlType="submit">Editar</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default Jogos;