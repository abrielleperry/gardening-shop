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

  // map flower colors for catagories
  const flowerColorMapping = {
    White: [
      "White",
      "Cream",
      "Ivory",
      "Whitish",
      "White to light pink",
      "White with pink tinge",
      "White sometimes flushed with pink",
      "White to purplish-pink",
      "White to pale pink",
      "White with purple petal bases",
      "White rays with yellow centers",
      "White to pink blushed with yellow",
      "White with yellow center",
      "White with pale yellow centers",
      "White rays with yellow center disks",
      "White with greenish-yellow centers",
      "White with yellow centers (Japanese form)",
      "Shell pink aging to white",
      "White with pink veins",
      "White with purple crown",
      "White sometimes blushed with pink (or reddish pink)",
      "White with red on petal reverses",
      "White with pink throats",
      "White with yellow throats",
      "White with greenish yellow blotch",
      "White tinged with coral",
      "White (semi-double)",
      "White, cream"
    ],
    Yellow: [
      "Yellow",
      "Soft yellow",
      "Pale yellow",
      "Yellow with purple center",
      "Greenish yellow",
      "Yellow-green",
      "Creamy yellow",
      "Yellowish-green",
      "Bright yellow",
      "Golden yellow",
      "Light yellow",
      "Lemon yellow",
      "Yellow and white",
      "Yellow rays with dark brown center",
      "Yellow rays with green center disk",
      "Yellow with red tips",
      "Yellow with red at base",
      "Yellow with orange tube",
      "Yellow sometimes tinged with orange or red",
      "Yellow tinged with purple",
      "Yellow with yellow to chartreuse bracts",
      "Yellow petals",
      "Yellow rays with brown center disk",
      "Yellow flowers",
      "Yellow flowers with red throats",
      "Yellow-orange",
      "Yellow-orange petals"
    ],
    Pink: [
      "Pink",
      "Pale pink",
      "Pink and Creamy White",
      "Pinkish-white",
      "Pink to white",
      "Pinkish white",
      "Pink to lavender",
      "Pink to mauve",
      "Pink to rose-purple",
      "Rose-pink",
      "Pinkish-red",
      "Pink with deep pink accents",
      "Pink (double)",
      "Pink (single)",
      "Pink and white with raspberry crests",
      "Pink and yellow",
      "Rose pink with raspberry calyxes",
      "Pink with a magenta blotch",
      "Pink with red eyes",
      "Pink with dark red eye",
      "Pink-purple",
      "Blush pink"
    ],
    Red: [
      "Red",
      "Dark red",
      "Reddish-purple",
      "Reddish-pink",
      "Reddish-orange",
      "Brick red",
      "Rose red",
      "Cherry red",
      "Crimson pink",
      "Crimson rose",
      "Rose-red",
      "Maroon",
      "Dark maroon",
      "Burgundy",
      "Deep red",
      "Ruby red",
      "Pinkish red",
      "Reddish-bronze",
      "Red-orange",
      "Orange-red",
      "Red with deeper crimson eye",
      "Red with yellow interior",
      "Scarlet red",
      "Dark red with white throat",
      "Red with white throat",
      "Red with yellow stamens",
      "Red/purple",
      "Red, pink, yellow, white"
    ],
    Purple: [
      "Purple",
      "Purplish red",
      "Violet",
      "Lavender",
      "Violet-blue",
      "Purple-blue",
      "Lilac",
      "Lavender-blue",
      "Purplish-pink",
      "Purplish white",
      "Lavender-pink",
      "Lavender to purple",
      "Lavender gray",
      "Lavender to pale purple",
      "Deep purple",
      "Dark purple",
      "Lilac-purple",
      "Light purple",
      "Purple with white stripes",
      "Purple with yellow center disk",
      "Purple-pink",
      "Purplish red with pink bracts",
      "Pinkish-purple",
      "Lavender with dark red eye",
      "Violet purple",
      "Lavender, blue",
      "Rose pink tinged with lilac"
    ],
    Blue: [
      "Blue",
      "Azure blue",
      "Blue to violet",
      "Deep purplish blue",
      "Violet-blue",
      "Blue-lavender",
      "Bluish-purple",
      "Light blue",
      "Blue with red stamens",
      "Bluish green",
      "Pale blue",
      "Blue with yellow center eye",
      "Dark blue with yellow stamens",
      "Sky blue",
      "Navy blue",
      "Pale to dark blue",
      "Lavender, blue",
      "Lilac blue",
      "Steel blue",
      "Violet-blue",
      "Blue/purple"
    ],
    Orange: [
      "Orange",
      "Reddish-orange",
      "Orange-pink",
      "Burnt orange",
      "Bright orange",
      "Orange to red",
      "Orange-red",
      "Orange-yellow",
      "Peach with yellow throat",
      "Peach to copper orange",
      "Pumpkin orange",
      "Rusty red",
      "Coral-bronze",
      "Marmalade orange",
      "Yellow-orange petals",
      "Orange-veined yellow flowers",
      "Pale orange",
      "Orange with yellow center",
      "Orange to yellow",
      "Orange and yellow",
      "Orange-pink to dark coral",
      "Orange, scarlet"
    ],
    Green: [
      "Green",
      "Greenish",
      "Greenish white",
      "Greenish-yellow",
      "Greenish-yellow to creamy white spathe",
      "Yellowish-green to creamy white",
      "Greenish-white tinged with purple",
      "Yellowish-gray",
      "Pale green",
      "Yellow-green",
      "Green/purple",
      "Green with showy yellow bracts",
      "Greenish white with purple",
      "Green with orange bracts"
    ],
    Brown: [
      "Brown",
      "Brownish",
      "Yellowish to reddish brown",
      "Brownish-purple",
      "Yellowish brown",
      "Brownish-red",
      "Yellowish brown",
      "Brown with yellow centers",
      "Dark brown with yellow centers",
      "Yellowish-brown",
      "Light brown",
      "Brownish-purple with yellow centers",
      "Brownish-yellow"
    ],
    "Multi-colored": [
      "Multicolored in purple, mauve, green, brown and white",
      "Yellow, orange, and bright pink",
      "Red, pink, yellow, white",
      "White, yellow, orange, red and purple, often mixed in same cluster",
      "Red, yellow, orange, pink, rose, lavender, green and white",
      "Bicolor shades of yellow, orange, red and brown with a brown cone",
      "Red-orange and yellow bicolor ray florets with dark brown central disk",
      "Yellow and red rays with brown centers",
      "Yellow rays with brown center disk",
      "Coral pink with yellow centers",
      "Pink (alkaline soils) Blue (acid soils)"
    ]
  };

  function normalizeFlowerColor(value) {
    for (let key in flowerColorMapping) {
      if (flowerColorMapping[key].includes(value)) {
        return key;
      }
    }
    return value;
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

  // function logUniqueSunlightValues() {
  $.ajax({
    type: "GET",
    url: "detailed_plants.json",
    dataType: "json",
    success: function (response) {
      console.log("AJAX request successful");

      const uniqueSunlightValues = new Set();
      response.forEach((plant) => {
        if (Array.isArray(plant.sunlight)) {
          plant.sunlight.forEach((value) => {
            uniqueSunlightValues.add(value.trim());
          });
        } else {
          console.warn(
            "Plant sunlight property is not an array:",
            plant.sunlight
          );
        }
      });

      console.log("Unique sunlight values:", Array.from(uniqueSunlightValues));
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX request failed");
      console.error("Status: " + textStatus);
      console.error("Error: " + errorThrown);
      console.error("Response Text: " + jqXHR.responseText);
    }
  });
  // }

  function applyFilters(plants) {
    let sunlightFilter = $("#sunlight").val().trim().toLowerCase();
    let wateringFilter = $("#watering").val().trim().toLowerCase();
    let cycleFilter = $("#cycle").val().trim().toLowerCase();
    let indoorFilter = $("#indoor").val().trim().toLowerCase();
    let typeFilter = $("#type").val().trim();
    let flowerColorFilter = $("#flower_color").val().trim().toLowerCase();
    let filteredPlants = plants.filter((plant) =>
      filterPlants(
        plant,
        sunlightFilter,
        wateringFilter,
        cycleFilter,
        indoorFilter,
        typeFilter,
        flowerColorFilter
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
    let flowerColorMatch =
      flowerColorFilter === "" ||
      (Array.isArray(plant.flower_color) &&
        plant.flower_color
          .map((color) => normalizeFlowerColor(color.trim().toLowerCase()))
          .includes(flowerColorFilter));
    return (
      sunlightMatch &&
      wateringMatch &&
      cycleMatch &&
      indoorMatch &&
      typeMatch &&
      flowerColorMatch
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
        $("#sunlight, #watering, #cycle, #indoor, #type, #flower_color").on(
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
      <div class="plant-card card m-2" style="width: 18rem;">
        <img src="${imageUrl}" alt="${data.common_name}" class="card-img-top">
        <div class="card-header">${data.common_name}</div>
        <div class="card-body">
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Scientific name: ${data.scientific_name.join(
              ", "
            )}</li>
            <li class="list-group-item">Other names: ${otherNames}</li>
            <li class="list-group-item">Cycle: ${data.cycle}</li>
            <li class="list-group-item">Watering: ${data.watering}</li>
            <li class="list-group-item">Sunlight: ${
              Array.isArray(data.sunlight)
                ? data.sunlight.join(", ")
                : data.sunlight
            }</li>
            <li class="list-group-item">Type: ${data.type}</li>
            <li class="list-group-item">Hardiness min: ${
              data.hardiness["min"]
            }</li>
            <li class="list-group-item">Hardiness max: ${
              data.hardiness["max"]
            }</li>
            <li class="list-group-item">${data.description}</li>
          </ul>
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
