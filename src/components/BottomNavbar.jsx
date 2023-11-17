import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Icon, Image } from 'semantic-ui-react';
import { conf } from "../config";
import AuthContext from "../contexts/AuthContext";

export const BottomNavbar = () => {
    const [activeItem, setActiveItem] = useState('');
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const parseJWT = (token) => {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    const userId = (parseJWT(auth.token)).id;

    let handleItemClick = (e, { name }) => setActiveItem(name);

    return (
        <Menu className="bottom-menu" compact>
            <Menu.Item
                name='feed'
                active={activeItem === 'feed'}
                onClick={() => navigate(`${conf.prefix}/`)}
            >
                <Icon style={{ margin: '0' }} name="home" />
            </Menu.Item>

            <Menu.Item
                name='loadPhoto'
                active={activeItem === 'loadPhoto'}
                onClick={() => navigate(`${conf.prefix}/createPost`)}
            >
                <Icon style={{ margin: '0' }} name="plus" />
            </Menu.Item>

            <Menu.Item
                name='profile'
                active={activeItem === 'profile'}
                onClick={() => {
                    const userProfileUrl = `${conf.prefix}/profile/${userId}`;
                    navigate(userProfileUrl);
                }}
            >
                <Icon style={{ margin: '0' }} name="user" />
            </Menu.Item>
        </Menu>
    )
}