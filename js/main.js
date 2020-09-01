/*============================================================*/
/*=====================MOBILE NAVIGATION======================*/
/*============================================================*/

const naviList = document.querySelector('.navigation__list');
const line1 = document.querySelector('.navigation__button  .navigation__button__line1');
const line2 = document.querySelector('.navigation__button  .navigation__button__line2');
const line3 = document.querySelector('.navigation__button  .navigation__button__line3');

document.addEventListener('click', function (event) {
	if (event.target.closest('.navigation__list__mobile__link')) {
    naviList.classList.toggle("opacity");
    naviList.classList.toggle("display");
    line1.classList.toggle("line1");
    line2.classList.toggle("line2");
    line3.classList.toggle("line3");
  }
}, false);

document.querySelector('.navigation__button').addEventListener('click', function(){
  naviList.classList.toggle("opacity");
  naviList.classList.toggle("display");
  line1.classList.toggle("line1");
  line2.classList.toggle("line2");
  line3.classList.toggle("line3");
});

document.querySelector('.navigation__list__mobile__button').addEventListener('click', function(){
 naviList.classList.toggle("opacity");
 naviList.classList.toggle("display");
  line1.classList.toggle("line1");
  line2.classList.toggle("line2");
  line3.classList.toggle("line3");
});

/*============================================================*/
/*=======================PRE LOADER===========================*/
/*============================================================*/

$(window).on('load', function() {
  if ($('#preloader').length) {
    $('#preloader').delay(300).fadeOut('slow', function() {
      $(this).remove();
    });
  }
});

/*============================================================*/
/*=====================FIREWORKS==============================*/
/*============================================================*/

//Firework activate
var audio = document.getElementById('audio');
function fireworkActivate() {
    document.querySelector('.closebtn').style.display = "block";
    document.getElementById('birthday').style.display = "block";
    document.getElementById('canvasMsg').style.display = "block";
    audio.play();
    audio.loop = true;
}

//Firework Deactivate 
function fireworkDeactivate() {
  document.querySelector('.closebtn').style.display = "none";
  document.getElementById('birthday').style.display = "none";
  document.getElementById('canvasMsg').style.display = "none";
  audio.pause();
}

// helper functions
const PI2 = Math.PI * 2
const random = (min, max) => Math.random() * (max - min + 1) + min | 0
const timestamp = _ => new Date().getTime()

// container
class Birthday {
  constructor() {
    this.resize()

    // create a lovely place to store the firework
    this.fireworks = []
    this.counter = 0

  }
  
  resize() {
    this.width = canvas.width = window.innerWidth
    let center = this.width / 2 | 0
    this.spawnA = center - center / 4 | 0
    this.spawnB = center + center / 4 | 0
    
    this.height = canvas.height = window.innerHeight
    this.spawnC = this.height * .1
    this.spawnD = this.height * .5
    
  }
  
  onClick(evt) {
     let x = evt.clientX || evt.touches && evt.touches[0].pageX
     let y = evt.clientY || evt.touches && evt.touches[0].pageY
     
     let count = random(3,5)
     for(let i = 0; i < count; i++) this.fireworks.push(new Firework(
        random(this.spawnA, this.spawnB),
        this.height,
        x,
        y,
        random(0, 260),
        random(30, 110)))
          
     this.counter = -1
     
  }
  
  update(delta) {
    ctx.globalCompositeOperation = 'hard-light'
    ctx.fillStyle = `rgba(20,20,20,${ 7 * delta })`
    ctx.fillRect(0, 0, this.width, this.height)

    ctx.globalCompositeOperation = 'lighter'
    for (let firework of this.fireworks) firework.update(delta)

    // if enough time passed... create new new firework
    this.counter += delta * 3 // each second
    if (this.counter >= 1) {
      this.fireworks.push(new Firework(
        random(this.spawnA, this.spawnB),
        this.height,
        random(0, this.width),
        random(this.spawnC, this.spawnD),
        random(0, 360),
        random(30, 110)))
      this.counter = 0
    }

    // remove the dead fireworks
    if (this.fireworks.length > 1000) this.fireworks = this.fireworks.filter(firework => !firework.dead)

  }
}

