import React, { useState} from "react";
import { motion } from 'framer-motion';

interface FormFields {
  email: string;
  password: string;
}

const Login = () => {

    const [isErro, setIsErro] = useState(false);

    const error = () => {
        setIsErro(true);
    };

    const noerror = () => {
        setIsErro(false);
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            y: '-100%'
        },
        visible: {
            opacity: 1,
            y: '0',
            transition: {
            duration: 0.3
            }
        }
    };

    const [fields, setFields] = useState<FormFields>({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState<FormFields>({
        email: "",
        password: ""
    });

    const validateEmail = (email: string) => {
        if (!email) {
            error();
            return "O e-mail inválido.";
        }else{
            return "";
        }
    };

    const validatePassword = (password: string) => {
        if (!password) {
            error();
            return "A senha invalida.";
        }else{
            return "";
        }
    };

    const validateForm = () => {
        let newErrors = {
            email: validateEmail(fields.email),
            password: validatePassword(fields.password)
        };
        setErrors(newErrors);
        return Object.values(newErrors).every((val) => val === "");
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateForm()) {
            // submit do formulário
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFields((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
    <>
        <motion.div        
            initial="hidden"
            animate={isErro ? 'visible' : 'hidden'}
            variants={modalVariants}
            style={{
            position: 'fixed',
            zIndex: 1000,
            top: 5,
            right: 5,
            width: "100%"
            }}
        >
            <div className="error">
                {errors.email && <span>{errors.email}</span>}
                {errors.password && <span>{errors.password}</span>}
            </div>
        </motion.div>
        <div className="body-login">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">E-mail:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={fields.email}
                        onChange={handleInputChange}
                    />            
                </div>
                <div>
                    <label htmlFor="password">Senha:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={fields.password}
                        onChange={handleInputChange}
                    />            
                </div>
                <button type="submit">Entrar</button>
            </form>
        </div>
    </>
    );
};

export default Login;