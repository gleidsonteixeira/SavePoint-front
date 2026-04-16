import { App, Button, Form, Input, InputNumber, Modal, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { BiPencil, BiTrash } from "react-icons/bi";
import { type LicencaType } from "../hooks/licencasHooks";

const Licencas = () => {
    const [modalCriar, setModalCriar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const { notification } = App.useApp();
    const [licencas, setLicencas] = useState<LicencaType[]>([]);
    const [formEditar] = Form.useForm();

    async function buscar() {
        const request = await fetch("http://127.0.0.1:8000/api/licencas");
        const response = await request.json();
        setLicencas(response);
    }

    async function criar(dados: LicencaType) {
        const request = await fetch("http://127.0.0.1:8000/api/licencas", {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const response = await request.json();

        if (!request.ok) {
            notification.error({
                description: response.mensagem ?? "Erro ao criar licença.",
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

    async function editar(dados: LicencaType) {
        const request = await fetch(`http://127.0.0.1:8000/api/licencas/${dados.id}`, {
            method: "put",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const response = await request.json();

        if (!request.ok) {
            notification.error({
                description: response.mensagem ?? "Erro ao atualizar licença.",
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
        const request = await fetch(`http://127.0.0.1:8000/api/licencas/${id}`, {
            method: "delete",
            headers: {
                "content-type": "application/json"
            }
        });

        const response = await request.json();

        if (!request.ok) {
            notification.error({
                description: response.mensagem ?? "Erro ao remover licença.",
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
                <h1 className="text-xl font-bold text-azul-total">Licenças</h1>
                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => setModalCriar(true)}
                >
                    Nova Licença
                </Button>
            </div>

            <Table dataSource={licencas} rowKey={"id"} scroll={{ x: "max-content" }}>
                <Table.Column key="id" dataIndex="id" title="Id" />
                <Table.Column key="conta_id" dataIndex="conta_id" title="Conta ID" />
                <Table.Column key="jogo_id" dataIndex="jogo_id" title="Jogo ID" />
                <Table.Column key="tipo_licenca" dataIndex="tipo_licenca" title="Tipo" />
                <Table.Column key="status" dataIndex="status" title="Status" />
                <Table.Column key="otp_licenca" dataIndex="otp_licenca" title="OTP" />

                <Table.Column
                    title="Ações"
                    render={(_, linha: LicencaType) => (
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
                                description="Deseja realmente apagar a licença?"
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
                title="Nova Licença"
                open={modalCriar}
                footer={null}
                onCancel={() => setModalCriar(false)}
            >
                <Form layout="vertical" onFinish={criar}>
                    <Form.Item
                        label="Conta ID"
                        name="conta_id"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}
                    >
                        <InputNumber className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Jogo ID"
                        name="jogo_id"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}
                    >
                        <InputNumber className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Tipo de Licença"
                        name="tipo_licenca"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="OTP Licença" name="otp_licenca">
                        <Input />
                    </Form.Item>

                    <Button type="primary" htmlType="submit">Criar</Button>
                </Form>
            </Modal>

            <Modal
                title="Editar Licença"
                open={modalEditar}
                footer={null}
                onCancel={() => setModalEditar(false)}
            >
                <Form layout="vertical" onFinish={editar} form={formEditar}>
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Conta ID"
                        name="conta_id"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}
                    >
                        <InputNumber className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Jogo ID"
                        name="jogo_id"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}
                    >
                        <InputNumber className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Tipo de Licença"
                        name="tipo_licenca"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="OTP Licença" name="otp_licenca">
                        <Input />
                    </Form.Item>

                    <Button type="primary" htmlType="submit">Editar</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default Licencas;