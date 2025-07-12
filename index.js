// --- LE CERVEAU DE NOTRE APPLICATION WIFI (MIS À JOUR) ---

// 1. On importe nos boîtes à outils
const express = require('express');
const cors = require('cors'); // <-- ON AJOUTE L'OUTIL CORS
const app = express();
const PORT = 3000;

// --- Middlewares ---
// On active CORS pour autoriser les requêtes venant d'autres origines (comme Replit)
app.use(cors()); // <-- ON DIT À NOTRE SERVEUR D'ACCEPTER LES VISITEURS

// On active la lecture du JSON
app.use(express.json());

// --- NOTRE FAUSSE BASE DE DONNÉES ---
let wifiCodes = {
    "JOUR-A4B7": { duration: "1 Jour", used: false },
    "JOUR-C8D1": { duration: "1 Jour", used: false },
    "SEMAINE-E5F2": { duration: "1 Semaine", used: false },
    "SEMAINE-G9H6": { duration: "1 Semaine", used: false },
    "MOIS-K3L4": { duration: "1 Mois", used: false }
};

// --- LA ROUTE API ---
app.post('/api/validate-code', (req, res) => {
    const { code } = req.body;
    const upperCaseCode = code ? code.toUpperCase() : '';

    console.log(`Tentative de validation pour le code : ${upperCaseCode}`);

    if (wifiCodes[upperCaseCode]) {
        if (!wifiCodes[upperCaseCode].used) {
            wifiCodes[upperCaseCode].used = true;
            console.log(`SUCCÈS : Le code ${upperCaseCode} est valide et a été activé.`);
            res.json({ 
                success: true, 
                message: `Code valide. Accès autorisé pour ${wifiCodes[upperCaseCode].duration}.` 
            });
        } else {
            console.log(`ÉCHEC : Le code ${upperCaseCode} a déjà été utilisé.`);
            res.status(400).json({ 
                success: false, 
                message: 'Ce code a déjà été utilisé.' 
            });
        }
    } else {
        console.log(`ÉCHEC : Le code ${upperCaseCode} est invalide.`);
        res.status(400).json({ 
            success: false, 
            message: 'Code invalide ou inexistant.' 
        });
    }
});

// On démarre le serveur
app.listen(PORT, () => {
  console.log(`Serveur "Cerveau WIFI" démarré et à l'écoute sur le port ${PORT}`);
});