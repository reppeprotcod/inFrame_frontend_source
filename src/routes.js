import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { Registration } from "./components/Registration";
import { HomePage } from "./pages/HomePage";
import { Login } from "./components/Login";
import { UserProfile } from "./components/UserProfile";
import { CreatePost } from "./components/CreatePost";
import { Post } from "./components/Post";
import { UserSettings } from "./components/UserSettings";
import { UsersList } from "./components/UsersList";
import { Notifications } from "./pages/Notifications";
import { conf } from "./config";

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Routes>
                <Route path={`${conf.prefix}`} element={<HomePage />} />
                <Route path={`${conf.prefix}/profile/:userId`} element={<UserProfile />} />
                <Route path={`${conf.prefix}/createPost`} element={<CreatePost />} />
                <Route path={`${conf.prefix}/post/:id`} element={<Post />} />
                <Route path={`${conf.prefix}/userSettings`} element={<UserSettings />} />
                <Route path={`${conf.prefix}/profile/:userId/subscribers`} element={<UsersList title='Подписчики' subscribers={true} />} />
                <Route path={`${conf.prefix}/profile/:userId/subscriptions`} element={<UsersList title='Подписки' subscriptions={true} />} />
                <Route path={`${conf.prefix}/post/:id/likes`} element={<UsersList likes={true} />} />
                <Route path={`${conf.prefix}/notifications`} element={<Notifications />} />
                <Route path="*" element={<Navigate replace to={`${conf.prefix}`} />} />
            </Routes>
        )
    }
    return (
        <Routes>
            <Route path={`${conf.prefix}/registration`} element={<Registration />} />
            <Route path={`${conf.prefix}/login`} element={<Login />} />
            <Route path="*" element={<Navigate replace to={`${conf.prefix}/login`} />} />
        </Routes>
    )
}