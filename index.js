// --- LE CERVEAU DE NOTRE APPLICATION WIFI (MIS À JOUR V2) ---

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- NOTRE FAUSSE BASE DE DONNÉES ---
let wifiCodes = {
    "JOUR-A4B7": { duration: "1 Jour", used: false },
    "SEMAINE-E5F2": { duration: "1 Semaine", used: false },
};

// --- FONCTION POUR CRÉER UN CODE UNIQUE ---
function generateUniqueCode(prefix) {
    let newCode;
    let isUnique = false;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    // On boucle tant qu'on n'a pas trouvé un code qui n'existe pas déjà
    while (!isUnique) {
        let randomPart = '';
        for (let i = 0; i < 4; i++) {
            randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        newCode = `${prefix}-${randomPart}`;
        if (!wifiCodes[newCode]) {
            isUnique = true;
        }
    }
    return newCode;
}

// --- ANCIENNE ROUTE POUR VALIDER UN CODE ---
app.post('/api/validate-code', (req, res) => {
    // (Le code de validation reste le même, pas de changement ici)
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
            res.status(400).json({ success: false, message: 'Ce code a déjà été utilisé.' });
        }
    } else {
        console.log(`ÉCHEC : Le code ${upperCaseCode} est invalide.`);
        res.status(400).json({ success: false, message: 'Code invalide ou inexistant.' });
    }
});


// --- NOUVELLE ROUTE POUR GÉNÉRER UN CODE ---
app.post('/api/generate-code', (req, res) => {
    const { plan } = req.body; // On reçoit le plan choisi (ex: "jour", "semaine")
    let newCode;
    let duration;

    switch (plan) {
        case 'jour':
            newCode = generateUniqueCode('JOUR');
            duration = '1 Jour';
            break;
        case 'semaine':
            newCode = generateUniqueCode('SEMAINE');
            duration = '1 Semaine';
            break;
        case 'mois':
            newCode = generateUniqueCode('MOIS');
            duration = '1 Mois';
            break;
        default:
            return res.status(400).json({ success: false, message: 'Plan non valide.' });
    }

    // On ajoute le nouveau code à notre base de données
    wifiCodes[newCode] = { duration: duration, used: false };

    console.log(`NOUVEAU CODE CRÉÉ : ${newCode} pour une durée de ${duration}`);

    // On renvoie le code créé au frontend
    res.json({
        success: true,
        code: newCode,
        duration: duration,
        message: `Paiement simulé réussi !`
    });
});


// On démarre le serveur
app.listen(PORT, () => {
  console.log(`Serveur "Cerveau WIFI" démarré et à l'écoute sur le port ${PORT}`);
});