//Create variables here
var database;
var dog,foodS,dogIMG,happyDogIMG,sadDog,lazyDog;
var foodS = 0;
var feedPetBtn,addFoodBtn;
var  lastFed;
var foodObJ;
var gs=0;
var s;
var milkIMG;
var bedroom, garden, washroom;
var readState, gameState;
var currentTime1=0;
var currentTime2=0;
function preload()
{
dogIMG=loadImage("images/dogImg.png")
happyDogIMG=loadImage("images/dogImg1.png")
milkIMG=loadImage("images/milk.png")
bedroom=loadImage("images/bedRoom.png")
garden=loadImage("images/Garden.png")
washroom=loadImage("images/washRoom.png")
sadDog=loadImage("images/sadDog.png")
lazyDog=loadImage("images/lazy.png")
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 500);
  dog=createSprite(800,250)
  dog.scale=0.15;
  dog.addImage(dogIMG)


  foodStock=database.ref('food');
  foodStock.on('value',readStock);
  foodS=20;
  
  feedPetBtn=createButton("Feed the Dog")
  feedPetBtn.position(700,95);
  feedPetBtn.mousePressed(function(){
    dog.addImage(happyDogIMG);
    
    lastFed=lastFed+1;
    //console.log(s);
    gs=1;
    database.ref("/").update({
      feedTime:lastFed
    })
    database.ref("/").update({
      food:foodS-1
    })

  });

  addFoodBtn=createButton("Add Food");
  addFoodBtn.position(800,95);
  addFoodBtn.mousePressed(function(){
    database.ref("/").update({
      food:foodS+1
    })
  })

  var fedTime=database.ref('feedTime');
  fedTime.on("value",function(data){
  lastFed=data.val();
 })
  

readState=database.ref('gameState');
readState.on("value",function(data){
  gameState=data.val();
})

}


function draw() {  
  background(46,139,87);
  fill("black")
  text("Food Remaining: "+foodS,600,200)

if(gameState!=="hungry"){
  feedPetBtn.hide();
  addFoodBtn.hide();
  dog.x=2000;
} else{
  feedPetBtn.show();
  addFoodBtn.show();
  dog.addImage(sadDog);
}
currentTime1++;
if(currentTime1%60===0){
  currentTime2++;
}

if(lastFed!==undefined&&lastFed!==null&&gs!==0){
  if(lastFed>=12){
    text("Last Fed: "+lastFed%12+"PM",350,30);
  } else if(lastFed===0){
    text("Last Fed: 12 AM",350,30);
  } else {
    text("Last Fed: "+lastFed+"AM",350,30);
  }
}

var x=80
var y=100;

imageMode(CENTER);
image(milkIMG,720,220,70,70)


if(foodS!==0){
    for(var i=0;i<foodS;i++){
        if(i%10===0){
            x=80;
            y=y+50;
        }
        image(milkIMG,x,y,50,50);
        x=x+30;
    }
}


if(currentTime2===lastFed+1){
  database.ref("/").update({
    gameState:"playing"
  })
  background(garden);
} else if(currentTime2===(lastFed+2)){
  database.ref("/").update({
    gameState:"sleeping"
  })
  background(bedroom)
} else if(currentTime2>(lastFed+2)&&currentTime2<=(lastFed+4)){
  database.ref("/").update({
    gameState:"bathing"
  })
background(washroom)
} else{
  database.ref("/").update({
    gameState:"hungry"
  })
  //background(46,139,87)
  dog.x=800;
  dog.addImage("images/Dog.png");
}
console.log(currentTime2)
drawSprites();
  //add styles here
  textSize(20);
  /*fill("black")
  text("Food Remaining: "+foodStock,100,200);*/
}

function readStock(data){
  foodS=data.val();
}

function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }
  
  database.ref("/").update({
    food:x
  })
}

