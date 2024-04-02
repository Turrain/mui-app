import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { Route, Routes } from "react-router-dom";
import SignInPage from "./components/pages/SignInPage";
import MainLayout from "./components/layouts/MainLayout";
import DashboardPage from "./components/pages/DashboardPage";
import AuthGuard from "./utils/api/auth.guard";

export default function App() {
    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Routes>
                <Route element={<MainLayout />}>
                    <Route element={<AuthGuard />}>
                        <Route path='/' element={<DashboardPage />} />
                    </Route>

                    <Route path="/login" element={<SignInPage />} />
                </Route>
            </Routes>
        </CssVarsProvider>
    );
}