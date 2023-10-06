let main = document.getElementById("main");
let ennemies = 43;
let space = 100;
let choix = 1;
let pas = 0;
let fireSpeed = 0;
let craftLives = 0;
let fireLives = 0;
let craftMissiles = 0;
let select = document.createElement("input");
let nbEnnemies = document.createElement("input");
let joueurId = document.createElement("input");
let start = document.createElement("button");
let missileTimer = "";
let vitMob = 10;
let probaTir = 50;
let score = 0;
let nbShot = 0;
let action = "";
let coucouJeTire = "";
let divScore = document.createElement("div");
let maintheme = new Audio(
  "./assets/snd/theme-of-samus-aran-galactic-warrior-super-metroid.mp3"
);
let splachtheme = new Audio("./assets/snd/illusion-of-gaia-town-theme.mp3");
let loseSound = new Audio("./assets/snd/sm27.mp3");
let winSound = new Audio(
  "./assets/snd/victory-sound-effects-non-copyrighted-sound.mp3"
);

class Vaisseau {
  constructor(className, left, up, speed, lives, missile) {
    this._node = document.createElement("div");
    this._node.className = className;
    this._node.style.position = "absolute";
    this._node.style.left = left + "px";
    this._node.style.top = up + "px";
    this.speed = speed;
    this.lives = lives;
    this.missile = missile;
    main.appendChild(this._node);
  }

  getPosition() {
    return this._node.style.left + " " + this._node.style.top;
  }

  draw(left, up) {
    this._node.style.left = left + "px";
    this._node.style.top = up + "px";
  }

  IsAlive() {
    if (this.lives <= 0) {
      this._node.style.display = "none";
    }
    return true;
  }

  update(mouvLeft, mouvUp) {
    this._node.style.left = parseInt(this._node.style.left) + mouvLeft + "px";
    this._node.style.top = parseInt(this._node.style.top) + mouvUp + "px";
  }
}

class Missile {
  constructor(className, left, up, speed, lives) {
    this._node = document.createElement("div");
    this._node.className = className;
    this._node.style.position = "absolute";
    this._node.style.left = left + "px";
    this._node.style.top = up + "px";
    this.speed = speed;
    this.lives = lives;
    this._node.style.display = "none";
    main.appendChild(this._node);
  }
  draw(left, up) {
    this._node.style.left = left + "px";
    this._node.style.top = up + "px";
  }
  update() {
    this._node.style.top = parseInt(this._node.style.top) - this.speed + "px";
    testerCollision();
    if (parseInt(this._node.style.top) < -40) {
      this.lives = -100;
      missile.stopAnimation();
      this._node.style.display = "none";
    }
  }
  IsAlive() {
    if (this.lives <= 0) {
      this._node.style.display = "none";
    }
    return true;
  }
  getPosition() {
    return this._node.style.left + " " + this._node.style.top;
  }
}

Missile.prototype.startAnimation = function (fct, interval) {
  if (this._clock) window.clearInterval(this._clock);
  var _this = this;
  this._clock = window.setInterval(function () {
    fct(_this);
  }, interval);
};

Missile.prototype.stopAnimation = function () {
  window.clearInterval(this._clock);
};

class Alien {
  constructor(filename, left, up) {
    this._node = document.createElement("img");
    this._node.src = "./assets/img/" + filename + ".png";
    this._node.style.position = "absolute";
    main.appendChild(this._node);
    this._node.style.left = left + "px";
    this._node.style.top = up + "px";
    this._node.dead = false;
  }
}

let vaisseau = new Vaisseau("", 0, 0, 0, 0, 0);

