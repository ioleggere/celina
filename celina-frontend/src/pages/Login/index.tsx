import { useContext, useState } from 'react'
import './index.scss'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/Auth/AuthContext';
interface LoginState {
    username: string;
    password: string;
    usertoken: string;
}

const initialLoginState: LoginState = {
    username: "",
    password: "",
    usertoken: ""
}

function Login() {
    const [loginState, setLoginState] = useState<LoginState>(initialLoginState);
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const setUsername = (username: string) => {
        setLoginState((prevState) => ({ ...prevState, username }));
    };

    const setPassword = (password: string) => {
        setLoginState((prevState) => ({ ...prevState, password }));
    };

    const setuserToken = (usertoken: string) => {
        setLoginState((prevState) => ({ ...prevState, usertoken }));
    };

    const performLogin = async () => {
        if (!loginState.usertoken) {
            if (!loginState.username || !loginState.password) {
                setLoginState((prevState) => ({ ...prevState, errorLogin: true, messageErrorLogin: "Fill in all fields" }));
                return;
            }
        }

        if (loginState.usertoken) {
            try {
                const isLogged = await auth.signintoken(loginState.usertoken);
                if (isLogged) {
                    navigate('/Lobby');
                } else {
                    throw new Error("Authentication failed");
                }
            } catch (error) {
                alert("Authentication failed. Please try again. Error: " + error);
            }
        } else {
            try {
                const isLogged = await auth.signin(loginState.username, loginState.password);
                if (isLogged) {
                    navigate('/Lobby');
                } else {
                    throw new Error("Authentication failed");
                }
            } catch (error) {
                alert("Authentication failed. Please try again. Error: " + error);
            }
        }


    };

    const performRegister = async () => {
        navigate('/Register')
    };
    return (
        <div className='page-login'>
            <div className='header'>
                <img src='celina png.png' alt='celinaimg' className='celina' />
                <img src='logo.png' alt='logocelinaimg' className='logocelina' />
            </div>

            <div className='login-container'>

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="login-input-group">
                        <label htmlFor="username">Nome de Usuário</label>
                        <input
                            type="text"
                            id="username"
                            value={loginState.username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="login-input"
                        />
                    </div>
                    <div className="login-input-group">
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={loginState.password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                        />
                    </div>
                    <>Ou</>
                    <div className="login-input-group">
                        <label htmlFor="text">Token access</label>
                        <input
                            type="text"
                            id="token"
                            value={loginState.usertoken}
                            onChange={(e) => setuserToken(e.target.value)}
                            className="login-input"
                        />
                    </div>
                    <div className="login-actions">
                        <button type="button" className="login-button" onClick={performLogin}>
                            Login
                        </button>
                        <button type="button" className="register-button" onClick={performRegister}>
                            Register
                        </button>
                    </div>
                </form>

            </div>

        </div>
    )
}

export default Login