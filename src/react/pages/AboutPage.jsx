import SeoHead from '../components/SeoHead.jsx';
import { sitePath } from '../../lib/site-path.js';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <>
      <SeoHead
        title="À propos de CodeCraft — Apprendre le développement web"
        description="Découvre le projet CodeCraft, ses parcours HTML, CSS et JavaScript, et le fonctionnement local de la progression."
        path="/a-propos"
      />
      <header className="page-heading">
        <span className="eyebrow">LE PROJET</span>
        <h1>Apprendre le Web, en comprenant ce qu’on fait.</h1>
        <p>CodeCraft est un espace d’apprentissage francophone consacré aux technologies du navigateur.</p>
      </header>
      <article className="about-card">
        <h2>Un outil pour pratiquer</h2>
        <p>Les parcours relient une explication à un exemple modifiable. L’objectif est de comprendre progressivement comment le HTML structure une page, comment le CSS la met en forme et comment JavaScript ajoute des interactions.</p>
        <h2>Une plateforme en construction</h2>
        <p>Les leçons et exercices interactifs existants restent accessibles. Les références renvoient à MDN Web Docs; les API HTML, CSS, JavaScript et navigateur seront organisées séparément dans les prochaines étapes.</p>
        <h2>Données et progression</h2>
        <p>Il n’y a pas de compte utilisateur ni de serveur de progression. Les leçons terminées sont conservées dans le stockage local du navigateur sur cet appareil.</p>
        <a href={sitePath('/cours')}>Découvrir les parcours <span aria-hidden="true">→</span></a>
      </article>
    </>
  );
}
