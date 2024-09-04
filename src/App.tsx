import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { Route, Routes } from "react-router-dom";
import SignInPage from "./components/pages/SignInPage";
import MainLayout from "./components/layouts/MainLayout";
import DashboardPage from "./components/pages/DashboardPage";
import AuthGuard from "./utils/api/auth.guard";
import Kanban from "./components/kanban/Board";
import { storesContext } from "./utils/stores";
import { useCompanyStore } from "./utils/stores/CompanyStore";
import { useSoundfileStore } from "./utils/stores/SoundfileStore";
import { usePhoneListStore } from "./utils/stores/PhoneListStore";
import { useUserStore } from "./utils/stores/UserStore";
import VirtualManagerPage from "./components/pages/VirtualManagerPage";
import CRMPage from "./components/pages/CRMPage";
import ChatsPage from "./components/pages/ChatsPage";
import CallButton from "./components/CallButton";

export default function App() {
    return (
        <CssVarsProvider disableTransitionOnChange>
            <storesContext.Provider value={{ useCompanyStore, usePhoneListStore, useSoundfileStore, useUserStore }}>

                <CssBaseline />
                <Routes>
                    <Route element={<MainLayout />}>

                        {/* <Route element={<AuthGuard />}> */}
                            <Route path='/' element={<DashboardPage />} />
                            <Route path="/virtual-managers" element={<VirtualManagerPage />} />
                            <Route path="/crm" element={<CRMPage />} />
                            <Route path="/kanban" element={<Kanban />} />
                            <Route path="/chats" element={<ChatsPage />} />
                        {/* </Route> */}


                        <Route path="/login" element={<SignInPage />} />
                    </Route>
                </Routes>
            </storesContext.Provider>
            <CallButton />
        </CssVarsProvider>
    );
}