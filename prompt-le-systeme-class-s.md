# PROMPT — "LE SYSTÈME" (Plateforme de gestion Class S)

> À copier dans Bolt / v0. Ce prompt remplace entièrement les versions précédentes ("Class S Finances") : nouvelle structure, nouveau nom, nouveaux modules. Traite ceci comme une refonte complète, pas comme un correctif.

---

## 0. VISION

Construis **"Le Système"**, la plateforme de gestion de Scott Nana (designer indépendant, marque "Class S", Ouagadougou), inspirée de l'univers de l'anime **Solo Leveling**. Dans cet univers, un Chasseur progresse du rang E jusqu'au rang S grâce à un Système qui lui attribue des quêtes, suit ses statistiques, et fait grandir son armée de pouvoir. Le Système que tu construis applique exactement cette mécanique au parcours entrepreneurial de Scott : chaque activité économique est un personnage qui monte en rang, chaque revenu est de l'XP vers l'objectif final, chaque jour impose une Quête Quotidienne non négociable.

**Objectif central affiché partout dans l'app : atteindre 100 000 $ de chiffre d'affaires cumulé d'ici le 11 janvier 2027**, et faire monter chaque activité jusqu'au **rang S — le rang Class S**, qui donne son nom à la marque elle-même. C'est la boucle narrative de toute l'interface : Class S n'est pas qu'un nom de marque, c'est le rang à atteindre.

La plateforme est composée de **5 modules** :
1. **Fenêtre de Statut** (module comptabilité/pilotage financier) — **pleinement fonctionnel**, c'est le cœur de cette version.
2. **Portail** (module facturation et paiements) — **en vitrine uniquement**, "Bientôt disponible".
3. **Armée des Ombres** (module CRM/prospection/gestion clientèle) — **en vitrine uniquement**, "Bientôt disponible".
4. **Donjon** (module commandes, projets, production, time tracking) — **en vitrine uniquement**, "Bientôt disponible".
5. **Grimoire** (module catalogue de services et rentabilité par prestation) — **en vitrine uniquement**, "Bientôt disponible".

Ces 5 modules s'inspirent d'une vision d'agence complète où rien n'est isolé : Prospect → Client → Opportunité → Commande → Projet → Production → Livraison → Facture → Paiement → Dépenses → Rentabilité → Historique client, toute cette chaîne remontant dans un socle de données unique. Ils partagent ce socle commun (voir section 3) pour que rien n'ait besoin d'être reconstruit quand les 4 modules vitrine seront activés plus tard.

**Interconnexion à terme (à illustrer dans les vitrines, pas à développer maintenant)** : un client remplit un lien de formulaire partagé par Scott → ça ouvre automatiquement un nouveau Donjon (commande/projet) sans ressaisie → une fois le Donjon livré, un Portail (facture) peut être généré depuis ce même dossier → une fois la facture payée, la transaction correspondante apparaît automatiquement dans Fenêtre de Statut → la fiche client dans Armée des Ombres se met à jour (total dépensé, dernière commande, rentabilité générée). C'est cette boucle complète qui justifie le nom "Le Système" : aucune donnée n'est ressaisie deux fois.

---

## 1. STACK TECHNIQUE

