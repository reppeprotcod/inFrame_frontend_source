import React, { useContext, useState } from "react";
import { Button, Header, Form, Grid, Card } from 'semantic-ui-react';
import { login } from "../actions/userLogin";
import {useNavigate} from 'react-router-dom';
import AuthContext from "../contexts/AuthContext";
import { conf } from "../config";

export const Login = () => {
    const [form, setForm] = useState({
        username: '', password: ''
    })

    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const loginClick = async (event) => {
        if (form.username === '' || form.password === "") return;
        event.preventDefault();

        console.log(form);

        const loginState = await login(form);
        

        if(loginState) {
            auth.login(loginState);
            navigate(`${conf.prefix}`);
        }
    }

    return ( 
        <div>
            
            <Grid centered padded>
                <Grid.Column className="form-column">
                    <Header>Авторизация</Header>
                    <Card fluid>
                        <Card.Content>
                            <Form>
                                <Form.Input id="username" name="username" type="text" onChange={changeHandler} required label="Имя пользователя" placeholder="Имя пользователя" />
                                <Form.Input id="password" name="password" type="password" onChange={changeHandler} required label="Пароль" placeholder="Пароль" />
                                <Button color='google plus' onClick={loginClick} type="submit">Войти</Button>
                            </Form>
                        </Card.Content>
                    </Card>
                </Grid.Column>
            </Grid>
        </div>
    )
}