import { useRef, useState, useEffect } from 'react'
import './LoginSignup.css'
import Loader from '../../Layout/Loader/Loader.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { LockOpen } from '@material-ui/icons';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import FaceIcon from '@material-ui/icons/Face';

import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, login, register } from '../../actions/userAction.js';
import { loadUser } from '../../actions/userAction.js';

const LoginSignup = () => {
    

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch])

    const loginTab = useRef(null);
    const registerTab = useRef(null);
    const switcherTab = useRef(null);


    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { name, email, password } = user;

    const [avatar, setAvatar] = useState();
    const [avatarPreview, setAvatarPreview] = useState('/Profile.png');

    const { error, loading, isAuthenticated } = useSelector(state => state.user)


    const loginSubmit = (e) => {
        e.preventDefault();

        dispatch(login(loginEmail, loginPassword))
    }

    const registerSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set('name', name);
        myForm.set('email', email);
        myForm.set('password', password);
        myForm.set('avatar', avatar);

        dispatch(register(myForm));
    }

    const registerDataChange = (e) => {
        if(e.target.name === 'avatar') {
            const reader = new FileReader();

            reader.onload = () => {
                if(reader.readyState === 2) { // 2 means done
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            }

            reader.readAsDataURL(e.target.files[0]);
        }

        else {
            setUser({
                ...user,
                [e.target.name]: e.target.value,
            });
            console.log(user)
        }
    }

    const navigate = useNavigate();

    useEffect(() => {
        if(error) {
            dispatch(clearErrors());
        }

        if(isAuthenticated) {
            navigate('/account');
        }
    }, [dispatch, error, isAuthenticated, navigate])

    const switchTabs = (e, tab) => {
        if(tab === 'login') {
            switcherTab.current.classList.add('shiftToNeutral'); // changes to original position
            switcherTab.current.classList.remove('shiftToRight'); 

            registerTab.current.classList.remove('shiftToNeutralForm');
            loginTab.current.classList.remove('shiftToLeft');
        }

        if(tab === 'register') {
            switcherTab.current.classList.add('shiftToRight'); 
            switcherTab.current.classList.remove('shiftToNeutral'); 

            registerTab.current.classList.add("shiftToNeutralForm");
            loginTab.current.classList.add('shiftToLeft');
        }
    }

    return (
        <>
            {loading? <Loader /> :
            <>
            <div className='LoginSignupContainer'>
                <div className='LoginSignupBox'>
                    <div>
                        <div className='login_signUp_toggle'>
                            <p onClick={(e) => switchTabs(e, 'login')}>Login</p>
                            <p onClick={(e) => switchTabs(e, 'register')}>Register</p>
                        </div>
                        <button ref={switcherTab}></button>
                    </div>
                    <form className='loginForm' ref={loginTab} onSubmit={loginSubmit}>
                        <div className='loginEmail'>
                            <MailOutlineIcon />
                            <input 
                                type='email'
                                placeholder='Email'
                                required
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)} />
                        </div>

                        <div className='loginPassword'>
                            <LockOpen />
                            <input 
                            type='password'
                            placeholder='Password'
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)} />
                        </div>
                        
                        <Link to='/password/forgot'>Forgot Password ?</Link>
                        <input type='submit' value='Login' className='loginBtn' />
                    </form>


                    <form className='signUpForm' ref={registerTab} encType='multipart/form-data' onSubmit={registerSubmit}>
                        <div className='signupName'>
                            <FaceIcon />
                            <input 
                                type='text'
                                placeholder='Name'
                                required
                                name='name'
                                value={name}
                                onChange={registerDataChange} />
                        </div>

                        <div className='signupEmail'>
                            <MailOutlineIcon />
                            <input 
                                type='email'
                                placeholder='Email'
                                required
                                name='email'
                                value={email}
                                onChange={registerDataChange} />
                        </div>

                        <div className='signupPassword'>
                            <LockOpen />
                            <input 
                            type='password'
                            placeholder='Password'
                            required
                            name='password'
                            value={password}
                            onChange={registerDataChange} />
                        </div>

                        <div id='registerImage'>
                            <img src={avatarPreview} alt='Avatar Preview' />
                            <input 
                            type='file'
                            name='avatar'
                            accept='image/*'
                            onChange={registerDataChange} />
                        </div>
                        <input
                            type='submit'
                            value='Register'
                            className='signUpBtn' 
                            // disabled={loading ? true:false}
                        />
                    </form>
                </div>
            </div>
        </>}
        </>
    )
}

export default LoginSignup