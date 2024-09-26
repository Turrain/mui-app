import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import authService from '../../../utils/api/auth.service';

const GoogleAuthRedirect = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    
    const token = JSON.parse(params.get('access_token')?.slice(1).replace("'", "").replace("'", "")!)
    useEffect(() => {
        authService.google_login(token);
        if(authService.getAuthUser()) {
            navigate(from, { replace: true });
        }
    }, [navigate, from]);

    return (
        <div>
            Loading...
        </div>
    )
}

export default GoogleAuthRedirect;