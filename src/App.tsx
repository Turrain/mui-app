import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { Route, Routes } from "react-router-dom";
import SignInPage from "./components/pages/SignInPage";
import MainLayout from "./components/layouts/MainLayout";
import DashboardPage from "./components/pages/DashboardPage";
import AuthGuard from "./utils/api/auth.guard";
import { storesContext } from "./utils/stores";
import { companyStore } from "./utils/stores/CompanyStore";
import { soundfileStore } from "./utils/stores/SoundfileStore";
import { phoneListStore } from "./utils/stores/PhoneListStore";
import { userStore } from "./utils/stores/UserStore";
export default function App() {
    return (
        <CssVarsProvider disableTransitionOnChange>
            <storesContext.Provider value={{ companyStore, phoneListStore, soundfileStore, userStore }}>

                <CssBaseline />
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route element={<AuthGuard />}>
                            <Route path='/' element={<DashboardPage />} />
                        </Route>

                        <Route path="/login" element={<SignInPage />} />
                    </Route>
                </Routes>
            </storesContext.Provider>
        </CssVarsProvider>
    );
}