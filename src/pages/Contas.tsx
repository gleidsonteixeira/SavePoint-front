import { App, Button, Divider, Form, Input, InputNumber, Modal, Popconfirm, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { type ContaType } from "../hooks/contasHooks";
import { BiPencil, BiTrash } from "react-icons/bi";

const Contas = () => {
    const [modalCriar, setModalCriar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const { notification } = App.useApp();
    const [contas, setContas] = useState<ContaType[]>([]);
    const [formEditar] = Form.useForm();

    async function buscar() {
        const request = await fetch("http://127.0.0.1:8000/api/contas");
        const response = await request.json();
        setContas(response);
    }

    async function criar(dados: ContaType) {
        const request = await fetch("http://127.0.0.1:8000/api/contas", {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const response = await request.json();

        if (request.status === 500) {
            notification.error({
                description: response.mensagem,
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

    async function editar(dados: ContaType) {
        const request = await fetch(`http://127.0.0.1:8000/api/contas/${dados.id}`, {
            method: "put",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const response = await request.json();

        if (request.status === 500) {
            notification.error({
                description: response.mensagem,
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
        const request = await fetch(`http://127.0.0.1:8000/api/contas/${id}`, {
            method: "delete",
            headers: {
                "content-type": "application/json"
            }
        });

        const response = await request.json();

        if (request.status === 500) {
            notification.error({
                description: response.mensagem,
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
                <h1 className="text-xl font-bold text-azul-total">Contas</h1>
                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => setModalCriar(true)}
                >
                    Nova Conta
                </Button>
            </div>

            <Table
                dataSource={contas}
                rowKey={"id"}
                scroll={{ x: "max-content" }}
            >
                <Table.Column
                    key={"id"}
                    dataIndex={"id"}
                    title={"Id"}
                />
                <Table.Column
                    key={"email"}
                    dataIndex={"email"}
                    title={"E-mail"}
                />
                <Table.Column
                    key={"store_id"}
                    dataIndex={"store_id"}
                    title={"Store ID"}
                />
                <Table.Column
                    key={"conta_pai_id"}
                    dataIndex={"conta_pai_id"}
                    title={"Conta Pai"}
                />
                <Table.Column
                    key={"ultimo_acesso"}
                    dataIndex={"ultimo_acesso"}
                    title={"Último Acesso"}
                />
                <Table.Column
                    key={"pais_origem"}
                    dataIndex={"pais_origem"}
                    title={"País"}
                />
                <Table.Column
                    key={"saldo_disponivel"}
                    dataIndex={"saldo_disponivel"}
                    title={"Saldo"}
                />
                <Table.Column
                    title={"Ações"}
                    render={(_, linha: ContaType) => (
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
                                description="Deseja realmente apagar a conta?"
                                okText="Sim"
                                cancelText="Não"
                                onConfirm={() => deletar(linha.id!)}
                            >
                                <Button
                                    icon={<BiTrash />}
                                    shape="circle"
                                />
                            </Popconfirm>
                        </div>
                    )}
                />
            </Table>

            <Modal
                title="Nova Conta"
                closable={{ "aria-label": "Custom Close Button" }}
                open={modalCriar}
                footer={null}
                onCancel={() => setModalCriar(false)}
                width={900}
            >
                <Form
                    layout="vertical"
                    onFinish={criar}
                >
                    <Form.Item label="Conta Pai ID" name="conta_pai_id">
                        <Select 
                            showSearch={{optionFilterProp: 'label',}}
                            options={contas.map(conta => {
                                return {
                                    label: conta.email,
                                    value: conta.id
                                }
                            })}
                        />
                    </Form.Item>
                    <Divider titlePlacement="left">Dados de Acesso</Divider>
                    <div className="flex gap-4 *:flex-1">
                        <Form.Item
                            label="E-mail"
                            name="email"
                            rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                            <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                        </Form.Item>

                        <Form.Item
                            label="Senha"
                            name="senha"
                            rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                            <Input.Password className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                        </Form.Item>

                        <Form.Item label="Códigos FA" name="fa_codigos">
                            <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                        </Form.Item>

                        <Form.Item label="Último Acesso" name="ultimo_acesso">
                            <Input type="date" className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                        </Form.Item>
                    </div>
                    <Divider titlePlacement="left">Dados de Yamp</Divider>
                    <div className="flex gap-4 *:flex-1">
                        <Form.Item label="Store ID" name="store_id">
                            <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                        </Form.Item>

                        <Form.Item label="Referência Externa" name="referencia_externa">
                            <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                        </Form.Item>
                    </div>



                    <Form.Item label="Data de Nascimento" name="data_nascimento">
                        <Input type="date" className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                    </Form.Item>

                    <Form.Item label="Custo de Aquisição" name="custo_aquisicao">
                        <InputNumber className="w-full" min={0} step={0.01} />
                    </Form.Item>

                    <Form.Item label="Data de Aquisição" name="data_aquisicao">
                        <Input type="date" className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                    </Form.Item>

                    <Form.Item label="País de Origem" name="pais_origem">
                        <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                    </Form.Item>

                    <Form.Item label="Saldo Disponível" name="saldo_disponivel">
                        <InputNumber className="w-full" min={0} step={0.01} />
                    </Form.Item>

                    <Button type="primary" htmlType="submit">Criar</Button>
                </Form>
            </Modal>

            <Modal
                title="Editar Conta"
                closable={{ "aria-label": "Custom Close Button" }}
                open={modalEditar}
                footer={null}
                onCancel={() => setModalEditar(false)}
            >
                <Form
                    layout="vertical"
                    onFinish={editar}
                    form={formEditar}
                >
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="E-mail"
                        name="email"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}
                    >
                        <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                    </Form.Item>

                    <Form.Item
                        label="Senha"
                        name="senha"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}
                    >
                        <Input.Password className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                    </Form.Item>

                    <Form.Item label="Códigos FA" name="fa_codigos">
                        <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                    </Form.Item>

                    <Form.Item label="Store ID" name="store_id">
                        <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                    </Form.Item>

                    <Form.Item label="Conta Pai ID" name="conta_pai_id">
                        <InputNumber className="w-full" />
                    </Form.Item>

                    <Form.Item label="Último Acesso" name="ultimo_acesso">
                        <Input type="date" className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                    </Form.Item>

                    <Form.Item label="Referência Externa" name="referencia_externa">
                        <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                    </Form.Item>

                    <Form.Item label="Data de Nascimento" name="data_nascimento">
                        <Input type="date" className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                    </Form.Item>

                    <Form.Item label="Custo de Aquisição" name="custo_aquisicao">
                        <InputNumber className="w-full" min={0} step={0.01} />
                    </Form.Item>

                    <Form.Item label="Data de Aquisição" name="data_aquisicao">
                        <Input type="date" className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                    </Form.Item>

                    <Form.Item label="País de Origem" name="pais_origem">
                        <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                    </Form.Item>

                    <Form.Item label="Saldo Disponível" name="saldo_disponivel">
                        <InputNumber className="w-full" min={0} step={0.01} />
                    </Form.Item>

                    <Button type="primary" htmlType="submit">Editar</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default Contas;