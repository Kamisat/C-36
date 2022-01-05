var dog, sadDog, happyDog, database;
var foodS, foodStock;
var addFood;
var foodObj;

var feed, lastFed;

//create feed and lastFed variable here

function preload() {
  sadDog = loadImage("Dog.png");
  happyDog = loadImage("happy dog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 400);

  foodObj = new Food();

  foodStock = database.ref("Comida");
  foodStock.on("value", readStock);

  dog = createSprite(800, 200, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  //create feed the dog button here

  feedTheDog = createButton("Feed the dog");
  feedTheDog.position(700, 95);
  feedTheDog.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}

function draw() {
  background(46, 139, 87);
  foodObj.display();

  //write code to read fedtime value from the database
  lastFed = database.ref("HoraDeComer");
  lastFed.on("value", function (data) {
    lastFed = data.val();
  });

  //write code to display text lastFed time here

  textSize(23);
  fill("black");
  if (lastFed >= 12) {
    text("Lastfed: " + lastFed + " PM", 40, 20);
  } else if (lastFed == 0) {
    text("Lastfed: 12 AM", 40, 20);
  } else if (lastFed < 12) {
    text("Lastfed: " + lastFed + "AM", 40, 20);
  }

  console.log(lastFed)

  drawSprites();
}

//function to read food Stock
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog() {
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time

  var foodStockVal = foodObj.getFoodStock();
  if (foodStockVal <= 0) {
    foodObj.updateFoodStock(foodStockVal * 0);
  } else if (foodStockVal >= 1) {
    foodObj.updateFoodStock(foodStockVal - 1);
  }
  database.ref("/").update({
    Comida: foodObj.getFoodStock(),
    HoraDeComer: hour()
  });
}

//function to add food in stock
function addFoods() {
  foodS++;
  database.ref("/").update({
    Comida: foodS,
  });
}
