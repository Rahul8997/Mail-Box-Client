import React, { useRef, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useHttp from '../Hooks/use-http';
import { authActions } from '../Store';


const Login = () => {
    const [login, setLogin] = useState(false);
    const enteredMail = useRef();
    const enteredPassword = useRef();
    const enteredConfirmPassword = useRef();
    const authSignUpReq = useHttp();
    const authLoginReq = useHttp();

    let dispatch = useDispatch();
    const history = useHistory();
    const toggleLogin = () => {
        setLogin(!login);
    }

    const afterSignUP = (data) => {
        // console.log("User has successfully signed up")
        alert(`User has successfully signed up`)
        // console.log(data)
        dispatch(authActions.setToken(data.idToken));
        dispatch(authActions.setUser(enteredMail.current.value));
        localStorage.setItem("token", data.idToken)
        localStorage.setItem("user", enteredMail.current.value)
        history.push('/inbox')
    }
    const afterLogin = (data) => {
        // console.log(data.idToken);
        dispatch(authActions.setToken(data.idToken));
        dispatch(authActions.setUser(enteredMail.current.value));
        localStorage.setItem("token", data.idToken)
        // console.log("User has successfully Log in")
        alert(`User has successfully logged in`)
        localStorage.setItem("user", enteredMail.current.value)
        history.push('/inbox')
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!login) {
            if (enteredMail.current.value.length > 0 && enteredPassword.current.value.length > 0 && enteredConfirmPassword.current.value.length > 0) {
                if (enteredPassword.current.value !== enteredConfirmPassword.current.value) {
                    alert("password and confirmPasswors not matching")
                } else {
                    authSignUpReq(
                        {
                            url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_AUTH_API_KEY}`,
                            method: "POST",
                            body: {
                                "email": enteredMail.current.value,
                                "password": enteredPassword.current.value,
                                "returnSecureToken": true
                            }
                        },
                        afterSignUP
                    );
                }
            } else {
                alert("please fill all the data")
            }
        } else {
            if (enteredMail.current.value.length > 0 && enteredPassword.current.value.length > 0) {
                authLoginReq(
                    {
                        url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_AUTH_API_KEY}`,
                        method: "POST",
                        body: {
                            "email": enteredMail.current.value,
                            "password": enteredPassword.current.value,
                            "returnSecureToken": true
                        }
                    },
                    afterLogin
                );
            } else {
                alert("please fill all the data")
            }
        }
    }
    return (
        <div className='row my-3'>
            <div className='col-lg-3 col-md-6 col-sm-8 col-11 mx-auto'>
                <Form className='my-auto mx-auto bg-light p-3 rounded border border-1'>
                    <h4 className='text-center py-4'>{!login ? "Sign Up" : "Log In"}</h4>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control type="email" placeholder="Email" ref={enteredMail} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="Password" ref={enteredPassword} />
                    </Form.Group>
                    {!login && <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                        <Form.Control type="password" placeholder="Confirm Password" ref={enteredConfirmPassword} />
                    </Form.Group>}
                    <Button variant="primary" className='w-100' type="submit" onClick={handleLogin}>
                        {!login ? "Sign Up" : "Log In"}
                    </Button>
                    {/* {login && <p className='text-center text-primary'>Forget password?</p>} */}
                    <Button variant="outline-success" className='my-2 w-100' onClick={toggleLogin}>
                        {!login ? "Have an account?Login" : "Haven't Account?Sign Up"}
                    </Button>
                </Form>
            </div>
        </div>
    )
}

export default Login
