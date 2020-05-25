import { authHeader } from "../helpers/authHeader";

const login = async (email, password) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    };

    const response = await fetch('http://localhost:6607/users/authenticate', requestOptions);
    const user = await handleResponse(response);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
}

const logout = () => {
    localStorage.removeItem('user');
}

const getAll = async () => {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    const response = await fetch('http://localhost:6607/users', requestOptions);
    return handleResponse(response);
}

const register = async user => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user })
    };

    try {
        const res = await fetch('http://localhost:6607/users/register', requestOptions);
        const result = res.data;
        return console.log(result);
    }
    catch (error) {
        return console.log(error);
    }
}

const handleResponse = response => {
    return response.text()
        .then(text => {
            const data = text && JSON.parse(text);

            if (!response.ok) {
                if (response.status === 401) {
                    logout();
                }
                
                const error = (data && data.message) || response.statusText;

                return Promise.reject(error);
            }

            return data;            
        });
}

export const userService = {
    login,
    logout,
    getAll,
    register
};