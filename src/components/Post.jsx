import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { Card, Image, Icon, Button, Comment, Loader, Grid } from "semantic-ui-react";
import { addPostLike } from "../actions/addPostLike";
import { deletePostLike } from "../actions/deletePostLike";
import { deletePost } from "../actions/deletePost";
import { getPost } from "../actions/getPost";
import { likeExisting } from "../actions/likeExisting";
import { addComment } from "../actions/addComment";
import { deleteComment } from "../actions/deleteComment";
import { conf } from '../config';
import AuthContext from "../contexts/AuthContext";
import { getAllComments } from "../actions/getAllComments";
import { getUser } from "../actions/getUser";
import { addRepost } from "../actions/addRepost";
import { OneComment } from "./OneComment";
import { isAdmin } from "../actions/isAdmin";

export const Post = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const params = useParams();
    const id = params.id;

    const [post, setPost] = useState();

    const [likeCount, setLikeCount] = useState(0);
    const [like, setLike] = useState();
    const [visibleComments, setVisibleComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [allComments, setAllComments] = useState();
    const [admin, setAdmin] = useState();
    const [loading, setLoading] = useState(true);
    //const [commentLike, setCommentLike] = useState();
    //const [comLikesCount, setComLikesCount] = useState();

    const loadComments = async () => {
        const comments = await getAllComments(id, auth.token);
        const newComments = await Promise.all(comments.map(async (p, key) => {
            const user = await getUser(p.user_id, auth.token);
            return {
                key: key,
                id: p.comment_id,
                date: p.date,
                text: p.text,
                likeCount: p.likeCount,
                username: user.username,
                photo: user.user_photo,
                userId: p.user_id
            };
        }));
        setAllComments(newComments);
    }

    useEffect(() => {
        if (auth.token && auth.token.length && !post) {
            (async () => {
                const post = await getPost(id, auth.token);
                setPost(post);
                setLikeCount(post?.likeCount ?? 0);
                const like = await likeExisting(id, auth.token);
                setLike(like);
                setLoading(false);
            })();
        }

        (async () => {
            const roleA = await isAdmin(auth.token);
            if (roleA) setAdmin(true);
            else setAdmin(false);
        })();

        loadComments();
    }, [id, auth, post]);

    const parseJWT = (token) => {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    if (!post?.photo) {
        return <></>
    }

    const changeLikeStatus = async () => {
        // const isLike = await likeExisting(id, auth.token);
        if (!like) {
            await addPostLike(id, auth.token);
            setLikeCount(likeCount + 1);
            setLike(true);
        }
        else {
            await deletePostLike(id, auth.token);
            setLikeCount(likeCount - 1);
            setLike(false);
        }
    }

    const deleteThisPost = async () => {
        const mes = await deletePost(id, auth.token);
        if (mes) {
            alert(mes);
            navigate(`${conf.prefix}/profile/${(parseJWT(auth.token)).id}`);
        }
    }

    const commentsClick = () => {
        setVisibleComments(!visibleComments);
    }

    const textChange = (event) => {
        setCommentText(event.target.value);
    }

    const addCommentClick = async () => {
        const text = commentText.trim();
        if (text.length > 0) {
            const comment = await addComment(id, text, auth.token);
            console.log(comment.text);
            setCommentText('');
            setAllComments([]);
            loadComments();
        }
    }

    const deleteCommentClick = async (comment) => {
        await deleteComment(comment.id, auth.token);
        setAllComments([]);
        loadComments();
    }

    const repostClick = async () => {
        const repost = await addRepost(id, auth.token);
    }

    let photo = `${conf.base_url}/user_photos/${post.user.user_photo}`;
    if (post.user.user_photo == 'noPhotoUser.png') {
        photo = `${conf.prefix}/noPhotoUser.png`;
    }

    return loading ?
        <Loader active inline='centered' /> :
        <Grid centered stackable>
            <Grid.Column width={10} style={{ height: '85vh' }}>
                <Card className="imageBackground" style={{ height: '100%', width: '100%' }}>
                    <Image style={{ height: '100%', objectFit: 'contain' }} className="photo" src={`${conf.base_url}/post_photos/${post?.photo}`} />
                </Card>
            </Grid.Column>
            <Grid.Column width={5} style={{ height: '85vh' }}>
                <Card className='postBlock'>
                    <Card.Content extra className='postHeader'>
                        <div className='postHeaderUser'>
                            <Image src={photo} avatar />
                            <NavLink style={{ marginLeft: '6px', color: 'black', fontWeight: 'bold' }} to={`${conf.prefix}/profile/${post.user.user_id}`}>{post.user.username}</NavLink>
                        </div>
                        <div className='postHeaderMeta'>
                            <Card.Meta style={{ marginRight: 'auto' }}>
                                <span className="date">{(post?.date).split('T')[0]}</span>
                            </Card.Meta>
                            <div>
                                {
                                    (post?.user_id === (parseJWT(auth.token)).id || admin) ? <Card.Content extra><Button style={{ backgroundColor: 'transparent', padding: '0' }} onClick={deleteThisPost} icon={<Icon name="trash" />} /></Card.Content> : <></>
                                }
                            </div>
                        </div>
                    </Card.Content>
                    <Card.Content className='postDescription'>
                        <Card.Description>{post?.description}</Card.Description>
                    </Card.Content>

                    <Card.Content extra className="postActions">
                        {
                            like === false ?
                                <div className="commentLikeButton"><Button style={{ backgroundColor: 'transparent', paddingRight: '2px' }} onClick={changeLikeStatus} icon={<Icon name='like' />} /> {likeCount}</div>
                                :
                                <div className="commentLikeButton"><Button style={{ color: "red", backgroundColor: 'transparent', paddingRight: '2px' }} onClick={changeLikeStatus} icon={<Icon name='like' />} /> {likeCount}</div>
                        }
                        <Button style={{ backgroundColor: 'transparent' }} onClick={commentsClick} icon={<Icon name="comments" />} />
                        <Button style={{ backgroundColor: 'transparent' }} onClick={repostClick} icon={<Icon name="share" />} />
                    </Card.Content>

                    {
                        visibleComments === false ? <></> :
                            <Card.Content extra style={{ height: '100%' }}>
                                <Comment.Group className="commentsBlock">
                                    {
                                        (!allComments || !allComments.length) ? <p>нет комментариев</p>
                                            :
                                            allComments.map(comment => {
                                                return (
                                                    <OneComment key={comment.key} comment={comment} onDelete={deleteCommentClick}></OneComment>
                                                )
                                            })
                                    }
                                </Comment.Group>
                            </Card.Content>
                    }

                    {
                        visibleComments === false ? <></> :
                            <Card.Content style={{ height: 'max-content', paddingTop: 'auto' }}>
                                <textarea onChange={textChange} value={commentText} rows="2" style={{ display: 'block', boxSizing: 'border-box', width: '100%', margin: '5px 0px', resize: 'none' }}></textarea>
                                <Button onClick={addCommentClick} content='Отправить' labelPosition='left' icon='edit' primary style={{ width: '100%' }} />
                            </Card.Content>
                    }
                </Card>
            </Grid.Column>
        </Grid>;
}