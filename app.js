
import express from "express";
import bodyParser from "body-parser";
import file from "./file.cjs";
import mongoose from "mongoose";
import _ from "lodash";

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const port = process.env.PORT || 3000;
const day = file.getDate();
const year = file.getYear();


const {Schema} = mongoose;

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const itemsSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item ({
    name: 'Welcome to Your ToDoList!'
});

const item2 = new Item ({
    name: 'Click the + Button to Add New Items.'
});

const item3 = new Item ({
    name: 'Click the Checkbox to Delete an Item from the Todolist.'
});

const defaultItems = [item1, item2, item3];

const listSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    items: [itemsSchema]
});

const List = mongoose.model('List', listSchema); 


app.get("/", (req, res) => {
  Item.find({}).then((foundItems) => {
    if (foundItems.length === 0) {
        Item.insertMany(defaultItems).then(async () => {
          console.log("Successfully saved default items to DB!");
          res.redirect("/");
        });
      } else {
        res.render("list", {
          listTitle: day,
          newListItems: foundItems,
          currentYear: year,
        });
    }
  });
});


app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const dynamicItem = new Item ({
        name: file.capitalize(itemName)
    });
    if (listName === day) {
        dynamicItem.save();
        res.redirect('/');   
    } else {
        List.findOne({name: listName}).then((foundList) => {
            foundList.items.push(dynamicItem);
            foundList.save();
            res.redirect(`/${listName}`);
        });
    }
});


app.post("/delete", (req, res) => {
    const checkedItemID = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === day) {
        Item.deleteOne({_id: checkedItemID}).then(() => {
            console.log(`${checkedItemID} has been deleted successfully.`);
            res.redirect('/');
        });
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemID}}}).then((foundList) => {
            res.redirect(`/${listName}`);
        });
    }
});


app.get("/:customListName", (req, res) => {
    const customList = _.capitalize(req.params.customListName);
    List.findOne({name: file.capitalize(customList)}).then((listQuery) => {
        if (!listQuery) {
            const list = new List({
            name: file.capitalize(customList),
            items: defaultItems
            });
            list.save();
            res.redirect(`/${customList}`)
        } else {
            res.render('list', {
                listTitle: listQuery.name,
                newListItems: listQuery.items,
                currentYear: year
            });
        }
    });
});


app.get("/about", (req, res) => {
    res.render("about", {
        currentYear: year
    });
});

app.listen(port, () => { 
    console.log(`Listening on => 127.0.0.1:${port}/`);
});

