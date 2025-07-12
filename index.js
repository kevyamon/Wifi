const express = require('express');
const app = express();

app.use(express.json());

// Simuler une base de données (à remplacer par une vraie BD plus tard)
const users = { "testuser": "testpass" }; // Nom d'utilisateur : mot de passe
const codes = { "1234": true, "5678": true }; // Codes valides

app.post('/api/connect', (req, res) => {
  const { username, password, code } = req.body;
  if (username && password) {
    if (users[username] === password) {
      res.json({ message: `Bienvenue ${username} ! Connecté avec succès.` });
    } else {
      res.status(401).json({ message: "Identifiants incorrects !" });
    }
  } else if (code) {
    if (codes[code]) {
      res.json({ message: `Code ${code} accepté ! Connecté avec succès.` });
    } else {
      res.status(401).json({ message: "Code invalide !" });
    }
  } else {
    res.status(400).json({ message: "Données manquantes !" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});