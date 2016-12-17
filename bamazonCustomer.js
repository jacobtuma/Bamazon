var mysql = require("mysql");
var inquirer = require('inquirer')

var connection = mysql.createConnection({
    host: "localhost", port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "jakey122",
    database: "bamazon_db"
});
var itemID = 0;
var itemPrice = 0;

connection.query("SELECT * FROM products ", function (err, res) {
    if (err) {
        throw err;
    }
    console.log("------------------------------------------------------------")
    console.log("Item ID | Name | Department | Price | Quantity")
    for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + "        " + res[i].product_name + " " + res[i].department_name + " $" + res[i].price + " " + res[i].stock_quantity)
    }
    console.log("------------------------------------------------------------")
    prompt(res)
});

function prompt(res) {
    inquirer.prompt([
        {
            type: "input",
            message: 'Insert the ID of the item you\'d like. Type "q" to quit.',
            name: "item",
            validate: function (value) {
                if ((value) <= res.length || (value) == "q") {
                    return true;
                }
                return false;
                
            }
        }
        ])
        .then(function (choice) {
            itemID = choice.item;
            itemPrice = res[choice.item - 1].price
    

            if (choice.item == "q" || choice.item == "Q") {
                connection.end()
            } else if (choice.item <= res.length) {
                askQuantity(res[choice.item - 1].stock_quantity)
            }

        });

}

function askQuantity(quantity) {


    inquirer.prompt([
        {
            type: "input",
            message: "How many would you like? (" + quantity + " in stock!)" ,
            name: "requested",
            validate: function (value) {
                if ((value) <= quantity ){
                    return true;
                
                }
                return false;
            }

        }
        ])
        .then(function (choice) {

updateDB(quantity, choice.requested)
     

        });
        

}

function updateDB(quantity, requested) {

newQuantity = quantity - requested;
var total = itemPrice * requested

       connection.query("UPDATE products SET stock_quantity = ? WHERE item_id= ?",[newQuantity, itemID], function (err, res) {
    if (err) {
        throw err;
    }
console.log("Database Updated!")
    });

console.log("Your total is $" + total )
connection.end()



}


// "UPDATE products SET ? WHERE ?"