const getAdminEditTemplate = parcel => (`
<tr class="">
<td><b>${parcel._id}</b></td>
<td><b><small>${new Date(parcel.sentOn).toLocaleString()}</b></small></td>
<td><b><small>${parcel.status}</small></b> <br></td>
<td><b><small>${parcel.currentLocation}</td>
<td><button class="btn btn-primary" data-toggle="modal" data-target="#${parcel._id}_edit_Modal">Edit</button></td>
<div class="modal fade" id="${parcel._id}_edit_Modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
  aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title" id="exampleModalLabel">Edit Details</h3>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <p aria-hidden="true">&times;</p>
        </button>
      </div>
      <div class="modal-body">
        <form id="${parcel._id}_edit_form">
          <label>Pick Up Location: </label>
          <span>${parcel.from}</span> <br>
          <label>Destination: </label>
          <span>${parcel.to}</span> <br><br>
          <label for="currlocation">Edit current Location</label>
          <input style="width: 90%; padding: 10px 20px; border:1px solid #eba83d;"
           required type="text"
            id="currlocation_${parcel._id}"
            value="${parcel.currentLocation}"
            placeholder="Enter the current location of parcel"> <br> <br>
            <label for="status">Edit current status</label>
            <select id="status_${parcel._id}" class="form-control">
              <option value="${parcel.status}">${parcel.status}</option>
              <option value="placed">placed</option>
              <option value="transit">transit</option>
              <option value="delivered">delivered</option>
            </select><br>
            <button onclick="updateParcelDetails('${parcel._id}')" class="btn btn-primary">Update</button> 
      </form>
      </div>
      <div class="modal-footer">
        <button type="submit" class="btn btn-primary" data-dismiss="modal"
          aria-label="Close">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</div>
</tr>
`)

const getParcelViewTemplate = parcel_order => (
  `<div class="col-md-4">
    <div class="single-service-three wow fadeInUp" data-wow-delay=".2s">
      <div class="service-icon-three"><i class="fa fa-truck"></i></div>
      <h5>Order Id: ${parcel_order._id}</h5>
      <p>Placed on: ${new Date(parcel_order.sentOn).toLocaleString()} <br>
        Status: ${parcel_order.status} <br>
        Quantity: ${parcel_order.weight} ${parcel_order.weightmetric} 
      </p>
      <a href='parcel-actions.html?parcel_id=${parcel_order._id}' class="btn btn-primary" 
      style="background: rgb(56, 54, 54);">View full details</a>
    </div>
  </div>
  `
)

const LoadAdminAction = () => (
  `<div class="col-md-4 col-lg-4 col-sm-6 col-xs-12">
    <div class="single-blog wow fadeInUp" data-wow-delay="0.2s">
      <div class="blog-details text-center">
        <h3><a href="admin.html">Go to Admin Panel - Manage Delivery orders</a></h3>
        <a href="admin.html" class="read-more">Go to</a>
    </div>
    </div>
  </div>`
)