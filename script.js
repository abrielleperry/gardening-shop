$(document).ready(function () {
  function showLoader() {
    $("#loader").show();
  }

  function hideLoader() {
    $("#loader").hide();
  }

  // map sunlight conditions for catagories
  const sunlightMapping = {
    "full sun": [
      "full sun",
      "Full sun",
      "Sun",
      "Full sun only if soil kept moist"
    ],
    "part sun": [
      "Partial sun",
      "part sun/part shade",
      "Part sun/part shade",
      "Partial sun Shade",
      "Full sun Partial sun",
      "Full sun Partial sun Shade"
    ],
    "part shade": [
      "part shade",
      "Part shade",
      "part sun/part shade",
      "Part sun/part shade",
      "Partial Shade",
      "Partial sun Shade",
      "full sun only if soil kept moist",
      "Sun-part shade"
    ],
    "filtered shade": [
      "filtered shade",
      "Filtered shade",
      "Deciduous Shade (Spring Sun)"
    ],
    "Deep shade": [
      "full shade",
      "Full shade",
      "Shade",
      "Deep shade",
      "deep shade",
      "Sheltered"
    ]
  };

  // map plant types for catafories
  const typeMapping = {
    Trees: [
      "Tree",
      "Needled evergreen",
      "Broadleaf evergreen",
      "Tree - deciduous"
    ],
    "Shrubs and Bushes": [
      "Deciduous shrub",
      "Shrub",
      "Bush",
      "Shrub - deciduous"
    ],
    "Herbaceous Plants": [
      "Herb",
      "Herbs",
      "Perennial herbs",
      "Biennial",
      "Herbaceous perennial",
      "Ground cover",
      "Herbaceous perennial",
      "Poales (grass-like)",
      "Semi-evergreen",
      "Herbaceous perennial",
      "Poales (grass-like)",
      "Herbaceous perennial"
    ],
    "Flowers and Flowering Plants": [
      "Flower",
      "Carnation",
      "Chrysanthemum",
      "Dianthus",
      "Coneflower",
      "Euphorbia",
      "Aster",
      "Gladiolus",
      "Sunflower",
      "ShastaDaisy",
      "Peony",
      "Veronica",
      "CreepingZinnia",
      "Wildflower"
    ],
    "Grasses and Grass-like Plants": [
      "Grass",
      "Turfgrass",
      "Ornamental grass",
      "Rush or Sedge",
      "Reeds",
      "Reed",
      "GRAMINOIDS",
      "FORBS"
    ],
    "Vines and Climbers": [
      "Vine",
      "Climbers",
      "Creeper",
      "Creepers",
      "Broadleaf evergreen",
      "Vine or climber"
    ],
    "Ground Covers": [
      "Ground Cover",
      "Ground Cover Fern Wildflower",
      "Broadleaf evergreen",
      "Ground cover",
      "Broadleaf evergreen",
      "Ground cover",
      "Vine or climber"
    ],
    "Ferns and Mosses": ["Fern", "PTERIDOPHYTES", "Moss"],
    "Specialty Plants": [
      "Cactus",
      "Carnivorous",
      "Epiphyte",
      "Palm or Cycad",
      "Bulb",
      "Orchid",
      "Indoor foliage plant"
    ],
    "Edible Plants": ["Vegetable", "Fruit", "Grain"],
    "Weeds and Wild Plants": ["Weed", "Thrift", "Thistle", "Wildflower"]
  };

  function normalizePlantType(value) {
    for (let key in typeMapping) {
      if (typeMapping[key].includes(value)) {
        return key;
      }
    }
    return value;
  }

  function normalizeSunlightCondition(value) {
    for (let key in sunlightMapping) {
      if (sunlightMapping[key].includes(value)) {
        return key;
      }
    }
    return value;
  }

  function applyFilters(plants) {
    let sunlightFilter = $("#sunlight").val().trim().toLowerCase();
    let wateringFilter = $("#watering").val().trim().toLowerCase();
    let cycleFilter = $("#cycle").val().trim().toLowerCase();
    let indoorFilter = $("#indoor").val().trim().toLowerCase();
    let typeFilter = $("#type").val().trim();
    let filteredPlants = plants.filter((plant) =>
      filterPlants(
        plant,
        sunlightFilter,
        wateringFilter,
        cycleFilter,
        indoorFilter,
        typeFilter
      )
    );
    displayPlants(filteredPlants);
  }

  function filterPlants(
    plant,
    sunlightFilter,
    wateringFilter,
    cycleFilter,
    indoorFilter,
    typeFilter
  ) {
    let sunlightMatch =
      sunlightFilter === "" ||
      (Array.isArray(plant.sunlight) &&
        plant.sunlight
          .map((s) => s.trim().toLowerCase())
          .includes(sunlightFilter));
    let wateringMatch =
      wateringFilter === "" ||
      (plant.watering &&
        plant.watering.trim().toLowerCase().includes(wateringFilter));
    let cycleMatch =
      cycleFilter === "" ||
      (plant.cycle && plant.cycle.trim().toLowerCase() === cycleFilter);
    let indoorMatch =
      indoorFilter === "" ||
      (indoorFilter === "indoor" ? plant.indoor : !plant.indoor);
    let typeMatch =
      typeFilter === "" ||
      (plant.type && normalizePlantType(plant.type.trim()) === typeFilter);

    return (
      sunlightMatch && wateringMatch && cycleMatch && indoorMatch && typeMatch
    );
  }

  function loadPlantApi() {
    $.ajax({
      type: "GET",
      url: "detailed_plants.json",
      dataType: "json",
      beforeSend: function () {
        showLoader();
      },
      success: function (response) {
        hideLoader();
        response.forEach((plant) => {
          if (Array.isArray(plant.sunlight)) {
            plant.sunlight = plant.sunlight.map((value) =>
              normalizeSunlightCondition(value.trim().toLowerCase())
            );
          }
          if (plant.type) {
            plant.type = normalizePlantType(plant.type.trim());
          }
        });
        displayPlants(response);
        $("#sunlight, #watering, #cycle, #indoor, #type").on(
          "change",
          function () {
            applyFilters(response);
          }
        );
      },
      error: function (textStatus, errorThrown) {
        hideLoader();
        console.error("Error: " + textStatus, errorThrown);
        alert("Failed to load plant data: " + errorThrown);
      }
    });
  }

  function displayPlants(plants) {
    $("#plant-container").empty();
    plants.forEach((data) => {
      let imageUrl =
        data.default_image && data.default_image.small_url
          ? data.default_image.small_url
          : "https://via.placeholder.com/150";
      let otherNames =
        data.other_name.length > 0 ? data.other_name.join(", ") : "N/A";
      let plantCard = `
  <div class="plant-card card m-2 " style="width: 25rem;">
    <div class="card-header">
      <h5>${data.common_name}</h5>
    </div>
    <div class="row ">
      <div class="col-8">
        <img src="${imageUrl}" alt="${data.common_name}" class="img-fluid">
      </div>
      <div class="col ">
      <p>Scientific name: </br> ${data.scientific_name.join(", ")}</p>
      </div>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-3">Type: ${data.type}</div>
        <div class="col-3">${data.dimension}</div>
        <div class="col-3">Sunlight: ${
          Array.isArray(data.sunlight)
            ? data.sunlight.join(", ")
            : data.sunlight
        }</div>
        <div class="col-3">Watering: ${data.watering}</div>
      </div>
      <a href="#" class="btn btn-primary">More details</a>
      <a href="#" class="btn btn-primary">Add to cart</a>
    </div>
  </div>
`;

      $("#plant-container").append(plantCard);
    });
    updatePlantCount(plants.length);
  }

  function updatePlantCount(count) {
    $("#plant-count").text(`Number of plants: ${count}`);
  }

  //logUniqueTypeValues();
  // logUniqueSunlightValues();
  loadPlantApi();
});
