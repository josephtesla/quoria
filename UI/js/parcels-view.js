
window.addEventListener('load', async () => {

  document.querySelector("#loader").style.display = 'block';

  const all_orders_tab = document.querySelector("#all-orders-tab");
  const delivered_orders_tab = document.querySelector("#delivered-orders-tab");
  const transit_tab = document.querySelector("#transit-tab");
  const all_orders_count = document.querySelector("#all-count");
  const delivered_count = document.querySelector("#delivered-count");
  const transit_count = document.querySelector("#transit-count");


  const authToken = getLoggedInDetails().token;
  const user_id = getLoggedInDetails().user_id;

  
 //API REQUEST
  const { data } = await fetchData(`${API_PREFIX}/users/${user_id}/parcels`, authToken);

  const deliveredData = data.filter((parcel) => parcel.status == 'delivered');
  const transitData = data.filter((parcel) => parcel.status == 'transit');

  all_orders_count.textContent = data.length;
  delivered_count.textContent = deliveredData.length;
  transit_count.textContent = transitData.length;

  if (!data.length) all_orders_tab.innerHTML += '<h1 class="text-center">No Available Orders!</h1>'
  if (!deliveredData.length) delivered_orders_tab.innerHTML += '<h1 class="text-center">No Available Orders!</h1>'
  if (!transitData.length) transit_tab.innerHTML += '<h1 class="text-center">No Available Orders!</h1>'


  data.forEach(parcel_order => {
    let html = getParcelViewTemplate(parcel_order);
    all_orders_tab.innerHTML += html;
  });

  deliveredData.forEach(parcel_order => {
    let html = getParcelViewTemplate(parcel_order)
    delivered_orders_tab.innerHTML += html;
  });

  transitData.forEach(parcel_order => {
    let html = getParcelViewTemplate(parcel_order);
    transit_tab.innerHTML += html;
  });

  document.querySelector('#loader').style.display = 'none';


})