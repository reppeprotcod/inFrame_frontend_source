import React, { useContext } from "react";
import { conf } from '../config';
import { Button, Card, Icon } from "semantic-ui-react";
import AuthContext from "../contexts/AuthContext";
import { deleteRepost } from "../actions/deleteRepost";
import { deletePost } from "../actions/deletePost";
import { useNavigate, NavLink } from "react-router-dom";

export const PostPreview = (props) => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const onDeleteClick = async (event) => {
        // event.stopPropagation();
        event.preventDefault();
        if(props.post.repost_id) {
            console.log(props.post);
            await deleteRepost(props.post.repost_id, auth.token);
        }
        else {
            await deletePost(props.post.post_id, auth.token);
        }
        props.onDelete();
        // return false;
    }

    return (
        <div className={props.isMy ? "userPostPrev" : ""}>
        <Card fluid style={{aspectRatio: 1, backgroundImage: `url('${conf.base_url}/post_photos/${props.post.photo}')`, backgroundSize: "cover", backgroundPosition: "center"}}>
            <Button style={{backgroundColor: '#fc2c21'}} onClick={onDeleteClick} className="postPrevTrash" icon={<Icon name="trash" />}></Button>
        </Card>
        </div>
    )
}