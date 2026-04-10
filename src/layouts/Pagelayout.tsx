import { Outlet } from "react-router";
import Header from "../components/Header";
import Menu from "../components/Menu";

const Pagelayout = () => {
    return (
        <div>
            <Menu />
            <div>
                <Header />
                <Outlet />

            </div>
        </div>

    );
}

export default Pagelayout;