const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));

function removeDuplicateWithSet(myArr) {
  const newObj = new Set(myArr);
  const newArr = [];
  newObj.forEach((obj) => {
    newArr.push(obj);
  });
  return newArr;
}

function removeDuplicateWithObject(myArr) {
  const obj = {};
  const preserveArr = [];
  myArr.forEach((element, i) => {
    if (obj[element] === undefined) {
      obj[element] = { data: element, index: i };
      preserveArr.push(obj[element]);
    }
  });
  const origOrderArr = preserveArr.sort((a, b) => a.index - b.index);
  return origOrderArr.map((element) => element.data);
}

function validateOrder(order) {
  if (typeof order !== 'string') {
    throw new Error('The order name type should be a string --');
  }
  const asc = order.toLowerCase() === 'asc';
  if (!asc && order.toLowerCase() !== 'desc') {
    throw new Error('Please choose the correct abbreviation of the order name ^^');
  }
  return asc;
}

function sortWithSort(myArr, order) {
  const asc = validateOrder(order);
  const sortedArr = myArr;
  return sortedArr.sort((a, b) => (asc ? a - b : b - a));
}

function sortWithMySort(myArr, order) {
  const asc = validateOrder(order);
  const sortedArr = [];
  let minOrMax;
  let unsortedArr = myArr;

  myArr.forEach(() => {
    minOrMax = asc ? Math.min(...unsortedArr) : Math.max(...unsortedArr);
    sortedArr.push(minOrMax);
    unsortedArr = myArr.filter((element) => (asc ? element > minOrMax : element < minOrMax));
  });

  // overwrites myArr (?)
  // myArr.forEach(() => {
  //   minOrMax = asc ? Math.min(...unsortedArr) : Math.max(...unsortedArr);
  //   sortedArr.push(minOrMax);
  //   unsortedArr[unsortedArr.indexOf(minOrMax)] = asc
  //     ? Math.max(...unsortedArr) : Math.min(...unsortedArr);
  // });
  return sortedArr;
}

// function findSecondMax(arr) {
//   const max1 = Math.max(...arr);
//   const withoutMax1 = arr.filter((element) => element !== max1);
//   return Math.max(...withoutMax1);
// }

app.get('/', (_, res) => {
  try {
    const myArr = [2, 3, 88, 2, 4, 5, 4, 3, 22, 1, 1, 4, 5, 0];
    const readySet = removeDuplicateWithSet(myArr);
    const customSet = removeDuplicateWithObject(myArr);

    const readySort = sortWithSort(removeDuplicateWithSet(myArr), 'asc'); // to avoid overwriting
    const customSort = sortWithMySort(customSet, 'asc');
    res.status(200).json({ duplicate: { readySet, customSet }, order: { readySort, customSort } });

    // const arr = [2, 3, 88, 2, 4, 5, 4, 3, 22, 1, 0];
    // res.status(200).json(findSecondMax(arr));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('The server is running on port 3000');
});
