# 🎾 PadelClub - L'E-Commerce Intelligente per il Padel

Piattaforma e-commerce B2C all'avanguardia dedicata al mondo del Padel. Integra un ecosistema avanzato di Intelligenza Artificiale basato su Google Gemini, unendo shopping, community e personalizzazione estrema.

## 🎯 Caratteristiche Principali (Core Features)

- **Ricerca Multimodale AI**: Sistema di ricerca che accetta testo, comandi vocali (Speech-to-Text) e immagini (Computer Vision) per trovare l'equipaggiamento perfetto.
- **PadelBot (Personal Shopper)**: Un assistente AI conversazionale che analizza le risposte degli utenti e genera raccomandazioni di prodotto mirate con "reasoning" (spiegazione logica dell'IA).
- **Player Card (Community)**: Un profilo pubblico condivisibile per ogni utente, che mostra livello di abilità, stile di gioco e la propria "Armeria" (attrezzatura posseduta). I prodotti cliccati sulla card portano direttamente all'acquisto.
- **Area VIP & Marketing 1-to-1**: Un Paywall che sblocca bundle generati dinamicamente dall'IA e sconti personalizzati in base al comportamento e alle preferenze dell'utente.
- **Mockup Dinamici SVG**: Generazione lato server di immagini vettoriali per i prodotti, ottimizzate e senza dipendenze da link esterni (Hotlinking prevention).

## 📋 Prerequisiti

- **Node.js** v18+ e npm
- **MongoDB Cloud** (Atlas) - account + connection string
- **Google Gemini API Key** - da [https://ai.google.dev/](https://ai.google.dev/)

## ⚙️ Setup Iniziale

### 1. Clona e Prepara il Progetto

```bash
git clone <tuo-repository-url>
cd padelclub
```

### 2. Configura le Variabili di Ambiente (.env)

Crea un file `.env` nella root del progetto. Assicurati che questo file sia inserito in `.gitignore` per motivi di sicurezza!

```env
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/padelclub?retryWrites=true&w=majority

# JWT Secret (Fondamentale per i Token VIP)
JWT_SECRET=inserisci_una_chiave_segreta_molto_lunga

# Google Gemini API
GEMINI_API_KEY=inserisci_la_tua_chiave_gemini_qui

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

### 3. Installa le Dipendenze

Il progetto utilizza una struttura a monorepo semplificata. Installa le dipendenze sia per il server che per il client:

```bash
npm run install-all
```

### 4. Popola il Database (Seeding)

Genera il catalogo prodotti iniziale (inclusi i mockup SVG dinamici) lanciando lo script di semina:

```bash
node seed.js
```

_Se eseguito correttamente, vedrai il messaggio: `✓ Database seeded con mockup e EMOJI funzionanti!`_

## 🚀 Avvio dell'Applicazione

### Opzione 1: Esecuzione Simultanea (Consigliato)

```bash
npm run dev
```

Questo lancia sia il server backend (porta 5000) che il client frontend (porta 3000 o 5173 con Vite) in parallelo.

### Opzione 2: Esecuzione Separata

**Terminal 1 - Backend:**

```bash
npm run server
```

**Terminal 2 - Frontend:**

```bash
npm run client
```

## 🧪 Panoramica delle Funzionalità per il Testing

### 1. Ricerca Multimodale

1. Naviga nella pagina **Catalogo**.
2. Usa la nuova barra di ricerca "Mobile-First".
3. **Vocale**: Clicca l'icona del microfono 🎤 e chiedi (es: "Voglio una racchetta di potenza per professionisti").
4. **Visiva**: Clicca la fotocamera 📷, carica un'immagine (es: una foto dal web) e chiedi a Gemini di trovare prodotti simili.

### 2. PadelBot & Dashboard

1. Effettua Login/Registrazione.
2. Vai nella tua **Dashboard** e rispondi al questionario di PadelBot.
3. Il sistema salverà il tuo Stile, Livello, Posizione (Destra/Sinistra) e le tue preferenze di Budget.

### 3. Area VIP (Sconti Generati dall'IA)

1. Diventa utente VIP tramite la Dashboard (aggiorna lo stato nel DB).
2. L'IA Gemini analizzerà il tuo profilo da giocatore e genererà bundle personalizzati (es: "Racchetta di Potenza + Palline") offrendo sconti intelligenti.

### 4. Player Card Pubblica

1. Naviga verso `http://localhost:3000/player/{username_utente}`.
2. Visualizza la Card. Cliccando sui prodotti nell'"Armeria", si aprirà direttamente il Product Modal per l'acquisto (Ottimizzazione UX per massimizzare le conversioni).

## 🛠️ Stack Tecnologico

- **Frontend**: React.js, Vite, Tailwind CSS, React Router DOM, React Hot Toast (UI Alerts).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB & Mongoose.
- **Intelligenza Artificiale**: Google Gemini Pro & Gemini Flash Image (Tramite SDK Ufficiale).
- **Autenticazione**: JSON Web Tokens (JWT).

## 📦 Note per la Messa in Produzione (Deploy)

Quando sei pronto per rilasciare il progetto online:

1. Esegui `npm run build` all'interno della cartella `client`. Questo genererà la cartella **`dist/`** contenente i file JS e CSS minificati e pronti per i server cloud.
2. Il frontend può essere ospitato su **Vercel** o **Netlify**.
3. Il backend può essere ospitato su **Render**, **Railway** o **Heroku**.
4. Assicurati di inserire le Variabili d'Ambiente (.env) nei settaggi delle piattaforme Cloud.
