import { BrowserRouter, Route, Routes } from "react-router";
import Pagelayout from "../layouts/Pagelayout";
import Home from "../pages/Home";
import Clientes from "../pages/Clientes";

const Rotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Pagelayout />}>
                    <Route index element={<Home />} />
                    <Route path="clientes" element={<Clientes />} />
                </Route>
            </Routes>
        </BrowserRouter>

    );
}

export default Rotas;