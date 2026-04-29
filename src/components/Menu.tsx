import { NavLink } from "react-router";
import logo from '../assets/logo-savepoint.png';

const Menu = () => {
    return (
        <div className="w-62.5 h-screen bg-azul-total">
            <img src={logo} alt="Logo" className="w-40 m-auto" />
            <nav className="flex flex-col gap-2 p-4 leading-10 *:text-white! *:hover:bg-azul-total/15! :duration-150!:rounded :pl-2:text-azul-total! :[&.active]:bg-azul-total!:[&.active]:text-white! *:font-semibold">
                <NavLink end to="/">Home</NavLink>
                <NavLink end to="/clientes">Clientes</NavLink>
                <NavLink end to="/contas">Contas</NavLink>
                <NavLink end to="/jogos">Jogos</NavLink>
                <NavLink end to="/licencas">Licenças</NavLink>
                <NavLink end to="/locacoes">Locações</NavLink>
            </nav>
        </div>
    );
}

export default Menu;