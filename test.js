// const array = [13, 1, 7, 2, 5, 3, 8, 2, 1, 13, 1, 7, 11, 4, 7, 6, 9, 10, 12];

// const result1 = array.filter((item, index, array) => {
//   return array.indexOf(item) !== index;
// }); //[ 2, 1, 13, 1, 7, 7 ] result

// const result2 = array
//   .sort((a, b) => a - b)
//   .filter((item, index, array) => {
//     return array.indexOf(item) === index;
//   }); // [ 1, 2, 3,  4,  5,  6, 7, 8, 9, 10, 11, 12,13 ]

// const result3 = array
//   .sort((a, b) => a - b)
//   .filter((item, index, array) => {
//     return array.indexOf(item) !== index;
//   }); // [ 1, 1, 2, 7, 7, 13 ]

// const result4 = array.reduce((obj, arr) => {
//   if (obj[arr] == undefined) {
//     obj[arr] = 1;
//     return obj;
//   } else {
//     obj[arr]++;
//     return obj;
//   }
// }, {}); // { '1': 3, '2': 2, '3': 1, '4': 1, '5': 1, '6': 1,'7': 3, '8': 1, '9': 1, '10': 1, '11': 1, '12': 1,'13': 2 }

// const value = 'asdsd';
// console.log(!isNaN(value)); // true if value is a number

// const month  = 'june';
// month = 'july';
// console.log(month);

// const obj = {
//     name: 'farhan',
//     age: 25,
// }
// Object.freeze(obj);
// obj.name = 'khan';
// console.log(obj);


// console.log(array.sort((a,b) =>{ return a-b})); // [ 1, 1, 2, 2, 3, 5, 7, 7, 8, 9, 10, 11, 12, 13, 13 ]

// const months = ['jan','june','july','august','september','feb','march','april','may','october','november','december'];
// console.log(months.sort()); // [ 'april', 'august', 'december', 'feb', 'jan', 'july', 'june', 'march', 'may', 'november', 'october', 'september' ]


//create a function for setImmediate
// function setImmediate(callback) {
//     const startTime = new Date().getTime();
//     while (new Date().getTime() < startTime + 0) { }
//     callback();
// }
// setImmediate(() => {
//     console.log('hello');
// }
// );
// //write a function for set time out
// function setTimeOut(callback, time) {
//     const startTime = new Date().getTime();
//     while (new Date().getTime() < startTime + time) { }
//     callback();
// }

// setTimeOut(() => {
//     console.log('hello');
// }, 5000);