class Firework {
  constructor(x, y, targetX, targetY, shade, offsprings) {
    this.dead = false
    this.offsprings = offsprings

    this.x = x
    this.y = y
    this.targetX = targetX
    this.targetY = targetY

    this.shade = shade
    this.history = []
  }
  update(delta) {
    if (this.dead) return

    let xDiff = this.targetX - this.x
    let yDiff = this.targetY - this.y
    if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) { // is still moving
      this.x += xDiff * 2 * delta
      this.y += yDiff * 2 * delta

      this.history.push({
        x: this.x,
        y: this.y
      })

      if (this.history.length > 20) this.history.shift()

    } else {
      if (this.offsprings && !this.madeChilds) {
        
        let babies = this.offsprings / 2
        for (let i = 0; i < babies; i++) {
          let targetX = this.x + this.offsprings * Math.cos(PI2 * i / babies) | 0
          let targetY = this.y + this.offsprings * Math.sin(PI2 * i / babies) | 0

          birthday.fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0))

        }

      }
      this.madeChilds = true
      this.history.shift()
    }
    
    if (this.history.length === 0) this.dead = true
    else if (this.offsprings) { 
        for (let i = 0; this.history.length > i; i++) {
          let point = this.history[i]
          ctx.beginPath()
          ctx.fillStyle = 'hsl(' + this.shade + ',100%,' + i + '%)'
          ctx.arc(point.x, point.y, 1, 0, PI2, false)
          ctx.fill()
        } 
      } else {
      ctx.beginPath()
      ctx.fillStyle = 'hsl(' + this.shade + ',100%,50%)'
      ctx.arc(this.x, this.y, 1, 0, PI2, false)
      ctx.fill()
    }

  }
}

let canvas = document.getElementById('birthday')
let ctx = canvas.getContext('2d')

let then = timestamp()

let birthday = new Birthday
window.onresize = () => birthday.resize()
document.onclick = evt => birthday.onClick(evt)
document.ontouchstart = evt => birthday.onClick(evt)

  ;(function loop(){
  	requestAnimationFrame(loop)

  	let now = timestamp()
  	let delta = now - then

    then = now
    birthday.update(delta / 1000)
  	

  })()

/*============================================================*/
/*=====================ENTRY TEXT=============================*/
/*============================================================*/

// Wrap every letter in a span
var textWrapper = document.querySelector('.entry2__text');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='entry2__letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.entry2__text .entry2__letter',
    translateY: [-1000,0],
    easing: "easeOutExpo",
    duration: 200,
    delay: (el, i) => 30 * i
  }).add({
    targets: '.entry2__text',
    opacity: 0,
    duration: 50000000,
    easing: "easeOutExpo",
    delay: 1000
  });

/*============================================================*/
/*=========================SLIDER=============================*/
/*============================================================*/

// $('.entry1__carousel').slick({
//   dots: false,
//   infinite: true,
//   fade: true,
//   speed: 3000,
//   slidesToShow: 1,
//   slidesToScroll: 1,
//   arrows: false,
//   autoplay: true,
//   autoplaySpeed: 1000,
//   cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)'
// });

/*============================================================*/
/*======================BIRTH TIMER===========================*/
/*============================================================*/

function birthTimer() {
  var now = new Date();
  var birthDate = new Date(1999, 8, 4);
  
  var currentTime = now.getTime();
  var birthTime = birthDate.getTime();
  
  var finalTime = currentTime - birthTime;
  
  var seconds = Math.floor(finalTime / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor((hours / 24 )-6);
  var years = Math.floor(days / 365);
  
  seconds %= 60;

  if(seconds<10) {
    seconds = "0"+seconds;
  }
  
  
  document.getElementById("years").textContent = years;
  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;

  var a = Math.floor(100000 + Math.random() * 900000);
  var b = Math.floor(100000 + Math.random() * 900000);
  document.querySelector('.color__change').style.background = `linear-gradient(to bottom, #${a}, #${b})`;

  setTimeout(birthTimer, 1000); 
}

birthTimer();

/*============================================================*/
/*=======================AOS INIT=============================*/
/*============================================================*/

AOS.init();

/*============================================================*/
/*=======================SMOOTH SCROLL========================*/
/*============================================================*/

var scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000
});

/*============================================================*/
/*====================IMP DATES ANIMATION=====================*/
/*============================================================*/

const kritika = document.querySelector('.dates__container__item-1');
const kritikaBox = document.querySelector('.queenBox');

const ashish = document.querySelector('.ashish');
const ashishBox = document.querySelector('.ashishBox');

