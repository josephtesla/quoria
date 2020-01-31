const API_PREFIX = "http://quoria-service.herokuapp.com/api/v1";

const userIsLoggedIn = () => localStorage.getItem("token");

const getLoggedInDetails = () => ({
  user_id: localStorage.getItem("user_id"),
  fullname: localStorage.getItem("fullname"),
  token: localStorage.getItem('token'),
  username: localStorage.getItem('username')
})

const fetchParams = (method, token = '', body) => (
  {
    method: method,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'x-access-token': token
    },
    mode: 'cors',
    cache: 'no-cache',
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify(body)
  }
)

const fetchData = async (url, token) => {
  try {
    const resp = await fetch(url, fetchParams('GET', token));
    const result = await resp.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}

const postData = async (url, body, token = '') => {
  try {
    const resp = await fetch(url, fetchParams('POST', token, body))
    const result = await resp.json();
    return result
  } catch (error) {
    console.log(error)
  }
}

const patchData = async (url, body, token = '') => {
  try {
    const resp = await fetch(url, fetchParams('PATCH', token, body))
    const result = await resp.json();
    return result
  } catch (error) {
    console.log(error)
  }
}

const storeUserLoggin = (user_id, token, fullname, username) => {
  localStorage.setItem('user_id', user_id)
  localStorage.setItem('token', token);
  localStorage.setItem('fullname', fullname);
  localStorage.setItem('username', username);
}

const clearUserLoggin = () => {
  localStorage.clear();
}

const redirect = (url) => {
  window.location.href = url
}