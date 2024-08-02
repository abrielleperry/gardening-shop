$(document).ready(function () {

  function showLoader() {
    $("#loader").show();
  }

  function hideLoader() {
    $("#loader").hide();
  }

  function loadPlantApi() {
    $.ajax({
      type: "GET",
      url: 'plant_data.json',
      dataType: "json",
      beforeSend: function () {
        showLoader();
      },
      success: function (response) {
        hideLoader();
        response.forEach((data) => {
          let imageUrl = data.default_image && data.default_image.small_url ? data.default_image.small_url : 'https://via.placeholder.com/150';
          console.log(imageUrl); 
          let otherNames = data.other_name.length > 0 ? data.other_name.join(', ') : 'N/A';
          let plantCard = `
          <div class="plant-card card m-2" style="width: 18rem;">
          <img src="${imageUrl}" alt="${data.common_name}" class="card-img-top">
          <div class="card-header">${data.common_name}</div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
              <li class="list-group-item">Scientific name: ${data.scientific_name.join(', ')}</li>
              <li class="list-group-item">Other names: ${otherNames}</li>
              <li class="list-group-item">${data.cycle}</li>
              <li class="list-group-item">${data.watering}</li>
              <li class="list-group-item">${data.sunlight}</li>

              </ul>
              <a href="#" class="btn btn-primary">More details</a>
              <a href="#" class="btn btn-primary">Add to cart</a>
            </div>
          </div>
          `;
          $("#plant-container").append(plantCard);
        });
        console.log(response);

      },
      error: function (textStatus, errorThrown) {
        hideLoader();
        console.error("Error: " + textStatus, errorThrown);
        alert('Failed to load plant data: ' + errorThrown);
      }
    });
  }

  loadPlantApi(); // Start loading from local JSON file
});
