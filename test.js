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
// console.log(result4);
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

// const a = {
//     type: 'number',
// }

// a.type = 'string';
// console.log(a.type);

//write a function for set interval

// function setInterval(callback, time) {
//     const startTime = new Date().getTime();
//     while (true) {
//         if (new Date().getTime() >= startTime + time) {
//             callback();
//             startTime = new Date().getTime();

//         }
//     }
// }

// setInterval(() => {
//     console.log(count);
// }, 1000);

// const array = [{name:"jatin", age:23}]
//  array.map((item) => {
//     for(let i in item){
//         console.log(i);
//     }
// })

// const child_process = require('child_process');

// child_process.spawn('node', [,'child.js'], {
//     stdio: 'inherit'
// });
// setTimeout(()=>{console.log("TimeOut")},1000)
// console.log("line 1")
// setTimeout(()=>{console.log("TimeOut2 2 2 2 2")},0)
// setImmediate(()=> {
//     console.log("Immidiate")
// });

// console.log("line 2")



// const a = 10;
// console.log(b);
// var b = 90;
// console.log(c);
// let c = 10;
// console.log (a);
// console.log(d);
// const d =12;

// ()=>{
// console.log("Inside",b)
// var b = 10;
// }
// var b = 20;
// console.log("Outside",b)

// const arr = ['abc', 'xyz'];
// const newarr = ['sdfs', 'dgff','werc'];

// const aa =arr.concat( newarr)
// console.log(aa);

// ()=>{
//     console.log("avc");
// }


// let q = ["avc","abc","xyz","snap","www"]

// const aaa = q.indexOf("abc");
// q.(aaa);
// console.log(q,"ddd");