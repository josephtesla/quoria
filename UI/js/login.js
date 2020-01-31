if (localStorage.getItem('token')){
  redirect('actionpage.html');
}

//Log in user
document.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;

  let formHasErrors = false;

  [username, password].forEach(field => {
    if (field === '') {
      const html = `<span class="alert alert-danger">Form has errors!. All fields are required!</span>`
      document.querySelector('.error-div').innerHTML = html;
      formHasErrors = true;
    }
  })

  if (!formHasErrors) {
    const formData = { username, password };
    postData(`${API_PREFIX}/auth/login`, formData)
      .then(resp => {
        if (resp.error) {
          const html = `<span class="alert alert-danger">${resp.error}</span>`
          document.querySelector('.error-div').innerHTML = html;
        } else {
          const { token, user } = resp.data[0];
          storeUserLoggin(
            user._id,
            token,
            user.fullname,
            user.username
          );
          redirect('actionpage.html')
        }
      }).catch((error) => {
        const html = `<span class="alert alert-danger">Error occured while logging in.</span>`
        document.querySelector('.error-div').innerHTML = html;
        console.log(error)
      })

    if (document.querySelector('.alert'))
      document.querySelector('.alert').style.display = 'none';
  }


})