const { Sequelize, DataTypes } = require("sequelize");
const express = require("express");
const app = express();
const port = 3000;

// Initialize Sequelize with SQLite as the dialect and specify the database storage path
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "storage/database.sqlite",
});

// Define the model for Pokemons with various attributes
const POKEMONS = sequelize.define("pokemon", {
  name: DataTypes.STRING,
  level: DataTypes.INTEGER,
  element: DataTypes.STRING,
  hp: DataTypes.INTEGER,
  cp: DataTypes.INTEGER,
  lastEvol: DataTypes.STRING,
  nextEvol: DataTypes.STRING,
});

// Middleware to parse JSON requests
app.use(express.json());

// Synchronize the defined models with the database
sequelize.sync();

// GET endpoint to fetch all pokemons
app.get("/pokemons", async (req, res) => {
  try {
    const pokemons = await POKEMONS.findAll();
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET endpoint to fetch a specific pokemon by its ID
app.get("/pokemons/:id", async (req, res) => {
  try {
    const pokemon = await POKEMONS.findByPk(req.params.id);
    if (!pokemon) {
      res.status(404).json({ error: "Pokemon not found" });
      return;
    }
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST endpoint to create a new pokemon
app.post("/pokemons", async (req, res) => {
  try {
    const pokemon = await POKEMONS.create(req.body);
    res.status(201).json(pokemon);
  } catch (error) {
    res.status(400).json({ error: "Invalid request body" });
  }
});

// PUT endpoint to update an existing pokemon by its ID
app.put("/pokemons/:id", async (req, res) => {
  try {
    const pokemon = await POKEMONS.findByPk(req.params.id);
    if (!pokemon) {
      res.status(404).json({ error: "Pokemon not found" });
      return;
    }
    await pokemon.update(req.body);
    res.json(pokemon);
  } catch (error) {
    res.status(400).json({ error: "Invalid request body" });
  }
});

// DELETE endpoint to delete a pokemon by its ID
app.delete("/pokemons/:id", async (req, res) => {
  try {
    const pokemon = await POKEMONS.findByPk(req.params.id);
    if (!pokemon) {
      res.status(404).json({ error: "Pokemon not found" });
      return;
    }
    await pokemon.destroy();
    res.json({ message: "Pokemon deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
