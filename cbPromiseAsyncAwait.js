/*
 *  This example shows three ways of accomplishing the same task: reading and printing
 *  from two files in a specified order:
 *
 *  The first version uses callback functions.
 *  The second version uses native promise syntax.
 *  The third version uses async...await.
 *
 *  Usage:  node cbPromiseAsyncAwait.js
 */

//////////////  helper function  /////////////////
const fs = require('fs');

/*  Below we create a function for reading files that returns a promise.  We converted the
 *  fs.readfile() function which uses callbacks.  Many of the asynchronous functions you'll
 *  encounter already return promises, so this extra step is seldom necessary.
 */
const promisifiedReadfile = (file, encoding) =>
  new Promise((resolve, reject) => {
    fs.readFile(file, encoding, (err, text) => {
      if (err) {
        return reject(err.message);
      }
      resolve(text);
    });  // end of .readFile
  });
//////////////  end of helper function  /////////////////


/*  THE FIRST VERSION:  Here we use fs.readfile() and callback functions:
 */
fs.readFile('./file.txt', 'utf-8', (err, data) => {
  if (err) {
    throw err;
  }
  let firstSentence = data;
  fs.readFile('./file2.txt', 'utf-8', (err, data) => {
    if (err) {
      throw err;
    }
    let secondSentence = data;
    console.log("Using callback:", firstSentence, secondSentence);
  });  // end of .readFile
});  // end of .readFile


/*  THE SECOND VERSION:  Here we use native promises with our "promisified" version of readfile:
 */
let firstSentence; 
promisifiedReadfile('./file.txt', 'utf-8')
  .then((data) => {
    firstSentence = data;
    return promisifiedReadfile('./file2.txt', 'utf-8');
  })
  .then((data) => {
    let secondSentence = data;
    console.log("Using promisified:", firstSentence, secondSentence);
  })
  .catch((err) => {
    console.log(err)
  });


/*  THE THIRD VERSION:  Here we use promisifiedReadfile() again but instead of using the native
 *  promise .then() syntax, we declare and invoke an async/await function:
 */
async function readFiles() {
  let firstSentence = await promisifiedReadfile('./file.txt', 'utf-8');  // pause until promise resolves
  let secondSentence = await promisifiedReadfile('./file2.txt', 'utf-8');  // pause until promise resolves
  console.log("readFiles: Using async & await:", firstSentence, secondSentence);
}
readFiles();


/*  Alternate THIRD VERSION to show concurrency
 *
 *  Note the await keyword halts the execution of an async function until a promise is no longer pending.
 */
async function readFilesConcurrently() {
  let firstSentence = promisifiedReadfile('./file.txt', 'utf-8');  // no wait
  console.log("readFilesConcurrently: Just called promisifiedReadfile:", firstSentence);  // see promise's status

  let secondSentence = promisifiedReadfile('./file2.txt', 'utf-8');  // no wait
  console.log("readFilesConcurrently: Just called promisifiedReadfile:", secondSentence);  // see promise's status

  // await resolutions to print them to the console
  console.log("readFilesConcurrently: Using async & await:", await firstSentence, await secondSentence);
}  // end of readFilesConcurrently()

readFilesConcurrently();


/* ////////////////////////////////////////////////
Another way to take advantage of concurrency when we have multiple promises which can be executed simultaneously is to await a Promise.all().
 
We can pass an array of promises as the argument to Promise.all(), and it will return a single promise.  This promise will resolve when all of the promises in the argument array have resolved.  This promise's resolve value will be an array containing the resolved values of each promise from the argument array.
e.g.

async function asyncPromAll() {
  const resultArray = await Promise.all( [asyncTask1(), asyncTask2(), asyncTask3(), asyncTask4()] );
  for ( let i = 0; i < resultArray.length; i++ ){
    console.log(resultArray[i]);
  }
}

In our above example, we await the resolution of a Promise.all().  This Promise.all() was invoked with an argument array containing four promises (returned from required-in functions).  Next, we loop through our resultArray, and log each item to the console.  The first element in resultArray is the resolved value of the asyncTask1() promise, the second is the value of the asyncTask2() promise, and so on.

Promise.all() allows us to take advantage of asynchronicity — each of the four asynchronous tasks can process concurrently.  Promise.all() also has the benefit of failing fast, meaning it won't wait for the rest of the asynchronous actions to complete once any one has rejected.  As soon as the first promise in the array rejects, the promise returned from Promise.all() will reject with that reason.  As it was when working with native promises, Promise.all() is a good choice if multiple asynchronous tasks are all required, but none must wait for any other before executing.
//////////////////////////////////////////////// */
