import { App, Button, Divider, Form, Input, InputNumber, Modal, Popconfirm, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { type ContaType } from "../hooks/contasHooks";
import { BiPencil, BiTrash } from "react-icons/bi";
import { AXIOS } from "../services";
import type { JogoType } from "../hooks/jogosHooks";


const Contas = () => {
    const [modalCriar, setModalCriar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const { notification } = App.useApp();
    const [contas, setContas] = useState<ContaType[]>([]);
    const [jogos, setJogos] = useState<JogoType[]>([]);
    const [formEditar] = Form.useForm();
    const [formCriar] = Form.useForm();

    async function buscar() {
        const response = await AXIOS.get("/contas");
        setContas(response.data);
    }

    async function buscarJogos() {
        const response = await AXIOS.get("/jogos");
        setJogos(response.data);
    }

    async function criar(dados: ContaType) {
        try {
            dados.fa_codigos = dados.fa_codigos?.replaceAll(" ", " | ")
            dados.senha_dispositivo = dados.senha_dispositivo?.replaceAll(" ", " | ")
            const response = await AXIOS.post("/contas", dados)
                    
            if (response.status == 500) {

                return response;
            }

            notification.success({
                description: response.data.mensagem,
                placement: "bottomRight"
            });
            formCriar.resetFields();
            setModalCriar(false);
            buscar();
        } catch (error:any) {
            console.log("ERROR", {...error})
            notification.error({
                    description: error.response.data.mensagem,
                    placement: "bottomRight"
                });
        }

    }

    async function editar(dados: ContaType) {
        dados.fa_codigos = dados.fa_codigos?.replaceAll(" ", " | ")
        dados.senha_dispositivo = dados.senha_dispositivo?.replaceAll(" ", " | ")
        const response = await AXIOS.put(`/contas/${dados.id}`, dados);
        
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
        const response = await AXIOS.delete(`/contas/${id}`);

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
        buscarJogos();
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
                    form={formCriar}
                >
                    <Divider titlePlacement="left">Dados de Acesso</Divider>
                    <div className="flex gap-4 *:flex-1">
                        <Form.Item label="Jogo ID" name="jogo_id">
                            <Select
                                showSearch={{ optionFilterProp: 'label', }}
                                options={jogos.map(jogo => {
                                    return {
                                        label: `${jogo.nome}(${jogo.plataforma})`,
                                        value: jogo.id
                                    }
                                })}
                            />
                        </Form.Item>
                        <Form.Item label="Conta Pai ID" name="conta_pai_id">
                            <Select
                                showSearch={{ optionFilterProp: 'label', }}
                                options={contas.map(conta => {
                                    return {
                                        label: conta.email,
                                        value: conta.id
                                    }
                                })}
                            />
                        </Form.Item>
                        <Form.Item name="status_conta" hidden>
                            <Input value={"Pendente"} />
                        </Form.Item>
                        <Form.Item label="Store ID" name="store_id">
                            <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                        </Form.Item>
                        <Form.Item label="Códigos 2FA" name="fa_codigos">
                            <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                        </Form.Item>
                    </div>
                    <div className="flex gap-4 *:flex-1">
                        <Form.Item
                            label="E-mail"
                            name="email"
                            rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                            <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" autoComplete="off" />
                        </Form.Item>

                        <Form.Item
                            label="Senha"
                            name="senha"
                            rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                            <Input.Password className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" autoComplete="new-password" />
                        </Form.Item>
                        <Form.Item
                            label="Senha de dispositivo"
                            name="senha_dispositivo"

                        >
                            <Input.Password className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                        </Form.Item>


                        <Form.Item
                            label="Data de Nascimento"
                            name="data_nascimento"
                            rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                            <Input type="date" className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                        </Form.Item>

                    </div>
                    <Divider titlePlacement="left">Dados Complementares</Divider>
                    <div className="flex gap-4 *:flex-1">
                        <Form.Item label="Custo de Aquisição" name="custo_aquisicao">
                            <InputNumber className="w-full!" min={0} step={0.01} />
                        </Form.Item>

                        <Form.Item label="Data de Aquisição" name="data_aquisicao">
                            <Input type="date" className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                        </Form.Item>

                        <Form.Item label="País de Origem" name="pais_origem">
                            <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                        </Form.Item>

                        <Form.Item label="Saldo Disponível" name="saldo_disponivel">
                            <InputNumber className="w-full!" min={0} step={0.01} />
                        </Form.Item>
                    </div>

                    {/* <Divider titlePlacement="left">Dados de Yamp</Divider>
                    <div className="flex gap-4 *:flex-1">
                        

                        <Form.Item label="Referência Externa" name="referencia_externa">
                            <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                        </Form.Item>
                    </div>



                    

                     */}

                    <Button type="primary" htmlType="submit">Criar</Button>
                </Form>
            </Modal>

            <Modal
                title="Editar Conta"
                closable={{ "aria-label": "Custom Close Button" }}
                open={modalEditar}
                footer={null}
                onCancel={() => setModalEditar(false)}
                width={900}
            >
                <Form
                    layout="vertical"
                    onFinish={editar}
                    form={formEditar}
                >
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>

                    <Divider titlePlacement="left">Dados de Acesso</Divider>
                    <div className="flex gap-4 *:flex-1">
                        <Form.Item label="Jogo ID" name="jogo_id">
                            <Select
                                showSearch={{ optionFilterProp: 'label', }}
                                options={jogos.map(jogo => {
                                    return {
                                        label: `${jogo.nome}(${jogo.plataforma})`,
                                        value: jogo.id
                                    }
                                })}
                            />
                        </Form.Item>
                        <Form.Item label="Conta Pai ID" name="conta_pai_id">
                            <Select
                                showSearch={{ optionFilterProp: 'label', }}
                                options={contas.map(conta => {
                                    return {
                                        label: conta.email,
                                        value: conta.id
                                    }
                                })}
                            />
                        </Form.Item>
                        <Form.Item name="status_conta" hidden>
                            <Input value={"Pendente"} />
                        </Form.Item>
                        <Form.Item label="Store ID" name="store_id">
                            <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                        </Form.Item>
                        <Form.Item label="Códigos 2FA" name="fa_codigos">
                            <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                        </Form.Item>
                    </div>
                    <div className="flex gap-4 *:flex-1">
                        <Form.Item
                            label="E-mail"
                            name="email"
                            rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                            <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" autoComplete="off" />
                        </Form.Item>

                        <Form.Item
                            label="Senha"
                            name="senha"
                            rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                            <Input.Password className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" autoComplete="new-password" />
                        </Form.Item>
                        <Form.Item
                            label="Senha de dispositivo"
                            name="senha_dispositivo"

                        >
                            <Input.Password className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                        </Form.Item>


                        <Form.Item
                            label="Data de Nascimento"
                            name="data_nascimento"
                            rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                            <Input type="date" className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                        </Form.Item>

                    </div>
                    <Divider titlePlacement="left">Dados Complementares</Divider>
                    <div className="flex gap-4 *:flex-1">
                        <Form.Item label="Custo de Aquisição" name="custo_aquisicao">
                            <InputNumber className="w-full!" min={0} step={0.01} />
                        </Form.Item>

                        <Form.Item label="Data de Aquisição" name="data_aquisicao">
                            <Input type="date" className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                        </Form.Item>

                        <Form.Item label="País de Origem" name="pais_origem">
                            <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                        </Form.Item>

                        <Form.Item label="Saldo Disponível" name="saldo_disponivel">
                            <InputNumber className="w-full!" min={0} step={0.01} />
                        </Form.Item>
                    </div>

                    <Button type="primary" htmlType="submit">Editar</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default Contas;