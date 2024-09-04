import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "blog",
  password: "1357912",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));

// Array to store posts
let posts = [];

// Route to render the home page

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM posts ORDER BY id ASC");
    posts = result.rows;
    const resultFeatured = await db.query("SELECT * FROM posts WHERE type = 'featured' ORDER BY created_at DESC LIMIT 1");
    const featuredPost = resultFeatured.rows[0] || null;

    res.render("index.ejs", {
    posts,
    featuredPost
  });
  } catch (err) {
    console.log(err);
  }
});


app.get('/weather', async (req, res) => {
  const city = req.query.city; // Get the city from the query parameters

  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const apiKey = '7a529339c4a6443b8f0144547241002';
    const weatherResponse = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
    const weatherData = weatherResponse.data;

    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// Route to handle the post creation
app.get("/create-post", (req, res) => {
  res.render("create-post.ejs");
});

// Route to handle the form submission
app.post("/create-post", async (req, res) => {
  const date = new Date();
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const fullDate = new Intl.DateTimeFormat('en-US', options).format(date);
  const { title, content, type, category } = req.body;
  try {
    await db.query("INSERT INTO posts (title, content, type, category, created_at) VALUES ($1, $2, $3, $4, $5)", [title, content, type, category, fullDate]);
    res.redirect("/");
  } catch(err) {
    console.log(err);
  }
  //  const newPost = { title, content, fullDate };
  //  posts.push(newPost);
});

// Route to render the edit form for a specific post
app.get("/edit-post/:index", (req, res) => {
  const index = req.params.index;
  const postToEdit = posts[index];
  res.render("edit-post.ejs", { index, postToEdit });
});

app.get("/read-more/:index", (req, res) => {
  const index = req.params.index;

  res.render("read-more.ejs", { index, posts });
});

app.get("/read-more/long-posts/:index", (req, res) => {
  const index = req.params.index;

  res.render("long-posts.ejs", { index, longPosts });
});

app.get("/read-more/featured-posts/:index", (req, res) => {
  const index = req.params.index;

  res.render("featured-posts.ejs", { index, featuredPosts });
});

app.get("/read-more/business-posts/:index", (req, res) => {
  const index = req.params.index;

  res.render("business-posts.ejs", { index, businessPosts });
});

app.get("/read-more/culture-posts/:index", (req, res) => {
  const index = req.params.index;

  res.render("culture-posts.ejs", { index, culturePosts });
});

app.get("/business", async (req, res) => {
  try {
    const resultBusiness = await db.query("SELECT * FROM posts WHERE category = 'business' ORDER BY created_at DESC");
    const businessPosts = resultBusiness.rows || null;

    res.render("business.ejs", {
    posts,
    businessPosts
  });
  } catch (err) {
    console.log(err);
  }
});

app.get("/culture", async (req, res) => {
  try {
    const resultCulture = await db.query("SELECT * FROM posts WHERE category = 'culture' ORDER BY created_at DESC");
    const culturePosts = resultCulture.rows || null;

    res.render("culture.ejs", {
    posts,
    culturePosts
  });
  } catch (err) {
    console.log(err);
  }
});

app.get("/travel", async (req, res) => {
  try {
    const resultTravel = await db.query("SELECT * FROM posts WHERE category = 'travel' ORDER BY created_at DESC");
    const travelPosts = resultTravel.rows || null;

    res.render("travel.ejs", {
    posts,
    travelPosts
  });
  } catch (err) {
    console.log(err);
  }
});

// Route to handle the form submission for editing a post
app.post("/edit-post/:index", (req, res) => {
  const index = req.params.index;
  const { title, content } = req.body;
  posts[index] = { title, content };
  res.redirect("/");
});

// Route to handle the deletion of a post
app.get("/delete-post/:index", (req, res) => {
  const index = req.params.index;
  posts.splice(index, 1);
  res.redirect("/");
});

app.use(express.static('public'));


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
