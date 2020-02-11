import config from 'config';
import { authHeader } from '../_helpers';

export const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete
};

async function login(email, password) {
    const requestOptions = {
        //credentials: "same-origin",
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        //credentials: 'same-origin',
        //headers: {
        //   "content-type": "API-Key",
        //  },
        body: JSON.stringify({ email, password }),
    };
    console.log(`SENDING BODY FROM USER SERVICE: ${JSON.stringify(requestOptions.body)}`);
    const response = await fetch(`${config.apiUrl}/auth/login`, requestOptions);
    //readerR = await ; //Promise<ReadableStreamReadResult<R>> 
    //console.log(`RECEIVED RESPONSE FROM USER SERVICE: ${JSON.stringify(await response.body.getReader().read())}`);
    //console.log(`RECEIVED RESPONSE FROM USER SERVICE: ${JSON.stringify(await response.json())}`);
    /*response.body.getReader().read()
        .then(v => {
            console.log(v);
        })
        .catch(e => {
            console.log(e);
        });*/
    //console.log(`login response: ${JSON.stringify(response.text())}`);
    if (!response.ok) {
        console.log("not okay");
        if (response.status === 401) {
            // auto logout if 401 response returned from api
            logout();
            location.reload(true);
        }
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }
    var user =  await response.json();
    user.token = response.headers.get('Auth');
    console.log(`returning user: ${JSON.stringify(user)}`);
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    localStorage.setItem('user', JSON.stringify(user));
    console.log(`set user to ${JSON.stringify(user)}`);
    return user;
        /*.then(function(response) {
            let user = handleResponse(response);
            localStorage.setItem('user', JSON.stringify(user));
            console.log(`returning user: ${user}`);
            return user;
        });*/
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll() {
    const requestOptions = {
        //credentials: "include",
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/users/register`, requestOptions).then(handleResponse);
}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/users/${user.id}`, requestOptions).then(handleResponse);;
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    //WHERE ARE MY HEADERS FROM FETCH
    console.log(response.status   )  //=> number 100–599
    console.log(response.statusText )//=> String
    console.log(response.headers.get('Auth')   ) //=> Headers
    console.log(response.url   )     //=> String
    /*//console.log(response.body   )     //=> String
    if (!response.ok) {
        console.log("not okay");
        if (response.status === 401) {
            // auto logout if 401 response returned from api
            logout();
            location.reload(true);
        }
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }
    var data = response.text().then(text => {
        console.log(`text ${JSON.stringify(text)}`);
        var data = text && JSON.parse(text);
        data.token = response.headers.get('Auth');
        console.log(data);
        return data;
    });*/
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                console.log(`logging out`);
                // auto logout if 401 response returned from api
                //logout();
                //location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        data.token = response.headers.get('Auth');
        return data;
    });
}