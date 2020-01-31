
const parcelOrderId = window.location.search.split("&")[0].split("=")[1];
document.querySelector('title').textContent = `ORDER ID: ${parcelOrderId} - Courier Service App`;
document.querySelector('#order-id').textContent = parcelOrderId;
document.querySelector('#order-cancel-id').textContent = parcelOrderId;

const authToken = getLoggedInDetails().token;
const userId = getLoggedInDetails().user_id;

const loadingSpinner = document.querySelector('#loader');

window.addEventListener('load', async () => {

  loadingSpinner.style.display = 'block'

  const { data } = await fetchData(`${API_PREFIX}/parcels/${parcelOrderId}`, authToken);
  console.log(data)
  document.querySelector('#order-date').textContent = new Date(data[0].sentOn).toLocaleString();
  document.querySelector('#order-pickup').textContent = data[0].from;
  document.querySelector('#order-current').textContent = data[0].currentLocation;
  document.querySelector('#order-dest').textContent = data[0].to;
  document.querySelector('#current-dest').textContent = data[0].to;
  document.querySelector('#order-status').textContent = data[0].status;
  document.querySelector('#order-quantity').textContent = `${data[0].weight} ${data[0].weightmetric}`;

  if (data[0].status === 'delivered') {
    document.querySelector('#details').innerHTML += `
    <strong>Date Delivered</strong>: <span id="order-delivered-date">
    ${new Date(data[0].deliveredOn).toLocaleString()}
    </span> <br>
    `;
  }
  loadingSpinner.style.display = 'none'

  document.querySelector('#cancel-confirm-btn').addEventListener('click', async (ev) => {
    ev.preventDefault();
    loadingSpinner.style.display = 'block';

    //API REQUEST - Make changes
    await patchData(`${API_PREFIX}/parcels/${parcelOrderId}/cancel`, {}, authToken);


    document.querySelector("#cancel-modal-trigger").click();
    window.addEventListener('click', () => {
      redirect('parcels-view.html');
    })
  })

  document.querySelector('#dest-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const newDestination = document.querySelector("#newDestination").value;
    document.querySelector('#dest-closer').click();
    loadingSpinner.style.display = 'block';

    //API REQUEST
    const resp = await patchData(`${API_PREFIX}/parcels/${parcelOrderId}/${userId}/destination`, { newDestination }, authToken);

    document.querySelector('#order-dest').textContent = resp.data[0].to;
    loadingSpinner.style.display = 'none';
    alert('Order delivery destination has been updated!');

  })

})