const ak = document.querySelector('.ak');
const akBox = document.querySelector('.akBox');

kritika.addEventListener('click', function() {
  if(akBox.classList.toggle("moving")) {
    akBox.classList.toggle("moving")
  }
  if(ashishBox.classList.toggle("moving")) {
    ashishBox.classList.toggle("moving");
  }
  kritikaBox.classList.toggle("moving");
});

ashish.addEventListener('click', function() {
  if(kritikaBox.classList.toggle("moving")) {
    kritikaBox.classList.toggle("moving");
  }
  if(akBox.classList.toggle("moving")) {
    akBox.classList.toggle("moving")
  }
  ashishBox.classList.toggle("moving");
});

ak.addEventListener('click', function() {
  if(kritikaBox.classList.toggle("moving")) {
    kritikaBox.classList.toggle("moving");
  }
  if(ashishBox.classList.toggle("moving")) {
    ashishBox.classList.toggle("moving");
  }
  akBox.classList.toggle("moving");
});

/*============================================================*/
/*=======================COUNTER UP===========================*/
/*============================================================*/

$(".num").counterUp({delay:10,time:1000});

/*============================================================*/
/*========================TOGETHER============================*/
/*============================================================*/

function change1() {
  const random = Math.floor(Math.random() * 80) + 1;
  document.querySelector('.togetherContainer__item-1').style.backgroundImage = `linear-gradient(125deg, rgba(129,197,205,.7) 0%, rgba(170,204,159,.7) 50%, rgba(146,203,188,.7) 100%), url(/img/${random}.jpg)`;
  setTimeout(change1, 120000);
}

function change2() {
  const random = Math.floor(Math.random() * 80) + 1;
  document.querySelector('.togetherContainer__item-2').style.backgroundImage = `linear-gradient(125deg, rgba(129,197,205,.7) 0%, rgba(170,204,159,.7) 50%, rgba(146,203,188,.7) 100%), url(/img/${random}.jpg)`;
  setTimeout(change2, 100000);
}

function change3() {
  const random = Math.floor(Math.random() * 80) + 1;
  document.querySelector('.togetherContainer__item-3').style.backgroundImage = `linear-gradient(125deg, rgba(129,197,205,.7) 0%, rgba(170,204,159,.7) 50%, rgba(146,203,188,.7) 100%), url(/img/${random}.jpg)`;
  setTimeout(change3, 50000);
}

function change4() {
  const random = Math.floor(Math.random() * 80) + 1;
  document.querySelector('.togetherContainer__item-4').style.backgroundImage = `linear-gradient(125deg, rgba(129,197,205,.7) 0%, rgba(170,204,159,.7) 50%, rgba(146,203,188,.7) 100%), url(/img/${random}.jpg)`;
  setTimeout(change4, 30000);
}

function change5() {
  const random = Math.floor(Math.random() * 80) + 1;
  document.querySelector('.togetherContainer__item-5').style.backgroundImage = `linear-gradient(125deg, rgba(129,197,205,.7) 0%, rgba(170,204,159,.7) 50%, rgba(146,203,188,.7) 100%), url(/img/${random}.jpg)`;
  setTimeout(change5, 10000);
}

change1();
change2();
change3();
change4();
change5();

function relationTimer() {
  var now = new Date();
  var relationDate = new Date(2016, 9, 22);
  
  var currentTime = now.getTime();
  var relationTime = relationDate.getTime();
  
  var finalTime = currentTime - relationTime;
  
  var seconds = Math.floor(finalTime / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);
  var years = Math.floor(days / 365);

  seconds %= 60;

  if(seconds<10) {
    seconds = "0"+seconds;
  }
  
  
  document.getElementById("rel_years").textContent = years;
  document.getElementById("rel_days").textContent = days;
  document.getElementById("rel_hours").textContent = hours;
  document.getElementById("rel_minutes").textContent = minutes;
  document.getElementById("rel_seconds").textContent = seconds;

  setTimeout(relationTimer, 1000); 
}

relationTimer();

/*============================================================*/
/*====================MODAL OPEN CLOSE========================*/
/*============================================================*/

// document.querySelector('.modal1__clsbtn').addEventListener('click', function() {
//   document.getElementById('modal1-open').checked = false;
//   document.getElementById('modal1-close').checked = true;
// })