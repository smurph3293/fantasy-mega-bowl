export function authHeader() {
    console.log('auth header called');
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
        console.log(`sending token ${user.token}`);
        return { 'Authorization':user.token };
    } else {
        return {};
    }
}