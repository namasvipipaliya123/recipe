const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 8090;

let Recipe = [
  {
    name: 'Spaghetti Carbonara',
    description: 'A classic Italian pasta dish.',
    preparationTime: '15 minutes',
    cookingTime: '15',
    imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/carbonara-index-6476367f40c39.jpg?crop=0.888888888888889xw:1xh;center,top&resize=1200:*',
    country: 'India',
    veg: true,
    id: 1
  }
];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.send('Welcome to the Recipe API.');
});

app.get('/recipe/all', (req, res) => {
  res.json(Recipe);
});


app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'recipe.html'));
});


app.post('/recipe/add', (req, res) => {
  const { name, description, preparationTime, cookingTime, imageUrl, country, veg } = req.body;
  if (!name || !description || !preparationTime || !cookingTime || !imageUrl || !country || veg === undefined) {
    return res.status(400).json({ message: 'All fields are required', recipes: Recipe });
  }
  const newRecipe = {
    name,
    description,
    preparationTime,
    cookingTime,
    imageUrl,
    country,
    veg: veg === 'true',
  };
  Recipe.push(newRecipe);
  res.json(Recipe);
});

app.patch('/recipe/update/:id', (req, res) => {
  const { id } = req.params;
  const index = Recipe.findIndex(r => r.id == id);
  if (index === -1) return res.status(404).json({ message: 'Recipe not found' });
  const updatedRecipe = { ...Recipe[index], ...req.body };
  Recipe[index] = updatedRecipe;
  res.json(Recipe);
});


app.delete('/recipe/delete/:id', (req, res) => {
  const { id } = req.params;
  Recipe = Recipe.filter(r => r.id != id);
  res.json(Recipe);
});


app.get('/recipe/filter', (req, res) => {
  let { veg, sort, country } = req.query;
  let filteredRecipes = [...Recipe];
  
  if (veg) {
    filteredRecipes = filteredRecipes.filter(r => r.veg === (veg === 'true'));
  }
  
  if (country) {
    filteredRecipes = filteredRecipes.filter(r => r.country.toLowerCase() === country.toLowerCase());
  }
  
  if (sort === 'lth') {
    filteredRecipes.sort((a, b) => a.preparationTime.localeCompare(b.preparationTime));
  } else if (sort === 'htl') {
    filteredRecipes.sort((a, b) => b.preparationTime.localeCompare(a.preparationTime));
  }
  
  res.json(filteredRecipes);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}.`);
});
