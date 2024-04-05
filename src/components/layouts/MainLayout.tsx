import { Outlet } from "react-router-dom";
import Toast from "../Toast";
import { toastStore } from "../../utils/stores/ToastStore";
import { observer } from "mobx-react";

const MainLayout = observer(() => {
    return (
        <div>
            <Outlet />
            <Toast
                open={toastStore.open}
                color={toastStore.color}
                text={toastStore.message}
                onClose={() => toastStore.close()}
            />
        </div>
    );
});

export default MainLayout;

