import { App, Button, Dropdown, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Tag, type MenuProps } from "antd";
import { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { BiPencil, BiPlus, BiTrash, BiX } from "react-icons/bi";
import { type LicencaType } from "../hooks/licencasHooks";
import { AXIOS } from "../services";
import type { ContaType } from "../hooks/contasHooks";
import type { JogoType } from "../hooks/jogosHooks";


const Licencas = () => {
    const [modalCriar, setModalCriar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const { notification } = App.useApp();
    const [licencas, setLicencas] = useState<LicencaType[]>([]);
    const [formEditar] = Form.useForm();
    const [contas, setContas] = useState<ContaType[]>([]);
    const [jogos, setJogos] = useState<JogoType[]>([]);
    const [formCriar] = Form.useForm();
    const jogo_selecao = Form.useWatch("jogo_id", formCriar);
    const [plataformasEscolhidas, setPlataformasEscolhidas] = useState<string[]>([]);

    const items: MenuProps['items'] = [
        {
            label: "PS3",
            key: '0',
            onClick: () => {
                setPlataformasEscolhidas([...plataformasEscolhidas, "PS3"])
            }
        },
        {
            label: "Primária PS4",
            key: '1',
            onClick: () => {
                setPlataformasEscolhidas([...plataformasEscolhidas, "Primária PS4"])
            }
        },
        {
            label: "Secundária PS4/PS5",
            key: '2',
            onClick: () => {
                setPlataformasEscolhidas([...plataformasEscolhidas, "Secundária PS4/PS5"])
            }
        },
        {
            label: "Primária PS5",
            key: '2',
            onClick: () => {
                setPlataformasEscolhidas([...plataformasEscolhidas, "Primária PS5"])
            }
        },
    ];

    async function buscar() {
        const response = await AXIOS.get("/licencas");
        setLicencas(response.data);
    }

    async function buscarContas() {
        const response = await AXIOS.get("/contas");
        setContas(response.data);
    }

    async function buscarJogos() {
        const response = await AXIOS.get("/jogos");
        setJogos(response.data);
    }

    async function criar(dados: LicencaType) {

        if(plataformasEscolhidas.length == 0){
            notification.error({
                description: "Escolha plataformas",
                placement: "bottomRight"
            });
            return;
        }
        dados.tipo_licenca = plataformasEscolhidas.toString();
        const response = await AXIOS.post("/licencas", dados);

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

    async function editar(dados: LicencaType) {
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
        const response = await AXIOS.delete(`/licencas/${id}`);

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
        buscarContas();
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
                <Form layout="vertical" onFinish={criar} form={formCriar}>
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
                    <Form.Item label="Conta" name="conta_id">
                        <Select
                            showSearch={{ optionFilterProp: 'label', }}
                            options={contas.filter(conta => conta.jogo_id == jogo_selecao).map(conta => {
                                return {
                                    label: conta.email,
                                    value: conta.id
                                }
                            })}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Tipo de Licença"
                        name="tipo_licenca"
                    >
                        <div className="flex gap-2 items-center">
                            <div className="w-full min-h-8 rounded-md border border-black/15 flex flex-wrap items-center px-1 gap-1">
                                {
                                    plataformasEscolhidas.map((plataforma, posicao) => (
                                        <Tag
                                            key={`t-${posicao}`}
                                            className={"flex! gap-1! items-center! cursor-pointer"}
                                            color={"#2b3895"}
                                            onClick={() => {
                                                setPlataformasEscolhidas(plataformasEscolhidas.filter((p, i) => i != posicao));
                                            }}
                                        >
                                            {plataforma} <BiX size={16} />
                                        </Tag>
                                    ))
                                }
                            </div>
                            <Dropdown menu={{ items }} trigger={['click']}>
                                <Button type="primary" onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        Escolher
                                        <BiPlus />
                                    </Space>
                                </Button>
                            </Dropdown>
                        </div>
                        {/* <Select
                            mode="multiple"
                            options={[
                                {
                                    label: "PS3",
                                    value: "PS3",
                                },
                                {
                                    label: "Primária PS4",
                                    value: "Primária PS4",
                                },
                                {
                                    label: "Secundária PS4/PS5",
                                    value: "Secundária PS4/PS5",
                                },
                                {
                                    label: "Primária PS5",
                                    value: "Primária PS5",
                                },
                                {
                                    label: "Secundária PS5",
                                    value: "Secundária PS5",
                                },
                                {
                                    label: "Xbox 360",
                                    value: "Xbox 360",
                                },
                                {
                                    label: "Primária",
                                    value: "Primária",
                                },
                                {
                                    label: "Secundária",
                                    value: "Secundária",
                                },

                            ]}
                        /> */}

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