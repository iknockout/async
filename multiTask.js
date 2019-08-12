/*  
 *  Demonstrate use of callback to receive notification when a job is finished.
 *  See how asynchronous allows a program to multi-task.
 *
 *  Callbacks:  pre-ES6
 *  Promises:  introduced in ES6
 *  async...await:  introduced in ES8
 */

function notifyWhenFinished( timeInSeconds ) {
  const timeUnit = timeInSeconds > 1 ? "seconds" : "second";
  console.log( `${timeInSeconds} ${timeUnit} is over.` );
}

function doStuffForNseconds( numSeconds ) {
  setTimeout( () => {
    notifyWhenFinished( numSeconds );
  }, numSeconds * 1000 );
}

function doStuff() {
  doStuffForNseconds(10);
  doStuffForNseconds(1);
  doStuffForNseconds(5);
  console.log("Starting to do stuff...");
}

function doMoreStuff() {
  doStuffForNseconds(3);
}

doStuff();
// doMoreStuff();

/***************************************
In real world situation, doStuff() would launch some operation, e.g.
get something from a server / service / database / API.  We make sure
such operation is asynchronous else our program (application) would
only be able to do one task at any one time.

The sample code above uses setTimeout() to mimic an asynchronous operation.
setTimeout takes two arguments: a callback function, and a time in milliseconds
as the time delay before executing the callback function.

When an asynchronous job is finished, we want to be notified so that we
can continue our task.  Hence callback functions.

In the sample code above, the callback function is the anonymous arrow function
in the first argument of setTimeout().

In real world situation, notifyWhenFinished() would do something with the data
returned from the asynchronous operation.

Note that asynchronous operations return when they are finished, i.e. they
may NOT return in the order in which they are launched.
Play around with uncommenting doMoreStuff().
***************************************/
