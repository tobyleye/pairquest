const parseGridSize = (size) => {
  if (size.includes("x")) {
    return size.split("x").map((i) => parseInt(i));
  } else {
    size = parseInt(size);
    return [size, size];
  }
};

const generateBoardItems = (size) => {
  let totalItems = size[0] * size[1];
  let totalPairs = totalItems / 2;
  let items = [];
  for (let i = 0; i < totalPairs; i++) {
    let item = Math.floor(Math.random() * 99);
    items.push(item, item);
  }
  return shuffle(items);
};

module.exports = {
  parseGridSize,
  generateBoardItems,
};

function shuffle(array) {
  let clone = [...array];
  let result = [];
  while (clone.length > 0) {
    let randomIndex = Math.floor(Math.random() * clone.length);
    let randomItem = clone[randomIndex];
    result.push(randomItem);
    clone.splice(randomIndex, 1);
  }
  return result;
}
