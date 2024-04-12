import { url_api } from './constants';

interface User {
    name: String,
    password:String
}

export const getUser = async (data: User) => {
    return fetch(url_api+"authenticate", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
}

export default { getUser }