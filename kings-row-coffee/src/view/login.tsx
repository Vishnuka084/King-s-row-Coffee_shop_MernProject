import Input from "../components/input/input.tsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import * as validator from '../util/validator.ts'
import toast, {Toaster} from 'react-hot-toast'
import axios from "axios";
// @ts-ignore
import Cookies from "js-cookie"

interface Props {
    setIsLogged: (log: boolean) => void;
}

const Login = (props: Props): JSX.Element => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [loginState, setLoginState] = useState(true)

    const login = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        let data = JSON.stringify({
            email: email,
            password: password
        })
        console.log(data)

        await axios.post('http://localhost:8080/user/auth', data, config)
            .then(res => {
                Cookies.set('token', res.data.data.accessToken, { expires: 7 })
                Cookies.set('user', JSON.stringify(res.data.data.user), { expires: 7 })
                props.setIsLogged(true)
                navigate('/');
                console.log(res)
            });
    }

    const handleLogin = () => {
        toast.promise(
            login(),
            {
                loading: 'Login',
                success: <b>{'Login successful'}</b>,
                error: (err) => <b>{err.response.data.message}</b>,
            }
        );
    }

    const handleInput = (e: any, type: string): void => {

        switch (type) {
            case 'Email':
                setEmail(e.target.value)
                break;
            case 'First name':
                setFName(e.target.value)
                break;
                case 'Last name':
                setLName(e.target.value)
                break;
            case 'Password':
                setPassword(e.target.value)
                break;
                case 'Confirm Password':
                setConfirmPass(e.target.value)
                break;
        }
    }

    const handleValidate = (): void => {

        if (email === '' || password === '') {
            return;
        }
        if (!validator.validateEmail(email)) {
            toast.error("Invalid Email.");
            return;
        }
        if (!validator.validatePassword(password)) {
            toast.error("Invalid Password.");
            return;
        }
        handleLogin();
    }

    const handleUpdateValidate = (): void => {

        if (!validator.validateEmail(email)) {
            toast.error("Invalid Email.");
            return;
        }
        if (!validator.validateName(fName)) {
            toast.error("Invalid first name.");
            return;
        }
        if (!validator.validateName(lName)) {
            toast.error("Invalid last name.");
            return;
        }
        if (!validator.validatePassword(password)) {
            toast.error("Invalid Password.");
            return;
        }
        if (password !== confirmPass) {
            toast.error("Password don't match.");
            return;
        }
        signUp();
    }

    const signUp = () => {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        let data = JSON.stringify({
            fname:fName,
            lname:lName,
            email:email,
            password:password
        })

        axios.post('http://localhost:8080/user', data, config )
            .then(res => {
                toast.success(res.data.message);
                Cookies.set('token', res.data.data.accessToken, { expires: 7 })
                Cookies.set('user', JSON.stringify(res.data.data.user), { expires: 7 })
                props.setIsLogged(true)
                navigate('/');
            })
            .catch(err => {
                toast.error(err.response.data.message);
            });
    }

    const selectOption = () => {
        setLoginState(!loginState);
        clear();
    }

    const clear = () => {
        setEmail('');
        setPassword('');
        setFName('');
        setLName('');
        setConfirmPass('');
    }
    return (
        <section
            className={'row w-full h-[100vh]'}>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className={'col-md-8 bg-[#FFA16C] bg-opacity-50 flex items-center justify-content-center'}>
                <img src="src/assets/9462908_35973-removebg-preview.png" alt="login image" className={'w-80'}/>
            </div>
            <div className={'col-md-4 bg-white px-[85px] '}>
                {
                    loginState ?
                        <div className={'py-[130px]'}>
                            <div>
                                <h1 className={'font-pop m-0 text-[1.6rem] font-[500] text-gray-700 my-1'}>
                                    Welcome to King's Row System</h1>
                                <h1 className={'font-round mt-4 text-[13px] font-[400] text-gray-400'}>Please log in to your
                                    account</h1>
                                <div className={'pl-2 pr-4 py-3'}>

                                    <Input
                                        value={email}
                                        id={1}
                                        type={'email'}
                                        name={'Email'}
                                        placeholder={"example@gmail.com"}
                                        callBack={handleInput}/>

                                    <Input
                                        value={password}
                                        id={2}
                                        type={'password'}
                                        name={'Password'}
                                        placeholder={".........."}
                                        callBack={handleInput}/>
                                </div>
                            </div>
                            <button
                                className={'transition-all duration-200 hover:shadow-[0_10px_20px_rgba(255,_161,_108,_0.4)] w-full py-[10px] font-round text-sm bg-[#ffa16c] text-white rounded-lg active:bg-[#fe7439] '}
                                onClick={() => handleValidate()}>
                                Log in
                            </button>
                            <div className={'py-8 flex flex-col'}>
                                <div className={'w-full flex items-center justify-center'}>
                                    <hr className={'w-full border-gray-400'}></hr>
                                    <span className={'text-sm font-round text-gray-500 px-2 pb-1'}>or</span>
                                    <hr className={'w-full border-gray-400'}></hr>
                                </div>
                                <div className={'w-full flex items-center text-sm  justify-center'}>
                                    <h1 className={'mt-2 font-round text-gray-400 cursor-default '}>New on our platform ?
                                        <span onClick={selectOption} className={'ml-1 cursor-pointer text-[#ffa16c] active:text-red-500'}> Create an account </span>
                                    </h1>
                                </div>
                            </div>
                        </div>
                        :
                        <div>
                            <div className={'pt-[90px]'}>
                                <h1 className={'font-pop m-0 text-[1.6rem] font-[500] text-gray-700 my-1'}>
                                    Welcome to King's Row System</h1>
                                <h1 className={'font-round mt-4 text-[13px] font-[400] text-gray-400'}>Please Sign up in here</h1>
                                <div className={'pl-2 pr-4 py-3'}>

                                    <Input
                                        value={email}
                                        id={1}
                                        type={'email'}
                                        name={'Email'}
                                        placeholder={"example@gmail.com"}
                                        callBack={handleInput}/>
                                    <div className={'row'}>
                                        <div className={'col-md-6 pr-4'}>
                                            <Input
                                                value={fName}
                                                id={2}
                                                type={'text'}
                                                name={'First name'}
                                                placeholder={"example@gmail.com"}
                                                callBack={handleInput}/>
                                        </div>
                                        <div className={'col-md-6 pl-4'}>
                                            <Input
                                                value={lName}
                                                id={3}
                                                type={'text'}
                                                name={'Last name'}
                                                placeholder={"example@gmail.com"}
                                                callBack={handleInput}/>
                                        </div>
                                    </div>
                                    <Input
                                        value={password}
                                        id={4}
                                        type={'password'}
                                        name={'Password'}
                                        placeholder={".........."}
                                        callBack={handleInput}/>
                                    <Input
                                        value={confirmPass}
                                        id={5}
                                        type={'password'}
                                        name={'Confirm Password'}
                                        placeholder={".........."}
                                        callBack={handleInput}/>
                                </div>
                            </div>
                            <button
                                className={'transition-all duration-200 hover:shadow-[0_10px_20px_rgba(255,_161,_108,_0.4)] w-full py-[10px] font-round text-sm bg-[#ffa16c] text-white rounded-lg active:bg-[#fe7439] '}
                                onClick={() => handleUpdateValidate()}>
                                Sign up
                            </button>
                            <div className={'py-8 flex flex-col'}>
                                <div className={'w-full flex items-center justify-center'}>
                                    <hr className={'w-full border-gray-400'}></hr>
                                    <span className={'text-sm font-round text-gray-500 px-2 pb-1'}>or</span>
                                    <hr className={'w-full border-gray-400'}></hr>
                                </div>
                                <div className={'w-full flex items-center text-sm  justify-center'}>
                                    <h1 className={'mt-2 font-round text-gray-400 cursor-default '}>Already have an account ?
                                        <span onClick={selectOption} className={'ml-1 cursor-pointer text-[#ffa16c] active:text-red-500'}>Sign in your account </span>
                                    </h1>
                                </div>
                            </div>
                        </div>
                }
            </div>
        </section>
    );
}
export default Login;
