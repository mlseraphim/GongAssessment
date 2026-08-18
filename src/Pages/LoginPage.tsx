import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../Hooks/AppContext";
import { useApiCaller } from "../Hooks/ApiCallerHook";
import { encode } from "../Infrastructure/Helpers";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAppContext();
    const apiCaller = useApiCaller();
  
    const loginUser = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const userSecret = encode(email, password);

        apiCaller.UserIdGet(userSecret).then(respId => {
            if (respId > 0) {
                apiCaller.UserGet(respId).then(respUser => {
                    if (respUser) {
                        login(respUser, userSecret);
                        
                        navigate('/', { replace: true });
                    }
                });
            }
        });
    };

    return (
        <>
            <form onSubmit={ loginUser }>
                <h1>Please login</h1>

                <div>
                    <label>
                        <span>email address:</span>                        
                        <input type="email" name="email" required />
                    </label>

                    <label>
                        <span>password:</span>                        
                        <input type="password" name="password" required />
                    </label>

                    <button type="submit">Login</button>
                </div>
            </form>
        </>
    );
};

export default LoginPage;