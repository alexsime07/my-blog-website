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
const posts = [
  {
    title: "Business Model",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis commodo ligula a dolor varius congue. Duis vulputate rhoncus facilisis. Vestibulum blandit blandit mauris, vel ultricies enim accumsan et. Etiam neque dolor, vestibulum euismod arcu nec, viverra euismod sem. Donec finibus elementum nisi et ultrices. Vivamus finibus blandit urna vitae venenatis. Curabitur consequat cursus orci. Donec venenatis ante vulputate mauris semper, id ultrices felis semper. Aenean massa nisi, maximus ut leo in, iaculis malesuada nisl. Proin ut convallis lectus.",
  },
  {
    title: "Culture Wars",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis commodo ligula a dolor varius congue. Duis vulputate rhoncus facilisis. Vestibulum blandit blandit mauris, vel ultricies enim accumsan et. Etiam neque dolor, vestibulum euismod arcu nec, viverra euismod sem. Donec finibus elementum nisi et ultrices. Vivamus finibus blandit urna vitae venenatis. Curabitur consequat cursus orci. Donec venenatis ante vulputate mauris semper, id ultrices felis semper. Aenean massa nisi, maximus ut leo in, iaculis malesuada nisl. Proin ut convallis lectus.",
  },
  {
    title: "Summer Travel Guide",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis commodo ligula a dolor varius congue. Duis vulputate rhoncus facilisis. Vestibulum blandit blandit mauris, vel ultricies enim accumsan et. Etiam neque dolor, vestibulum euismod arcu nec, viverra euismod sem. Donec finibus elementum nisi et ultrices. Vivamus finibus blandit urna vitae venenatis. Curabitur consequat cursus orci. Donec venenatis ante vulputate mauris semper, id ultrices felis semper. Aenean massa nisi, maximus ut leo in, iaculis malesuada nisl. Proin ut convallis lectus.",
  },
];

const businessPosts = [
  {
    title: "Business Model",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis commodo ligula a dolor varius congue. Duis vulputate rhoncus facilisis. Vestibulum blandit blandit mauris, vel ultricies enim accumsan et. Etiam neque dolor, vestibulum euismod arcu nec, viverra euismod sem. Donec finibus elementum nisi et ultrices. Vivamus finibus blandit urna vitae venenatis. Curabitur consequat cursus orci. Donec venenatis ante vulputate mauris semper, id ultrices felis semper. Aenean massa nisi, maximus ut leo in, iaculis malesuada nisl. Proin ut convallis lectus.",
    fullDate: "09 July, 2024"  
  },
];
const culturePosts = [
  {
    title: "Culture Wars",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis commodo ligula a dolor varius congue. Duis vulputate rhoncus facilisis. Vestibulum blandit blandit mauris, vel ultricies enim accumsan et. Etiam neque dolor, vestibulum euismod arcu nec, viverra euismod sem. Donec finibus elementum nisi et ultrices. Vivamus finibus blandit urna vitae venenatis. Curabitur consequat cursus orci. Donec venenatis ante vulputate mauris semper, id ultrices felis semper. Aenean massa nisi, maximus ut leo in, iaculis malesuada nisl. Proin ut convallis lectus.",
      fullDate: "08 October, 2023"  

  },
];
const travelPosts = [
  {
    title: "Summer Travel Guide",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis commodo ligula a dolor varius congue. Duis vulputate rhoncus facilisis. Vestibulum blandit blandit mauris, vel ultricies enim accumsan et. Etiam neque dolor, vestibulum euismod arcu nec, viverra euismod sem. Donec finibus elementum nisi et ultrices. Vivamus finibus blandit urna vitae venenatis. Curabitur consequat cursus orci. Donec venenatis ante vulputate mauris semper, id ultrices felis semper. Aenean massa nisi, maximus ut leo in, iaculis malesuada nisl. Proin ut convallis lectus.",
      fullDate: "17 July, 2024"  

  },
];
const featuredPosts = [
  {
    title: "Business Model",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis commodo ligula a dolor varius congue. Duis vulputate rhoncus facilisis. Vestibulum blandit blandit mauris, vel ultricies enim accumsan et. Etiam neque dolor, vestibulum euismod arcu nec, viverra euismod sem. Donec finibus elementum nisi et ultrices. Vivamus finibus blandit urna vitae venenatis. Curabitur consequat cursus orci. Donec venenatis ante vulputate mauris semper, id ultrices felis semper. Aenean massa nisi, maximus ut leo in, iaculis malesuada nisl. Proin ut convallis lectus.",
  },
];
const longPosts = [
  {
    title: "Business Model",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis commodo ligula a dolor varius congue. Duis vulputate rhoncus facilisis. Vestibulum blandit blandit mauris, vel ultricies enim accumsan et. Etiam neque dolor, vestibulum euismod arcu nec, viverra euismod sem. Donec finibus elementum nisi et ultrices. Vivamus finibus blandit urna vitae venenatis. Curabitur consequat cursus orci. Donec venenatis ante vulputate mauris semper, id ultrices felis semper. Aenean massa nisi, maximus ut leo in, iaculis malesuada nisl. Proin ut convallis lectus.",
    fullDate: "17 July, 2024"
  },
];

// Route to render the home page
app.get("/", async (req, res) => {
  await db.query("")
  res.render("index.ejs", {
    posts,
    featuredPosts,
    longPosts,
    businessPosts,
    culturePosts,
  });
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
  res.render("create-post.ejs", { posts });
});

// Route to handle the form submission
app.post("/create-post", (req, res) => {
  const date = new Date();
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const fullDate = new Intl.DateTimeFormat('en-US', options).format(date);
  const { title, content, type, category } = req.body;
  const newPost = { title, content, fullDate };
  posts.push(newPost);

  switch (category) {
    case "business":
      businessPosts.push(newPost);
      break;
    case "culture":
      culturePosts.push(newPost);
      break;
    case "travel":
      travelPosts.push(newPost);
    default:
      console.log("No category selected.");
  }

  switch (type) {
    case "featured":
      featuredPosts.push(newPost);
      break;
    case "longpost":
      longPosts.push(newPost);
      break;
    default:
      console.log("No type selected.");
  }

  res.redirect("/");
});

// Route to render the edit form for a specific post
app.get("/edit-post/:index", (req, res) => {
  const index = req.params.index;
  console.log(req.params);
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

app.get("/business", (req, res) => {
  res.render("business.ejs", { businessPosts });
});

app.get("/culture", (req, res) => {
  res.render("culture.ejs", { culturePosts });
});

app.get("/travel", (req, res) => {
  res.render("travel.ejs", { travelPosts });
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
