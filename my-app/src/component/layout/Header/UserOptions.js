import React, { useState } from 'react'
import './Header.css';
import { SpeedDial, SpeedDialAction } from '@material-ui/lab';
import Backdrop from '@material-ui/core/Backdrop';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Dashboard from '@material-ui/icons/Dashboard';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { logout } from '../../../actions/userAction';
import { useDispatch } from 'react-redux';

const UserOptions = ({ user }) => {

    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const alert = useAlert();
    const dispatch = useDispatch();

    const options = [
        { icon: <ListAltIcon />, name: 'Orders', func: orders },
        { icon: <PersonIcon />, name: 'Profile', func: account },
        { icon: <ExitToAppIcon />, name: 'Logout', func: logoutUser },
    ];

    if(user.role === 'admin') {
        options.unshift({ icon: <DashboardIcon />, name: 'Dashboard', func: dashboard })
    }

    function dashboard() {
        navigate('/dashboard');
    }

    function orders() {
        navigate('/orders');
    }

    function account() {
        navigate('/account');
    }

    function logoutUser() {
        dispatch(logout());
        alert.success('Logout Successfully');
    }

    return (
        <>
        <Backdrop open={open} style={{ zIndex: '10' }} />
        <SpeedDial
        ariaLabel='SpeedDial tooltip example'
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        style={{ zIndex: '11' }}
        open={open}
        direction='down'
        className='speedDial'
        icon={<img className='speedDialIcon' src={user.avatar.url ? user.avatar.url : '/Profile.png'} alt='Profile'/>}>

        {
            options.map((item) => (
                <SpeedDialAction key={item.name} icon={item.icon} tooltipTitle={item.name} onClick={item.func} />
            ))
        }

        </SpeedDial>
        </>
    )
}

export default UserOptions