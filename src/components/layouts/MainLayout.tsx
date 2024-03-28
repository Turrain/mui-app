import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div>
            {/* <AuthStatus /> */}

            {/* <ul>
                <li>
                    <Link to="/">Public Page</Link>
                </li>
                <li>
                    <Link to="/protected">Protected Page</Link>
                </li>
            </ul> */}

            <Outlet />
        </div>
    );
}
export default MainLayout;