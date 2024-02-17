const { Sequelize, DataTypes } = require("sequelize");
const express = require("express");
const app = express();
const port = 3000;

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "storage/database.sqlite",
});

const POKEMONS = sequelize.define("pokemon", {
  name: DataTypes.STRING,
  level: DataTypes.INTEGER,
  element: DataTypes.STRING,
  hp: DataTypes.INTEGER,
  cp: DataTypes.INTEGER,
  lastEvol: DataTypes.STRING,
  nextEvol: DataTypes.STRING,
});

app.use(express.json());
sequelize.sync();

app.get("/pokemons", async (res) => {
  const pokemons = await POKEMONS.findAll();
  res.json(pokemons);
});

app.get("/pokemons/:id", async (req, res) => {
  const pokemon = await POKEMONS.findByPk(req.params.id);
  if (!pokemon) {
    res.status(404).json("Pokemon not found");
  }
  res.json(pokemon);
});

app.post("/pokemons", async (req, res) => {
  try {
    const pokemon = await POKEMONS.create(req.body);
    res.json(pokemon);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.put("/pokemons/:id", async (req, res) => {
  try {
    const pokemon = await POKEMONS.findByPk(req.params.id);
    if (!pokemon) {
      res.status(404).json("Pokemon not found");
    }
    await pokemon.update(req.body);
    res.json(pokemon);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.delete("/pokemons/:id", async (req, res) => {
  try {
    const pokemon = await POKEMONS.findByPk(req.params.id);
    if (!pokemon) {
      res.status(404).json("Pokemon not found");
    }
    await pokemon.destroy();
    res.json("Pokemon deleted");
  } catch (e) {
    res.status(400).json(e);
  }
});

app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}`);
});
