const meals = document.getElementById('meals')
const searchContainer = document.getElementById('searchContainer')
const leftWidth = $('.left').innerWidth();

$('.sidebar').css({left: `-${leftWidth}px`});

let isShown = false

function closeSidebar(){   
        $('.sidebar').animate({left: `-${leftWidth}px`}, 500);
        $('.close-icon i').addClass('fa-bars')
        $('.close-icon i').removeClass('fa-xmark')
        for (let i = 0; i < 5; i++) {
        $(".sidebar ul li").eq(i).animate({
            top: '100%'
        }, (i + 5) * 150)
    }
    isShown = false
}

function openSidebar(){
    $('.sidebar').animate({left: `0px`}, 500);
    $('.close-icon i').addClass('fa-xmark')
        $('.close-icon i').removeClass('fa-bars')
        // $('.sidebar ul li').animate({top : '0%'} , 5000) 
        for (let i = 0; i < 5; i++) {
            $(".sidebar ul li").eq(i).animate({
                top: 0
            }, (i + 5) * 150)
        }
        isShown = true
    }

closeSidebar()
    
$('.close-icon').on('click', function() {
if (isShown == true){
    closeSidebar()
} else {
    openSidebar()
}
})

async function mainMeals(){
    searchContainer.innerHTML = ""
    $(".page-loader").fadeIn(300)
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`)
    if(response.ok){
        const data = await response.json()
        let mealsList = data.meals        
        displayMainMeal(mealsList)
    }
    $('.page-loader').fadeOut(300)
}
mainMeals()

function displayMainMeal(arr){
    let holder = ``
    for(let i=0; i < arr.length; i++) {
        holder += `
            <div onclick="singleMeal('${arr[i].idMeal}')" class="col-12 col-md-6 col-lg-4 col-xl-3">
            <div class="card meal position-relative overflow-hidden rounded-2 cursor-pointer">
               <img src="${arr[i].strMealThumb}" class="card-img-top w-100" alt="meal1">
               <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                  <h3>${arr[i].strMeal}</h3>
               </div>
            </div>
         </div>
        `
    }
    meals.innerHTML = holder
}

async function singleMeal(id){
    searchContainer.innerHTML = ""
    $(".inner-loading").removeClass('d-none').fadeIn(300)
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    if(response.ok){
        const data = await response.json()
        const singleMeal = data.meals
        console.log(singleMeal);
        displaySingleMeal(singleMeal[0])
        $(".inner-loading").fadeOut(300)
    }
}

function displaySingleMeal(meal) {
  let ingredientsList = '';
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredientsList += `
        <li class="list-group-item d-flex align-items-center bg-dark text-white border-0">
          <i class="fa-solid fa-utensils text-success me-3"></i>
          <span>${measure} ${ingredient}</span>
        </li>`;
    }
  }

  let tags = meal.strTags?.split(",").map(tag => tag.trim()) || [];
  let tagsList = tags.map(tag => `
    <li class="list-group-item d-flex align-items-center bg-dark text-white border-0">
      <i class="fa-solid fa-tag text-danger me-3"></i>
      <span>${tag}</span>
    </li>`).join('');

  meals.innerHTML = `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10 text-white">
          <div class="text-center mb-4">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="img-fluid rounded-3 shadow mb-3" />
            <h2>${meal.strMeal}</h2>
          </div>

          <div class="bg-dark bg-opacity-75 p-4 rounded-4 shadow-sm">
            <h3 class="mb-3"><i class="fa-solid fa-book-open me-2 text-info"></i>Instructions</h3>
            <p>${meal.strInstructions}</p>

            <div class="mb-4">
              <h5><i class="fa-solid fa-location-dot text-info me-2 mb-3"></i><strong>Area:</strong> ${meal.strArea}</h5>
              <h5><i class="fa-solid fa-list text-warning me-2"></i><strong>Category:</strong> ${meal.strCategory}</h5>
            </div>

            <div class="mb-4">
              <h4 class="mb-3"><i class="fa-solid fa-bowl-rice me-2 text-success"></i>Ingredients</h4>
              <ul class="list-group list-group-flush rounded-3 border border-success overflow-hidden">
                ${ingredientsList}
              </ul>
            </div>

            <div class="mb-4">
              <h4 class="mb-3"><i class="fa-solid fa-tags me-2 text-danger"></i>Tags</h4>
              <ul class="list-group list-group-flush rounded-3 border border-danger overflow-hidden">
                ${tagsList || '<li class="list-group-item bg-dark text-white border-0"><em>No tags available</em></li>'}
              </ul>
            </div>

            <div class="text-center mt-4">
              <a href="${meal.strSource}" target="_blank" class="btn btn-outline-light me-2">
                <i class="fa-solid fa-globe"></i> Source
              </a>
              <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger">
                <i class="fa-brands fa-youtube"></i> YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function showSearchInputs() {
    closeSidebar()
    searchContainer.innerHTML = `
    <div class="row py-5 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control py-2 bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control py-2 bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`

    meals.innerHTML = ""
}

async function searchByName(name) {
    meals.innerHTML = ""
    $(".inner-loading").removeClass('d-none').fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    if(response.ok) {
        const data = await response.json()   
        const mealsNames = data.meals
        mealsNames ? displayMainMeal(mealsNames.slice(0, 20)) : displayMainMeal([])
        $(".inner-loading").fadeOut(300)
    }

}

async function searchByFLetter(letter) {
    meals.innerHTML = ""
    $(".inner-loading").removeClass('d-none').fadeIn(300)

    letter == "" ? letter = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
    if(response.ok) {
        const data = await response.json()
        const mealsLetter = data.meals
        mealsLetter ? displayMainMeal(mealsLetter.slice(0, 20)) : displayMainMeal([])
        $(".inner-loading").fadeOut(300)
    }
}

async function getCategory() {
    searchContainer.innerHTML = ""
        closeSidebar()
        $(".inner-loading").removeClass('d-none').fadeIn(300)
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
        if(response.ok){
            const data = await response.json()
            const categories = data.categories
            console.log(categories);
            displayCategories(categories)
        }
        $(".inner-loading").fadeOut(300)
}

function displayCategories(arr) {
    let holder = "";

    for (let i = 0; i < arr.length; i++) {
        holder += `
        <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="meal card position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                    </div>
                </div>
        </div>
        `
    }

    meals.innerHTML = holder
}

async function getCategoryMeals(category) {
            $(".inner-loading").removeClass('d-none').fadeIn(300)
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    if(response.ok) {
        const data = await response.json()
        const catMeals = data.meals   
        displayMainMeal(catMeals.slice(0, 20))
        $(".inner-loading").fadeOut(300)
    }
}

async function getArea() {
    searchContainer.innerHTML = ""
    closeSidebar()
    $(".inner-loading").removeClass('d-none').fadeIn(300)
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    const data = await respone.json()
    const areas = data.meals
    displayArea(areas)
    $(".inner-loading").fadeOut(300)
}
function displayArea(arr) {
    let holder = "";
    for (let i = 0; i < arr.length; i++) {
        holder += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center text-white cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>
        `
    }
    meals.innerHTML = holder
}

async function getAreaMeals(area) {
    $(".inner-loading").removeClass('d-none').fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    if(response.ok) {
        const data = await response.json()
        const areameals = data.meals
        displayMainMeal(areameals.slice(0, 20))
        $(".inner-loading").fadeOut(300)
    }
}

async function getIngredients() {
    searchContainer.innerHTML = ""
    closeSidebar()
    $(".inner-loading").removeClass('d-none').fadeIn(300)
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
   if(respone.ok){
       const data = await respone.json()
       const ingredients = data.meals
       displayIngredients(ingredients.slice(0, 20))
       $(".inner-loading").fadeOut(300)
    }
}

function displayIngredients(arr) {
    let holder = "";
    for (let i = 0; i < arr.length; i++) {
        holder += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-white text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        </div>
        `
    }

    meals.innerHTML = holder
}

async function getIngredientsMeals(ingredients) {
$(".inner-loading").removeClass('d-none').fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    if(response.ok){
        const data = await response.json()
        const ingredientsMeals = data.meals
        displayMainMeal(ingredientsMeals.slice(0, 20))
        $(".inner-loading").fadeOut(300)
    }
}


let inputTouched = {
  name: false,
  email: false,
  phone: false,
  age: false,
  password: false,
  repassword: false
};

function showContacts() {
    searchContainer.innerHTML = ""
    closeSidebar()
  meals.innerHTML = `
    <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
      <div class="container w-75 text-center">
        <div class="row g-4">
          ${generateInput("name", "Enter Your Name")}
          ${generateInput("email", "Enter Your Email", "email")}
          ${generateInput("phone", "Enter Your Phone")}
          ${generateInput("age", "Enter Your Age", "number")}
          ${generateInput("password", "Enter Your Password", "password")}
          ${generateInput("repassword", "Repassword", "password")}
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
      </div>
    </div>`;

  document.querySelectorAll("input").forEach(input => {
    input.addEventListener("focus", () => {
      const id = input.id.replace("Input", "");
      inputTouched[id] = true;
    });
  });

  document.querySelectorAll("input").forEach(input => {
    input.addEventListener("keyup", inputsValidation);
  });
}

function generateInput(id, placeholder, type = "text") {
  return `
    <div class="col-md-6">
      <input id="${id}Input" type="${type}" class="form-control" placeholder="${placeholder}">
      <div id="${id}Alert" class="alert alert-danger w-100 mt-2 d-none">
        ${getAlertMessage(id)}
      </div>
    </div>`;
}

function getAlertMessage(id) {
  const messages = {
    name: "Special characters and numbers not allowed",
    email: "Email not valid *exemple@yyy.zzz",
    phone: "Enter valid Phone Number",
    age: "Enter valid age",
    password: "Enter valid password *Minimum 8 characters, at least one letter and one number*",
    repassword: "Enter valid repassword"
  };
  return messages[id];
}

function inputsValidation() {
  const validations = {
    name: /^[a-zA-Z ]+$/,
    email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    age: /^(0?[1-9]|[1-9][0-9]|1[01][0-9]|200)$/,
    password: /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/,
    repassword: null // special handling
  };

  let allValid = true;

  for (let field in validations) {
    const input = document.getElementById(`${field}Input`);
    const alert = document.getElementById(`${field}Alert`);

    let isValid = field === "repassword"
      ? input.value === document.getElementById("passwordInput").value
      : validations[field].test(input.value);

    if (inputTouched[field]) {
      alert.classList.toggle("d-none", isValid);
      alert.classList.toggle("d-block", !isValid);
    }

    if (!isValid) allValid = false;
  }

  document.getElementById("submitBtn").disabled = !allValid;
}