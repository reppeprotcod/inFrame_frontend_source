import React, { useContext, useEffect, useState } from "react";
import { getPost } from "../actions/getPost";
import { getPosts } from "../actions/getPosts";
import { getReposts } from "../actions/getReposts";
import { getSubscriptions } from "../actions/getSubscriptions";
import { getUser } from "../actions/getUser";
import { BottomNavbar } from "../components/BottomNavbar";
import { Grid, Feed, Image, Loader, Dimmer } from "semantic-ui-react";
import AuthContext from "../contexts/AuthContext";
import { conf } from "../config";
import { FeedPost } from "../components/FeedPost";

export const HomePage = () => {
    const auth = useContext(AuthContext);
    const [posts, setPosts] = useState();
    const [loading, setLoading] = useState(true);

    const parseJWT = (token) => {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    const authUserId = (parseJWT(auth.token).id);

    useEffect(() => {
        (async () => {
            if (!loading) return;
            const subscriptions = await getSubscriptions(authUserId, auth.token);

            const allPosts = (await Promise.all(subscriptions.map(async (p, key) => {
                const posts = await getPosts(auth.token, p.user_id);
                const allReposts = await getReposts(auth.token, p.user_id);

                const rep = await Promise.all(allReposts.map(async (p, key) => {
                    const post = await getPost(p.post_id, auth.token);
                    post.date = p.date;
                    post.repost_id = p.repost_id;
                    return post;
                }));

                return [...posts, ...rep.filter((r) => r.user_id != authUserId)];
            }))).flat();

            const postsWithUsers = await Promise.all(allPosts.map(async (p) => {
                const user = await getUser(p.user_id, auth.token);
                return { ...p, user };
            }));
            postsWithUsers.sort((a, b) => new Date(b.date) - new Date(a.date));

            setPosts(postsWithUsers.map((b, key) => {
                b.key = key;
                return b;
            }));
            setLoading(false);
        })();
    }, []);

    return (
        <div>
            <Grid columns={1} padded="horizontally" style={{ marginTop: '16px', marginBottom: '36px' }}>
                {
                    loading ?
                        <Loader active inline='centered' /> :
                        (!posts || !posts.length) ?
                            <p className="center">нет публикаций</p> :
                            posts.map((post) => {
                                return (
                                    <Grid.Row key={post.key} centered>
                                        <Grid.Column className="posts-column" mobile={14} tablet={8} computer={8} largeScreen={8} widescreen={8}>
                                            <FeedPost post={post}></FeedPost>
                                        </Grid.Column>
                                    </Grid.Row>
                                )
                            })
                }
            </Grid>
            <BottomNavbar />
        </div>
    )
}