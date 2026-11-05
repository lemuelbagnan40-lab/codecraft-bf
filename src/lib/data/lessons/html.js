const sharedObjectives = ['Comprendre le rôle des éléments HTML', 'Écrire une structure lisible et accessible', 'Vérifier le résultat dans un navigateur'];

export const htmlLessons = [
  {
    id: 'structure-document', slug: 'structure-document', courseId: 'html', level: 'Débutant', duration: '15 min',
    title: 'La structure d’un document HTML',
    introduction: 'Une page HTML est un document organisé. Le navigateur lit ses éléments pour construire une structure que CSS pourra présenter et JavaScript rendre interactive.',
    objectives: sharedObjectives, prerequisites: 'Aucun. Un éditeur de texte et un navigateur suffisent.',
    sections: [
      { title: 'Le squelette d’une page', body: 'Le doctype annonce un document HTML moderne. L’élément html contient toute la page. head regroupe les informations destinées au navigateur, tandis que body contient le contenu visible.', code: '<!doctype html>\n<html lang="fr">\n  <head>\n    <meta charset="utf-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>Ma première page</title>\n  </head>\n  <body>\n    <h1>Bonjour le Web</h1>\n    <p>Voici ma première page.</p>\n  </body>\n</html>', explanation: 'La première ligne choisit le standard HTML actuel. lang indique la langue principale. charset gère correctement les caractères. viewport aide les écrans mobiles. title apparaît dans l’onglet du navigateur.' },
      { title: 'head et body ont des rôles différents', body: 'Les métadonnées ne remplacent pas le contenu de la page. Garde dans head le titre, les métadonnées et les liens vers les feuilles de style. Place dans body ce que la personne doit consulter.', callout: 'Chaque document doit avoir un titre descriptif et un attribut lang adapté à son contenu.' },
      { title: 'Erreurs fréquentes', body: 'Oublier le doctype peut déclencher un mode de rendu historique. Un titre absent rend les onglets difficiles à distinguer. Des éléments mal imbriqués rendent le document ambigu. Indente régulièrement et vérifie les balises ouvrantes et fermantes.' }
    ],
    example: { id: 'html-document', files: { html: '<h1>Bonjour le Web</h1>\n<p>Ma page est structurée en HTML.</p>', css: 'body { font-family: system-ui, sans-serif; padding: 1rem; }\nh1 { color: #176b45; }', javascript: 'document.querySelector("h1").addEventListener("click", () => {\n  document.querySelector("p").textContent = "Le document est prêt !";\n});' }, expectedResult: 'Un titre vert et un paragraphe apparaissent. Cliquer sur le titre modifie le paragraphe.' },
    exercises: [
      { id: 'html-structure-qcm', type: 'multiple-choice', level: 'Facile', prompt: 'Quel élément contient le contenu principal visible de la page ?', options: [{ id: 'head', label: '<head>' }, { id: 'body', label: '<body>' }, { id: 'title', label: '<title>' }], correctOptionId: 'body', explanation: '<body> contient le contenu affiché dans la page.' },
      { id: 'html-lang', type: 'short-answer', level: 'Facile', prompt: 'Quel attribut indique la langue principale du document ?', acceptedAnswers: ['lang'], hint: 'Il se place généralement sur l’élément html.', explanation: 'L’attribut lang, par exemple lang="fr", indique la langue aux outils d’assistance et aux navigateurs.' },
      { id: 'html-doctype', type: 'code', level: 'Défi', prompt: 'Écris l’annonce du type de document HTML moderne.', requiredSnippets: ['<!doctype html>'], hint: 'Cette déclaration est placée avant l’élément html.', explanation: 'Le doctype HTML moderne s’écrit <!doctype html>. La casse n’a pas d’importance en HTML.' }
    ], summary: ['Le doctype active le mode HTML moderne.', 'head contient les métadonnées et body le contenu.', 'Utilise lang, charset, viewport et un title pertinent.']
  },
  {
    id: 'elements-attributs', slug: 'elements-attributs', courseId: 'html', level: 'Débutant', duration: '12 min',
    title: 'Éléments, balises et attributs',
    introduction: 'Les éléments donnent une structure et un sens au contenu. Les attributs ajoutent des informations ou des réglages à un élément.',
    objectives: ['Distinguer une balise d’un élément', 'Utiliser correctement des attributs', 'Comprendre les éléments vides'], prerequisites: 'Avoir consulté la structure d’un document HTML.',
    sections: [
      { title: 'Un élément avec contenu', body: 'Une balise ouvrante et une balise fermante entourent le contenu. L’ensemble constitue un élément.', code: '<p class="intro">Bienvenue sur mon site.</p>', explanation: 'p est le nom de l’élément. class est un attribut dont la valeur est intro. Le texte est le contenu.' },
      { title: 'Attributs et éléments vides', body: 'Un attribut s’écrit dans la balise ouvrante. Certains éléments, comme img ou br, n’ont pas de contenu ni de balise fermante.', code: '<a href="https://developer.mozilla.org/">Documentation MDN</a>\n<img src="portrait.jpg" alt="Portrait de Mariam">', explanation: 'href indique la destination du lien. src indique le fichier image. alt fournit un texte de remplacement utile.' },
      { title: 'Écrire du HTML robuste', body: 'Entoure les valeurs d’attributs de guillemets, imbrique les éléments proprement et choisis des noms qui décrivent le contenu. Un id doit être unique dans le document ; une class peut être réutilisée.' }
    ],
    example: { id: 'html-attributes', files: { html: '<article class="profile">\n  <h2>Mariam</h2>\n  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240" alt="Portrait souriant de Mariam">\n  <a href="https://developer.mozilla.org/">Lire la documentation</a>\n</article>', css: '.profile { max-width: 280px; padding: 1rem; border: 1px solid #ddd; border-radius: 12px; font-family: system-ui; }\n.profile img { width: 100%; border-radius: 8px; }', javascript: '' }, expectedResult: 'Une fiche avec un titre, une image décrite et un lien s’affiche.' },
    exercises: [
      { id: 'html-attribute-qcm', type: 'multiple-choice', level: 'Facile', prompt: 'Quel attribut d’un lien contient son adresse de destination ?', options: [{ id: 'src', label: 'src' }, { id: 'href', label: 'href' }, { id: 'alt', label: 'alt' }], correctOptionId: 'href', explanation: 'href donne la destination d’un lien.' },
      { id: 'html-alt', type: 'short-answer', level: 'Facile', prompt: 'Quel attribut fournit une alternative textuelle à une image ?', acceptedAnswers: ['alt'], hint: 'Il se place sur l’élément img.', explanation: 'alt décrit l’image quand elle est informative. Une image décorative peut avoir un alt vide.' },
      { id: 'html-anchor', type: 'code', level: 'Défi', prompt: 'Écris un lien vers https://example.com avec le texte « Visiter le site ».', requiredSnippets: ['<a', 'href=', 'https://example.com', 'Visiter le site', '</a>'], hint: 'La destination est un attribut de la balise ouvrante.', explanation: 'Un élément a possède un attribut href et du texte descriptif entre ses balises.' }
    ], summary: ['Les balises délimitent les éléments.', 'Les attributs enrichissent la balise ouvrante.', 'Un alt utile et un texte de lien descriptif améliorent l’accessibilité.']
  },
  {
    id: 'titres-semantique', slug: 'titres-semantique', courseId: 'html', level: 'Débutant', duration: '14 min',
    title: 'Titres et structure sémantique',
    introduction: 'Le HTML sémantique décrit le rôle du contenu. Cette structure aide les personnes, les technologies d’assistance et les outils à comprendre la page.',
    objectives: ['Organiser une hiérarchie de titres', 'Choisir des éléments sémantiques', 'Distinguer structure et apparence'], prerequisites: 'Connaître les éléments et attributs HTML.',
    sections: [
      { title: 'Construire une hiérarchie de titres', body: 'h1 à h6 expriment des niveaux de titre. Choisis-les selon la hiérarchie du contenu plutôt que selon leur taille visuelle. Une page possède généralement un titre principal clair.', code: '<h1>Le jardin partagé</h1>\n<section>\n  <h2>Les plantations</h2>\n  <h3>Les tomates</h3>\n</section>', explanation: 'h2 est une partie du sujet principal. h3 est une sous-partie de cette section. CSS peut ensuite ajuster la taille visuelle.' },
      { title: 'Repères sémantiques', body: 'header présente une page ou une section, nav regroupe des liens de navigation, main contient le contenu principal, article est un contenu autonome, section regroupe un thème et footer conclut une page ou une section.', code: '<header><h1>Le jardin partagé</h1></header>\n<nav aria-label="Navigation principale">…</nav>\n<main>\n  <article><h2>Notre projet</h2><p>Un jardin pour le quartier.</p></article>\n</main>\n<footer>Contact</footer>' },
      { title: 'Éviter les faux titres', body: 'Ne choisis pas un titre parce qu’il a la taille souhaitée. Un texte en gras ou un div stylé ne remplace pas un titre. Pour un contenu visuellement différent, conserve le bon élément et applique une classe CSS.' }
    ],
    example: { id: 'html-semantics', files: { html: '<header><h1>Le jardin partagé</h1></header>\n<main>\n  <article>\n    <h2>Notre première récolte</h2>\n    <p>Les tomates ont mûri cette semaine.</p>\n  </article>\n</main>\n<footer>Un projet du quartier.</footer>', css: 'body { max-width: 650px; margin: 2rem auto; padding: 0 1rem; font: 1rem/1.6 system-ui; color: #344; }\nheader, footer { color: #176b45; }\narticle { padding: 1rem; background: #f3f7f1; border-radius: 10px; }', javascript: '' }, expectedResult: 'La page est organisée en en-tête, contenu principal, article et pied de page.' },
    exercises: [
      { id: 'html-heading-qcm', type: 'multiple-choice', level: 'Facile', prompt: 'Quel élément représente le contenu principal unique d’une page ?', options: [{ id: 'main', label: '<main>' }, { id: 'aside', label: '<aside>' }, { id: 'span', label: '<span>' }], correctOptionId: 'main', explanation: '<main> identifie le contenu central du document.' },
      { id: 'html-nav', type: 'short-answer', level: 'Facile', prompt: 'Quel élément sémantique sert à regrouper les principaux liens de navigation ?', acceptedAnswers: ['nav'], hint: 'Son nom ressemble au mot « navigation ».', explanation: '<nav> marque une zone importante de navigation.' },
      { id: 'html-heading-code', type: 'code', level: 'Défi', prompt: 'Écris un titre de niveau 1 « Mon portfolio ».', requiredSnippets: ['<h1', 'Mon portfolio', '</h1>'], hint: 'Le titre le plus important se situe entre h1 et /h1.', explanation: '<h1>Mon portfolio</h1> crée un titre principal.' }
    ], summary: ['Une hiérarchie cohérente rend le contenu facile à parcourir.', 'Choisis les éléments pour leur sens.', 'L’apparence visuelle se règle ensuite avec CSS.']
  }
];

export function getHtmlLesson(slug) {
  return htmlLessons.find((lesson) => lesson.slug === slug);
}
