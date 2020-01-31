window.addEventListener('load', async () => {
  const authToken = getLoggedInDetails().token;
  const user_id = getLoggedInDetails().user_id;
  const action_cards = document.querySelectorAll(".action_card");

  const resp = await fetchData(`${API_PREFIX}/users/${user_id}/isAdmin`, authToken);
  if (resp.is_admin){
    document.querySelector("#actions_row").innerHTML += LoadAdminAction();
  }
  else {
    action_cards.forEach((card) => {
      card.classList.remove("col-md-4", "col-lg-4")
    })
  }

  const orders_count = document.querySelector('#orders-total');
  const orders_delivered = document.querySelector('#orders-delivered');
  const orders_transit = document.querySelector('#orders-transit');
  
 //API REQUEST
  const { data } = await fetchData(`${API_PREFIX}/users/${user_id}/parcels`, authToken);

  const deliveredData = data.filter((parcel) => parcel.status == 'delivered');
  const transitData = data.filter((parcel) => parcel.status == 'transit');

  orders_count.textContent = data.length;
  orders_delivered.textContent = deliveredData.length;
  orders_transit.textContent = transitData.length

})