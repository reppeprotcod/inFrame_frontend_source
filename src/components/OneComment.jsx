import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import { conf } from "../config";
import { Button, Comment, Icon } from "semantic-ui-react";
import { comLikeExisting } from "../actions/comLikeExisting";
import { deleteComLike } from "../actions/deleteComLike";
import { addComLike } from "../actions/addComLike";
import { isAdmin } from "../actions/isAdmin";

export const OneComment = (props) => {
    const comment = props.comment;
    const auth = useContext(AuthContext);

    const [like, setLike] = useState();
    const [likeCount, setLikeCount] = useState(comment.likeCount ?? 0);
    const [admin, setAdmin] = useState();

    useEffect(() => {
        (async () => {
            const like = await comLikeExisting(comment.id, auth.token);
            setLike(like);
            const roleA = await isAdmin(auth.token);
            if (roleA) setAdmin(true);
            else setAdmin(false);
        })();
    })

    const changeLikeStatus = async () => {
        //const isLike = await comLikeExisting(comment.id, auth.token);
        if (!like) {
            await addComLike(comment.id, auth.token);
            setLikeCount(likeCount + 1);
            setLike(true);
        }
        else {
            await deleteComLike(comment.id, auth.token);
            setLikeCount(likeCount - 1);
            setLike(false);
        }
    }

    const parseJWT = (token) => {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    let photo = `${conf.base_url}/user_photos/${comment.photo}`;
    if (comment.photo == 'noPhotoUser.png') {
        photo = `${conf.prefix}/noPhotoUser.png`;
    }

    return (
        <Comment>
            <Comment.Avatar style={{ aspectRatio: '1', objectFit: "cover" }} src={photo} />
            <Comment.Content>
                <Comment.Author style={{ width: 'max-content', display: 'inline-block' }}><NavLink to={`${conf.prefix}/profile/${comment.userId}`}>{comment.username}</NavLink></Comment.Author>
                <Comment.Metadata style={{ display: 'inline-block' }}>{(comment.date).split('T')[0]}</Comment.Metadata>
                <Comment.Text>{comment.text}</Comment.Text>
                <Comment.Actions style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginRight: '10px' }}>
                    {
                        like === false ?
                            <div className="commentLikeButton"><Button style={{ backgroundColor: 'transparent', paddingRight: '2px' }} onClick={changeLikeStatus} icon={<Icon name='like' />} /> {likeCount}</div>
                            :
                            <div className="commentLikeButton"><Button style={{ color: "red", backgroundColor: 'transparent', paddingRight: '2px' }} onClick={changeLikeStatus} icon={<Icon name='like' />} /> {likeCount}</div>
                    }

                    {
                        (comment.userId === (parseJWT(auth.token)).id || admin) ?
                            <Comment.Action onClick={() => props.onDelete(comment)}><Icon color='grey' name="trash" /></Comment.Action>
                            : <></>
                    }

                </Comment.Actions>
            </Comment.Content>
        </Comment>
    )
}