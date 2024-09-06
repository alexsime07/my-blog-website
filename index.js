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
    const resultLong = await db.query("SELECT * FROM posts WHERE type = 'longpost' ORDER BY created_at DESC");
    const longPosts = resultLong.rows || null;
    const resultCulture = await db.query("SELECT * FROM posts WHERE category = 'culture' ORDER BY created_at DESC LIMIT 1");
    const culturePost = resultCulture.rows[0] || null;
    const resultBusiness = await db.query("SELECT * FROM posts WHERE category = 'business' ORDER BY created_at DESC LIMIT 1");
    const businessPost = resultBusiness.rows[0] || null;
    res.render("index.ejs", {
    posts,
    featuredPost,
    culturePost, 
    businessPost, 
    longPosts
  });
  } catch (err) {
    console.log(err);
  }
});

  // Route to fetch weather data
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

// Route to display the edit form
app.get("/edit-post/:postID", async (req, res) => {
  const postID = req.params.postID;
  try {
    const result = await db.query("SELECT * FROM posts WHERE id = $1", [postID]);

    // Check if the post was found
    if (result.rows.length > 0) {
      const post = result.rows[0]; // Access the first (and only) post

      res.render("edit-post.ejs", { post });
    } else {
      res.status(404).send("Post not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// Route to handle form submission for updating a post
app.post("/edit-post/:postID", async (req, res) => {
  const postID = req.params.postID;
  const { title, content, type, category } = req.body;

  try {
    // Update the post in the database
    await db.query(
      "UPDATE posts SET title = $1, content = $2, type = $3, category = $4 WHERE id = $5",
      [title, content, type, category, postID]
    );

    // Redirect to the home page after saving changes
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});




app.get("/read-more/:postID", async (req, res) => {
  const postID = req.params.postID; // Get the post ID from the URL
  try {
    const result = await db.query("SELECT * FROM posts WHERE id = $1", [postID]);
    const post = result.rows[0]; // Get the specific post

    if (post) {
      res.render("read-more.ejs", { post });
    } else {
      res.status(404).send("Post not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
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

// Route to handle the deletion of a post
app.get("/delete/:postID", async (req, res) => {
  const postID = req.params.postID; // Get the post ID from the URL
  try {
    await db.query("DELETE FROM posts WHERE id = $1", [postID]);
    res.redirect("/");

  } catch (err) {
    console.log(err);
  }
});

app.use(express.static('public'));


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