function selection(choix) {
  switch (choix) {
    case 1:
      pas = 10;
      fireSpeed = 20;
      craftLives = 3;
      fireLives = 1;
      craftMissiles = 3;
      break;
    case 2:
      pas = 20;
      fireSpeed = 10;
      craftLives = 3;
      fireLives = 1;
      craftMissiles = 3;
      break;
    case 3:
      pas = 5;
      fireSpeed = 15;
      craftLives = 5;
      fireLives = 1;
      craftMissiles = 4;
      break;
    case 4:
      pas = 12;
      fireSpeed = 30;
      craftLives = 3;
      fireLives = 1;
      craftMissiles = 5;
      break;
    case 5:
      pas = 17;
      fireSpeed = 6;
      craftLives = 3;
      fireLives = 1;
      craftMissiles = 5;
      break;
    case 6:
      pas = 13;
      fireSpeed = 18;
      craftLives = 3;
      fireLives = 1;
      craftMissiles = 6;
      break;
    case 7:
      pas = 9;
      fireSpeed = 19;
      craftLives = 3;
      fireLives = 1;
      craftMissiles = 5;
      break;
    case 8:
      pas = 15;
      fireSpeed = 7;
      craftLives = 3;
      fireLives = 1;
      craftMissiles = 3;
      break;
    case 9:
      pas = 10;
      fireSpeed = 20;
      craftLives = 3;
      fireLives = 1;
      craftMissiles = 3;
      break;
    case 10:
      pas = 30;
      fireSpeed = 9;
      craftLives = 3;
      fireLives = 1;
      craftMissiles = 8;
      break;
    case 11:
      pas = 16;
      fireSpeed = 17;
      craftLives = 3;
      fireLives = 1;
      craftMissiles = 2;
      break;
    case 12:
      pas = 10;
      fireSpeed = 10;
      craftLives = 3;
      fireLives = 1;
      craftMissiles = 4;
      break;
  }
}