- Framework : **React** (Next.js si possible, sinon Vite + React).
- Style : **Tailwind CSS** avec tokens personnalisés (section 6).
- Composants : **shadcn/ui** entièrement restylisés selon le design system Class S — jamais l'apparence par défaut.
- Graphes : **Recharts** (LineChart, BarChart, RadialBarChart, AreaChart).
- **Authentification et stockage** : connexion **Google (OAuth)**, données synchronisées sur le cloud (Firebase Auth + Firestore, ou Supabase avec provider Google — utilise ce que l'environnement propose nativement). Aucune dépendance exclusive au localStorage.
- Typographie : **Jost** (Google Fonts), police principale de toute l'interface, y compris chiffres et graphes.
- Aucune donnée fictive codée en dur. Aucun Lorem Ipsum.

---

## 2. RÈGLE DE SYNCHRONISATION CLOUD — À RESPECTER STRICTEMENT DÈS LA CONCEPTION

Cette règle est non négociable et s'applique à **chaque** entité du socle de données (section 3), y compris les futures entités de Portail et Armée des Ombres quand elles seront activées :

- Toute mutation (création, modification, suppression) déclenche une écriture cloud **immédiate**, jamais différée.
- Chaque document cloud porte un champ `uid` (utilisateur Google connecté), et **toute lecture** filtre strictement sur ce `uid`.
- Un indicateur de synchronisation discret ("Synchronisé" / "Synchronisation..." / "Erreur — nouvelle tentative") est visible sur toutes les pages où une donnée peut être modifiée.
- En cas d'échec d'écriture (perte de connexion), les données sont mises en file d'attente locale et réessayées automatiquement — jamais perdues silencieusement.
- Tous les calculs agrégés (totaux, Profit First, prévisions, rangs) se recalculent **exclusivement** à partir des données confirmées côté cloud, jamais à partir d'un état local qui pourrait être désynchronisé.
- Test de validation à respecter : après toute création/modification, un rafraîchissement complet de la page (F5) doit afficher exactement les mêmes données, sans perte ni doublon.

---

## 3. SOCLE DE DONNÉES COMMUN (partagé entre les 3 modules, dès maintenant)

### 3.1 Client (nouvelle entité centrale, pivot de l'interconnexion future)

- `id`, `uid`, `nom`, `entreprise` (optionnel), `email` (optionnel), `téléphone` (optionnel), `activité_id` liée (optionnel — un client peut être associé à une ou plusieurs activités), `statut` (prospect / actif / dormant), `date de création`, `note` (optionnel).
- Ce module n'a pas d'interface de gestion complète dans cette version (celle-ci arrivera avec Armée des Ombres), mais l'entité doit exister dans le schéma de données dès maintenant, et un client doit pouvoir être créé rapidement **depuis le formulaire de transaction** (champ "Client lié", optionnel, avec possibilité de créer un nouveau client à la volée sans quitter le formulaire).

### 3.2 Activité économique

- `id`, `uid`, `nom` (texte libre, créé par l'utilisateur), `couleur`, `icône`, `date de création`, `statut` (active / en pause / archivée), `rang_actuel` (E / D / C / B / A / S — voir section 5.5).

### 3.3 Transaction (revenu ou dépense)

- `id`, `uid`, `date`, `montant_original`, `devise_origine` (USD ou XOF), `montant_usd` (converti et **stocké au moment de l'enregistrement**, jamais recalculé à l'affichage), `type` (revenu / dépense), `activité_id` (obligatoire — si aucune activité n'existe, forcer sa création avant de permettre la saisie), `client_id` (optionnel), `catégorie`, `note` (optionnel).

### 3.4 Charge récurrente (fusion abonnements + coûts récurrents)

- `id`, `uid`, `nom`, `nature` (abonnement logiciel / autre charge récurrente — loyer, salaire, cotisation, télécom, assurance, autre), `activité_id` liée (optionnel — peut être globale, ex : loyer du studio), `montant_original`, `devise_origine`, `montant_usd`, `fréquence` (mensuelle / trimestrielle / annuelle), `date de premier paiement`, `date de fin` (optionnel), `statut` (actif / en pause / terminé).

### 3.5 Note pour les futures entités de Portail, Armée des Ombres, Donjon et Grimoire

Ces entités n'ont pas besoin d'un schéma complet dans cette version (les modules restent en vitrine), mais garde ces principes en tête pour que les mockups des vitrines (section 6.6) restent cohérents avec l'architecture finale prévue :
- **Facture et Paiement sont deux entités séparées, jamais fusionnées** : une facture peut être réglée en plusieurs paiements distincts (ex : acompte, solde intermédiaire, solde final), chacun daté et tracé individuellement.
- **Commande → Projet** : une commande validée devient un projet avec ses propres étapes de production (brief → direction artistique → proposition → révisions → validation → livraison), un responsable, un temps estimé et un temps réellement passé.
- **Service (Grimoire)** : chaque prestation du catalogue porte un prix de base, une marge théorique, un compteur "nombre de fois vendu" et un CA généré, pour comparer objectivement la rentabilité des prestations entre elles.
- **Fiche client (Armée des Ombres)** : au-delà du strict nécessaire actuel (section 3.1), la version complète à venir inclura la source du lead, le canal de contact, la probabilité de conversion, le motif de perte éventuel, le coût d'acquisition et la valeur client estimée.

### 3.6 Tâche (Quête Quotidienne)

- `id`, `uid`, `titre`, `activité_id` liée (optionnel), `date`, `est_la_priorite` (booléen — une seule tâche par jour peut porter ce statut), `statut` (à faire / en cours / terminée), `note`.

Toute nouvelle transaction, charge récurrente ou tâche doit obligatoirement porter le `uid` de l'utilisateur connecté. Un formulaire ne peut jamais être soumis avec une activité manquante sur une transaction ou une charge, ni avec un montant invalide — validation bloquante avec message d'erreur clair dans le formulaire.

---

## 4. DEVISE — DOLLAR AMÉRICAIN PAR DÉFAUT

- Devise de référence dans toute l'application : **USD ($)**. Objectif 100k$, tous les totaux, graphes et prévisions sont exprimés en dollars.
- À la saisie, Scott choisit la devise du montant (USD ou XOF). Si XOF, conversion automatique en USD au moment de l'enregistrement, en utilisant un **taux de change manuel** défini dans les Réglages (pas d'API externe — le XOF est arrimé à l'euro et ne fluctue pas assez pour justifier cette complexité). Le taux est affiché avec sa date de dernière mise à jour, modifiable à tout moment par Scott.
- Le montant original et sa devise sont toujours conservés en plus du montant converti, et affichés entre parenthèses sur chaque ligne si différents du USD (ex : "150 000 XOF ≈ 250 $").
- Aucun calcul agrégé ne mélange jamais des devises non converties.

---

## 5. LOGIQUE FINANCIÈRE ET DE PROGRESSION

### 5.1 Progression vers 100 000 $

- Date de départ : date de la toute première transaction saisie. Date cible : **11 janvier 2027**.
- Total cumulé = somme des revenus convertis en USD, toutes activités confondues.
- Afficher : montant atteint, montant restant, pourcentage, jours restants réels (calculés dynamiquement).

### 5.2 Prévisions réalistes (jamais utopiques)

Aucune extrapolation arbitraire. Méthode stricte :
1. **Moins de 2 mois de données** : aucune prévision chiffrée. Afficher uniquement l'objectif mensuel plancher (montant restant ÷ mois restants), étiqueté "objectif", jamais "prévision".
2. **2 à 5 mois de données** : moyenne mobile des revenus mensuels réels, projetée sur les mois restants, avec libellé "Prévision basée sur ta moyenne des N derniers mois".
3. **6 mois ou plus** : régression linéaire simple (moindres carrés) sur les revenus mensuels réels, projetée jusqu'au 11 janvier 2027, avec une **fourchette basse/haute** (± écart-type) plutôt qu'un chiffre unique.
4. Toujours accompagner d'un texte explicite : *"Cette projection est basée sur tes N derniers mois réels, pas une estimation arbitraire."*
5. Toute prévision dépassant de plus de 50% le meilleur mois historique reçoit un badge visuel "optimiste".

### 5.3 Profit First (Mike Michalowicz)

Répartition automatique des revenus (USD) en 4 enveloppes, pourcentages ajustables dans les Réglages (défauts adaptés à un indépendant early-stage) :
- Profit — défaut 5%
- Rémunération du fondateur — défaut 50%
- Impôts/Taxes — défaut 15%
- Frais d'exploitation — défaut 30% (inclut automatiquement toutes les charges récurrentes actives, abonnements comme autres coûts)

Affichage en 4 anneaux (RadialBarChart), avec alerte visuelle si les charges récurrentes dépassent à elles seules l'enveloppe "Frais d'exploitation".

### 5.4 Quête Quotidienne — principes de "The One Thing" (Gary Keller)

- La Question Ciblante affichée en permanence en en-tête du module : *"Quelle est LA chose que je peux faire aujourd'hui, telle qu'en la faisant, tout le reste deviendrait plus facile ou inutile ?"*
- Une seule tâche par jour peut être désignée "LA priorité" (sélectionner une nouvelle priorité désélectionne automatiquement l'ancienne). Mise en avant visuelle forte (carte glass premium, en haut de la liste).
- Les autres tâches du jour sont listées en dessous, sobrement, sous le libellé "Autres tâches (à ne traiter qu'après LA priorité)".
- Chaque tâche peut être liée à une activité (badge coloré correspondant).
- Vue hebdomadaire en mini-calendrier (7 colonnes) montrant si LA priorité de chaque jour a été complétée.

### 5.5 Rangs E → S combinés au framework Chris Do

Chaque activité progresse à travers 5 rangs, qui combinent le rang Solo Leveling et le nom de l'étape Chris Do :

| Rang | Nom Chris Do | Critères (repris de la méthode Chris Do) |
|---|---|---|
| **E** | Survie | Missions ponctuelles, revenu imprévisible, acceptation de tout, aucune spécialisation |
| **D** | Stabilité | Profil client idéal identifié, portfolio de 3 à 5 études de cas ciblées, premiers revenus réguliers |
| **C → B** | Ambition / Systématisation | Tarification au forfait, processus en 5 étapes documenté, premiers 5-8k$/mois réguliers |
| **A** | Croissance | Flux de prospects constant, délégation commencée, 10-12 prospects qualifiés/mois |
| **S** | Pérennisation | Équipe formée, standards documentés, patrimoine protégé — **le rang Class S** |

- Le rang n'est **jamais deviné automatiquement** : Scott l'ajuste lui-même mensuellement via un mini-formulaire par activité ("Quel rang pour [nom de l'activité] ce mois-ci ?"), avec un tooltip rappelant les critères de chaque rang.
- Badge visuel façon "carte de rang de Chasseur" : lettre du rang en grand format avec une bordure colorée qui évolue du gris terne (E) vers le dégradé signature violet→champagne (S), pour que l'ascension soit visuellement gratifiante.
- Sur le dashboard, chaque carte d'activité affiche ce badge de rang bien en évidence.

---

## 6. DESIGN SYSTEM — "LE SYSTÈME" (à respecter au millimètre)

### 6.1 Palette de couleurs

```css
--violet-imperial: #6600CC;
--champagne: #C9A070;
--amethyste: #A87FE8;
--ardoise: #3A2F5C;
--onyx: #0D0A18;
--blanc-nacre: #F7F5FB;
--negatif: #E8546B;
--positif: #4ADE9A;
```

Palette étendue pour les activités créées librement (cyclique si non choisie) : `#6600CC`, `#A87FE8`, `#C9A070`, `#4ADE9A`, `#5EC8D8`, `#E8546B`.

Mode par défaut : **sombre** (Onyx #0D0A18). Toggle clair/sombre disponible, mais le sombre reste le mode signature.

Dégradé signature :
```css
background: linear-gradient(135deg, #6600CC 0%, #A87FE8 45%, #C9A070 100%);
```

### 6.2 Typographie — Jost

```css
@import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700;800&display=swap');
font-family: 'Jost', sans-serif;
```

| Usage | Taille | Graisse | Line-height | Letter-spacing |
|---|---|---|---|---|
| Montant héro | 64px (clamp(40px, 6vw, 64px)) | 700 | 1.0 | -0.02em |
| H1 (titre de page) | 32px | 600 | 1.15 | -0.01em |
| H2 (titre de carte) | 20px | 600 | 1.2 | normal |
| H3 (label KPI) | 14px | 500 | 1.3 | 0.02em, uppercase |
| Corps de texte | 15px | 400 | 1.5 | normal |
| Texte secondaire | 13px | 400 | 1.4 | Ardoise à 70% d'opacité |
| Chiffres en tableau | 15px | 500 (tabular-nums obligatoire) | 1.4 | normal |

`font-variant-numeric: tabular-nums;` obligatoire sur tous les chiffres financiers.

### 6.3 Glassmorphism — valeurs exactes

```css
.glass-card {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  box-shadow:
    0 8px 32px rgba(13, 10, 24, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  padding: 24px;
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(168, 127, 232, 0.35);
  transform: translateY(-2px);
  transition: all 240ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

Cartes premium (hero 100k$) : `border-radius: 32px`, `backdrop-filter: blur(40px) saturate(200%)`, fine bordure en dégradé violet→améthyste via pseudo-élément `::before`.

### 6.4 Reflet diagonal animé — VERSION ADOUCIE (règle stricte)

Le reflet ne doit apparaître **que sur un seul élément à la fois dans le champ de vision : la carte hero de l'objectif 100 000 $**. Aucun autre élément ne porte de reflet animé en continu (les cartes de rang, la Quête Quotidienne, les CTA gardent uniquement l'effet de survol classique : `translateY(-2px)`, changement d'opacité).

```css
.glass-card--premium::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -60%;
  width: 30%;
  height: 200%;
  background: linear-gradient(
    115deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.06) 45%,
    rgba(255, 255, 255, 0.12) 50%,
    rgba(255, 255, 255, 0.06) 55%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(20deg);
  animation: sheen-sweep 14s ease-in-out infinite;
  pointer-events: none;
}

@keyframes sheen-sweep {
  0%   { left: -60%; }
  12%  { left: 130%; }
  100% { left: 130%; }
}
```

Sur les boutons CTA : reflet déclenché uniquement au survol (`animation-play-state: paused` par défaut, `running` au `:hover`), durée réduite à 1.2s.

Pas de halo pulsant continu sur l'anneau de progression — uniquement une animation de dessin progressif **une seule fois** au chargement.

**Règle générale** : jamais plus d'une animation ambiante continue visible à l'écran à un instant donné. Respecter `prefers-reduced-motion: reduce` en retirant complètement le pseudo-élément `::after`.

### 6.5 Grille, espacement, rayons

- Unité de base 8px, tous les paddings/margins en multiples de 8.
- Rayons : 12px (inputs, badges), 20px (boutons, mini-cartes), 24px (cartes standard), 32px (cartes hero).
- Container max-width 1440px, marge latérale 48px desktop / 24px tablette / 16px mobile, grille 12 colonnes, gouttière 24px.
- Ombres toujours teintées Onyx (`rgba(13, 10, 24, X)`), jamais de noir pur.

### 6.6 Traitement visuel des modules "Bientôt disponible" (vitrine)

Portail, Armée des Ombres, Donjon et Grimoire sont **cliquables** dans la navigation (pas grisés/désactivés) et mènent chacun vers un **écran de preview** :
- Fond glass premium avec le dégradé signature en arrière-plan très subtil (opacité 15%).
- Grand titre du module (H1) + badge "Bientôt disponible" (pilule avec bordure dégradée).
- Description courte de la valeur du module (2-3 phrases, ton Class S).
- Mockup statique simplifié illustrant à quoi ressemblera l'interface une fois active (quelques cartes glass vides avec des placeholders légers, pas de fausses données chiffrées).
- Bouton "Me prévenir au lancement" (glass-card premium avec reflet au survol) qui enregistre l'intérêt de l'utilisateur (simple flag booléen en base, pas besoin de système de notification réel à ce stade).

---

## 7. STRUCTURE DE L'APPLICATION

### 7.0 Écran de connexion

Fond Onyx plein écran avec dégradé signature en arrière-plan subtil et flouté, logo/monogramme Class S centré, titre "Le Système", sous-titre "Ta route vers le rang S", bouton unique "Continuer avec Google" en glass-card premium. Aucun mot de passe, aucune inscription classique.

### 7.1 Navigation (sidebar)

Barre latérale gauche fixe (72px, extensible à 240px au survol ou via épingle), fond glass, icônes Lucide React `stroke-width: 1.5`. Sections, dans cet ordre :
1. **Fenêtre de Statut** (dashboard)
2. **Transactions**
3. **Charges récurrentes**
4. **Mes Activités**
5. **Quête Quotidienne**
6. **Prévisions**
7. **Portail** (badge "Bientôt disponible")
8. **Armée des Ombres** (badge "Bientôt disponible")
9. **Donjon** (badge "Bientôt disponible")
10. **Grimoire** (badge "Bientôt disponible")
11. **Réglages**

### 7.2 Fenêtre de Statut (dashboard principal)

**Bloc hero — Objectif 100 000 $** (carte premium pleine largeur, 320px, reflet diagonal actif) : montant héro cumulé en count-up, sous-titre "sur 100 000 $ d'ici le 11 janvier 2027", jours restants, anneau de progression circulaire (RadialBarChart, dégradé violet→champagne le long de l'arc), mini-stats en bas ("Objectif mensuel restant", "Meilleur mois", "Moyenne mensuelle réelle").

**Bloc "LA priorité du jour"** (carte premium compacte, sans reflet animé continu, juste effet hover) : reprend la tâche prioritaire de la Quête Quotidienne, avec la Question Ciblante en petit texte au-dessus, lien vers la page dédiée.

**Rangée de cartes activités** (grille flexible selon le nombre d'activités créées) : icône + nom, revenu du mois (count-up), mini sparkline 6 derniers mois, **badge de rang E→S** bien visible avec bordure colorée évolutive.

**Section Profit First** : 4 anneaux (Profit, Rémunération, Impôts, Frais d'exploitation) avec montants réels et alerte de dépassement.

**Section Charges récurrentes — aperçu rapide** : 5 prochaines échéances (nom, activité liée, montant, date), toutes charges confondues (abonnements + autres).

### 7.3 Page Transactions

- Formulaire d'ajout : montant, devise (USD/XOF), type (revenu/dépense), activité (select avec création à la volée), **client lié (optionnel, select avec création à la volée)**, catégorie, date, note.
- Validation bloquante si activité manquante ou montant invalide.
- Liste triable/filtrable par date, activité, type ; recherche texte. Montant en tabular-nums coloré, devise d'origine entre parenthèses si différente du USD.
- Suppression d'une transaction retire immédiatement son impact de tous les calculs agrégés, sans rechargement manuel.

### 7.4 Page Charges récurrentes

- Onglets/filtre : "Abonnements" / "Autres charges récurrentes" / "Tout".
- Formulaire d'ajout : nom, nature, activité liée (optionnelle), montant, devise, fréquence, date de premier paiement, date de fin optionnelle.
- Grille de cartes glass avec coût mensuel normalisé en $, badge d'activité, statut togglable directement sur la carte.
- Bandeau supérieur : coût mensuel total combiné, coût annuel projeté, répartition par activité (mini donut chart).
- Timeline des 30 prochains prélèvements, toutes charges confondues.

### 7.5 Page "Mes Activités"

- Gestion libre : créer, renommer, recolorer, mettre en pause, archiver.
- Chaque activité en carte : nom, couleur, icône, **badge de rang actuel**, revenu total cumulé, nombre de transactions, nombre de charges liées.
- Page de détail par activité : revenu, dépenses, profit net, graphe mensuel (BarChart revenus vs dépenses), charges liées, formulaire mensuel d'ajustement du rang avec tooltip des critères (section 5.5).
- Mise en pause/archivage d'une activité ne supprime jamais l'historique des transactions/charges liées (pas de suppression en cascade sans confirmation explicite).

### 7.6 Page Quête Quotidienne

- En-tête permanent avec la Question Ciblante.
- Carte premium "LA priorité du jour" en haut, sélecteur explicite pour désigner/changer cette priorité.
- Liste "Autres tâches" en dessous.
- Formulaire d'ajout rapide (titre, activité liée optionnelle, date).
- Vue hebdomadaire en mini-calendrier (7 colonnes) montrant la complétion de LA priorité par jour.

### 7.7 Page Prévisions

- AreaChart : trajectoire réelle cumulée (ligne pleine) vs trajectoire nécessaire pour 100k$ au 11 janvier 2027 (ligne pointillée), fourchette basse/haute en aire semi-transparente au-delà d'aujourd'hui.
- Encart méthodologique explicite (section 5.2).
- Simulateur interactif ("Et si j'augmentais mon revenu mensuel moyen de X% ?"), toujours étiqueté comme simulation.

### 7.8 Page Portail (vitrine)

Suit le traitement décrit en section 6.6. Contenu spécifique : titre "Portail", description orientée facturation ("Ouvre un portail vers chaque mission : devis, facture, suivi de paiement et relance, sans ressaisie — chaque facture payée alimente automatiquement ta Fenêtre de Statut. Facture et paiement restent toujours deux entités distinctes : une facture peut être réglée en plusieurs fois, chaque paiement est tracé individuellement."), mockup illustrant une liste de factures fictives grisées (statuts "Brouillon", "Envoyée", "Partiellement payée", "Payée" en placeholders visuels, pas de montants inventés). Ajoute une mention spécifique dans la description : "Partage un simple lien de formulaire à ton client — dès qu'il le remplit, un nouveau dossier s'ouvre automatiquement dans ton Donjon, brief inclus, sans ressaisie de ta part."

### 7.9 Page Armée des Ombres (vitrine)

Suit le traitement décrit en section 6.6. Contenu spécifique : titre "Armée des Ombres", description orientée CRM ("Chaque client conquis rejoint ton armée. Suis ton pipeline, l'historique de chaque relation, et la valeur de vie de chaque ombre recrutée."), mockup illustrant un pipeline en colonnes (Prospect / Discussion / Devis envoyé / Client / Fidélisé) avec des cartes placeholder vides.

### 7.10 Page Donjon (vitrine)

Suit le traitement décrit en section 6.6. Contenu spécifique : titre "Donjon", description orientée gestion de projet ("Chaque commande devient un donjon à traverser étage par étage : brief, direction artistique, révisions, validation, livraison. Suis le temps passé, les fichiers et l'avancement de chaque mission, sans jamais perdre le fil."), mockup illustrant une commande fictive avec une progression en étapes verticales (façon "étages de donjon"), placeholders vides sans données inventées.

### 7.11 Page Grimoire (vitrine)

Suit le traitement décrit en section 6.6. Contenu spécifique : titre "Grimoire", description orientée catalogue de services ("Ton grimoire de techniques : chaque prestation que tu maîtrises, avec son prix, sa marge réelle et le nombre de fois où elle t'a rapporté. De quoi savoir enfin quelles techniques valent la peine d'être répétées."), mockup illustrant quelques cartes de "techniques" (services) placeholder avec des jauges de marge vides.

### 7.12 Page Réglages

- Pourcentages Profit First (sliders, validation somme = 100%).
- Seuil d'alerte charges récurrentes.
- Taux de change XOF → USD (manuel, avec date de dernière mise à jour).
- Toggle mode clair/sombre.
- Export des données (JSON/CSV).
- Gestion du compte Google connecté (email affiché, déconnexion).

---

## 8. GESTION DES ÉTATS VIDES

- Fenêtre de Statut vide : anneau à 0%, message "Ta première transaction lance le compte à rebours vers le rang S" avec CTA vers l'ajout de transaction.
- Aucune activité créée : "Crée ta première activité pour commencer ton ascension" avec CTA vers "Mes Activités".
- Prévisions vide : courbe pointillée fantôme + "Ajoute au moins 2 mois de revenus pour débloquer tes premières prévisions."
- Charges récurrentes vide : "Ajoute ta première charge récurrente pour suivre tes frais fixes."
- Quête Quotidienne vide : la Question Ciblante seule + "Définis LA chose que tu vas faire aujourd'hui."

---

## 9. TON ET MICRO-COPY

- Français, tutoiement. Verbes actifs, phrases courtes, jamais de tirets cadratins.
- Le vocabulaire Solo Leveling (rang, quête, portail, ombre, ascension) infuse les libellés de l'interface sans jamais nuire à la clarté financière : un chiffre reste un chiffre, jamais habillé au point de devenir ambigu.
- Alertes directes et factuelles, sans dramatisation : "Tes charges récurrentes représentent 34% de tes frais d'exploitation ce mois-ci, au-dessus du seuil de 30% que tu as fixé."

---

## 10. LIVRABLE ATTENDU

Une application fonctionnelle, responsive (mobile/tablette/desktop), avec :
- Connexion Google fonctionnelle et synchronisation cloud fiable pour **toutes** les entités du socle de données (section 2 respectée sans exception).
- Entité Client intégrée dès cette version, même sans interface de gestion dédiée.
- Charges récurrentes unifiant abonnements et autres coûts fixes.
- Rangs E→S combinés au framework Chris Do, ajustables manuellement par activité.
- Quête Quotidienne fonctionnelle avec contrainte d'unicité de la priorité du jour.
- Portail, Armée des Ombres, Donjon et Grimoire en vitrine cliquable, pas de fonctionnalité réelle mais une preview soignée pour chacun — y compris la mention de l'auto-remplissage de Donjon via un lien de formulaire partagé, dans la vitrine Portail.
- Design system de la section 6 appliqué partout, reflet diagonal limité strictement à la carte hero, jamais plus d'une animation ambiante à l'écran à la fois.
- Aucune donnée fictive visible au premier lancement, hormis les placeholders des vitrines Portail/Armée des Ombres.

Construis maintenant "Le Système" en respectant scrupuleusement chaque spécification ci-dessus.
