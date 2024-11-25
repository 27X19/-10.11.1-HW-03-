// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
const minWeightInput = document.querySelector('.minweight__input');      // поле min weight
const maxWeightInput = document.querySelector('.maxweight__input');      // поле max weight

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  fruitsList.innerHTML = '';
  
  for (let i = 0; i < fruits.length; i++) {
      const li = document.createElement('li');
      li.classList.add('fruit__item');
  
      switch (fruits[i].color) {
       case 'фиолетовый':
          li.classList.add('fruit_violet');
          break;
       case 'зеленый':
          li.classList.add('fruit_green');
          break;
       case 'розово-красный':
          li.classList.add('fruit_carmazin');
          break;
       case 'желтый':
          li.classList.add('fruit_yellow');
          break;
       case 'светло-коричневый':
          li.classList.add('fruit_lightbrown');
          break;
       case 'красный':
          li.classList.add('fruit_red');
          break;
       case 'оранжевый':
          li.classList.add('fruit_orange');
          break;
       case 'малиновый':
          li.classList.add('fruit_crimson');
          break;
       case 'желто-оранжевый':
          li.classList.add('fruit_yellow-orange');
          break;
       case 'желто-зеленый':
          li.classList.add('fruit_yellow-green');
          break;
       default:
          break;
      }
  
      fruitsList.appendChild(li);
  
      const div = document.createElement('div');
      div.classList.add('fruit__info');
      li.appendChild(div);
  
      div.innerHTML = `
       <div>index: ${i + 1}</div>
       <div>kind: ${fruits[i].kind}</div>
       <div>color: ${fruits[i].color}</div>
       <div>weight (кг): ${fruits[i].weight}</div>
      `;
  }
  };
  
  display();


/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  let newFruits = [...fruits];
  while (fruits.length > 0) {
    let randomFruits = getRandomInt(0, fruits.length - 1);   // рандом и фруктов
    result.push(fruits[randomFruits]);                       // вставляем рандом  в result
    fruits.splice(randomFruits, 1);                          // вырезаем рандом
  }
  fruits = result;
  // Проверка на совпадение при перемешивании
  let notShuffled = fruits.every((el, index) => el === newFruits[index]);
  if (notShuffled) {
    alert("Нажмите ПЕРЕМЕШАТЬ еще раз");
  }
};
shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  let minWeight = parseInt(minWeightInput.value);
  let maxWeight = parseInt(maxWeightInput.value);
  
  if (isNaN(minWeight) || isNaN(maxWeight)) {
      alert('Вес должен быть указан числом!');
      maxWeightInput.value = "";
      minWeightInput.value = "";
      return fruits; // Возвращаем исходный массив, если значения не корректны
  }
  
  // Обмен значениями, если max меньше min
  if (maxWeight < minWeight) {
      [minWeight, maxWeight] = [maxWeight, minWeight];
  }
  
  return fruits.filter((item) => {
      return item.weight >= minWeight && item.weight <= maxWeight;
  });
  };
  
  filterButton.addEventListener('click', () => {
  fruits = filterFruits();
  display();
  });


/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  const priorityColor = ['желтый', 'зеленый', 'розово-красный', 'фиолетовый', 'светло-коричневый'];
  const color1 = priorityColor.indexOf(a.color);
  const color2 = priorityColor.indexOf(b.color);
  return color1 > color2;
};

const sortAPI = { //  сортировкa пузырьком
  bubbleSort(arr, comparation) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        if (comparation(arr[j], arr[j + 1])) {
          const tmp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = tmp;
        }
      }
    }
  },

  quickSort(arr, comparation) { //быстрая сортировка
    if (arr.length <= 1) {
      return arr;
    }
    let index = Math.floor(arr.length / 2);
    let currentItem = arr[index];
    let less = [];
    let more = [];
    for (let i = 0; i < arr.length; i += 1) {
      if (i === index) {
        continue;
      }
      if (comparation(arr[i], currentItem)) {
        more.push(arr[i]);
      } else {
        less.push(arr[i])
      }
    }
    return [...this.quickSort(less, comparation), currentItem, ...this.quickSort(more, comparation)];
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

// Переключать значение sortKind между 'bubbleSort' / 'quickSort'
sortChangeButton.addEventListener('click', () => {
  sortKindLabel.textContent === 'bubbleSort' ? sortKindLabel.textContent = 'quickSort' : sortKindLabel.textContent = 'bubbleSort';
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  const newFruit = {
    kind: kindInput.value,
    color: colorInput.value,
    weight: parseInt(weightInput.value)
    };
    fruits.push(newFruit);
  display();
});