function splash() {
  document.body.style.backgroundImage = "url('./assets/img/fond.jpg')";
  splachtheme.play();
  for (i = 1; i < 13; i++) {
    let divVaisseau = document.createElement("div");
    divVaisseau.id = "divVaisseau" + i;
    divVaisseau.className = "vaisseau" + i;
    divVaisseau.style.position = "absolute";
    if (i == 1) {
      divVaisseau.style.left =
        (document.body.clientWidth / 8) * 0 +
        document.body.clientWidth / 8 +
        "px";
      divVaisseau.style.top =
        (document.body.clientHeight / 8) * 0 +
        document.body.clientHeight / 8 +
        "px";
    }
    if (i == 2) {
      divVaisseau.style.left =
        (document.body.clientWidth / 8) * 1 +
        document.body.clientWidth / 8 +
        "px";
      divVaisseau.style.top =
        (document.body.clientHeight / 8) * 0 +
        document.body.clientHeight / 8 +
        "px";
    }
    if (i == 3) {
      divVaisseau.style.left =
        (document.body.clientWidth / 8) * 2 +
        document.body.clientWidth / 8 +
        "px";
      divVaisseau.style.top =
        (document.body.clientHeight / 8) * 0 +
        document.body.clientHeight / 8 +
        "px";
    }
    if (i == 4) {
      divVaisseau.style.left =
        (document.body.clientWidth / 8) * 3.3 +
        document.body.clientWidth / 8 +
        "px";
      divVaisseau.style.top =
        (document.body.clientHeight / 8) * 0 +
        document.body.clientHeight / 8 +
        "px";
    }
    if (i == 5) {
      divVaisseau.style.left =
        (document.body.clientWidth / 8) * 4.5 +
        document.body.clientWidth / 8 +
        "px";
      divVaisseau.style.top =
        (document.body.clientHeight / 8) * 0 +
        document.body.clientHeight / 8 +
        "px";
    }
    if (i == 6) {
      divVaisseau.style.left =
        (document.body.clientWidth / 8) * 6 +
        document.body.clientWidth / 8 +
        "px";
      divVaisseau.style.top =
        (document.body.clientHeight / 8) * 0 +
        document.body.clientHeight / 8 +
        "px";
    }
    if (i == 7) {
      divVaisseau.style.left =
        (document.body.clientWidth / 8) * 0 +
        document.body.clientWidth / 8 +
        "px";
      divVaisseau.style.top =
        (document.body.clientHeight / 8) * 3 +
        document.body.clientHeight / 8 +
        "px";
    }
    if (i == 8) {
      divVaisseau.style.left =
        (document.body.clientWidth / 8) * 5 +
        document.body.clientWidth / 8 +
        "px";
      divVaisseau.style.top =
        (document.body.clientHeight / 8) * 2.5 +
        document.body.clientHeight / 8 +
        "px";
    }
    if (i == 9) {
      divVaisseau.style.left =
        (document.body.clientWidth / 8) * 1 +
        document.body.clientWidth / 8 +
        "px";
      divVaisseau.style.top =
        (document.body.clientHeight / 8) * 4 +
        document.body.clientHeight / 8 +
        "px";
    }
    if (i == 10) {
      divVaisseau.style.left =
        (document.body.clientWidth / 8) * 2.5 +
        document.body.clientWidth / 8 +
        "px";
      divVaisseau.style.top =
        (document.body.clientHeight / 8) * 4.5 +
        document.body.clientHeight / 8 +
        "px";
    }
    if (i == 11) {
      divVaisseau.style.left =
        (document.body.clientWidth / 8) * 3.75 +
        document.body.clientWidth / 8 +
        "px";
      divVaisseau.style.top =
        (document.body.clientHeight / 8) * 4 +
        document.body.clientHeight / 8 +
        "px";
    }
    if (i == 12) {
      divVaisseau.style.left =
        (document.body.clientWidth / 8) * 5 +
        document.body.clientWidth / 8 +
        "px";
      divVaisseau.style.top =
        (document.body.clientHeight / 8) * 4 +
        document.body.clientHeight / 8 +
        "px";
    }
    divVaisseau.innerHTML = "<h2>" + i + "</h2>";
    divVaisseau.style.color = "white";
    main.appendChild(divVaisseau);
  }

  start.type = "submit";
  start.id = "start";
  start.style.position = "absolute";
  start.innerHTML = "Lancer le Game !";
  start.style.left = document.body.clientWidth / 2 - 125 + "px";
  start.style.top = document.body.clientHeight / 2 + 225 + "px";
  start.style.textAlign = "center";
  start.style.width = 250 + "px";
  start.style.height = 50 + "px";
  start.style.backgroundColor = "white";
  start.style.display = "block";
  select.id = "select";
  select.type = "number";
  select.min = 1;
  select.max = 12;
  select.placeholder = "Quel vaisseau voulez-vous ?";
  select.style.textAlign = "center";
  select.style.backgroundColor = "white";
  select.style.position = "absolute";
  select.style.left = document.body.clientWidth / 2 - 125 + "px";
  select.style.width = 250 + "px";
  select.style.height = 50 + "px";
  select.style.top = document.body.clientHeight / 2 + "px";
  select.style.display = "block";
  start.style.display = "block";
  joueurId.id = "joueurId";
  joueurId.type = "Text";
  joueurId.min = 1;
  joueurId.max = 12;
  joueurId.placeholder = " Votre Pseudo ? . ? S.v.p.";
  joueurId.style.backgroundColor = "white";
  joueurId.style.position = "absolute";
  joueurId.style.left = document.body.clientWidth / 2 - 125 + "px";
  joueurId.style.textAlign = "center";
  joueurId.style.width = 250 + "px";
  joueurId.style.height = 50 + "px";
  joueurId.style.top = document.body.clientHeight / 2 + 60 + "px";
  joueurId.style.display = "block";
  nbEnnemies.id = "nbEnnemies";
  nbEnnemies.type = "number";
  nbEnnemies.min = 1;
  nbEnnemies.max = 43;
  nbEnnemies.placeholder = "Combien d'ennemis voulez-vous ?Max 43";
  nbEnnemies.style.backgroundColor = "white";
  nbEnnemies.style.position = "absolute";
  nbEnnemies.style.left = document.body.clientWidth / 2 - 125 + "px";
  nbEnnemies.style.width = 250 + "px";
  nbEnnemies.style.height = 50 + "px";
  nbEnnemies.style.top = document.body.clientHeight / 2 - 60 + "px";
  nbEnnemies.style.display = "block";
  main.appendChild(select);
  main.appendChild(start);
  main.appendChild(joueurId);
  main.appendChild(nbEnnemies);
  vaisseau._node.style.display = "none";
  divScore.style.display = "none";
  for (var i = 1; i < 13; i++) {
    divVaisseau = document.getElementById(`divVaisseau${[i]}`);
    divVaisseau.style.display = "block";
  }
  window.clearInterval(action);
  start.addEventListener("click", function () {
    game();
  });
}

