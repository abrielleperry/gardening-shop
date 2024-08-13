$(document).ready(function () {
  console.log("Document is ready");

  function showLoader() {
    $("#loader").show();
  }

  function hideLoader() {
    $("#loader").hide();
  }

  var splide = new Splide(".splide", {
    type: "loop",
    autoplay: true,
    speed: 1000,
    perPage: 3,
    perMove: 1,
    arrows: false,
    dots: false,
    spacing: "0px",
    pagination: false
  });

  splide.mount();

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
    "Shrubs & Bushes": [
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
    "Flowers & Flowerings": [
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
    "Grasses & Grass-likes": [
      "Grass",
      "Turfgrass",
      "Ornamental grass",
      "Rush or Sedge",
      "Reeds",
      "Reed",
      "GRAMINOIDS",
      "FORBS"
    ],
    "Vines & Climbers": [
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
    "Ferns & Mosses": ["Fern", "PTERIDOPHYTES", "Moss"],
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
    if (!value) {
      return value;
    }
    const lowerCaseValue = value.toLowerCase();
    for (let key in typeMapping) {
      if (
        typeMapping[key].map((v) => v.toLowerCase()).includes(lowerCaseValue)
      ) {
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
    let hardinessFilter = $("#hardiness").val().trim();

    let filteredPlants = plants.filter((plant) =>
      filterPlants(
        plant,
        sunlightFilter,
        wateringFilter,
        cycleFilter,
        indoorFilter,
        typeFilter,
        hardinessFilter
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
    typeFilter,
    hardinessFilter
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
    let hardinessMatch = true;

    if (hardinessFilter !== "") {
      let hardiness = parseInt(hardinessFilter);
      let minZone = parseInt(plant.hardiness.min);
      let maxZone = parseInt(plant.hardiness.max);
      hardinessMatch = hardiness >= minZone && hardiness <= maxZone;
    }

    return (
      sunlightMatch &&
      wateringMatch &&
      cycleMatch &&
      indoorMatch &&
      typeMatch &&
      hardinessMatch
    );
  }

  function cleanDimension(dimension) {
    if (!dimension) return "";
    dimension = dimension.replace(/height\s*/i, "").trim();
    dimension = dimension.replace(/(\d+)\.\d+/g, "$1");
    dimension = dimension.replace(/\s+/g, " ").trim();
    if (dimension === "0 cm" || dimension === "0 - 0 cm" || dimension === "") {
      return "";
    }
    return dimension;
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
        $("#sunlight, #watering, #cycle, #indoor, #type, #hardiness").on(
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

  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  function handleAddToCartClick(event) {
    event.preventDefault();
    const plantCard = event.target.closest(".plant-card");
    const priceP = plantCard.querySelector(".price");
    const plantId = plantCard.getAttribute("data-plant-id");

    if (priceP && plantId) {
      const price = priceP.textContent;
      const cartData = JSON.stringify({ id: plantId, price: price });
      setCookie("cartData", cartData, 1);
      console.log("Cookie set: ", document.cookie);
    } else {
      console.error("Price element or plant ID not found");
    }
  }

  document.addEventListener("click", function (event) {
    if (event.target.closest(".add-to-cart-btn")) {
      handleAddToCartClick(event);
    }
  });

  function displayPlants(plants) {
    $("#plant-container").empty();
    if (plants.length === 0) {
      $("#no-plants-message").show();
      return;
    } else {
      $("#no-plants-message").hide();
    }

    plants.forEach((data) => {
      const normalizedType = normalizePlantType(data.type);
      if (normalizedType === "Trees") {
        return;
      }

      if (!data.default_image || !data.default_image.small_url) {
        return;
      }
      let imageUrl = data.default_image.medium_url;
      let otherNames =
        data.other_name.length > 0 ? data.other_name.join(", ") : "N/A";
      let dimension = cleanDimension(data.dimension);

      let firstSunlightCondition = Array.isArray(data.sunlight)
        ? data.sunlight[0]
        : data.sunlight;
      let randomPrice = getRandomPrice();

      let plantCard = `
            <div class="col-12 col-sm-6 col-md-4 col-lg-4 mb-4">
                <div class="plant-card card h-100" data-plant-id="${data.id}">
                    <img src="${imageUrl}" alt="${data.common_name}" class="card-img-top img-fluid">
                    <div class="card-body">
                        <div class="plant-title">
                            <div class="row ">
                                <div class="col">
                                    <p class="common-name text-capitalize">${data.common_name}</p>
                                      <p class="price">$${randomPrice}</p>
                                </div>
                                <div class="col-auto cart">
                                  <button class="add-to-cart-btn btn ">
                                <img src="images/cart-plus-solid.svg" alt="Cart Icon">
                                    </button>
                                </div>
                            </div>
                            <div class="plant-description row mx-auto">
                                <div class="col-content col-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="#2c402f" d="M512 32c0 113.6-84.6 207.5-194.2 222c-7.1-53.4-30.6-101.6-65.3-139.3C290.8 46.3 364 0 448 0l32 0c17.7 0 32 14.3 32 32zM0 96C0 78.3 14.3 64 32 64l32 0c123.7 0 224 100.3 224 224l0 32 0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160C100.3 320 0 219.7 0 96z"/>
                                    </svg>
                                    <p class="">${data.type}</p>
                                </div>
                                <div class="col-content col-3">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 22V2M12 22L8 18M12 22L16 18M12 2L8 6M12 2L16 6" stroke="#40241E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                    <p>${dimension}</p>
                                </div>
                            </div>
                            <div class="plant-description row mx-auto">
                                <div class="col-content col-3 ${data.sunlight}">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="#f5c665" d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"/>
                                    </svg>
                                    <p class="text-capitalize">${firstSunlightCondition}</p>
                                </div>
                                <div class="col-content col-3 ${data.watering}">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                        <path fill="#306670" d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0l1.8 0c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z"/></svg>
                                    <p>${data.watering}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bottom">
                    <button type="button" class="btn  mx-auto" data-bs-toggle="modal" data-bs-target="#exampleModal">
        <img src="images/plus-solid.svg" alt="Cart Icon">

                    </button>
                    </div>
                </div>
            </div>
        `;

      let plantModal = `
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header row">
        <button type="button" class="btn-close me-3 mt-2" data-bs-dismiss="modal" aria-label="Close"></button>
          <h1 class="modal-title  text-capitalize " id="exampleModalLabel">
      ${data.common_name}</h1>
    
      <p class="  text-capitalize " id="exampleModalLabel"> Scientific Name:
      ${data.scientific_name}</p>
        </div>
      <div class="modal-body">
  <div class="container-fluid">
    <div class="row">
      <div class="description">
<div class="modal-img ">
        <img src="${imageUrl}" alt="${data.common_name}" >
  
        </div>
        <p>${data.description}
</div>
</p>
        <div class="plant-description row mx-auto">
              <div class="col-content col-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path fill="#2c402f" d="M512 32c0 113.6-84.6 207.5-194.2 222c-7.1-53.4-30.6-101.6-65.3-139.3C290.8 46.3 364 0 448 0l32 0c17.7 0 32 14.3 32 32zM0 96C0 78.3 14.3 64 32 64l32 0c123.7 0 224 100.3 224 224l0 32 0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160C100.3 320 0 219.7 0 96z"/>
                  </svg>
                  <p class="">${data.type}</p>
              </div>
              <div class="col-content col-3">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22V2M12 22L8 18M12 22L16 18M12 2L8 6M12 2L16 6" stroke="#40241E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                  <p>${dimension}</p>
              </div>
          </div>
          <div class="plant-description row mx-auto">
              <div class="col-content col-3 ${data.sunlight}">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path fill="#f5c665" d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"/>
                  </svg>
                  <p class="text-capitalize">${firstSunlightCondition}</p>
              </div>
              <div class="col-content col-3 ${data.watering}">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                      <path fill="#306670" d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0l1.8 0c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z"/></svg>
                  <p>${data.watering}</p>
              </div>
          </div>
</div>
<div class="table-responsive">
<table class="table">
  <tbody>
    <tr>
  <td>Hardiness</td>
    <td>${data.hardiness.min} - ${data.hardiness.max}</td>
    </tr>
    <tr>
    <td>Growth Rate</td>
    <td>${data.growth_rate}</td>
    </tr>
    <tr>
    <td>Care Level</td>
      <td> ${data.care_level}</td>
  </tr>
  <tr>
      <td>Watering</td>
      <td>${data.watering_general_benchmark.value} ${data.watering_general_benchmark.unit}</td>
      </tr>
      <tr>
      <td>Pruning</td>
      <td>${data.pruning_month}</td>
    </tr>
  </tbody>
</div>
  </div>
</div>
      </div>
    </div>
  </div>
        `;
      $("#plant-container").append(plantCard);
      $("#plant-container").append(plantModal);
    });

    updatePlantCount(plants.length);
  }

  function updatePlantCount(count) {
    $("#plant-count").text(`Number of plants: ${count}`);
  }

  //logUniqueTypeValues();
  // logUniqueSunlightValues();

  function resetFilters() {
    $("#sunlight").val("");
    $("#watering").val("");
    $("#cycle").val("");
    $("#indoor").val("");
    $("#type").val("");
    $("#hardiness").val("");
    loadPlantApi();
  }
  $("#reset-filters").on("click", function (event) {
    event.preventDefault();
    resetFilters();
  });

  loadPlantApi();
});
