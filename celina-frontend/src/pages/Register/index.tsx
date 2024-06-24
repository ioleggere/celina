import { useContext, useState } from 'react'
import './index.scss'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/Auth/AuthContext';
interface RegisterState {
    name: string;
    username: string;
    password: string;
    email: string;
}

const initialRegisterState: RegisterState = {
    name: "",
    username: "",
    password: "",
    email: ""
}

function Login() {
    const [registerState, setRegisterState] = useState<RegisterState>(initialRegisterState);
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const setUsername = (username: string) => {
        setRegisterState((prevState) => ({ ...prevState, username }));
    };

    const setPassword = (password: string) => {
        setRegisterState((prevState) => ({ ...prevState, password }));
    };

    const setName = (name: string) => {
        setRegisterState((prevState) => ({ ...prevState, name }));
    };

    const setEmail = (email: string) => {
        setRegisterState((prevState) => ({ ...prevState, email }));
    };



    const performRegister = async () => {
        if (!registerState.username || !registerState.password || !registerState.name || !registerState.password) {
            setRegisterState((prevState) => ({ ...prevState, errorLogin: true, messageErrorLogin: "Fill in all fields" }));
            return;
        }

        try {
            const user = {
                username: registerState.username,
                email: registerState.email,
                password: registerState.password,
                name: registerState.name,
            }
            const isRegistered = await auth.register(user);
            if (isRegistered) {
                navigate('/Login');
            } else {
                throw new Error("Registration failed");
            }
        } catch (error) {
            alert("Registration failed. Please try again. Error: " + error);
        }



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
                            value={registerState.username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="login-input"
                        />
                    </div>
                    <div className="login-input-group">
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={registerState.password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                        />
                    </div>
                    <div className="login-input-group">
                        <label htmlFor="password">Nome</label>
                        <input
                            type="text"
                            id="name"
                            value={registerState.name}
                            onChange={(e) => setName(e.target.value)}
                            className="login-input"
                        />
                    </div>
                    <div className="login-input-group">
                        <label htmlFor="password">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={registerState.email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="login-input"
                        />
                    </div>
                    <div className="login-actions">
                        <button type="button" className="register-button" onClick={performRegister}>
                            Registrar
                        </button>
                    </div>
                </form>

            </div>

        </div>
    )
}

export default Login