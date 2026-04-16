import { App, Button, Form, Input, InputNumber, Modal, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { BiPencil, BiTrash } from "react-icons/bi";
import { type LocacaoType } from "../hooks/locacoesHooks";

const Locacoes = () => {
    const [modalCriar, setModalCriar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const { notification } = App.useApp();
    const [locacoes, setLocacoes] = useState<LocacaoType[]>([]);
    const [formEditar] = Form.useForm();

    async function buscar() {
        const request = await fetch("http://127.0.0.1:8000/api/alugueis");
        const response = await request.json();
        setLocacoes(response);
    }

    async function criar(dados: LocacaoType) {
        const request = await fetch("http://127.0.0.1:8000/api/alugueis", {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const response = await request.json();

        if (!request.ok) {
            notification.error({
                description: response.mensagem ?? "Erro ao criar locação.",
                placement: "bottomRight"
            });
            return;
        }

        notification.success({
            description: response.mensagem,
            placement: "bottomRight"
        });

        setModalCriar(false);
        buscar();
    }

    async function editar(dados: LocacaoType) {
        const request = await fetch(`http://127.0.0.1:8000/api/alugueis/${dados.id}`, {
            method: "put",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const response = await request.json();

        if (!request.ok) {
            notification.error({
                description: response.mensagem ?? "Erro ao atualizar locação.",
                placement: "bottomRight"
            });
            return;
        }

        notification.success({
            description: response.mensagem,
            placement: "bottomRight"
        });

        setModalEditar(false);
        buscar();
    }

    async function deletar(id: number) {
        const request = await fetch(`http://127.0.0.1:8000/api/alugueis/${id}`, {
            method: "delete",
            headers: {
                "content-type": "application/json"
            }
        });

        const response = await request.json();

        if (!request.ok) {
            notification.error({
                description: response.mensagem ?? "Erro ao remover locação.",
                placement: "bottomRight"
            });
            return;
        }

        notification.success({
            description: response.mensagem,
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
                <h1 className="text-xl font-bold text-azul-total">Locações</h1>
                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => setModalCriar(true)}
                >
                    Nova Locação
                </Button>
            </div>

            <Table dataSource={locacoes} rowKey={"id"} scroll={{ x: "max-content" }}>
                <Table.Column key="id" dataIndex="id" title="Id" />
                <Table.Column key="cliente_id" dataIndex="cliente_id" title="Cliente ID" />
                <Table.Column key="licenca_id" dataIndex="licenca_id" title="Licença ID" />
                <Table.Column key="data_inicio" dataIndex="data_inicio" title="Início" />
                <Table.Column key="data_fim" dataIndex="data_fim" title="Fim" />
                <Table.Column key="valor_pago" dataIndex="valor_pago" title="Valor Pago" />
                <Table.Column key="origem" dataIndex="origem" title="Origem" />
                <Table.Column key="referencia_externa" dataIndex="referencia_externa" title="Referência" />
                <Table.Column key="yampi_id" dataIndex="yampi_id" title="Yampi ID" />

                <Table.Column
                    title="Ações"
                    render={(_, linha: LocacaoType) => (
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
                                description="Deseja realmente apagar a locação?"
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
                title="Nova Locação"
                open={modalCriar}
                footer={null}
                onCancel={() => setModalCriar(false)}
            >
                <Form layout="vertical" onFinish={criar}>
                    <Form.Item
                        label="Cliente ID"
                        name="cliente_id"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}
                    >
                        <InputNumber className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Licença ID"
                        name="licenca_id"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}
                    >
                        <InputNumber className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Data Início"
                        name="data_inicio"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Data Fim" name="data_fim">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Referência Externa" name="referencia_externa">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Valor Pago" name="valor_pago">
                        <InputNumber className="w-full" min={0} step={0.01} />
                    </Form.Item>

                    <Form.Item label="Origem" name="origem">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Yampi ID" name="yampi_id">
                        <InputNumber className="w-full" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit">Criar</Button>
                </Form>
            </Modal>

            <Modal
                title="Editar Locação"
                open={modalEditar}
                footer={null}
                onCancel={() => setModalEditar(false)}
            >
                <Form layout="vertical" onFinish={editar} form={formEditar}>
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Cliente ID"
                        name="cliente_id"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}
                    >
                        <InputNumber className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Licença ID"
                        name="licenca_id"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}
                    >
                        <InputNumber className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Data Início"
                        name="data_inicio"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Data Fim" name="data_fim">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Referência Externa" name="referencia_externa">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Valor Pago" name="valor_pago">
                        <InputNumber className="w-full" min={0} step={0.01} />
                    </Form.Item>

                    <Form.Item label="Origem" name="origem">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Yampi ID" name="yampi_id">
                        <InputNumber className="w-full" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit">Editar</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default Locacoes;