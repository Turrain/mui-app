import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { Route, Routes } from "react-router-dom";
import SignInPage from "./components/pages/SignInPage";
import MainLayout from "./components/layouts/MainLayout";
import DashboardPage from "./components/pages/DashboardPage";
import AuthGuard from "./utils/api/auth.guard";
import Kanban from "./components/kanban/Board";
// import { storesContext } from "./utils/stores";
// import { companyStore } from "./utils/stores/CompanyStore";
// import { soundfileStore } from "./utils/stores/SoundfileStore";
// import { phoneListStore } from "./utils/stores/PhoneListStore";
// import { userStore } from "./utils/stores/UserStore";
import VirtualManagerPage from "./components/pages/VirtualManagerPage";
import CRMPage from "./components/pages/CRMPage";
import ChatsPage from "./components/pages/ChatsPage";
import CallButton from "./components/CallButton";
import { useEffect } from "react";
import { useCompanyStore } from "./utils/stores/CompanyStore";
import { useSoundfileStore } from "./utils/stores/SoundfileStore";
import { usePhoneListStore } from "./utils/stores/PhoneListStore";
import { useUserStore } from "./utils/stores/UserStore";

export default function App() {
    const fetchCompanies = useCompanyStore(state => state.fetchCompanies);
    const fetchSoundfiles = useSoundfileStore(state => state.fetchSoundfiles);
    const fetchPhonesLists = usePhoneListStore(state => state.fetchPhonesLists);
    const fetchUser = useUserStore(state => state.fetchUser);

    useEffect(() => {
        fetchUser();
        fetchCompanies();
        fetchSoundfiles();
        fetchPhonesLists();
    }, [fetchUser, fetchCompanies, fetchSoundfiles, fetchPhonesLists]);

    return (
        <CssVarsProvider disableTransitionOnChange>
            {/* <storesContext.Provider value={{ companyStore, phoneListStore, soundfileStore, userStore }}> */}

            <CssBaseline />
            <Routes>
                <Route element={<MainLayout />}>

                    <Route element={<AuthGuard />}>
                        <Route path='/' element={<DashboardPage />} />
                        <Route path="/virtual-managers" element={<VirtualManagerPage />} />
                        <Route path="/crm" element={<CRMPage />} />
                        <Route path="/kanban" element={<Kanban />} />
                        <Route path="/chats" element={<ChatsPage />} />
                    </Route>


                    <Route path="/login" element={<SignInPage />} />
                </Route>
            </Routes>
            <CallButton />
            {/* </storesContext.Provider> */}
        </CssVarsProvider>
    );
}