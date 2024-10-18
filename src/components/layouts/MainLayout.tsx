import { Outlet } from "react-router-dom";
import Toast from "../Toast";
import { useToastStore } from "../../utils/stores/ToastStore";

const MainLayout = (() => {
    return (
        <div>
            <Outlet />
            <Toast
                open={useToastStore().open}
                color={useToastStore().color}
                text={useToastStore().message}
                onClose={() => useToastStore().close()}
            />
        </div>
    );
});

export default MainLayout;

