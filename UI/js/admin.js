async function updateParcelDetails(parcel_id) {
  const loader = document.querySelector("#loader");
  const status = document.querySelector(`#status_${parcel_id}`).value;
  const currlocation = document.querySelector(`#currlocation_${parcel_id}`).value;
  const userId = getLoggedInDetails().user_id;
  const authToken = getLoggedInDetails().token;
  try {
    loader.style.display = "block";
    await patchData(`${API_PREFIX}/parcels/${parcel_id}/${userId}/status`, { status }, authToken);
    await patchData(`${API_PREFIX}/parcels/${parcel_id}/${userId}/currentlocation`, { currlocation }, authToken);
    loader.style.display = "none";
    redirect(window.location.href);
  }
  catch (error) {
    console.log(error)
  }
}

window.addEventListener('load', async () => {
  const authToken = getLoggedInDetails().token;
  const { data } = await fetchData(`${API_PREFIX}/parcels`, authToken);
  data.forEach(parcel => {
    const html = getAdminEditTemplate(parcel);
    document.querySelector('#data-body').innerHTML += html;
  });

})