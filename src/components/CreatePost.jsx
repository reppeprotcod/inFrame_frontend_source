import React, { useContext, useState } from "react";
import { BottomNavbar } from "./BottomNavbar";
import { Button, Header, Form, Grid, Card, Icon, Loader, Dimmer } from 'semantic-ui-react';
import { createPost } from "../actions/createPost";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import { conf } from "../config";

export const CreatePost = () => {
    const auth = useContext(AuthContext);

    const [form, setForm] = useState(new FormData());
    const [file, setFile] = useState();
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();

    const parseJWT = (token) => {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    const changeHandler = event => {
        if (event.target.name === "file") {
            const file = event.target.files[0];
            if (!form.has('photo')) form.append('photo', file);
            else form.set('photo', file);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setFile(reader.result);
            });
            reader.readAsDataURL(file);
        }
        else {
            if (!form.has(event.target.name)) form.append(event.target.name, event.target.value);
            else form.set(event.target.name, event.target.value);
        }
    }

    const createPostClick = async (event) => {
        if (!form.has('photo')) return;
        event.preventDefault();

        setUploading(true);
        const state = await createPost(form, auth.token);
        if (state) {
            navigate(`${conf.prefix}/profile/${(parseJWT(auth.token)).id}`);
        } else {
            setUploading(false);
        }
    }

    return (
        <div>
            <Grid centered padded>
                <Grid.Column className="form-column">
                    <Card fluid className='card-upload'>
                        <Card.Content>
                            <Form className='form-upload'>
                                <div className="post-photo" style={{ backgroundImage: file != null ? "url(" + file + ")" : "none", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center center" }}>
                                    <Button className="icon-upload" as="label" htmlFor="file" type="button" icon={<Icon name="upload" />} />
                                    <input type="file" accept="image/*" onChange={changeHandler} id="file" name="file" className="file-upload" />
                                </div>
                                <Form.Input id="description" name="description" onChange={changeHandler} type="text" placeholder="Описание" />
                                {
                                    uploading ?
                                        <Dimmer active>
                                            <Loader />
                                        </Dimmer> :
                                        <Button color='google plus' type="submit" onClick={createPostClick}>Опубликовать</Button>
                                }
                            </Form>
                        </Card.Content>
                    </Card>
                </Grid.Column>
            </Grid>
            <BottomNavbar />
        </div>
    )
}