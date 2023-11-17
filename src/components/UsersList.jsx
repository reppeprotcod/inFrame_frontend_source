import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Header, Grid, Card, Feed, Image, Loader } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import AuthContext from "../contexts/AuthContext";
import { getSubscribers } from "../actions/getSubscribers";
import { getSubscriptions } from "../actions/getSubscriptions";
import { getUser } from "../actions/getUser";
import { conf } from "../config";

export const UsersList = ({ title = '', subscribers = false, subscriptions = false, likes = false }) => {
    const auth = useContext(AuthContext);
    const params = useParams();
    const userId = params.userId;

    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            if (subscribers) {
                const subscribers = await getSubscribers(userId, auth.token);

                const users = await Promise.all(subscribers.map(async (p, key) => {
                    const p1 = await getUser(p.subscriber_id, auth.token);
                    return {
                        key: key,
                        id: p1.user_id,
                        username: p1.username,
                        photo: p1.user_photo
                    };
                }));
                setUsers(users);
                setLoading(false);
            }
            else if (subscriptions) {
                const subscriptions = await getSubscriptions(userId, auth.token);

                const users = await Promise.all(subscriptions.map(async (p, key) => {
                    const p1 = await getUser(p.user_id, auth.token);
                    return {
                        key: key,
                        id: p1.user_id,
                        username: p1.username,
                        photo: p1.user_photo
                    };
                }));
                setUsers(users);
                setLoading(false);
            }
        })();
    }, [auth.token, subscribers, subscriptions, userId]);

    return (
        <div>
            <Grid centered>
                <Grid.Column className="form-column">
                    <Header style={{ width: '100%', textAlign: 'center' }}>{title}</Header>
                    <Card centered>
                        <Card.Content>
                            <Feed>
                                {
                                    loading ?
                                        <Loader active inline='centered' /> :
                                        (!users || !users.length) ? <p className="center" style={{ color: 'black' }}>нет пользователей</p> :
                                            users.map((user) => {
                                                let photo = `${conf.base_url}/user_photos/${user.photo}`;
                                                if (user.photo == 'noPhotoUser.png') {
                                                    photo = `${conf.prefix}/noPhotoUser.png`;
                                                }
                                                return (
                                                    // <Grid.Row divided key={user.key}>
                                                    <Feed.Event key={user.key}>
                                                        <Feed.Label  > <Image spaced='right' style={{ width: "100%", aspectRatio: 1, objectFit: "cover" }} src={photo} /></Feed.Label>
                                                        {/* <img alt="user_photo" src={`${conf.base_url}/user_photos/${user.photo}`} />  */}

                                                        <Feed.Content>
                                                            <Feed.Summary><NavLink to={`${conf.prefix}/profile/${user.id}`}>{user.username}</NavLink></Feed.Summary>
                                                        </Feed.Content>
                                                    </Feed.Event>
                                                    // </Grid.Row>
                                                )
                                            })
                                }
                            </Feed>
                        </Card.Content>
                    </Card>

                </Grid.Column>
            </Grid>
        </div>
    )
}