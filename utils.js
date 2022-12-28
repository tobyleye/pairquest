import { icons } from "./constants";

export const parseGridSize = (size) => {
  if (size.includes("x")) {
    return size.split("x").map((i) => parseInt(i));
  } else {
    size = parseInt(size);
    return [size, size];
  }
};

const range = (start, end) => {
  let res = [];
  for (let i = start; i < end; i++) {
    res.push(i);
  }
  return res;
};

const numbersPool = () => range(0, 100);

const iconsPool = () => range(0, icons.length);

const selectRandomPair = (source, n, replace = true) => {
  let sourceCopy = [...source];
  let randomPairs = [];
  while (n > 0) {
    if (sourceCopy.length === 0) {
      break;
    }
    let randomIndex = Math.floor(Math.random() * sourceCopy.length);
    let randomItem = sourceCopy[randomIndex];
    randomPairs.push(randomItem, randomItem);
    if (!replace) {
      sourceCopy.splice(randomIndex, 1);
    }
    n -= 1;
  }

  return randomPairs;
};

export const generateBoardItems = (size, theme) => {

  let totalItems = size[0] * size[1];
  let totalPairs = totalItems / 2;
  let pool = [];
  switch (theme) {
    case "icons":
      pool = iconsPool();
      break;
    case "numbers":
      pool = numbersPool();
      break;
  }

  let withReplacement = totalPairs > pool.length;
  let items = selectRandomPair(pool, totalPairs, withReplacement);
  items = shuffle(items);
  return items;
};

function shuffle(array) {
  const swap = (array, fromIndex, toIndex) => {
    let toItem = array[toIndex];
    let fromItem = array[fromIndex];
    array[toIndex] = fromItem;
    array[fromIndex] = toItem;
  };

  for (let i = 0; i < array.length; i++) {
    // let's face it the probability of math.random returning 1 is close to 0
    let newIndex = Math.floor(Math.random() * (array.length));
    if (newIndex !== i) {
      swap(array, i, newIndex);
    }
  }
  return array;
}

// function shuffle(array) {
//   let clone = [...array];
//   let result = [];
//   while (clone.length > 0) {
//     let randomIndex = Math.floor(Math.random() * clone.length);
//     let randomItem = clone[randomIndex];
//     result.push(randomItem);
//     clone.splice(randomIndex, 1);
//   }
//   return result;
// }