splash();

function game() {
  splachtheme.pause();
  maintheme.play();

  document.body.style.backgroundImage = "url('./assets/img/firstscreen.jpg')";

  divScore.id = "score";
  divScore.style.backgroundColor = "white";
  divScore.style.position = "absolute";
  divScore.style.left = 0 + "px";
  divScore.style.width = 200 + "px";
  divScore.style.height = space + "px";
  divScore.style.textAlign = "center";
  divScore.style.top =
    document.body.clientHeight - parseInt(divScore.style.height) + "px";
  divScore.innerHTML = " Let'it go !";
  for (var i = 1; i < 13; i++) {
    divVaisseau = document.getElementById(`divVaisseau${[i]}`);
    divVaisseau.style.display = "none";
  }
  ennemiKO = 0;
  nbEnnemies.style.display = "none";
  joueurId.style.display = "none";
  divScore.style.display = "block";
  start.style.display = "none";
  select.style.display = "none";
  choix = parseInt(select.value);
  selection(parseInt(select.value));
  vaisseau = new Vaisseau(
    "vaisseau" + choix,
    0,
    0,
    pas,
    craftLives,
    craftMissiles
  );
  let middleScreen =
    document.body.clientWidth / 2 - parseInt(vaisseau._node.clientWidth) / 2;
  let middleBot =
    document.body.clientHeight - parseInt(vaisseau._node.clientHeight);
  vaisseau.draw(middleScreen, middleBot);
  vaisseau._node.style.width = vaisseau._node.clientWidth + "px";
  vaisseau._node.style.height = vaisseau._node.clientHeight + "px";
  main.appendChild(divScore);
  createEnnemy();
  shotEnnemy();
  action = window.setInterval(moveMob, 50);

  let controls = document.addEventListener("keydown", function (event) {
    if (
      (event.keyCode == 104 || event.keyCode == 38) &&
      parseInt(vaisseau._node.style.top) > 0
    ) {
      vaisseau.update(0, -pas);
    } else if (
      (event.keyCode == 100 || event.keyCode == 37) &&
      parseInt(vaisseau._node.style.left) > 0
    ) {
      vaisseau.update(-pas, 0);
    } else if (
      (event.keyCode == 102 || event.keyCode == 39) &&
      parseInt(vaisseau._node.style.left) <
        document.body.clientWidth - parseInt(vaisseau._node.style.width)
    ) {
      vaisseau.update(pas, 0);
    } else if (
      (event.keyCode == 98 || event.keyCode == 40) &&
      parseInt(vaisseau._node.style.top) <
        document.body.clientHeight - parseInt(vaisseau._node.style.height)
    ) {
      vaisseau.update(0, pas);
    }
    if (
      (event.keyCode == 101 || event.keyCode == 32) &&
      vaisseau._node.style.display != "none" &&
      nbShot < vaisseau.missile
    ) {
      nbShot = nbShot + 1;
      let missile = new Missile("fire" + choix, 0, 0, fireSpeed, fireLives);
      let shotSound = new Audio("./assets/snd/Missile-Shoot.wav");
      missile._node.style.display = "block";
      missile._node.style.width = missile._node.clientWidth + "px";
      missile._node.style.height = missile._node.clientHeight + "px";
      let left =
        parseInt(vaisseau._node.style.left) +
        (parseInt(vaisseau._node.style.width) -
          parseInt(missile._node.style.width)) /
          2;
      let top = parseInt(vaisseau._node.style.top);
      shotSound.play();
      missile.draw(left, top);
      movePlayerProjectile(missile);
    }
  });
}

