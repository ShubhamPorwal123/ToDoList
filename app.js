const express = require("express");         // provide libraries
const bodyParser = require("body-parser");  // individual elements access
const mongoose = require("mongoose");       // database connectivity with mongodb

const app = express();      // express instance

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Mongodb connection

// mongoose connection establishment
mongoose.connect("mongodb+srv://admin-shubham:Test123@cluster0.o8elx.mongodb.net/tdlDB",{ useNewUrlParser: true ,  useUnifiedTopology: true });

// Schema
const itemsSchema = new mongoose.Schema({
    name : String
});

// model
const Item = mongoose.model("Item",itemsSchema);

// adding documents / items into mongodb
const brush = new Item({
    name : "Brush"
});

const bath = new Item({
    name : "Bath"
});

const breakfast = new Item({
    name : "Breakfast"
});

const defaultItems = [brush,bath,breakfast];



// reading items from mongodb
app.get("/", function (req, res) {

    Item.find(function(error,foundItems)
    {
        if(foundItems.length === 0)
        {
            Item.insertMany(defaultItems,function(error)
            {
                console.log("Successful insertion");
            });
            res.redirect("/");
        }
        else
        {
            res.render("list", { ListTitle: "Today", newItemArray: foundItems });
        }
    })
});

// Logic for adding a new item into the list
app.post("/", function (req, res) {
    
    let itemName = req.body.newItem;

    const newItem = new Item({
        name : itemName
    })

    newItem.save();

    res.redirect("/");

});

// Logic for delete an item from the list
app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;

    Item.deleteOne({_id : checkedItemId },function(error){
        if(error)
        {
            console.log(error);
        }
        else
        {
            console.log("successfully deleted");
        }
    })

    res.redirect("/");
});

// listen on port 3000
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);

