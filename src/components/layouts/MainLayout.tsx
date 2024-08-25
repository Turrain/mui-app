import { Outlet } from "react-router-dom";
import Toast from "../Toast";
// import { toastStore } from "../../utils/stores/ToastStore";
// import { observer } from "mobx-react";
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

