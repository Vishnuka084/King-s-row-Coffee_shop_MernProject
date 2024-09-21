import Swal from "sweetalert2";
import axios from "axios";
import {useSpring, animated} from "@react-spring/web";
import {useRef, useState} from "react";
import {Edit, Trash} from "react-feather";
import {FiMoreVertical} from "react-icons/fi";
// @ts-ignore
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";

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
    _id: string;
    name: string;
    email: string;
    address: string;
    age: number;
    contact: string;
    image: string;
    setEmployee:(employee: Data) => void;
    handleOnLoad: () => void;
    showTosty: (title: string, message: string) => void;
}


const EmployeeCard = (props: Props): JSX.Element => {

    const [openOption, setOpenOption] = useState(false);
    const iconRef = useRef<any>();
    const navigate = useNavigate();

    const handleGetEmployeeById = (_id: string): void => {

        Swal.fire({
            title: "Are you sure?",
            text: "Are you sure do you to Edit this Employee!",
            showCancelButton: true,
            confirmButtonText: "Yes, edit it!",
            cancelButtonText: "No, cancel it!",
            customClass: {
                title: 'swal-title',
                popup: 'swal-popup',
                confirmButton: 'swal-update',
                cancelButton: 'swal-cancel'
            }
        }).then((result) => {
            if (result.isConfirmed) {

                /*const config = {
                    headers: {
                        'Authorization': Cookies.get('token')
                    }
                };*/
                axios.get(`http://localhost:8080/employee/getById/${_id}`)
                    .then(response => {
                        props.setEmployee(response.data.data);
                    })
                    .catch(err => {
                        props.showTosty('Error', err.response.data.message);
                        console.log(err)
                    });
            }
        });
    }

    const handleDeleteEmployee = (_id: string): void => {

        const token = getToken();
        if (token === null)
            return;

        Swal.fire({
            title: "Are you sure?",
            text: "Are you sure do you to delete this Employee !",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, saved it!",
            customClass: {
                title: 'swal-title',
                popup: 'swal-popup',
                confirmButton: 'swal-confirm',
                cancelButton: 'swal-cancel'
            }
        }).then((result) => {
            if (result.isConfirmed) {

                const config = {
                    headers: {
                        'Authorization': token
                    }
                };
                axios.delete(`http://localhost:8080/employee/${_id}`, config)

                    .then(res => {
                        props.showTosty('Success', "Deleted successful");
                        props.handleOnLoad();
                        console.log(res)
                    })
                    .catch(err => {
                        console.log(err)
                        props.showTosty('Error', err.response.data);
                        console.log(err.response.data)
                    });
            }
        });
    }

    const styles = useSpring({
        from: {
            opacity: 0
        },
        to: {
            opacity: 1
        }
    });

    const getToken = ():string|null => {
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
        }else {
            return token;
        }
    }

    const handleWindowClick = (e: any): void => {
        if (openOption) {
            // @ts-ignore
            if (iconRef.current && !iconRef.current.contains(e.target)) {
                setOpenOption(false);
            }
        }
    }
    window.addEventListener('click', handleWindowClick);

    return (
        <animated.div style={styles}
                      className={'w-full relative rounded-[5px] flex bg-white text-[13px] font-[500] items-center h-16 px-5 py-2 border-b-[1px] border-gray-200 cursor-default'}>
            <div className={'flex h-full items-center'}>
                <img src={props.image} alt="profile"
                     className={'w-11 h-11 rounded-full object-cover mr-3'}/>
            </div>
            <div className={''}>
                <h1 className={'mx-2 text-[#ffa16c] text-[15px] '}>{props.name}</h1>
                <div className={'font-normal flex text-gray-400 text-[12px]'}>
                    <h3 className={'mx-2'}>{props.email}</h3>
                    <h3 className={'mx-2'}>{props.address}</h3>
                    <h3 className={'mx-2'}>{props.age}</h3>
                    <h3 className={'mx-2'}>{props.contact}</h3>
                </div>
            </div>
            <div className={'absolute right-4 '}>
                <div ref={iconRef} className={'w-12'}><FiMoreVertical
                    onClick={() => setOpenOption(!openOption)}
                    className={`text-sm text-gray-500 cursor-pointer active:bg-gray-100 rounded-full w-6 h-6 px-1`}/>
                </div>
                <div
                    className={`${openOption ? 'z-[500] opacity-1' : 'z-[-10] opacity-0'} transition-transform duration-700  flex-col text-gray-600 font-[300] font-Robot text-[13px] shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] w-32 rounded-md absolute right-[30px] py-2 top-6 flex items-center border-[1px] border-gray-200 bg-white`}>
                    <span onClick={() => handleGetEmployeeById(props._id)}
                        className={'w-full active:bg-blue-500 active:text-white py-2.5 pl-8  flex items-center gap-2 justify-start hover:bg-[#FFA16C] hover:bg-opacity-10 hover:text-[#fe7439] hover:cursor-pointer'}>
                    <Edit className='text-lg' size={16}/> <span className='align-middle pt-1'>Edit</span>
                </span>
                    <span onClick={() => handleDeleteEmployee(props._id)}
                        className={'w-full active:bg-red-500 active:text-white py-2.5 pl-8 flex items-center gap-2 justify-start hover:bg-[#FFA16C] hover:bg-opacity-10 hover:text-[#fe7439] hover:cursor-pointer'}>
                    <Trash className='text-lg' size={16}/> <span className='align-middle pt-1'>Delete</span>
                </span>
                </div>
            </div>
        </animated.div>
    );
}

export default EmployeeCard;
