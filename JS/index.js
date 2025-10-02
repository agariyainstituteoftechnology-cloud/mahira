// User se number lena
var number = +prompt("Enter a number:");

// Agar number valid hai to uska table print karega
if (!isNaN(number)) {
    console.log(number + " ka table:");
    for (let i = 1; i <= 10; i++) {
        console.log(number + " x " + i + " = " + (number * i));
    }
} else {
    console.log("Please enter a correct number!");
}