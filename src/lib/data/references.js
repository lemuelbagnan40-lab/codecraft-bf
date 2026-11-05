export const references = [
  { id: 'html', title: 'HTML', description: 'Éléments, attributs, formulaires et structure des documents.', technology: 'html', keywords: ['balises', 'attributs', 'formulaires'], links: [
    { label: 'Référence des éléments HTML', href: 'https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Elements' },
    { label: 'Référence des attributs HTML', href: 'https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Attributes' }
  ] },
  { id: 'css', title: 'CSS', description: 'Propriétés, sélecteurs, règles et fonctions CSS.', technology: 'css', keywords: ['styles', 'mise en page', 'cascade'], links: [
    { label: 'Référence des propriétés CSS', href: 'https://developer.mozilla.org/fr/docs/Web/CSS/Reference/Properties' },
    { label: 'Sélecteurs CSS', href: 'https://developer.mozilla.org/fr/docs/Web/CSS/CSS_selectors' },
    { label: 'Fonctions CSS', href: 'https://developer.mozilla.org/fr/docs/Web/CSS/CSS_values_and_units/CSS_data_types#functions' }
  ] },
  { id: 'javascript', title: 'JavaScript', description: 'Référence du langage ECMAScript et des objets natifs.', technology: 'javascript', keywords: ['méthodes', 'fonctions', 'promesses'], links: [
    { label: 'Référence JavaScript', href: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference' },
    { label: 'Guide JavaScript', href: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide' }
  ] },
  { id: 'web-apis', title: 'APIs du navigateur', description: 'Interfaces web natives disponibles dans les navigateurs.', technology: 'web', keywords: ['DOM', 'Fetch', 'localStorage', 'navigateur'], links: [
    { label: 'Référence des APIs Web', href: 'https://developer.mozilla.org/fr/docs/Web/API' },
    { label: 'Guide Fetch API', href: 'https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch' }
  ] }
];

const referenceGroups = [
  { technology: 'css', category: 'Propriétés', items: [
    ['display', 'Choisit le mode d’affichage et de mise en page.', 'display: grid;', 'https://developer.mozilla.org/fr/docs/Web/CSS/display'],
    ['color', 'Définit la couleur du texte.', 'color: hsl(145 45% 30%);', 'https://developer.mozilla.org/fr/docs/Web/CSS/color'],
    ['background', 'Définit la couleur et les images d’arrière-plan.', 'background: linear-gradient(90deg, #173, #5a8);', 'https://developer.mozilla.org/fr/docs/Web/CSS/background'],
    ['margin et padding', 'Règlent l’espace extérieur et intérieur de la boîte.', 'padding: 1rem; margin-block: 2rem;', 'https://developer.mozilla.org/fr/docs/Web/CSS/margin'],
    ['border et border-radius', 'Définissent les bordures et l’arrondi des coins.', 'border: 1px solid #ccd; border-radius: .75rem;', 'https://developer.mozilla.org/fr/docs/Web/CSS/border'],
    ['box-sizing', 'Détermine le calcul des dimensions CSS.', 'box-sizing: border-box;', 'https://developer.mozilla.org/fr/docs/Web/CSS/box-sizing'],
    ['width et height', 'Définissent les dimensions d’une boîte.', 'width: min(100%, 60rem);', 'https://developer.mozilla.org/fr/docs/Web/CSS/width'],
    ['position et z-index', 'Positionnent un élément et contrôlent son empilement.', 'position: relative; z-index: 1;', 'https://developer.mozilla.org/fr/docs/Web/CSS/position'],
    ['overflow', 'Définit le rendu du contenu qui dépasse une boîte.', 'overflow: auto;', 'https://developer.mozilla.org/fr/docs/Web/CSS/overflow'],
    ['font et line-height', 'Contrôlent la famille, le poids et l’interligne.', 'font: 700 1rem/1.6 system-ui;', 'https://developer.mozilla.org/fr/docs/Web/CSS/font'],
    ['Flexbox', 'Aligne et répartit des éléments le long d’un axe.', 'display: flex; align-items: center; gap: 1rem;', 'https://developer.mozilla.org/fr/docs/Web/CSS/CSS_flexible_box_layout'],
    ['CSS Grid', 'Organise les éléments en lignes et colonnes.', 'grid-template-columns: repeat(2, 1fr);', 'https://developer.mozilla.org/fr/docs/Web/CSS/CSS_grid_layout'],
    ['transition', 'Anime progressivement les changements de propriétés.', 'transition: color 150ms ease;', 'https://developer.mozilla.org/fr/docs/Web/CSS/transition'],
    ['transform', 'Déplace, tourne ou met à l’échelle un élément.', 'transform: translateY(-2px);', 'https://developer.mozilla.org/fr/docs/Web/CSS/transform'],
    ['animation', 'Associe une séquence keyframes à un élément.', 'animation: appear 200ms ease;', 'https://developer.mozilla.org/fr/docs/Web/CSS/animation'],
    ['opacity et filter', 'Règlent la transparence et les effets visuels.', 'opacity: .8; filter: grayscale(1);', 'https://developer.mozilla.org/fr/docs/Web/CSS/filter'],
    ['accent-color', 'Personnalise l’accent des contrôles natifs.', 'accent-color: seagreen;', 'https://developer.mozilla.org/fr/docs/Web/CSS/accent-color'],
    ['propriétés logiques', 'Définissent des dimensions relatives au sens d’écriture.', 'margin-inline: auto; padding-block: 1rem;', 'https://developer.mozilla.org/fr/docs/Web/CSS/CSS_logical_properties_and_values']
  ] },
  { technology: 'css', category: 'Sélecteurs et états', items: [
    ['Sélecteurs de type, classe et identifiant', 'Ciblent une balise, une classe réutilisable ou un identifiant unique.', 'article.card { } #principal { }', 'https://developer.mozilla.org/fr/docs/Web/CSS/CSS_selectors'],
    ['Sélecteurs d’attribut', 'Ciblent les éléments selon la présence ou la valeur d’un attribut.', 'input[type="email"] { }', 'https://developer.mozilla.org/fr/docs/Web/CSS/Attribute_selectors'],
    ['Combinateurs CSS', 'Expriment les relations parent-enfant et entre frères.', 'nav > a { } article + article { }', 'https://developer.mozilla.org/fr/docs/Web/CSS/CSS_selectors/Selectors_and_combinators'],
    [':hover et :active', 'Ciblent respectivement le survol et l’activation.', 'button:hover { } button:active { }', 'https://developer.mozilla.org/fr/docs/Web/CSS/:hover'],
    [':focus et :focus-visible', 'Stylisent les éléments qui reçoivent le focus.', 'a:focus-visible { outline: 3px solid; }', 'https://developer.mozilla.org/fr/docs/Web/CSS/:focus-visible'],
    [':checked et :disabled', 'Ciblent les contrôles cochés ou désactivés.', 'input:checked { } button:disabled { }', 'https://developer.mozilla.org/fr/docs/Web/CSS/:checked'],
    [':nth-child()', 'Sélectionne des enfants selon leur position dans un groupe.', 'li:nth-child(odd) { }', 'https://developer.mozilla.org/fr/docs/Web/CSS/:nth-child'],
    [':is(), :where() et :has()', 'Simplifient les sélecteurs et les relations conditionnelles.', ':is(h1, h2) { } .card:has(img) { }', 'https://developer.mozilla.org/fr/docs/Web/CSS/:is'],
    ['Pseudo-éléments ::before et ::after', 'Créent des boîtes générées décoratives.', '.tag::before { content: "•"; }', 'https://developer.mozilla.org/fr/docs/Web/CSS/::before'],
    ['Pseudo-éléments de texte', 'Ciblent une première ligne, lettre ou sélection.', 'p::first-letter { font-size: 2em; }', 'https://developer.mozilla.org/fr/docs/Web/CSS/Pseudo-elements'],
    ['Spécificité CSS', 'Compare le poids relatif des sélecteurs dans la cascade.', '/* classe > type */ .notice { }', 'https://developer.mozilla.org/fr/docs/Web/CSS/Specificity']
  ] },
  { technology: 'css', category: 'Fonctions et unités', items: [
    ['calc()', 'Combine plusieurs valeurs compatibles dans une expression.', 'width: calc(100% - 2rem);', 'https://developer.mozilla.org/fr/docs/Web/CSS/calc'],
    ['min(), max() et clamp()', 'Bornent une valeur ou choisissent parmi plusieurs dimensions.', 'font-size: clamp(1rem, 4vw, 3rem);', 'https://developer.mozilla.org/fr/docs/Web/CSS/clamp'],
    ['var()', 'Lit la valeur d’une propriété personnalisée CSS.', 'color: var(--accent, seagreen);', 'https://developer.mozilla.org/fr/docs/Web/CSS/var'],
    ['linear-gradient()', 'Crée un dégradé linéaire utilisable comme image.', 'background: linear-gradient(90deg, #173, #5a8);', 'https://developer.mozilla.org/fr/docs/Web/CSS/gradient/linear-gradient'],
    ['color-mix() et oklch()', 'Mélange des couleurs et exprime teinte, clarté et chroma.', 'color: oklch(52% .13 150);', 'https://developer.mozilla.org/fr/docs/Web/CSS/color_value/color-mix'],
    ['px, %, em et rem', 'Unités de pixels, relatives au contexte ou à la racine.', 'padding: 1rem; width: 80%;', 'https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Values_and_Units'],
    ['vw, vh, svh, lvh et dvh', 'Unités liées aux dimensions du viewport.', 'min-height: 100dvh;', 'https://developer.mozilla.org/fr/docs/Web/CSS/length'],
    ['fr, ch et ex', 'Unités utiles aux pistes de grille et aux dimensions typographiques.', 'grid-template-columns: 1fr 2fr;', 'https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Values_and_Units']
  ] },
  { technology: 'css', category: 'Règles @', items: [
    ['@media', 'Applique des styles selon le viewport ou des préférences système.', '@media (min-width: 48rem) { }', 'https://developer.mozilla.org/fr/docs/Web/CSS/@media'],
    ['@container', 'Adapte un composant à la taille de son conteneur.', '@container (min-width: 30rem) { }', 'https://developer.mozilla.org/fr/docs/Web/CSS/@container'],
    ['@supports', 'Teste la prise en charge d’une déclaration CSS.', '@supports (display: grid) { }', 'https://developer.mozilla.org/fr/docs/Web/CSS/@supports'],
    ['@keyframes', 'Décrit les étapes d’une animation CSS.', '@keyframes appear { from { opacity: 0; } to { opacity: 1; } }', 'https://developer.mozilla.org/fr/docs/Web/CSS/@keyframes'],
    ['@font-face', 'Déclare une police personnalisée utilisable dans la page.', '@font-face { font-family: Demo; src: url(demo.woff2); }', 'https://developer.mozilla.org/fr/docs/Web/CSS/@font-face'],
    ['@layer', 'Organise la priorité des groupes de règles CSS.', '@layer reset, components, utilities;', 'https://developer.mozilla.org/fr/docs/Web/CSS/@layer'],
    ['Nesting CSS', 'Imbrique des règles CSS modernes avec le sélecteur parent &.', '.card { & a { color: green; } }', 'https://developer.mozilla.org/fr/docs/Web/CSS/CSS_nesting']
  ] },
  { technology: 'javascript', category: 'Chaînes et tableaux', items: [
    ['String.includes()', 'Vérifie si une chaîne contient une séquence.', '"javascript".includes("script");', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String/includes'],
    ['String.slice() et substring()', 'Extraient une portion d’une chaîne.', 'texte.slice(0, 5);', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String/slice'],
    ['String.trim(), split() et replace()', 'Nettoient, découpent ou remplacent du texte.', 'csv.trim().split(",");', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String'],
    ['String.startsWith() et endsWith()', 'Vérifient le préfixe ou le suffixe d’une chaîne.', 'nom.endsWith(".html");', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith'],
    ['Array.push(), pop(), shift() et unshift()', 'Ajoutent ou retirent des éléments aux extrémités.', 'items.push("nouveau");', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array'],
    ['Array.slice() et splice()', 'Copient une portion ou modifient un tableau en place.', 'const copie = items.slice(1, 3);', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/slice'],
    ['Array.includes() et indexOf()', 'Recherchent une valeur dans un tableau.', 'items.includes("html");', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/includes'],
    ['Array.find() et findIndex()', 'Retrouvent le premier élément ou index correspondant.', 'users.find(user => user.id === 3);', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/find'],
    ['Array.map() et filter()', 'Transforment ou sélectionnent les éléments d’un tableau.', 'items.filter(item => item.actif);', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/filter'],
    ['Array.reduce()', 'Accumule les éléments dans une valeur unique.', 'prix.reduce((s, p) => s + p, 0);', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce'],
    ['Array.some() et every()', 'Vérifient si certains ou tous les éléments satisfont un test.', 'scores.every(score => score >= 0);', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/every'],
    ['Array.sort() et reverse()', 'Réordonnent les éléments d’un tableau en place.', 'nombres.sort((a, b) => a - b);', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/sort']
  ] },
  { technology: 'javascript', category: 'Objets, nombres et dates', items: [
    ['Object.keys(), values() et entries()', 'Renvoient les clés, valeurs ou paires d’un objet.', 'Object.entries(profil);', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/entries'],
    ['Math.floor(), round() et random()', 'Arrondissent des nombres ou génèrent un nombre pseudo-aléatoire.', 'Math.floor(Math.random() * 10);', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math'],
    ['Number() et Number.isNaN()', 'Convertissent ou vérifient les valeurs numériques.', 'Number("42"); Number.isNaN(valeur);', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Number'],
    ['Date et ISO', 'Représentent un instant et fournissent une forme standardisée.', 'new Date().toISOString();', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Date'],
    ['Intl.NumberFormat et DateTimeFormat', 'Formatent nombres, devises et dates selon une locale.', 'new Intl.NumberFormat("fr-FR").format(12500);', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl'],
    ['Set et Map', 'Stockent des valeurs uniques ou des associations clé-valeur.', 'const uniques = new Set([1, 1, 2]);', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Map'],
    ['JSON.stringify() et parse()', 'Sérialisent ou reconstruisent les données JSON.', 'JSON.parse(JSON.stringify(profil));', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/JSON'],
    ['Expressions régulières', 'Décrivent un motif de recherche dans une chaîne.', '/^[a-z]+$/i.test(identifiant);', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Regular_expressions']
  ] },
  { technology: 'javascript', category: 'Fonctions, classes et promesses', items: [
    ['Fonctions et callbacks', 'Déclarent un comportement réutilisable et transmissible.', 'items.map((item) => item.nom);', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Functions'],
    ['Closures et portée', 'Conservent l’accès aux variables de la portée lexicale.', 'function creerCompteur() { let n = 0; return () => ++n; }', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Closures'],
    ['Classes et prototypes', 'Construisent des objets avec méthodes, héritage et prototypes.', 'class Produit { constructor(nom) { this.nom = nom; } }', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Classes'],
    ['Promise.then(), catch() et finally()', 'Composent la réussite, les erreurs et le nettoyage asynchrones.', 'operation().then(utiliser).catch(signaler);', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise'],
    ['async et await', 'Écrivent des séquences asynchrones lisibles autour des promesses.', 'const valeur = await charger();', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/async_function'],
    ['Promise.all()', 'Attend plusieurs opérations asynchrones en parallèle.', 'const valeurs = await Promise.all(taches);', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise/all']
  ] },
  { technology: 'web', category: 'APIs du navigateur', items: [
    ['DOM et événements', 'Sélectionnent les éléments et réagissent aux actions.', 'document.querySelector("button").addEventListener("click", agir);', 'https://developer.mozilla.org/fr/docs/Web/API/Document_Object_Model'],
    ['Fetch API et AbortController', 'Effectuent des requêtes HTTP annulables depuis le navigateur.', 'fetch(url, { signal: controller.signal });', 'https://developer.mozilla.org/fr/docs/Web/API/Fetch_API'],
    ['localStorage et sessionStorage', 'Stockent des chaînes sur une origine ou une session d’onglet.', 'localStorage.setItem("theme", "sombre");', 'https://developer.mozilla.org/fr/docs/Web/API/Web_Storage_API'],
    ['URL et URLSearchParams', 'Analysent les URL et leurs paramètres de recherche.', 'new URLSearchParams(location.search).get("q");', 'https://developer.mozilla.org/fr/docs/Web/API/URLSearchParams'],
    ['Clipboard API et Geolocation API', 'Accèdent au presse-papiers ou à la position après autorisation.', 'navigator.clipboard.writeText(texte);', 'https://developer.mozilla.org/fr/docs/Web/API'],
    ['IntersectionObserver et ResizeObserver', 'Observent visibilité et dimensions sans polling manuel.', 'new IntersectionObserver(callback);', 'https://developer.mozilla.org/fr/docs/Web/API/IntersectionObserver'],
    ['Web Workers, Canvas et Drag and Drop', 'Délèguent du calcul, dessinent et gèrent le glisser-déposer.', 'worker.postMessage(donnees);', 'https://developer.mozilla.org/fr/docs/Web/API'],
    ['Web Components', 'Créent des éléments personnalisés avec une encapsulation optionnelle.', 'customElements.define("mon-badge", MonBadge);', 'https://developer.mozilla.org/fr/docs/Web/API/Web_components']
  ] }
];

export const referenceEntries = referenceGroups.flatMap((group) => group.items.map(([title, description, example, href]) => ({
  id: `${group.technology}-${title.toLocaleLowerCase('fr').replace(/[^a-z0-9]+/g, '-')}`,
  title,
  description,
  example,
  href,
  technology: group.technology,
  category: group.category,
  keywords: [group.category, group.technology, title]
})));