let movePlayerProjectile = function (missile) {
  let projectile = missile;
  let moveMissile = window.setInterval(function () {
    let shotPos = parseInt(projectile._node.style.top);
    projectile._node.style.top = shotPos - projectile.speed + "px";
    for (var i = 0; i < nbEnnemies.value; i++) {
      let ennemy = document.getElementById(`ennemi${[i]}`);
      if (
        collide(projectile._node.style, ennemy.style) &&
        ennemy.style.display != "none"
      ) {
        if (ennemy.dead != true) {
          ennemiKO += 1;
          score += 50;
          nbShot = nbShot - 1;
          ennemy.dead = true;
        }
        projectile._node.style.display = "none";
        let exploSound = new Audio("./assets/snd/Missile-Explosion.wav");
        window.clearInterval(moveMissile);
        exploSound.play();
        ennemy.src = "./assets/img/bomb0.png";
        window.setTimeout(function () {
          ennemy.src = "./assets/img/bomb1.png";
        }, 50);
        window.setTimeout(function () {
          ennemy.src = "./assets/img/bomb2.png";
        }, 100);
        window.setTimeout(function () {
          ennemy.style.display = "none";
        }, 200);
        document.getElementById("score").innerHTML =
          "<h4><b>" +
          joueurId.value +
          "</b></h4><span>" +
          score +
          "/" +
          nbEnnemies.value * 50 +
          "</span>";
        if (ennemiKO == nbEnnemies.value) {
          maintheme.pause();
          winSound.play();
          let mention;
          if (nbEnnemies.value == 43) {
            mention =
              "Bravo " +
              joueurId.value +
              " ! " +
              nbEnnemies.value +
              " Kirby tués ! Tu as exterminé l'envahisseur ! ";
          }
          if (nbEnnemies.value <= 42 && nbEnnemies.value > 25) {
            mention =
              "Ah ouais quand même !" +
              joueurId.value +
              " ! " +
              nbEnnemies.value +
              " Kirby tués ! tu rigoles pas !";
          }
          if (nbEnnemies.value <= 25 && nbEnnemies.value > 15) {
            mention =
              "Ah c'est pas Mal " +
              joueurId.value +
              " ! " +
              " mais force un peu plus ;)";
          }
          if (nbEnnemies.value <= 15) {
            mention = "Tu peux mieux faire ! ajoutes de ennemis";
          }
          window.clearInterval(moveEnnemyProjectile);
          window.clearInterval(action);
          ennemy.style.display = "none";
          document.body.style.backgroundImage =
            "url('./assets/img/victory.jpg')";
          alert("partie fini ! you win ! " + mention + " Score : " + score);
          window.setTimeout(function () {
            location.reload();
          }, 10000);
        }
      }
    }
    if (shotPos <= -50) {
      nbShot = nbShot - 1;
      projectile._node.style.display = "none";
      window.clearInterval(moveMissile);
    }
  }, 100);
};

function createEnnemy() {
  for (var i = 0; i < nbEnnemies.value; i++) {
    var ennemy = new Alien();
    ennemy._node.id = "ennemi" + i;
    ennemy._node.className = "ennemy";
    ennemy._node.src = "./assets/img/tile" + i + ".png";
    ennemy._node.style.position = "absolute";
    ennemy._node.style.display = "block";
    ennemy._node.style.left = 10 + space * i + "px";
    ennemy._node.style.top = 0 + "px";
    ennemy._node.style.width = "61px";
    ennemy._node.style.height = "71px";
    for (var j = 0; j < 100; j++) {
      if (
        10 + space * i > (document.body.clientWidth - 69) * j &&
        -(parseInt(document.body.clientWidth - 69) * j) + space * i > 0
      ) {
        ennemy._node.style.left =
          -parseInt(document.body.clientWidth - 69) * j + space * i + "px";
        ennemy._node.style.top = 100 * j + "px";
      }
    }
  }
}

