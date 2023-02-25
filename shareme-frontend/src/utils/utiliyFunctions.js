export const returnUserInfo =() => {
    return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();
}