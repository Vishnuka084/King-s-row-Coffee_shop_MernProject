import {GrUpload} from "react-icons/gr";
import Input from "../../input/input.tsx";
import {forwardRef, useImperativeHandle, useRef, useState} from "react";
import * as validator from "../../../util/validator.ts";
import axios from "axios";
// @ts-ignore
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";


interface Data {
    _id: string;
    name: string;
    email: string;
    address: string;
    age: number;
    contact: string;
    image: string;
}

interface Props {
    onLoadAction: () => void;
    onSetEmployee: (Employee: Data) => void;
    showTosty: (title: string, message: string) => void;
}

const AddEmployee = forwardRef((props: Props, ref): JSX.Element => {

    const [oldImage, setOldImage] = useState<File | string | any>('');
    const [image, setImage] = useState<any>('');
    const fileInputRef = useRef<any>();
    // const [errorSate, setErrorSate] = useState([false, false, false, false, false]);
    const [id, setId] = useState<string | null>(null);
    const [name, setName] = useState<string>('');
    const [mail, setMail] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [age, setAge] = useState<number | string>('');
    const [contact, setContact] = useState<string>('');
    const [employeeState, setEmployeeState] = useState<'Save' | 'Update'>("Save");
    const navigate = useNavigate();


    useImperativeHandle(ref, () => {
        return {
            setEmployee: (employee: Data) => {
                setEmployeeState("Update");
                setId(employee._id);
                setName(employee.name);
                setMail(employee.email);
                setAddress(employee.address);
                setAge(employee.age);
                setContact(employee.contact);
                setOldImage(`http://localhost:8080/images/${employee.image}`);
                setImage('')
            },
        };
    });

    // Function to trigger click on file input
    const handleClick = (): void => {
        // @ts-ignore
        fileInputRef?.current?.click();
    };
    const handleFileChange = (event: any) => {
        setOldImage('')
        setImage(event.target.files[0]);
    };

    const getToken = (): string | null => {
        const token = Cookies.get('token');
        if (!token) {
            Swal.fire({
                title: "Login expire !",
                text: "Please log in to continue!",
                showCancelButton: false,
                confirmButtonText: "OK!",
                customClass: {
                    title: 'swal-title',
                    popup: 'swal-popup',
                    confirmButton: 'swal-confirm',
                    cancelButton: 'swal-cancel'
                }
            });
            navigate('/login');
            return null;
        } else {
            return token;
        }
    }

    const handleInput = (e: any, type: string): void => {

        switch (type) {
            case "Name":
                setName(e.target.value);
                break;
            case "Email":
                setMail(e.target.value);
                break;
            case "Address":
                setAddress(e.target.value);
                break;
            case "Age":
                setAge(e.target.value);
                break;
            case "Contact":
                setContact(e.target.value);
                break;
        }
    }

    const clearAll = () => {

        setName('');
        setMail('');
        setAddress('');
        setAge('');
        setContact('');
        setOldImage('')
        setImage('')
        setId(null);
        setEmployeeState('Save')
    }

    const handleEmployee = () => {

        if (employeeState === "Update") {
            if (handleValidation()) {
                handleUpdateEmployee();
            }
        } else {
            if (handleValidation()) {
                handleAddEmployee();
            }
        }
    }

    const handleValidation = (): boolean => {

        if (!validator.validateName(name)) {
            props.showTosty('Warning', 'Name cannot be empty')
            return false;
        }

        if (!validator.validateEmail(mail)) {
            props.showTosty('Warning', 'Invalid email or cannot be empty')
            return false;
        }

        if (!validator.validateAddress(address)) {
            props.showTosty('Warning', 'Invalid address or cannot be empty')
            return false;
        }

        if (!validator.validateAge(+age)) {
            props.showTosty('Warning', 'Invalid age or cannot be empty')
            return false;
        }

        if (!validator.validateContact(contact)) {
            props.showTosty('Warning', 'Invalid contact or cannot be empty')
            return false;
        }
        return true;
    }

    const handleUpdateEmployee = () => {

        const token = getToken();
        if (token === null)
            return;

        if (image) {
            const config = {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data',
                }
            };
            let data = JSON.stringify({
                _id: id,
                name: name,
                email: mail,
                address: address,
                age: age,
                contact: contact
            });

            const formData = new FormData();

            // @ts-ignore
            formData.append('file', image);
            formData.append('employee', data);

            axios.put('http://localhost:8080/employee', formData, config)
                .then(res => {
                    clearAll();
                    props.onLoadAction();
                    props.showTosty('Success', res.data.message);
                })
                .catch(err => {
                    console.log(err)
                    props.showTosty('Error', err.response.data.message);
                });
        } else {
            const config = {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                }
            };

            let data = JSON.stringify({
                _id: id,
                name: name,
                email: mail,
                address: address,
                age: age,
                contact: contact
            });
            axios.put('http://localhost:8080/employee/withoutImage', data, config)
                .then(res => {
                    clearAll();
                    props.onLoadAction();
                    props.showTosty('Success', res.data.message);
                })
                .catch(err => {
                    console.log(err)
                    props.showTosty('Error', err.response.data.message);
                });
        }
    }

    const handleAddEmployee = () => {

        if (image === null || image === '') {
            props.showTosty('Warning', 'Image cannot be empty')
            return;
        }

        const token = getToken();
        if (token === null)
            return;

        const config = {
            headers: {
                'Authorization': token,
                'Content-Type': 'multipart/form-data',
            }
        };

        let empData = JSON.stringify({
            name: name,
            email: mail,
            address: address,
            age: age,
            contact: contact
        });

        const formData = new FormData();

        console.log(image)
        // @ts-ignore
        formData.append('file', image);
        formData.append('employee', empData);

        console.log(formData.get('file'))

        axios.post('http://localhost:8080/employee', formData, config)
            .then(res => {
                clearAll();
                props.onLoadAction();
                props.showTosty('Success', res.data.message);

            })
            .catch(err => {
                console.log(err)
                props.showTosty('Error', err.response.data.message);
            });
    }

    return (
        <section>
            <div className={'w-full h-[20vh] bg-[#ffcaa9] py-4 px-14'}>
                {
                    image || oldImage ? <img src={oldImage ? oldImage : URL.createObjectURL(image)} alt="profile"
                                             onClick={handleClick}
                                             className={'cursor-pointer w-full h-full rounded-xl object-cover'}/>

                        : <div className={'cursor-pointer w-full h-full rounded-xl border-dashed border-2 ' +
                            'border-white flex justify-center items-center flex-col text-white'}
                               onClick={handleClick}>
                            <h1 className={'font-round text-sm my-2'}>Upload profile</h1>
                            <GrUpload className={'text-2xl'}/></div>
                }

                <input type={"file"} className={'hidden'} ref={fileInputRef} onChange={handleFileChange}/>
            </div>
            <div className={'px-8 pt-[10px]'}>
                <Input id={0}
                       value={name}
                       type={'text'}
                       name={'Name'}
                       placeholder={'Ryen rod'}
                       callBack={handleInput}/>
                <Input id={1}
                       value={mail}
                       type={'email'}
                       name={'Email'}
                       placeholder={'example@gnail,com'}
                       callBack={handleInput}/>
                <Input
                    id={2}
                    value={address}
                    type={'text'}
                    name={'Address'}
                    placeholder={'No .15 Colombo'}
                    callBack={handleInput}/>
                <div className={'row'}>
                    <div className={'col-md-4'}>
                        <Input id={3} value={age} type={'number'} name={'Age'} placeholder={'25'}
                               callBack={handleInput}/>
                    </div>
                    <div className={'col-md-8 pl-5'}>
                        <Input id={4} value={contact} type={'tel'} name={'Contact'} placeholder={'phone number'}
                               callBack={handleInput}/>
                    </div>
                </div>
                <div className={'w-full flex items-center justify-content-evenly py-4 font-cde text-[13px]'}>
                    <button
                        onClick={() => clearAll()}
                        className={`py-2 w-28 transition-all duration-200 hover: active:text-white active:bg-gray-700 hover:bg-gray-300 bg-gray-200 text-gray-500 rounded`}>Dismiss
                        All
                    </button>
                    <button
                        onClick={handleEmployee}
                        className={`py-2 w-28 transition-all duration-200 bg-[#454545] rounded hover:bg-[#2c2c2c] hover:text-white text-white active:bg-[#fc4f13]`}>{employeeState}
                    </button>
                </div>
            </div>
        </section>
    );
});

export default AddEmployee;
