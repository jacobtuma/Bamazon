var mysql = require("mysql");
var inquirer = require('inquirer')

var connection = mysql.createConnection({
    host: "localhost", port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "122",
    database: "bamazon_db"
});
console.log("Welcome, Manager.")
welcome()


function welcome () {
    console.log("\n")
     inquirer.prompt([
        {
            type: "list",
            message: "Make a selection",
            choices: [ 'View Products for sale', 'View Low Inventory', 'Add to inventory', 'Add New Product' ],
            name: "choice"
            }
        ])
        .then(function (start) {
       connection.query("SELECT * FROM products ", function (err, res) {
    if (err) {
        throw err;
    }

            switch(start.choice) {
    case "View Products for sale":
        viewProducts(res)
        break;
case "View Low Inventory":
        viewLow()
        break;

        case 'Add to inventory': 
        addQuantity(res)
         break;

         case 'Add New Product':
         newItem()
         break;


   }

       });
        });

         

}

function viewProducts(res) {
   
    console.log("------------------------------------------------------------")
    console.log("Item ID | Name | Department | Price | Quantity")
    for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + "        " + res[i].product_name + " " + res[i].department_name + " $" + res[i].price + " " + res[i].stock_quantity)
    }
    console.log("------------------------------------------------------------")
    connection.end()
    

}


function viewLow(res) {
    connection.query("SELECT * FROM products WHERE stock_quantity BETWEEN -15 AND 15", function(err, res) {
    if(err) {
        throw err;
    }

    console.log("------------------------------------------------------------")
    console.log("Item ID | Name | Department | Price | Quantity")
    for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + "        " + res[i].product_name + " " + res[i].department_name + " $" + res[i].price + " " + res[i].stock_quantity)
    }
    console.log("------------------------------------------------------------")
    });

    connection.end()
    
}



function addQuantity(res) {

    inquirer.prompt([
        {
            type: "input",
            message: 'Insert the ID of the item you\'d like.',
            name: "item",
            validate: function (value) {
                if ((value) <= res.length) {
                    return true;
                }
                return false;
                
            }
        }
        ])
        .then(function (choice) {

            inquirer.prompt([
        {
            type: "input",
            message: "You've selected: \"" + res[choice.item-1].product_name + "\". Current quantity is: " + res[choice.item-1].stock_quantity + ".\n Make a change in positive or negative integer amounts:",
            name: "new",
            validate: function (value) {
                if ((value) != NaN) {
                    return true;
                }
                return false;
                
            }
        }
        ])
        .then(function (result) { 
           
            newQuantity = parseInt(res[choice.item-1].stock_quantity) + parseInt(result.new)
            itemID = res[choice.item-1].item_id



            connection.query("UPDATE products SET stock_quantity = ? WHERE item_id= ?",[newQuantity, itemID], function (err, res) {
    if (err) {
        throw err;
    }
console.log("Database Updated!")
console.log("New stock quantity is " + newQuantity + ".")

connection.end()
    });

        });
        });
        
}

function newItem(){
     inquirer.prompt([
        {
            type: "input",
            message: "New Product Name:",
            name: "product_name"
            },
   {
            type: "input",
            message: "Department:",
            name: "department_name"
            },
               {
            type: "input",
            message: "Price:",
            name: "price"
            },
               {
            type: "input",
            message: "How many in stock?",
            name: "stock_quantity"
            },
        ])
        .then(function (n) {


connection.query("INSERT INTO products SET ?", {
  product_name: n.product_name,
  department_name: n.department_name ,
  price: n.price,
  stock_quantity: n.stock_quantity
}, function(err, res) {
  console.log("Database Updated!")
  connection.end()
});

     
    
  });


}