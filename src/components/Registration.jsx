import React, { useState, useContext } from "react";
import { Button, Header, Form, Grid, Card, Label, Icon } from 'semantic-ui-react'
import { registration } from "../actions/userRegistration";
import {useNavigate} from 'react-router-dom';
import login from "../actions/userLogin";
import AuthContext from "../contexts/AuthContext";
import { chechUserName } from "../actions/checkUserName";
import { conf } from "../config";

export const Registration = () => {
    const [form, setForm] = useState(new FormData());
    const [file, setFile] = useState();
    const [isAvailable, setIsAvailable] = useState();
    
    const navigate = useNavigate();

    const changeHandler = async event => {
        if(event.target.name === "file"){
            const file = event.target.files[0];
            if (!form.has('user_photo')) form.append('user_photo', file);
            else form.set('user_photo', file);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setFile(reader.result);
            });
            reader.readAsDataURL(file);
        }
        else if(event.target.name === "username") {
            const available = await chechUserName(event.target.value);
            setIsAvailable(available);
            if (!form.has(event.target.name)) form.append(event.target.name, event.target.value);
            else form.set(event.target.name, event.target.value);
        }
        else {
            if (!form.has(event.target.name)) form.append(event.target.name, event.target.value);
            else form.set(event.target.name, event.target.value);
        }
    }
    
    const auth = useContext(AuthContext);

    const registrationClick = async (event) => {
        event.preventDefault();

        const registrationState = await registration(form);

        if (registrationState) {
            const loginState = await login({
                username: form.get('username'),
                password: form.get('password'),
            });

            if(loginState) {
                auth.login(loginState);
                navigate(`${conf.prefix}`);
            }
        }
    }

    return (
        <div>
            <Grid centered padded>
                <Grid.Column className="form-column">
                    <Header>Регистрация</Header>
                    <Card fluid>
                        <Card.Content>
                            <Form>
                                <div className="user-photo" style={{backgroundImage: file != null ? "url("+file+")" : "none", backgroundSize: "cover"}}>
                                    <Button className="icon-upload" as="label" htmlFor="file" type="button" icon={<Icon name="upload" />} />
                                    <input type="file" accept="image/*" onChange={changeHandler} id="file" name="file" className="file-upload" />
                                </div>

                                <Form.Group widths={2} style={{height: "max-content"}}>
                                    {
                                        (isAvailable === undefined) ||  (isAvailable === true) ? 
                                        <Form.Input id="username" name="username" type="text" onChange={changeHandler} required label="Имя пользователя" placeholder="Имя пользователя" />
                                        :
                                        <Form.Input id="username" name="username" type="text" onChange={changeHandler} required label="Имя пользователя" error={{ content: 'Это имя занято' }} placeholder="Имя пользователя" />
                                    }
                                    <Form.Input id="email" name="email" type="email" onChange={changeHandler} required label="Email" placeholder="Email" />
                                </Form.Group>
                                <Form.Group widths={2}>
                                    <Form.Input id="password" name="password" type="password" onChange={changeHandler} required label="Пароль" placeholder="Пароль" />
                                    <Form.Input id="date" name="birth_date" type="date" onChange={changeHandler} required label="Дата рождения" placeholder="Дата рождения" />
                                </Form.Group>
                                <Button color='google plus' onClick={registrationClick} type="submit">Зарегистрироваться</Button>
                            </Form>
                        </Card.Content>
                    </Card>
                </Grid.Column>
            </Grid>
        </div>
    )
}