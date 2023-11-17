import React, { useContext, useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Icon, Input, Menu, Search } from 'semantic-ui-react';
import { findUser } from "../actions/findUser";
import { getCommentsLikesNotifications } from "../actions/getCommentsLikesNotifications";
import { getCommentsNotifications } from "../actions/getCommentsNotifications";
import { getPostsLikesNotifications } from "../actions/getPostsLikesNotifications";
import { getRepostsNotifications } from "../actions/getRepostsNotifications";
import { getSubscriptionsNotifications } from "../actions/getSubscriptionsNotifications";
import { conf } from "../config";
import AuthContext from "../contexts/AuthContext";
import NotificationsContext from "../contexts/NotificationsContext";

export const Navbar = ({ authenticated, logout }) => {
    const [activeItem, setActiveItem] = useState('');
    const auth = useContext(AuthContext);
    const notifications = useContext(NotificationsContext);
    // const [exist, setExist] = useState();
    // const [visibility, setVisibility] = useState(false);
    // const [user, setUser] = useState();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('');

    useEffect(() => {
        setTimeout(() => {
            if (auth.token && auth.token.length && notifications.notifications.length < 1) {
                (async () => {
                    const comLikesNotif = await getCommentsLikesNotifications(auth.token);
                    const comNotif = await getCommentsNotifications(auth.token);
                    const likesNotif = await getPostsLikesNotifications(auth.token);
                    const repostsNotif = await getRepostsNotifications(auth.token);
                    const subscrNotif = await getSubscriptionsNotifications(auth.token);
                    const n = [...comLikesNotif, ...comNotif, ...likesNotif, ...repostsNotif, ...subscrNotif].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                    if (n.length > 0) {
                        notifications.setNotifications(n);
                        notifications.setNotificationsBadge(true);
                    }
                })();
            }
        }, 1000);
    })

    const navigate = useNavigate();

    let handleItemClick = (e, { name }) => setActiveItem(name);

    const changeSearch = async (event) => {
        setValue(event.target.value);
        setLoading(true);
        const users = await findUser(event.target.value, auth.token);
        setResults(users.map((u) => {
            const photo = u.user_photo == 'noPhotoUser.png' ? `${conf.prefix}/noPhotoUser.png` : `${conf.base_url}/user_photos/${u.user_photo}`;
            return {
                title: u.username,
                image: photo,
                user_id: u.user_id,
            };
        }));
        setLoading(false);
    }

    const resultSelect = (event, data) => {
        setValue('');
        const user = data.result;
        navigate(`${conf.prefix}/profile/${user.user_id}`);
    }

    if (!authenticated) {
        return (
            <Menu>
                <Menu.Item
                    name='registration'
                    active={activeItem === 'registartion'}
                    onClick={() => navigate(`${conf.prefix}/registration`)}
                >
                    Зарегистрироваться
                </Menu.Item>

                <Menu.Item
                    name='login'
                    active={activeItem === 'login'}
                    onClick={() => navigate(`${conf.prefix}/login`)}
                >
                    Войти
                </Menu.Item>
            </Menu>
        )
    }

    return (
        <Menu>
            <Menu.Item
                name='logout'
                active={activeItem === 'logout'}
                onClick={() => { logout(); navigate(`${conf.prefix}/login`) }}
            >
                <Icon style={{ margin: '0' }} name="log out" />
            </Menu.Item>
            <Menu.Item
                name='notifications'
                active={activeItem === 'notifications'}
                onClick={() => navigate(`${conf.prefix}/notifications`)}
            >
                {
                    notifications.notificationBadge ?
                        <Icon.Group>
                            <Icon name="like" />
                            <Icon color="red" name="circle" corner="bottom right" />
                        </Icon.Group>
                        :
                        <Icon style={{ margin: '0' }} name="like" />
                }
            </Menu.Item>

            <Search
                loading={loading}
                value={value}
                results={results}
                onSearchChange={changeSearch}
                onResultSelect={resultSelect}
                className='icon'
                icon='search'
                placeholder='Поиск...'
                style={{ padding: '6px 6px' }}
                size='mini' />
        </Menu>
    )
}