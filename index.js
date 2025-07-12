// --- LE CERVEAU DE NOTRE APPLICATION WIFI ---
// Ce fichier est le serveur backend. Son seul rôle est de répondre à la question :
// "Est-ce que ce code est valide ?"

// 1. On importe notre boîte à outils "Express"
const express = require('express');
const app = express();
const PORT = 3000; // Le "port" sur lequel notre serveur va écouter

// Middleware pour permettre à notre serveur de comprendre le JSON
// C'est essentiel pour que le frontend et le backend puissent communiquer
app.use(express.json());

// --- NOTRE FAUSSE BASE DE DONNÉES ---
// Pour l'instant, les codes sont stockés ici.
// IMPORTANT : Ces données se réinitialiseront à chaque redémarrage du serveur.
// C'est parfait pour le développement, mais on le changera plus tard pour le déploiement.

let wifiCodes = {
    // La "clé" est le code lui-même, et la "valeur" est un objet avec ses détails
    "JOUR-A4B7": { duration: "1 Jour", used: false },
    "JOUR-C8D1": { duration: "1 Jour", used: false },
    "SEMAINE-E5F2": { duration: "1 Semaine", used: false },
    "SEMAINE-G9H6": { duration: "1 Semaine", used: false },
    "MOIS-K3L4": { duration: "1 Mois", used: false }
};

// --- LA ROUTE API ---
// C'est l'URL que notre frontend va appeler pour vérifier un code.
// Le chemin est "/api/validate-code"
app.post('/api/validate-code', (req, res) => {
    // On récupère le code envoyé par l'utilisateur depuis le corps (body) de la requête
    const { code } = req.body;

    // On met le code en majuscules pour éviter les erreurs de casse (jour-a4b7 vs JOUR-A4B7)
    const upperCaseCode = code ? code.toUpperCase() : '';

    console.log(`Tentative de validation pour le code : ${upperCaseCode}`);

    // Cas 1 : Le code existe dans notre "base de données"
    if (wifiCodes[upperCaseCode]) {
        // Cas 1a : Le code n'a pas encore été utilisé
        if (!wifiCodes[upperCaseCode].used) {
            // On marque le code comme utilisé
            wifiCodes[upperCaseCode].used = true;
            
            console.log(`SUCCÈS : Le code ${upperCaseCode} est valide et a été activé.`);
            
            // On renvoie une réponse de succès
            res.json({ 
                success: true, 
                message: `Code valide. Accès autorisé pour ${wifiCodes[upperCaseCode].duration}.` 
            });
        } 
        // Cas 1b : Le code a déjà été utilisé
        else {
            console.log(`ÉCHEC : Le code ${upperCaseCode} a déjà été utilisé.`);
            // On renvoie une réponse d'erreur
            res.status(400).json({ 
                success: false, 
                message: 'Ce code a déjà été utilisé.' 
            });
        }
    } 
    // Cas 2 : Le code n'existe pas
    else {
        console.log(`ÉCHEC : Le code ${upperCaseCode} est invalide.`);
        // On renvoie une réponse d'erreur
        res.status(400).json({ 
            success: false, 
            message: 'Code invalide ou inexistant.' 
        });
    }
});

// 4. On démarre le serveur et on lui dit d'écouter les requêtes sur le port 3000
app.listen(PORT, () => {
  console.log(`Serveur "Cerveau WIFI" démarré et à l'écoute sur le port ${PORT}`);
});
