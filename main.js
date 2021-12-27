var view = {
  displayMessage: function (message) {
    var messageArea = document.getElementById("messageArea");
    // переменна(messageArea) получит значение дива(messageArea)
    messageArea.innerHTML = message;
    // переменная(messageArea) полчит значение параметра(message)
  },
  displayHit: function (location) {
    var cell = document.getElementById(location);
    // Переменная(cell) получит значени параметра(location(01-66))
    cell.setAttribute("class", "hit");
    // Переменная(cell) присвоит себе класс(Hit/Miss)
  },
  displayMiss: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  },
};

// view.displayMessage("Tap tap, iaaaaaaaaaaaas this thing on?");
// переменная(view) вызывает функцию(displayMessage)и та вызывает текст

var model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,
  //model = объект и статисткиа игры

  ships: [
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    // массив с позициями трех кораблей
  ],  

  fire: function (codinations) {
    for (var i = 0; i < this.numShips; i++) {
      // перебирает массив numShips и узнает сколько кораблей в игре
      var ship = this.ships[i];
      // берет первый корабль
      var index = ship.locations.indexOf(codinations);
      // и проверяет его на кординаты который указанны в codinations и если координаты клетки
      // присутствуют в массиве locations, значит, выстрел попал в цель.
      // Потому что indexOf возвращает индекс (кординаты клетки) или -1 и если 1 то есть совпадение
      if (index >= 0) {
        // получаеться index = кординаты клетки или -1
        ship.hits[index] = "hit";
        // тогда этому индексу присваивается "hit"
        view.displayHit(codinations);
        // вызывает функцию displayHit. которая выведет на поле клетку попадания
        view.displayMessage("You hit the ship!");
        // также выведет сообщение что игрок попал в цель
        if (this.isSunk(ship)) {
          view.displayMessage("You sink the ship!");
          this.shipsSunk++;
          // еслb функция isSunk верна, тогда выведи на экран displayMessage и потом добавь в shipsSunk +1
        }
        return true;
      }
    }
    view.displayMiss(codinations);
    view.displayMessage("You missed!");
    return false;
    // в случаии если index будет -1 то вызовится функция displayMiss с кординатами и функция, которая вызовет сообщение "Miss!
  },

  isSunk: function (ship) {
    for (var i = 0; i < this.shipLength; i++) {
      // переберет массив shipLength
      if (ship.hits[i] !== "hit") {
        // и если в масиве где есть свойство hits в котором есть индексы и в них НЕ будут все значения "hit",тогда вернется false.
        return false;
      }
    }
    return true;
    // иначе будет true
  },

  generateShipLocations: function () {
    var locations;
    // переменная locations
    for (var i = 0; i < this.numShips; i++) {
      // перебери массив
      do {
        locations = this.generateShip();
        // И присвой locations сгенерированый корабль generateShip
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
    console.log("Ships array: ");
    console.log(this.ships);
  },

  generateShip: function () {
    var direction = Math.floor(Math.random() * 2);
    //генерирует число от 0 до 1 и потом умножает его на  что бы сделать от 0 до 2 и округляет вниз 0 вертикаль, 1 горизонталь.
    var row, col;
    if (direction === 1) {
      // horizontal
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
    } else {
      // vertical
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
      col = Math.floor(Math.random() * this.boardSize);
    }

    var newShipLocations = [];
    //Набор позиций нового корабля начинается с пустого массива, в который последовательно добавляются элементы
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));
      } else {
        newShipLocations.push(row + i + "" + col);
      }
    }
    return newShipLocations;
  },

  collision: function (locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  },
};

var controller = {
  shoots: 0,
  processGuess: function (cordinations) {
    var location = parseGuess(cordinations);
    if (location) {
      this.shoots++;
      //Если cordinations совпадают с кординатами кораблся, то в shoots ++
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage(
          "You sank all ships in " + this.shoots + " attempts and you won!"
        );
        // Если hit и model.shipsSunk = model.numShips ( 3 и 3 = 3), выведи на дисплей
      }
    }
  },
};

function parseGuess(cordinations) {
  var letters = ["A", "B", "C", "D", "E", "F", "G"];
  //Буквы на поле

  if (cordinations === null || cordinations.length !== 2) {
    alert("Oops, please enter a letter and a number on the board.");
    // Если cordinations не ровны нулю и длинна кординат ровна только 2, тогда выведет текст alert
  } else {
    firstChar = cordinations.charAt(0);
    var row = letters.indexOf(firstChar);
    var column = cordinations.charAt(1);
    //Или же firstChar получит и возвращает первый символа в cordinations
    //row полчает значение знаение firstChar и перебирает его в массиве letters, когда найдет, то возвращает его положение в массиве (номер позиции)
    //column получает знчение 2-ого символа в cordinations (символ уже является числом)

    if (isNaN(row) || isNaN(column)) {
      alert("Oops, that isn't on the board.");
      // проверяет, являются ли числами row и column, если нет то выведет alert
    } else if (
      row < 0 ||
      row >= model.boardSize ||
      column < 0 ||
      column >= model.boardSize
    ) {
      alert("Oops, that's off the board!");
      // или если row < 0 или row >= model.boardSize или column < 0 или column >= model.boardSize, то выведет alert
    } else {
      return row + column;
    }
  }
  return null;
}

function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  controller.processGuess(guess);
  guessInput.value = "";
}

function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}

window.onload = init;

function init() {
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  // Fire! button onclick handler

  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;
  // handle "return" key press

  model.generateShipLocations();
  // place the ships on the game board
}


