import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import { NavLink, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../Store';

import "./Navbar.css";
function Navigationbar() {

    const dispatch = useDispatch();
    const history = useHistory();
    const handlelogout = () => {
        console.log("logged out");
        dispatch(authActions.setUser(""))
        dispatch(authActions.setToken(""))
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        history.push('/');
    }

    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);

    return (
        <>
            <nav className="navbar">
                <div className="nav-container">
                    <NavLink exact to="/" className="nav-logo">
                        Mail box client
                    </NavLink>

                    <ul className={click ? "nav-menu active" : "nav-menu"}>
                        <li className="nav-item">
                            <NavLink exact to="/" activeClassName="active" className="nav-links" onClick={handleClick}>
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink exact to="/composemail" activeClassName="active" className="nav-links" onClick={handleClick}>
                                Compose
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink exact to="/inbox" activeClassName="active" className="nav-links" onClick={handleClick}>
                                Inbox
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink exact to="/sent" activeClassName="active" className="nav-links" onClick={handleClick}>
                                Sent
                            </NavLink>
                        </li>
                        <li className="">
                            <Button variant="primary" className='nav-link-btn' onClick={handlelogout} >
                                Logout
                            </Button>
                        </li>

                    </ul>
                    <div className="nav-icon" onClick={handleClick}>
                        <i className={click ? "fas fa-times" : "fas fa-bars"}></i>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navigationbar