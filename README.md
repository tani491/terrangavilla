# Teranga Park Villas — Landing Page

Landing page haut de gamme pour la résidence **Teranga Park Villas**
(Nguerigne Peulh, Petite Côte — Sénégal) : 13 sections, design noir & or,
formulaire de qualification, modale « Recevoir le dossier » (PDF),
boutons WhatsApp, tracking UTM + Meta Pixel + GA4, contenu pilotable
depuis Supabase.

**Stack** : Next.js 16 (App Router, Turbopack) · React 19 · TypeScript ·
Tailwind CSS 4 · Radix UI · Prisma + SQLite (fallback local) · Supabase
(PostgreSQL + Storage) · zod

---

## 1. Démarrage local

**Prérequis** : [Node.js 18+](https://nodejs.org) (LTS conseillée) — npm est inclus.

> **📦 Important après décompression** : `package.json` est **à la racine de
> l'archive**. Après extraction, vous devez voir `package.json`, `src/`,
> `public/` directement dans le dossier. Si vous les voyez, vous êtes au bon
> endroit. Les commandes npm doivent **toujours** être lancées depuis ce
> dossier (celui qui contient `package.json`).

```bash
npm install     # installe les dépendances + génère le client Prisma automatiquement
npm run dev     # démarre le serveur de développement
```

→ Ouvrez **http://localhost:3000**

> **Windows** : le plus simple est l'installeur automatique — ouvrez PowerShell
> dans le dossier du projet puis :
> ```powershell
> powershell -ExecutionPolicy Bypass -File .\setup.ps1
> ```
> ⚠️ Évitez les chemins contenant des **espaces ou des parenthèses**
> (ex. `teranga-park-villas-source (1)`) — préférez `C:\dev\teranga-park-villas`.
> Après extraction de l'archive, faites :
> ```powershell
> Set-Location C:\dev\teranga-park-villas    # dossier contenant package.json
> Get-ChildItem                               # vous devez voir package.json
> ```

Aucune configuration n'est nécessaire : le site démarre immédiatement avec
les valeurs par défaut (images, prix, WhatsApp) et la base SQLite
`prisma/custom.db` est **déjà incluse** dans le projet.

> Si vous récupérez le code depuis git sans le fichier de base :
> exécutez une fois `npx prisma db push`

---

## 2. Configuration (.env)

Copiez `.env.example` vers `.env` si besoin (déjà fait dans l'archive).

| Variable | Rôle | Obligatoire ? |
|---|---|---|
| `DATABASE_URL` | Base SQLite locale (`file:./custom.db`) | Oui (fallback leads) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL de votre projet Supabase | Non (optionnel) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme Supabase (lecture/insertion via RLS) | Non (optionnel) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel (tracking publicitaire) | Non |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 (`G-XXXXXXXXXX`) | Non |

**Sans Supabase** : le site fonctionne à 100 % — contenus par défaut du code,
leads enregistrés dans SQLite (Prisma).
**Avec Supabase** : contenus lus dans `site_settings`, leads écrits dans
Supabase (SQLite reste le filet de sécurité si Supabase est indisponible).

> Les clés Supabase se mettent idéalement dans `.env.local`
> (prioritaire sur `.env`, ignoré par git).

---

## 3. Tester les leads

1. Simulez une campagne avec des paramètres UTM :
   ```
   http://localhost:3000/?utm_source=instagram&utm_medium=bio&utm_campaign=teranga
   ```
2. Cliquez sur un bouton **« Recevoir le dossier »** (navbar, hero, prix,
   diaspora, visite vidéo, CTA final) et remplissez la modale
   (Nom complet / Téléphone WhatsApp / Pays).
3. Le lead est enregistré avec `requested_document = true`,
   `source = instagram` et les UTM complets.
4. Visualisez les leads :
   ```bash
   npx prisma studio   # → http://localhost:5555 (table Lead)
   ```

Le champ `source` est dérivé de `utm_source`
(instagram / tiktok / facebook / whatsapp / direct par défaut).

---

## 4. Connecter Supabase (pas-à-pas)

### 4.1 Créer le projet
1. Connectez-vous sur [supabase.com](https://supabase.com) → **New project**.
2. Nom : `teranga-park-villas` · Mot de passe BDD : conservez-le.
3. Région : **Frankfurt (eu-central-1)** recommandée (la plus proche du Sénégal
   parmi les options Performantes).
4. Attendez la fin de l'initialisation (~2 min).

### 4.2 Créer les tables et buckets
1. Menu **SQL Editor** → **New query**.
2. Collez tout le contenu de [`supabase/migrations/0001_site_settings_leads.sql`](supabase/migrations/0001_site_settings_leads.sql)
   (également fourni à la racine de l'archive) → **Run**.
3. Le script crée en une fois :
   - table `site_settings` (contenus modifiables) — lecture publique, écriture réservée ;
   - table `leads` (prospects) — insertion publique, lecture réservée (RLS) ;
   - buckets Storage `teranga-images` et `teranga-documents`.

### 4.3 Récupérer les clés
**Settings → API** :
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4.4 Configurer le projet
En local : créez `.env.local` avec les deux variables, puis redémarrez `npm run dev`.

### 4.5 Alimenter les contenus
1. **Storage** → `teranga-images` → uploadez les photos (hero + galerie).
2. Cliquez sur chaque fichier → **Copy public URL**.
3. **Table Editor** → `site_settings` → nouvelle ligne, collez les URLs :

| Colonne | Exemple | Effet |
|---|---|---|
| `hero_image_url` | URL publique image hero | Grande image d'accueil |
| `hero_title` / `hero_subtitle` | Textes | Titre et sous-titre du hero |
| `gallery_image_1` … `gallery_image_6` | URLs publiques | Galerie (les vides sont ignorées) |
| `pdf_url` | URL du PDF dans `teranga-documents` | Active le téléchargement du dossier |
| `whatsapp_number` | `221736155944` | Numéro WhatsApp (chiffres uniquement) |
| `price` | `157 200 000 FCFA` | Prix affiché |
| `availability_text` | Texte | Mention de disponibilité |

4. Uploadez le dossier PDF dans `teranga-documents` → copiez son URL publique
   → collez-la dans `pdf_url`. La modale passe alors de
   « dossier momentanément indisponible » au **téléchargement direct**.

**Vérification** : modifiez une valeur dans `site_settings` → le site la
reflète en **~60 secondes** (cache ISR). Un lead de test apparaît dans
Table Editor → `leads`.

---

## 5. Production locale

```bash
npm run build    # compile + copie les assets dans le build standalone (multiplateforme)
npm start        # sert le build → http://localhost:3000
```

Autre port : `PORT=3001 npm start`

---

## 6. Déploiement Vercel

1. Poussez le code sur GitHub/GitLab.
2. [vercel.com](https://vercel.com) → **Add New → Project** → importez le dépôt
   (le build Next.js est détecté automatiquement, aucune option à changer).
3. **Environment Variables** → ajoutez :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_META_PIXEL_ID` et/ou `NEXT_PUBLIC_GA4_ID` si utilisés
4. **Deploy**. Les mises à jour de contenu se font ensuite depuis Supabase
   (`site_settings`), sans redéploiement.

---

## 7. Tracking (Meta Pixel & GA4)

Événements émis par les deux plateformes : `PageView`, `ViewContent`,
`Lead` (formulaire ou modale envoyée), `Contact` (clic WhatsApp/téléphone),
`Schedule` (demande de visite vidéo).

Les UTM (`utm_source`, `utm_medium`, `utm_campaign`) sont capturés à
l'arrivée et persistés **30 jours** en localStorage, puis joints à chaque
lead. Lien type campagne :
```
https://votre-domaine.com/?utm_source=instagram&utm_medium=bio&utm_campaign=teranga
```

---

## 8. Structure du projet

```
├── src/
│   ├── app/                    # App Router (page, layout, API /api/leads)
│   ├── components/teranga/     # Sections de la landing (Hero, Pricing, FAQ…)
│   ├── components/ui/          # Composants Radix/shadcn de base
│   └── lib/
│       ├── config.ts           # Constantes + helpers WhatsApp + modale dossier
│       ├── site-settings.ts    # Lecture Supabase + valeurs par défaut (fallback)
│       ├── supabase.ts         # Client Supabase (créé si variables présentes)
│       ├── tracking.ts         # UTM + Meta Pixel + GA4
│       └── db.ts               # Client Prisma (fallback SQLite)
├── prisma/
│   ├── schema.prisma           # Modèle Lead (SQLite local)
│   └── custom.db               # Base locale prête à l'emploi
├── supabase/migrations/        # SQL à exécuter dans le SQL Editor Supabase
├── scripts/copy-standalone.mjs # Copie des assets après build (Windows/macOS/Linux)
└── public/images/              # Images par défaut du site
```

---

## 9. Dépannage

### 9.1 Windows — les 3 erreurs classiques

**Erreur 1 — `ENOENT … Could not read package.json`**
Vous n'êtes pas dans le bon dossier (npm ne trouve pas `package.json`).
```powershell
# Vérifiez où vous êtes et ce qu'il y a autour :
Get-Location
Get-ChildItem
# → Si vous ne voyez PAS package.json, naviguez vers le dossier qui le contient :
Set-Location C:\dev\teranga-park-villas
# Puis relancez :
npm install
```

**Erreur 2 — `ENOTEMPTY` / dossiers verrouillés pendant l'installation**
Un programme (VS Code, antivirus, explorateur) verrouille `node_modules`.
1. Fermez **VS Code** et tous les terminaux ouverts sur le projet.
2. Dans un **nouveau** PowerShell : `cmd /c "rmdir /s /q node_modules"`
3. Relancez `npm install` (ou mieux : `npm ci`).

**Erreur 3 — `confbox` / `pkg-types` / `ERR_MODULE_NOT_FOUND` pendant `prisma generate`**
L'arborescence `node_modules` est corrompue (installation interrompue ou
chemin avec espaces/parenthèses). Nettoyage complet :
```powershell
cmd /c "rmdir /s /q node_modules"
npm cache clean --force
npm ci          # réinstalle TOUT proprement depuis package-lock.json
npm run dev
```
> `npm ci` supprime automatiquement `node_modules` avant d'installer :
> c'est la méthode la plus fiable en cas de doute.
> Si `prisma generate` échoue encore après un `npm ci` propre, lancez-le
> manuellement une fois : `npx --no-install prisma generate`.

**Règle d'or** : dossier du projet **sans espaces ni parenthèses**,
chemin **court** (ex. `C:\dev\teranga-park-villas`), VS Code **fermé**
pendant l'installation.

### 9.2 Autres problèmes

| Problème | Solution |
|---|---|
| Port 3000 déjà utilisé | `npm run dev -- -p 3001` |
| Réinitialiser la base locale | Supprimez `prisma/custom.db` puis `npx prisma db push` |
| « Prisma Client did not initialize » | `npx prisma generate` |
| Les modifications Supabase n'apparaissent pas | Attendez ~60 s (cache ISR) ou redémarrez `npm run dev` |
| La modale dit « dossier indisponible » | `pdf_url` est vide dans `site_settings` (ou Storage non public) |
| Le site ignore Supabase | Vérifiez `.env.local` (URL + anon key) et redémarrez le serveur |
| `npx` propose d'installer `prisma@8…` | Répondez **n** — utilisez toujours la version locale : `npx --no-install prisma generate` |
#   t e r r a n g a v i l l a  
 