function moveMob() {
  for (var k = 0; k < nbEnnemies.value; k++) {
    var ennemy = document.getElementById(`ennemi${[k]}`);
    if (ennemy.style.display == "block") {
      if (
        parseInt(ennemy.style.top) == 0 ||
        parseInt(ennemy.style.top) == 200 ||
        parseInt(ennemy.style.top) == 400 ||
        parseInt(ennemy.style.top) == 600 ||
        parseInt(ennemy.style.top) == 800
      ) {
        ennemy.style.left = parseInt(ennemy.style.left) + vitMob + "px";
      }
      if (
        parseInt(ennemy.style.top) == 100 ||
        parseInt(ennemy.style.top) == 300 ||
        parseInt(ennemy.style.top) == 500 ||
        parseInt(ennemy.style.top) == 700 ||
        parseInt(ennemy.style.top) == 900
      ) {
        ennemy.style.left = parseInt(ennemy.style.left) - vitMob + "px";
      }
      if (
        parseInt(ennemy.style.left) + 3 >= document.body.clientWidth - 69 ||
        parseInt(ennemy.style.left) - 3 < 0
      ) {
        ennemy.style.top = parseInt(ennemy.style.top) + 100 + "px";
      }
      if (parseInt(ennemy.style.top) > document.body.clientHeight) {
        ennemy.style.display = "none";
        document.body.style.backgroundImage = "url('./assets/img/killyou.jpg')";
        maintheme.pause();
        loseSound.play();
        window.clearInterval(action);
        alert(
          "Bah alors !? on se tourne les pouces ? Tu y retournes et tu les butes tous !!!"
        );
        ennemy.style.display = "none";
        window.setTimeout(function () {
          location.reload();
        }, 10000);
      }
      if (collide(ennemy.style, vaisseau._node.style)) {
        vaisseau._node.style.display = "none";
        window.clearInterval(action);
        window.clearInterval(coucouJeTire);
        window.clearInterval(action);
        maintheme.pause();
        loseSound.play();
        document.body.style.backgroundImage = "url('./assets/img/killyou.jpg')";
        alert("T'as perdu ! Touché  par un ennemi");
        ennemy.style.display = "none";
        window.setTimeout(function () {
          location.reload();
        }, 10000);
      }
    }
  }
}

let collide = function (a, b) {
  return !(
    parseInt(a.top) + parseInt(a.height) < parseInt(b.top) ||
    parseInt(a.top) > parseInt(b.top) + parseInt(b.height) ||
    parseInt(a.left) + parseInt(a.width) < parseInt(b.left) ||
    parseInt(a.left) > parseInt(b.left) + parseInt(b.width)
  );
};

let shotEnnemy = function () {
  coucouJeTire = window.setInterval(function () {
    var k = Math.floor(Math.random() * 50);
    if (k < nbEnnemies.value) {
      var ennemy = document.getElementById(`ennemi${[k]}`);
      if (ennemy.style.display != "none") {
        let missileK = new Missile("missileK", 0, 0, 20, 1);
        missileK._node.style.display = "block";
        missileK._node.style.position = "absolute";
        missileK._node.style.width = "25px";
        missileK._node.style.height = "48px";
        let shotESound = new Audio("./assets/snd/Ice-Missile-Shoot.wav");
        shotESound.play();
        let left =
          parseInt(ennemy.style.left) +
          (parseInt(ennemy.style.width) -
            parseInt(missileK._node.style.width)) /
            2;
        let top = parseInt(ennemy.style.top);
        missileK.draw(left, top);
        moveEnnemyProjectile(missileK);
      }
    }
  }, 1000);
};

let moveEnnemyProjectile = function (missile) {
  let projectile = missile;
  let moveMissile = window.setInterval(function () {
    let shotPos = parseInt(projectile._node.style.top);
    projectile._node.style.top = shotPos + projectile.speed + "px";
    if (collide(projectile._node.style, vaisseau._node.style)) {
      projectile._node.style.display = "none";
      nbShot = nbShot - 1;
      window.clearInterval(moveMissile);
      vaisseau._node.style.display = "none";
      score -= 100;
      document.getElementById("score").innerHTML =
        "<h4><b>" +
        joueurId.value +
        "</b></h4><span>" +
        score +
        "/" +
        nbEnnemies.value * 50 +
        "</span>";
      window.clearInterval(coucouJeTire);
      window.clearInterval(action);
      document.body.style.backgroundImage = "url('./assets/img/gameover.jpg')";
      maintheme.pause();
      loseSound.play();
      alert("Tu t'es mangé un missile ! x) PERDU ^^");
      window.setTimeout(function () {
        location.reload();
      }, 10000);
    }
    if (shotPos >= document.body.clientHeight) {
      window.clearInterval(moveMissile);
    }
  }, 100);
};
