import { BrowserRouter, Route, Routes } from "react-router";
import Pagelayout from "../layouts/Pagelayout";
import Home from "../pages/Home";
import Clientes from "../pages/Clientes";
import Contas from "../pages/Contas";
import Jogos from "../pages/Jogos";
import Licencas from "../pages/Licencas";
import Locacoes from "../pages/Locacoes";

const Rotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Pagelayout />}>
                    <Route index element={<Home />} />
                    <Route path="clientes" element={<Clientes />} />
                    <Route path="contas" element={<Contas />} />
                    <Route path="jogos" element={<Jogos />} />
                    <Route path="licencas" element={<Licencas />} />
                    <Route path="locacoes" element={<Locacoes />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Rotas;