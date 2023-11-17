import React, { useContext, useEffect, useState } from "react";
import { Feed, Image, Button, Icon } from "semantic-ui-react";
import { PostPreview } from "../components/PostPreview";
import { addPostLike } from "../actions/addPostLike";
import { deletePostLike } from "../actions/deletePostLike";
import { addRepost } from "../actions/addRepost";
import { likeExisting } from "../actions/likeExisting";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import { conf } from "../config";

export const FeedPost = ({ post }) => {
    const [like, setLike] = useState();
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.token && auth.token.length && like === undefined) {
            (async () => {
                const like = await likeExisting(post.post_id, auth.token);
                setLike(like);
            })();
        }
    }, [auth]);

    const changeLikeStatus = async () => {
        // const isLike = await likeExisting(id, auth.token);
        if (!like) {
            await addPostLike(post.post_id, auth.token);
            setLikeCount(likeCount + 1);
            setLike(true);
        }
        else {
            await deletePostLike(post.post_id, auth.token);
            setLikeCount(likeCount - 1);
            setLike(false);
        }
    }

    const commentsClick = () => {
        navigate(`${conf.prefix}/post/${post.post_id}`);
    }

    const repostClick = async () => {
        const repost = await addRepost(post.post_id, auth.token);
    }

    let photo = `${conf.base_url}/user_photos/${post.user.user_photo}`;
    if (post.user.user_photo == 'noPhotoUser.png') {
        photo = `${conf.prefix}/noPhotoUser.png`;
    }

    return (<>
        <Feed>
            <Feed.Event>
                <Feed.Label><Image style={{ width: "32px", height: "32px", objectFit: "cover" }} src={photo} /></Feed.Label>
                <Feed.Content style={{ marginLeft: "8px" }}>
                    <Feed.Summary><NavLink to={`${conf.prefix}/profile/${post.user.user_id}`}>{post.user.username}</NavLink></Feed.Summary>
                </Feed.Content>
            </Feed.Event>
        </Feed>
        <NavLink to={`${conf.prefix}/post/${post.post_id}`}>
            <PostPreview post={post}></PostPreview>
        </NavLink>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            {
                like === false ?
                    <div className="commentLikeButton"><Button style={{ color: "#eee", backgroundColor: 'transparent', paddingRight: '2px' }} onClick={changeLikeStatus} icon={<Icon name='like' />} /> {likeCount}</div>
                    :
                    <div className="commentLikeButton"><Button style={{ color: "red", backgroundColor: 'transparent', paddingRight: '2px' }} onClick={changeLikeStatus} icon={<Icon name='like' />} /> {likeCount}</div>
            }
            <Button style={{ color: "#eee", backgroundColor: 'transparent' }} onClick={commentsClick} icon={<Icon name="comments" />} />
            <Button style={{ color: "#eee", backgroundColor: 'transparent' }} onClick={repostClick} icon={<Icon name="share" />} />
        </div>
    </>);
}