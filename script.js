$(document).ready(function () {
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

  function showLoader() {
    $("#loader").show();
  }

  function hideLoader() {
    $("#loader").hide();
  }

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

  function cleanDimension(dimension) {
    if (!dimension) return "";
    const match = dimension.match(
      /(\d+(\.\d+)?\s*(feet|ft|meters|m|cm|inches|in))/i
    );
    return match ? match[0] : "";
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

  function getRandomPrice(min = 5, max = 100) {
    return (Math.random() * (max - min) + min).toFixed(2);
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
      let dimension = cleanDimension(data.dimension);

      let firstSunlightCondition = Array.isArray(data.sunlight)
        ? data.sunlight[0]
        : data.sunlight;
      let randomPrice = getRandomPrice();

      let plantCard = `
  <div class="plant-card card">
    
    <img src="${imageUrl}" alt="${
        data.common_name
      }" class="plant-card-img card-img-top img-fluid">
  
    <div class="card-body">
    <div class="plant-title">
    <p class="common-name">${data.common_name}</p>
      <p>${data.scientific_name.join(", ")}</p>
      </div>
      <div class="plant-description row mx-auto   ">
        <div class="col-content col-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#2c402f" d="M512 32c0 113.6-84.6 207.5-194.2 222c-7.1-53.4-30.6-101.6-65.3-139.3C290.8 46.3 364 0 448 0l32 0c17.7 0 32 14.3 32 32zM0 96C0 78.3 14.3 64 32 64l32 0c123.7 0 224 100.3 224 224l0 32 0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160C100.3 320 0 219.7 0 96z"/></svg>
        <p class="text-capitalize">${data.type}</p>
        </div>
        <div class="col-content col-3">
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 22V2M12 22L8 18M12 22L16 18M12 2L8 6M12 2L16 6" stroke="#40241E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>        
<p>${dimension}</p>
        </div>
    <div class="col-content col-3  ${data.sunlight}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="#f5c665" d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"/>
              </svg>
              <p class="text-capitalize">${firstSunlightCondition}</p>
            </div>
<div class="col-content col-3 ${data.watering}">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#306670" d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0l1.8 0c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z"/></svg>  <p>${
        data.watering
      }</p>
</div>

      </div>
      <div class="row price-buy">
    <div class="col">
    <p>$${randomPrice}</p>
    </div>
    
<div class="col">
        <a href="#" class="btn btn-primary">Add to cart</a>
  
</div>    
      </div>
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
