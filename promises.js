/*
 *  Demonstrate creating a new JavaScript (ES6) Promise and handling a promise that is
 *  resolved or rejected.
 *
 *  A promise is an object that handles asynchronous data.  A promise has three states --
 *
 *  pending : when a promise is created or waiting for data.
 *  fulfilled : the asynchronous operation was handled successfully.
 *  rejected : the asynchronous operation was unsuccessful.
 *  
 *  Documentation --
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 */

// we know this function takes a while to execute given a large enough argument
function fibonacci( n ) {
    // base cases
    if ( n === 0 ) {
        return 0;
    }
    if ( n === 1 ) {
        return 1;
    }
    // recursive step
    return fibonacci( n - 2) + fibonacci( n - 1 );
}  // end of fibonacci(arg1)

const myPromise = new Promise( (fulfilled, rejected) => {
    let fib = fibonacci(42);  // mimic async code
    if ( fib >= 0 ) {
        fulfilled(fib);
    } else {
        rejected("Promise rejected");
    }
});

const handleSuccess = resolvedValue => {
    console.log( "fibonacci returned: ", resolvedValue );
};

const handleFailure = reject => {
    console.log( reject );
};

myPromise.then(handleSuccess).catch(handleFailure);
