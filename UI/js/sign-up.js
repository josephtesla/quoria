if (localStorage.getItem('token')){
  redirect('actionpage.html');
}

//Sign in user
document.addEventListener('submit', (e) => {
  e.preventDefault();
  const fullname = document.querySelector('#fullname').value;
  const username = document.querySelector('#username').value;
  const email = document.querySelector('#email').value;
  const repeatPassword = document.querySelector("#repeat-password").value;
  const password = document.querySelector('#password').value;

  let formHasErrors = false;

  [fullname, username, email, password].forEach(field => {
    if (field === '') {
      const html = `<span class="alert alert-danger">Form has errors!. All fields are required!</span>`
      document.querySelector('.error-div').innerHTML = html;
      formHasErrors = true;
    }
  })

  if (password !== repeatPassword) {
    const html = `<span class="alert alert-danger">Form has errors!. The passwords do not match!</span>`
    document.querySelector('.error-div').innerHTML = html;
    formHasErrors = true;
  }

  if (!formHasErrors) {
    const formData = { fullname, username, email, password }
    postData(`${API_PREFIX}/auth/signup`, formData)
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
        const html = `<span class="alert alert-danger">Error occured while creating account.</span>`
        document.querySelector('.error-div').innerHTML = html;
        console.log(error)
      })

    if (document.querySelector('.alert'))
      document.querySelector('.alert').style.display = 'none';

  }


})