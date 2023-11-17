import React, { useContext, useEffect, useState } from "react";
import { Button, Header, Form, Grid, Card, Checkbox } from 'semantic-ui-react';
import {useNavigate} from 'react-router-dom';
import AuthContext from "../contexts/AuthContext";
import { getUserSettings } from "../actions/getUserSettings";
import { changeUserSettings } from "../actions/changeUserSettings";
import { conf } from "../config";

export const UserSettings = () => {
    const [isChecked, setIsChecked] = useState();

    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    
    const parseJWT = (token) => {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    useEffect(() => {
        (async() => {
            const userSettings = await getUserSettings((parseJWT(auth.token)).id, auth.token);
            setIsChecked(userSettings.private_profile);
        })();
    }, [auth.token]);

    console.log(isChecked);

    const changeHandler = async() => {
        console.log('change');
        setIsChecked(!isChecked);
    }


    const userSettingsClick = async () => {
        const userSet = await changeUserSettings(0, isChecked, auth.token);
        

        if(userSet) {
            navigate(`${conf.prefix}/profile/${(parseJWT(auth.token)).id}`);
        }
    }

    return ( 
        <div>
            <Grid centered padded>
                <Grid.Column className="form-column">
                    <Header>Настройки</Header>
                    <Card fluid>
                        <Card.Content>
                            <Form>
                                <Checkbox checked={isChecked} onChange={changeHandler} label="Закрытый профиль" />
                                <br />
                                <br />
                                <Button color='google plus' onClick={userSettingsClick} type="submit">Сохранить</Button>
                            </Form>
                        </Card.Content>
                    </Card>
                </Grid.Column>
            </Grid>
        </div>
    )
}