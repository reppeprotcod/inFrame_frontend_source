import React, { useContext, useState } from "react";
import { Button, Feed, Icon } from "semantic-ui-react";
import AuthContext from "../contexts/AuthContext";
import { conf } from "../config";
import { getUser } from "../actions/getUser";
import { acceptSubscription } from "../actions/acceptSubscription";
import { deleteSubscription } from "../actions/deleteSubscription";
import { useNavigate, NavLink } from "react-router-dom";
import NotificationsContext from "../contexts/NotificationsContext";

export const Notification = (props) => {
    const notification = props.notification;
    const notifications = useContext(NotificationsContext);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [subscriber, setSubscriber] = useState();

    const acceptSubscr = async () => {
        await acceptSubscription(notification.subscription_id, auth.token);
        console.log(notification.subscription_id);
        notifications.setNotifications(notifications.notifications.filter((n) => n != notification));
    }

    const notAcceptSubscr = async () => {
        await deleteSubscription(notification.subscription_id, auth.token);
        console.log(notification.subscription_id);
        notifications.setNotifications(notifications.notifications.filter((n) => n != notification));
    }

    if (notification.isComment) {
        let photo = `${conf.base_url}/user_photos/${notification.comment.user.user_photo}`;
        if (notification.comment.user.user_photo == 'noPhotoUser.png') {
            photo = `${conf.prefix}/noPhotoUser.png`;
        }
        return (
            <Feed.Event>
                <Feed.Label style={{display: 'flex', alignItems: 'center'}}>
                    <NavLink to={`${conf.prefix}/profile/${notification.comment.user.user_id}`}>
                        <img style={{ aspectRatio: '1', objectFit: "cover" }} src={photo} alt="#" />
                    </NavLink>
                </Feed.Label>
                <Feed.Content style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Feed.Summary style={{display: 'block'}}>
                        <NavLink to={`${conf.prefix}/profile/${notification.comment.user.user_id}`}>
                            {notification.comment.user.username + ' '}
                        </NavLink>
                        прокомментировал(-а):
                        <Feed.Content>{notification.comment.text}</Feed.Content>
                    </Feed.Summary>
                    <NavLink style={{display: 'block'}} to={`${conf.prefix}/post/${notification.comment.post.post_id}`}>
                        <img style={{ aspectRatio: '1', width: '40px' }} src={`${conf.base_url}/post_photos/${notification.comment.post.photo}`} alt="#" />
                    </NavLink>
                </Feed.Content>
            </Feed.Event>
        )
    }
    else if (notification.isCommentLike) {
        return (
            <Feed.Event>
                <Feed.Label style={{display: 'flex', alignItems: 'center'}}>
                    <NavLink to={`${conf.prefix}/profile/${notification.comments_like.user.user_id}`}>
                        <img style={{ aspectRatio: '1', objectFit: "cover" }} src={`${conf.base_url}/user_photos/${notification.comments_like.user.user_photo}`} alt="#" />
                    </NavLink>
                </Feed.Label>
                <Feed.Content style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Feed.Summary>
                        <NavLink to={`${conf.prefix}/profile/${notification.comments_like.user.user_id}`}>
                            {notification.comments_like.user.username + ' '}
                        </NavLink>
                        лайкнул(-а) комментарий:
                        <Feed.Content>{notification.comments_like.comment.text}</Feed.Content>
                    </Feed.Summary>
                    <NavLink to={`${conf.prefix}/post/${notification.comments_like.comment.post.post_id}`}>
                        <img style={{ aspectRatio: '1', width: '40px' }} src={`${conf.base_url}/post_photos/${notification.comments_like.comment.post.photo}`} alt="#" />
                    </NavLink>
                </Feed.Content>
            </Feed.Event>
        )
    }
    else if (notification.isPostLike) {
        return (
            <Feed.Event>
                <Feed.Label style={{display: 'flex', alignItems: 'center'}}>
                    <NavLink to={`${conf.prefix}/profile/${notification.posts_like.user.user_id}`}>
                        <img style={{ aspectRatio: '1', objectFit: "cover" }} src={`${conf.base_url}/user_photos/${notification.posts_like.user.user_photo}`} alt="#" />
                    </NavLink>
                </Feed.Label>
                <Feed.Content style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Feed.Summary>
                        <NavLink to={`${conf.prefix}/profile/${notification.posts_like.user.user_id}`}>
                            {notification.posts_like.user.username + ' '}
                        </NavLink>
                        лайкнул(-а):
                    </Feed.Summary>
                    <NavLink to={`${conf.prefix}/post/${notification.posts_like.post.post_id}`}>
                        <img style={{ aspectRatio: '1', width: '40px' }} src={`${conf.base_url}/post_photos/${notification.posts_like.post.photo}`} alt="#" />
                    </NavLink>
                </Feed.Content>
            </Feed.Event>
        )
    }
    else if (notification.isRepost) {
        return (
            <Feed.Event>
                <Feed.Label style={{display: 'flex', alignItems: 'center'}}>
                    <NavLink to={`${conf.prefix}/profile/${notification.repost.user.user_id}`}>
                        <img style={{ aspectRatio: '1', objectFit: "cover" }} src={`${conf.base_url}/user_photos/${notification.repost.user.user_photo}`} alt="#" />
                    </NavLink>
                </Feed.Label>
                <Feed.Content style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Feed.Summary>
                        <NavLink to={`${conf.prefix}/profile/${notification.repost.user.user_id}`}>
                            {notification.repost.user.username + ' '}
                        </NavLink>
                        сделал(-а) репост:
                    </Feed.Summary>
                    <NavLink to={`${conf.prefix}/post/${notification.repost.post.post_id}`}>
                        <img style={{ aspectRatio: '1', width: '40px' }} src={`${conf.base_url}/post_photos/${notification.repost.post.photo}`} alt="#" />
                    </NavLink>
                </Feed.Content>
            </Feed.Event>
        )
    }
    else {
        if(!subscriber){
            (async () => {
                const user = await getUser(notification.subscription.subscriber_id, auth.token);
                setSubscriber(user);
            })();
        }

        if(subscriber) {
            if(notification.is_allowed) {
                return (
                    <Feed.Event>
                        <Feed.Label style={{display: 'flex', alignItems: 'center'}}>
                            <NavLink to={`${conf.prefix}/profile/${subscriber.user_id}`}>
                                <img style={{ aspectRatio: '1', objectFit: "cover" }} src={`${conf.base_url}/user_photos/${subscriber.user_photo}`} alt="#" />
                            </NavLink>
                        </Feed.Label>
                        <Feed.Content style={{display: 'flex'}}>
                            <Feed.Summary>
                                <NavLink to={`${conf.prefix}/profile/${subscriber.user_id}`}>
                                    {subscriber.username + ' '}
                                </NavLink>
                                подписался(-ась) на вас.
                            </Feed.Summary>
                        </Feed.Content>
                    </Feed.Event>
                )
            }
            else {
                return (
                    <Feed.Event>
                        <Feed.Label style={{display: 'flex', alignItems: 'center'}}>
                            <NavLink to={`${conf.prefix}/profile/${subscriber.user_id}`}>
                                <img style={{ aspectRatio: '1', objectFit: "cover" }} src={`${conf.base_url}/user_photos/${subscriber.user_photo}`} alt="#" />
                            </NavLink>
                        </Feed.Label>
                        <Feed.Content style={{display: 'flex'}}>
                            <Feed.Summary>
                                <NavLink to={`${conf.prefix}/profile/${subscriber.user_id}`}>
                                    {subscriber.username + ' '}
                                </NavLink>
                                отправил(-а) запрос на подписку
                            </Feed.Summary>
                        </Feed.Content>
                        <Feed.Content style={{display: 'flex', alignItems: "center"}}>
                            <Button onClick={acceptSubscr} icon={<Icon name='check' />} color="green" circular></Button>
                            <Button onClick={notAcceptSubscr} icon={<Icon name='x' />} color="red" circular></Button>
                        </Feed.Content>
                    </Feed.Event>
                )
            }
        }
    }
}