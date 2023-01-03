const range = (start, end) => {
  let res = [];
  for (let i = start; i < end; i++) {
    res.push(i);
  }
  return res;
};

const shuffle = (array) => {
  const swap = (array, fromIndex, toIndex) => {
    let toItem = array[toIndex];
    let fromItem = array[fromIndex];
    array[toIndex] = fromItem;
    array[fromIndex] = toItem;
  };

  for (let i = 0; i < array.length; i++) {
    let newIndex = Math.floor(Math.random() * array.length);
    if (newIndex !== i) {
      swap(array, i, newIndex);
    }
  }
  return array;
};

const generateBoardItems = (gridSize, theme) => {
  gridSize = gridSize[0] * gridSize[1]
  const totalPairs = gridSize / 2;
  const rangeSize = theme === "icons" ? 8 : 99
  const source = range(0, rangeSize);
  let withReplacement = totalPairs > source.length;
  const items = [];
  for (let i = 0; i < totalPairs; i++) {
    let randomIndex = Math.floor(Math.random() * source.length);
    let randomItem = source[randomIndex];
    items.push(randomItem, randomItem);
    if (withReplacement) {
      source.splice(randomIndex, 1);
    }
  }
  return shuffle(items);
};

module.exports =  { generateBoardItems };
