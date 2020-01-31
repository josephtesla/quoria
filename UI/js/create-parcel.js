if (!userIsLoggedIn()) {
  redirect("index.html")
}


document.addEventListener('submit', async (e) => {
  e.preventDefault();

  const from = document.querySelector('#from').value;
  const to = document.querySelector("#destination").value;
  const weightmetric = document.querySelector("#wmetric").value;
  const weight = document.querySelector('#weight').value;
  const loader = document.querySelector("#loader");

  const user_id = getLoggedInDetails().user_id;
  const token = getLoggedInDetails().token;

  const formData = { from, to, weightmetric, weight };

  try {
    loader.style.display = 'block';
    const resp = await postData(`${API_PREFIX}/parcels/${user_id}`, formData, token);
    loader.style.display = 'none';
    document.querySelector("#order-confirm-toggler").click();
    window.addEventListener('click', () => { redirect("actionpage.html") })

  } catch (error) {

    console.log(error)
  }

})