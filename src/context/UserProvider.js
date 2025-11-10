import { useState } from 'react'
import { UserContext } from './UserContext'
import axios from 'axios'
import React from 'react'

export default function UserProvider({children}) {
    const userFromStorage = sessionStorage.getItem('user')
    const [user, setUser] = useState(userFromStorage ? JSON.parse(userFromStorage) : {email: '', password: ''})

    const signUp = async () => {
        const headers = {headers: {"Content-Type": "Application/json"}}
        await axios.post(`${import.meta.env.VITE_API_URL}/user/signup`,JSON.stringify({user: user}), headers)
        setUser({email: '', password: ''})
    }

    const signIn = async () => {
        const headers = {headers: {"Content-Type": "Application/json"}}
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/signin`,JSON.stringify({user: user}), 
        headers)
        setUser(response.data)
        sessionStorage.setItem('user', JSON.stringify(response.data))
    }

    return React.createElement(
        UserContext.Provider,
        { value: {user,setUser,signUp,signIn}},
        children
    )
}