# iced-handler

handle ( index, create, getEdit, postEdit, delete ) regustes very easily for express apps

## install

```
npm i iced-handler
```

## how to use ?

1- import ICED
```js
const ICED = require('iced-handler')
```
2- import your Model
```js
const Post = require('./models/post')
```
or you can sent your models directory. but in models dir must be somthing like this :

/models/index.js:
```js
// you must do this for all of you models
exports.Post = require('./post')
```
and then insted of using model object in next step you cant just use model Sting name like this :`index(req , "Post")`

```js
ICED.modelsPath = '/models'
```

3- use it in controller
`index(req , <model name , model object>)`return the pageinated object of model
```js
app.get('/' ,async (req, res) => {
    res.json(await ICED.index(req , Post))
})
```
if your requst is somthig that need to gave data you can use this way:

make data structure list it list items can be `String` or `Object`

if it was `String` ICED will put `req.body[<your Str>]`

if it was `Object` ICED will use `exptions` that can create by your self. `exptions` are functions thay return somthig and that returned thing will put in data that is going to save

`Oject` must be like this:`{<key> : <value> , args: [<exptions argument>]}`  value can be `exptions` or can be `anonymous function`

Define `exptions`
```js
ICED.exptions.<exptions name> = (req , args) => {
    // do staff
    return data
}
```

```js
app.post('/posts' ,async (req, res) => {

    const dataStructure = [
        "title", // title : req.body.title
        { 'slug': "slug", args: ["title"] }, // create slug from title
        { 'user': "curent_user" }, // get curent user with exptions
        {'tag' : () => {
            let tag
            // do staff
            return tag
        }} // put tag var in data
    ]

    res.json(await ICED.postCreate(req , Post , dataStructure))
})
```


full example of using ICED :

project structure:
```
/app
    /models
        post.js
        product.js
        indes.js
    index.js
```

/app/index.js :
```js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ICED = require("iced-handler");

// connect to database
mongoose.connect("mongodb://localhost:27017/test").then((result) => {
  app.listen(3000);
});

ICED.modelsPath = "/models";

ICED.exptions.curent_user = (req) => {
    let user
    // get curent user
  return user.id;
};

// data struture of Post that you want to save
app.get("/", async (req, res) => {
  res.send(await ICED.index(req, "Post"));
});

app.get("/create", async (req, res) => {

    const data = [
  "title",
  { 'slug': "slug", args: ["title"] },
  { 'user': "curent_user" },
  {'tag' : () => {
    let tag
    // do staff
    return tag
  }}
];

  res.send(await ICED.postCreate(req, "Post", data));
});
```

/app/models/index.js:
```js
exports.Post = require('./post')
exports.Product = require('./product')
```

/app/models/post.js:
```js
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    title: {
        type: String
    },
    slug: {
        type: String
    },
    user:{
        type: String
    },
    tag:{
        type: String
    }
})

module.exports = mongoose.model('Post', postSchema)
```
