import React, { useContext, useEffect, useState } from "react";
import { getCommentsNotifications } from "../actions/getCommentsNotifications";
import { getCommentsLikesNotifications } from "../actions/getCommentsLikesNotifications";
import { getPostsLikesNotifications } from "../actions/getPostsLikesNotifications";
import { getRepostsNotifications } from "../actions/getRepostsNotifications";
import { getSubscriptionsNotifications } from "../actions/getSubscriptionsNotifications";
import { BottomNavbar } from "../components/BottomNavbar";
import AuthContext from "../contexts/AuthContext";
import { Card, Feed, Grid, Header, Loader } from "semantic-ui-react";
import { Notification } from "../components/Notification";
import { readCommentLikeNotification } from "../actions/readCommentLikeNotification";
import { readCommentNotification } from "../actions/readCommentNotification";
import { readPostLikeNotification } from "../actions/readPostLikeNotification";
import { readRepostNotification } from "../actions/readRepostNotification";
import { readSubscriptionNotification } from "../actions/readSubscriptionNotification";
import NotificationsContext from "../contexts/NotificationsContext";

export const Notifications = () => {
    const auth = useContext(AuthContext);
    const notifications = useContext(NotificationsContext);
    const [loadedNotifs, setLoadedNotifs] = useState(false);

    useEffect(() => {
        if (auth.token && auth.token.length && !loadedNotifs) {
            (async () => {
                const comLikesNotif = await getCommentsLikesNotifications(auth.token);
                const comNotif = await getCommentsNotifications(auth.token);
                const likesNotif = await getPostsLikesNotifications(auth.token);
                const repostsNotif = await getRepostsNotifications(auth.token);
                const subscrNotif = await getSubscriptionsNotifications(auth.token);
                const n = [...comLikesNotif, ...comNotif, ...likesNotif, ...repostsNotif, ...subscrNotif].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                notifications.setNotifications(n);

                let hasSubscrRequests = false;
                for (const notif of subscrNotif) {
                    if (notif.is_allowed === false) {
                        hasSubscrRequests = true;
                    }
                }
                if (!hasSubscrRequests) {
                    notifications.setNotificationsBadge(false);
                }

                n.forEach((notif) => {
                    if (notif.isComment) readCommentNotification(notif.notif_com_id, auth.token);
                    else if (notif.isCommentLike) readCommentLikeNotification(notif.notif_com_like_id, auth.token);
                    else if (notif.isPostLike) readPostLikeNotification(notif.notif_like_id, auth.token);
                    else if (notif.isRepost) readRepostNotification(notif.notif_repost_id, auth.token);
                    else if (notif.isSubscription && notif.is_allowed) {
                        readSubscriptionNotification(notif.notif_subscr_id, auth.token);
                    }
                });

                setLoadedNotifs(true);
            })();
        }
    })
    return (
        <div>
            <Grid centered>
                <Grid.Column>
                    <Header style={{ width: '100%', textAlign: 'center' }}>Уведомления</Header>
                    <Card centered>
                        <Card.Content>
                            <Feed>
                                {
                                    !loadedNotifs ?
                                        <Loader active inline='centered' /> :
                                        (!notifications.notifications || !notifications.notifications.length) ? <p style={{ color: 'black' }}>нет уведомлений</p>
                                            :
                                            notifications.notifications.map((notification, key) => {
                                                console.log('notification: ', notification);
                                                return (
                                                    <Notification key={key} notification={notification}></Notification>
                                                )
                                            })
                                }
                            </Feed>
                        </Card.Content>
                    </Card>
                </Grid.Column>
            </Grid>
            <BottomNavbar />
        </div>
    )
}