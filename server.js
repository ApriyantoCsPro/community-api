require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 30000;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const commentsRoutes = require("./routes/comments");
const likesRoutes = require("./routes/likes");
const reactionsRoutes = require("./routes/reactions");
const subscribesRoutes = require("./routes/subscribers");

app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/posts", postRoutes)
app.use("/comments", commentsRoutes)
app.use("/likes", likesRoutes)
app.use("/reactions", reactionsRoutes)
app.use("/subscribers", subscribesRoutes)

app.listen(port);
console.log("Learn Node JS With Afray, RESTful API server started on: " + port);
