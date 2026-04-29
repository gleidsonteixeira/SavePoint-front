import { App, Button, Form, Input, Modal, Popconfirm, Table } from "antd";
import { MaskedInput } from "antd-mask-input";
import { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { type ClienteType } from "../hooks/clienteHooks";
import { BiPencil, BiTrash } from "react-icons/bi";

const Clientes = () => {

    const [modalCriar, setModalCriar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [cpfCriar, setCpfCriar] = useState("");
    const [whatsappCriar, setWhatsappCriar] = useState("");
    const { notification } = App.useApp();
    const [clientes, setClientes] = useState<ClienteType[]>([]);
    const [formEditar] = Form.useForm()
    // const { data: clientes = [] } = useBuscarClientes();
    // const { mutate: criarCliente } = useCriarCliente();

    async function buscar() {
        const request = await fetch("http://www.axiepsx.com/api/clientes")
        const response = await request.json()
        setClientes(response)
    }
    async function criar(dados: ClienteType) {
        const request = await fetch("http://www.axiepsx.com/api/clientes", {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(dados)
        })
        const response = await request.json()
        if (request.status == 500) {
            notification.error({
                description: response.mensagem,
                placement: "bottomRight"

            })
            return
        }
        notification.success({
            description: response.mensagem,
            placement: "bottomRight"

        })
        setModalCriar(false)
        buscar()
        // criarCliente(dados, {
        //     onSuccess: (resposta) => {
        //         notification.success({
        //             description: resposta.message
        //         })
        //     }
        // })
    }
    async function editar(dados: ClienteType){
        const request = await fetch(`http://www.axiepsx.com/api/clientes/${dados.id}`, {
            method: "put",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(dados)
        })
        const response = await request.json()
        if (request.status == 500) {
            notification.error({
                description: response.mensagem,
                placement: "bottomRight"

            })
            return
        }
        notification.success({
            description: response.mensagem,
            placement: "bottomRight"

        })
        setModalEditar(false)
        buscar()
    }
    async function deletar(id: string){
        const request = await fetch(`http://www.axiepsx.com/api/clientes/${id}`, {
            method: "delete",
            headers: {
                "content-type": "application/json"
            },
                })
        const response = await request.json()
        if (request.status == 500) {
            notification.error({
                description: response.mensagem,
                placement: "bottomRight"

            })
            return
        }
        notification.success({
            description: response.mensagem,
            placement: "bottomRight"

        })
        
        buscar()
    }
    useEffect(() => {
        buscar()
    }, [])
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-azul-total">Clientes</h1>
                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => setModalCriar(true)}
                >
                    Novo Cliente
                </Button>
            </div>

            <Table
                dataSource={clientes}
                rowKey={"id"}
            >
                <Table.Column
                    key={"id"}
                    dataIndex={"id"}
                    title={"Id"}
                />
                <Table.Column
                    key={"nome"}
                    dataIndex={"nome"}
                    title={"Nome"}
                />
                <Table.Column
                    key={"email"}
                    dataIndex={"email"}
                    title={"E-mail"}
                />
                <Table.Column
                    key={"cpf"}
                    dataIndex={"cpf"}
                    title={"CPF"}
                />
                <Table.Column
                    key={"whatsapp"}
                    dataIndex={"whatsapp"}
                    title={"Whatsapp"}
                />
                <Table.Column

                    title={"Ações"}
                    render={(_, linha) => (
                        <div>
                            <Button
                                icon={
                                    <BiPencil />
                                }
                                shape="circle" 
                                onClick={()=>{
                                    formEditar.setFieldsValue({...linha})
                                    setModalEditar(true)
                                }}
                                />
                            <Popconfirm
                                title="Aviso"
                                description="Deseja realmente apagar o cliente?"
                                okText="Sim"
                                cancelText="Não"
                                onConfirm={(()=>deletar(linha.id))}

                            >
                                 <Button
                                icon={
                                    <BiTrash />
                                }
                                shape="circle" />
                            </Popconfirm>
                           
                        </div>
                    )}
                />
            </Table>


            <Modal
                title="Novo Cliente"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={modalCriar}
                footer={null}
                onCancel={() => setModalCriar(false)}
            >
                <Form
                    layout="vertical"
                    onFinish={criar}
                >
                    <Form.Item
                        label="Nome"
                        name="nome"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}>
                        <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}>
                        <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                    </Form.Item>
                    <Form.Item
                        label="CPF"
                        name="cpf"
                    >
                        <MaskedInput
                            mask="000.000.000-00"
                            className="w-full p-2 border border-gray-300 hover:border-azul-total! focus:border-azul-total! rounded"
                            value={cpfCriar}
                            onChange={(e) => setCpfCriar(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Whatsapp"
                        name="whatsapp"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}>
                        <MaskedInput
                            mask="(00) 00000-0000"
                            className="w-full p-2 border border-gray-300 hover:border-azul-total! focus:border-azul-total! rounded"
                            value={whatsappCriar}
                            onChange={(e) => setWhatsappCriar(e.target.value)}
                        />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Criar</Button>
                </Form>

            </Modal>
            <Modal
                title="Editar Cliente"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={modalEditar}
                footer={null}
                onCancel={() => setModalEditar(false)}
            >
                <Form
                    layout="vertical"
                    onFinish={editar}
                    form = {formEditar}
                >
                    <Form.Item
                        name = "id"
                        hidden

                    >

                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Nome"
                        name="nome"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}>
                        <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}>
                        <Input className="w-full p-2 border border-gray-300 focus:outline-azul-total! rounded" />
                    </Form.Item>
                    <Form.Item
                        label="CPF"
                        name="cpf"
                    >
                        <MaskedInput
                            mask="000.000.000-00"
                            className="w-full p-2 border border-gray-300 hover:border-azul-total! focus:border-azul-total! rounded"
                            value={cpfCriar}
                            onChange={(e) => setCpfCriar(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Whatsapp"
                        name="whatsapp"
                        rules={[{ required: true, message: "Campo Obrigatório" }]}>
                        <MaskedInput
                            mask="(00) 00000-0000"
                            className="w-full p-2 border border-gray-300 hover:border-azul-total! focus:border-azul-total! rounded"
                            value={whatsappCriar}
                            onChange={(e) => setWhatsappCriar(e.target.value)}
                        />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Editar</Button>
                </Form>

            </Modal>
        </div>
    );
}

export default Clientes;