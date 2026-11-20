// Take command line arguments, convert them to numbers
let arr = process.argv.slice(2).map(Number);

console.log("Array elements are:");

// Corrected for loop syntax
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}
