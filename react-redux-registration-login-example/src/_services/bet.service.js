import config from 'config';
import { authHeader } from '../_helpers';

export const betService = {
    create,
    getAll,
    delete: _delete
};

async function create(title, description, opponents, user) {
    console.log(`about to create bet with opponents: ${JSON.stringify(opponents)}`);
    console.log(`about to create bet with user: ${JSON.stringify(user)}`);
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
        body: JSON.stringify({ 'owner':user, 'opponents':opponents, title, description }),
    };
    console.log(`sending body: ${JSON.stringify(requestOptions.body)}`);
    const response = await fetch(`${config.apiUrl}/bets`, requestOptions);
    console.log(`auth header: ${response.headers.get('Auth')}`);
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
    var bet =  response.json();
    //user.token = response.headers.get('Auth');
    console.log(`returning bet: ${JSON.stringify(bet)}`);
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    //localStorage.setItem('user', JSON.stringify(user));
    location.reload(true);
    return bet;
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

    return fetch(`${config.apiUrl}/bets`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    console.log(`deleteing with: ${config.apiUrl}/bets/${id}`);
    return fetch(`${config.apiUrl}/bets/${id}`, requestOptions)
        .then(function(response) {
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
            location.reload(true);
        })//.then(handleResponse);
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
        console.log(`text in handle resposne: ${text}`);
        const data = text && JSON.parse(text);
        //console.log(`data in handle resposne: ${JSON.stringify(data)}`);
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