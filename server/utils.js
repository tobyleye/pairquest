const range = (start, end) => {
  let res = [];
  for (let i = start; i < end; i++) {
    res.push(i);
  }
  return res;
};

// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
const shuffle = (sequence) =>  {
  const swap = (i, j) => {
    const ith_item = sequence[i];
    const jth_item = sequence[j];

    sequence[i] = jth_item;
    sequence[j] = ith_item;
  };

  for (let i = sequence.length - 1; i > 0; i--) {
    const roll = Math.floor(Math.random() * i);
    swap(roll, i);
  }

  return sequence;
}

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
