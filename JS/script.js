var amount = +prompt("Enter amount:");

if(isNaN(amount) || amount % 500 !== 0){
    console.log("Please enter a correct number");
}else{
    var n5000 = Math.floor(amount / 5000);
    amount = amount % 5000;

    var n1000 = Math.floor(amount / 1000);
    amount = amount % 1000;

    var n500 = Math.floor(amount / 500);
    amount = amount % 500;

    if(n5000 > 0){
        console.log("5000 x " + n5000);
    }else{
        console.log("5000 is zero");
    }

    if(n1000 > 0){
        console.log("1000 x " + n1000);
    }
    else{
        console.log("1000 is zero");
    }

    if(n500 > 0){
        console.log("500 x " + n500);
    }
    else{
        console.log("500 is zero");
    }

}