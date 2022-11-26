const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const lodash = require("lodash");


mongoose.connect("mongodb://localhost:27017/blogdb");
const blogSchema = mongoose.Schema({
  title: { type: String, unique: true },
  content: String
});
const Blog = mongoose.model("Blog", blogSchema);

const home = new Blog({ title: "Home", content: "Laces vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing." });
// home.save();

const about = new Blog({ title: "About", content: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui." });
// about.save();

const contact = new Blog({ title: "Contact", content: "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero." });
// contact.save();
//Global variables

Blog.find({}, (err, result) => {

  if (result.length === 0) {
    console.log("Inserting items...")
    Blog.insertMany([home, about, contact]);
  }
  else{console.log("Items found");}
});
const posts = [];
// const homeStartingContent = new Blog({title:"homeStartingContent",content:"Hola this is starter content from mongoDb"});

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//GET routes
app.get("/", function (req, res) {
  Blog.find({}, (err, found) => {
    // console.log(found);
    res.render("home", { found: found})
  });
  // console.log(posts);

});
app.get("/about", function (req, res) {
  Blog.findOne({ title: "About" }, (err, content) => {

    res.render("about", { content: content });
  });
});
app.get("/contacts", function (req, res) {
  Blog.findOne({ title: "Contact" }, (err, content) => {

    res.render("contact", { content: content })
  });
});
app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts/:post", function (req, res) {
  posts.forEach(function (post) {
    const requiredPost = lodash.lowerCase(req.params.post);
    const storedPost = lodash.lowerCase(post.postTitle);
    if (storedPost === requiredPost) {
      res.render("post", { title: post.postTitle, content: post.postContent })
    }

  });
});

//POST routes
app.post("/compose", function (req, res) {
  const postTitle = req.body.title;
  const postContent = req.body.content;
  const newBlog = new Blog({title:postTitle,content:postContent});
  if(newBlog.save())
  {
    const post = { postTitle, postContent }
    console.log(newBlog);
    // posts.push(post);
    // res.redirect("/");
    Blog.find({},(err,found)=>{

      res.render("home",{found:found});
    });
  }
});

//PORT
app.listen(3000, function () {
  console.log("Server started on port 3000\nhttp://localhost:3000");
});
