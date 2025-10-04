function numberToWords(num) {
            // Array for numbers from 0 to 19
            const ones = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
                        "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
                        "sixteen", "seventeen", "eighteen", "nineteen"];
            
            // Array for multiples of ten (20, 30, 40, etc.)
            const tens = ["", "", "twenty", "thirty", "forty", "fifty",
                        "sixty", "seventy", "eighty", "ninety"];

            // If the number is between 20 and 99
            if (num < 20) {
                return ones[num];
            }
        
            // If the number is between 100 and 999
            if (num < 100) { 
                var reminder = num % 10;
                return tens[Math.floor(num / 10)] + 
                    (reminder !== 0 ? "-" + ones[reminder] : "");
            }

            // If the number is between 100 and 999
            if (num < 1000) { 
                return ones[Math.floor(num / 100)] + " hundred" + 
                    (num % 100 !== 0 ? " and " + numberToWords(num % 100) : "");
            }
            // If the number is between 1000 and 9999
            if (num < 100000) {
                return numberToWords(Math.floor(num / 1000)) + " thousand" + 
                    (num % 1000 !== 0 ? " " + numberToWords(num % 1000) : "");
            }

             if (num < 10000000) {
                return numberToWords(Math.floor(num / 100000)) + " lac" + 
                    (num % 100000 !== 0 ? " " + numberToWords(num % 100000) : "");
            }
             if (num < 1000000000) {
                return numberToWords(Math.floor(num / 1000000)) + "100crore" + 
                    (num % 1000000 !== 0 ? " " + numberToWords(num % 1000000) : "");
            }
            return "Number too big";
        }

        var number = +prompt("Enter number");
        console.log(numberToWords(number));