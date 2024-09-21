import {useEffect, useRef, useState} from "react";
// @ts-ignore
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";


const Header = (): JSX.Element => {

    const navigate = useNavigate();
    const hasFetchedData = useRef(false);
    const [userName, setUserName] = useState('Jonedo Rod');
    const [userEmail, setUserEmail] = useState('jonereo@info.com');

    useEffect(() => {
        if (hasFetchedData.current) return;
        hasFetchedData.current = true;
        getProfileData();
    }, []);

    const getProfileData = async () => {
        const user = await Cookies.get('user');
        if (!user){
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
        }else {
            const userJson = JSON.parse(user);
            setUserName(`${userJson.fname} ${userJson.lname}`);
            setUserEmail(userJson.email);
        }
    }

    return (
        <header className={'w-full h-[70px] flex items-center justify-end col-md-12 bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg'}>
            <div className={'text-end font-cde'}>
                <h3 className={'text-[15px] text-gray-700'}>{userName}</h3>
                <h3 className={'text-[13px] text-gray-400'}>{userEmail}</h3>
            </div>
            <div className={'relative'}>
                <img src="src/assets/NicePng_cammy-png_1829287.png" alt="prfile" title={'profile'}
                     className={'w-10 border-[1px] border-gray-500 rounded-full object-cover mr-4 ml-2 cursor-pointer'}/>
                <span className={'absolute w-3 rounded-full aspect-square bg-green-500 bottom-0 right-3'}></span>
            </div>
        </header>
    );
}

export default Header;
