import React, { useContext, useEffect, useState } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { Button, Grid, Icon, Form, Loader } from "semantic-ui-react";
import { addSubscription } from "../actions/addSubscription";
import { changeUserPhoto } from "../actions/changeUserPhoto";
import { deleteSubscription } from "../actions/deleteSubscription";
import { getNotificationRequest } from "../actions/getNotificationRequest";
import { getPost } from "../actions/getPost";
import { getPosts } from "../actions/getPosts";
import { getReposts } from "../actions/getReposts";
import { getSubscribers } from "../actions/getSubscribers";
import { getSubscription } from "../actions/getSubscription";
import { getSubscriptions } from "../actions/getSubscriptions";
import { getUserPhoto } from "../actions/getUserPhoto";
import { getUserSettings } from "../actions/getUserSettings";
import { isAdmin } from "../actions/isAdmin";
import { conf } from "../config";
import AuthContext from "../contexts/AuthContext";
import { BottomNavbar } from "./BottomNavbar";
import { PostPreview } from "./PostPreview";

export const UserProfile = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [posts, setPosts] = useState()
    const [visibility, setVisibility] = useState('none');
    const [isVisible, setIsVisible] = useState(false);
    const [isSubscription, setIsSubscription] = useState();
    const [subscrRequest, setSubscrRequest] = useState();
    const [showPosts, setShowPosts] = useState();

    const [userPhoto, setUserPhoto] = useState();
    const [tempUserPhoto, setTempUserPhoto] = useState();
    const [form, setForm] = useState(new FormData());

    const [subscribersCount, setSubscribersCount] = useState();
    const [subscriptionsCount, setSubscriptionsCount] = useState();
    const [subscriptionId, setSubscriptionId] = useState();

    const [admin, setAdmin] = useState();
    const [loading, setLoading] = useState(true);

    const params = useParams();
    const userId = params.userId;

    useEffect(() => {
        (async () => {
            if (auth.token && auth.token.length) {
                let photo = await getUserPhoto(auth.token, userId);
                if (photo == 'noPhotoUser.png') {
                    setUserPhoto(`url('${conf.prefix}/noPhotoUser.png')`);
                } else {
                    setUserPhoto(`url('${conf.base_url}/user_photos/${photo}')`);
                }
            }
        })();

        (async () => {
            const status = await getNotificationRequest(userId, auth.token);
            if (status) setSubscrRequest(true);
            else setSubscrRequest(false);

            const roleA = await isAdmin(auth.token);
            if (roleA) setAdmin(true);
            else setAdmin(false);
        })();

        (async () => {
            if ((!posts && auth.token) || (auth.token && window.location.pathname.includes(userId))) {
                let allPosts = await getPosts(auth.token, userId);
                let allReposts = await getReposts(auth.token, userId);

                const posts = [...allPosts];

                if (allReposts) {
                    const reposts = await Promise.all(allReposts.map(async (p, key) => {
                        const post = await getPost(p.post_id, auth.token);
                        post.date = p.date;
                        post.repost_id = p.repost_id;
                        return post;
                    }));
                    posts.push(...reposts);
                }


                posts.sort((a, b) => new Date(b.date) - new Date(a.date));

                setPosts(posts.map((p, key) => {
                    p.key = key;
                    return p;
                }));
                setLoading(false);
            }
        })();

        (async () => {
            const settings = await getUserSettings(userId, auth.token);//добавить id пользователя что ли 
            const isPrivate = settings.private_profile;
            console.log("isPrivate:", isPrivate);
            setShowPosts(!isPrivate);
        })();

        (async () => {
            if (userId === (parseJWT(auth.token)).id) return;
            const subscr = await getSubscription(userId, auth.token);
            //setSubscriptionId(subscr.subscription_id);
            console.log("subscr: " + subscr);
            //console.log("subscr status: " + subscr.subscription_status);
            if (subscr) {
                setSubscriptionId(subscr.subscription_id);
                setIsSubscription(subscr.subscription_status);
            }
            else setIsSubscription(false);
        })();

        (async () => {
            const subscribers = await getSubscribers(userId, auth.token);
            const subscriptions = await getSubscriptions(userId, auth.token);
            setSubscribersCount(subscribers.length);
            setSubscriptionsCount(subscriptions.length);
        })();
    }, [auth.token, userId, userPhoto]);

    const changeHandler = event => {
        const file = event.target.files[0];

        if (!form.has('user_photo')) form.append('user_photo', file);
        else form.set('user_photo', file);

        const reader = new FileReader();
        reader.addEventListener("load", () => {
            setTempUserPhoto(reader.result);
        });
        reader.readAsDataURL(file);
    }

    const parseJWT = (token) => {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    const changePhotoClick = async (event) => {
        event.preventDefault();
        const state = await changeUserPhoto(form, auth.token);
        if (state) {
            setUserPhoto("url(" + tempUserPhoto + ")");
            changePhoto();
        }
    }

    const subscriptionClick = async () => {
        if (showPosts && !isSubscription) {
            await addSubscription(userId, auth.token);
            setIsSubscription(true);
            setSubscribersCount(subscribersCount + 1);
            console.log('подписка открытый акк');
        }
        else if (!showPosts && !isSubscription && !subscrRequest) {
            await addSubscription(userId, auth.token);
            //setIsSubscription(false);
            setSubscrRequest(true);
            console.log('подписка закрытый акк');
        }
        else if (isSubscription && !subscrRequest) {
            console.log(subscriptionId);
            await deleteSubscription(subscriptionId, auth.token);
            setIsSubscription(false);
            setSubscribersCount(subscribersCount - 1);
            console.log('отписка открытый акк');
        }
        else if (subscrRequest) {
            console.log(subscriptionId);
            if (subscriptionId) await deleteSubscription(subscriptionId, auth.token);
            setSubscrRequest(false);
            console.log('отписка закрытый акк');
        }
    }

    const changePhoto = () => {
        if (!isVisible) {
            setVisibility('block');
            setIsVisible(true);
        }
        else {
            setVisibility('none');
            setIsVisible(false);
            setTempUserPhoto('');
        }
    }

    const deletePost = (post) => {
        setPosts(posts.filter((p) => p != post));
    }

    return (
        <>
            {
                userId === (parseJWT(auth.token)).id ?
                    <Grid columns={3} padded="horizontally" stackable>
                        <Grid.Row>
                            <Grid.Column textAlign="center">
                                <div style={{ backgroundImage: userPhoto, backgroundSize: "cover", backgroundPosition: "center" }} className="user-photo" />
                                <Button circular icon='setting' onClick={() => { navigate(`${conf.prefix}/userSettings`) }} />
                                {/* <Button onClick={() => setVisibility('visible')}>изменить фото</Button> */}
                                <Button onClick={changePhoto}>Изменить фото</Button>
                            </Grid.Column>

                            <Grid.Column verticalAlign="middle" style={{ display: isVisible ? 'none' : 'block' }}>
                                <div className="subscriptionsCount">
                                    <div className="subscrText">
                                        <NavLink to={`${conf.prefix}/profile/${userId}/subscribers`}>
                                            {!loading ? subscribersCount : <Loader active inline='centered' size='tiny' />}
                                        </NavLink>
                                        <p>подписчиков</p>
                                    </div>
                                    <div className="subscrText">
                                        <NavLink to={`${conf.prefix}/profile/${userId}/subscriptions`}>
                                            {!loading ? subscriptionsCount : <Loader active inline='centered' size='tiny' />}
                                        </NavLink>
                                        <p>подписок</p>
                                    </div>
                                </div>
                            </Grid.Column>

                            <Grid.Column style={{ display: `${visibility}` }}>
                                <Form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div className="user-photo" style={{ backgroundImage: tempUserPhoto ? "url(" + tempUserPhoto + ")" : "none", backgroundSize: "cover", backgroundPosition: "center" }}>
                                        <Button className="icon-upload" as="label" htmlFor="file" type="button" icon={<Icon name="upload" />} />
                                        <input type="file" accept="image/*" onChange={changeHandler} id="file" name="file" className="file-upload" />
                                    </div>
                                    <Button onClick={changePhotoClick} type="submit">Применить</Button>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                        <hr style={{ width: '90%', color: '#333' }} />

                        <Grid.Row style={{ marginBottom: '36px' }}>
                            {
                                loading ?
                                    <Loader active inline='centered' /> :
                                    (!posts || !posts.length) ? <p className="center">нет публикаций</p> :
                                        posts.map((post) => {
                                            return (
                                                <Grid.Column key={post.key} className="posts-column" style={{ padding: "2px" }}>
                                                    <NavLink to={`${conf.prefix}/post/${post.post_id}`}><PostPreview onDelete={() => deletePost(post)} isMy={true} post={post} ></PostPreview></NavLink>
                                                </Grid.Column>
                                            )
                                        })
                            }
                        </Grid.Row>
                    </Grid>
                    :
                    <Grid columns={3} padded="horizontally" stackable>
                        <Grid.Row>
                            <Grid.Column>
                                <div style={{ backgroundImage: userPhoto, backgroundSize: "cover", backgroundPosition: "center" }} className="user-photo" />
                            </Grid.Column>
                            <Grid.Column verticalAlign="middle" textAlign="center">
                                <div className="subscriptionsCount">
                                    <div className="subscrText">
                                        <NavLink to={`${conf.prefix}/profile/${userId}/subscribers`}>{subscribersCount}</NavLink>
                                        <p>подписчиков</p>
                                    </div>
                                    <div className="subscrText">
                                        <NavLink to={`${conf.prefix}/profile/${userId}/subscriptions`}>{subscriptionsCount}</NavLink>
                                        <p>подписок</p>
                                    </div>
                                </div>

                                {
                                    (isSubscription) ? <Button onClick={subscriptionClick}>Отписаться</Button> :
                                        (subscrRequest) ? <Button onClick={subscriptionClick}>Запрос отправлен</Button> :
                                            <Button color='green' onClick={subscriptionClick} style={{ color: "#fff" }}>Подписаться</Button>
                                }
                            </Grid.Column>
                        </Grid.Row>
                        <hr style={{ width: '90%', color: '#333' }} />

                        {
                            (showPosts || isSubscription || admin) ?
                                <Grid.Row style={{ marginBottom: '36px' }}>
                                    {
                                        loading ?
                                            <Loader active inline='centered' /> :
                                            (!posts || !posts.length) ?
                                                <p className="center">нет публикаций</p> :
                                                posts.map((post) => {
                                                    return (
                                                        <Grid.Column key={post.key} className="posts-column" style={{ padding: "2px" }}>
                                                            <NavLink to={`${conf.prefix}/post/${post.post_id}`}><PostPreview onDelete={() => deletePost(post)} post={post} ></PostPreview></NavLink>
                                                        </Grid.Column>
                                                    )
                                                })
                                    }
                                </Grid.Row>
                                :
                                <Grid.Row>
                                    Подпишитесь, чтобы увидеть посты.
                                </Grid.Row>
                        }
                    </Grid>
            }
            <BottomNavbar />
        </>
    )
}