export type Locale = 'en' | 'es';
export const getLocale = (locale: string | undefined): Locale => locale === 'es' ? 'es' : 'en';

const en = {
	home: 'Home', projects: 'Projects', stack: 'Stack', about: 'About Me', mail: 'Mail',
	welcome: 'Welcome', openMenu: 'Open menu', closeMenu: 'Close menu', quickMenu: 'Quick menu',
	menu: 'Menu', language: 'Language', site: 'Site', pages: 'Pages', connect: 'Connect',
	role: 'Software Engineer', roleFirst: 'Software', roleSecond: 'Engineer',
	viewProjects: 'View projects', scrollNext: 'Scroll to what comes next', scroll: 'Scroll',
	learnFirst: 'Never Stop', learnSecond: 'Learning', moreThan: 'More than', years: 'years building solutions',
	testing: 'Testing', deploy: 'Deploy', infrastructure: 'Infrastructure', ai: 'AI',
	projectsTitle: 'Built, shipped, running.', projectsLead: 'A few projects across product, tooling and infrastructure.',
	stackTitle: 'What I build with.', education: 'Education', languages: 'Languages', downloadCV: 'Download CV',
	details: 'Details', allProjects: 'All projects', challenges: 'Challenges', builtWith: 'Built with',
	moreWork: 'More work', previous: 'Previous', next: 'Next', visitSite: 'Visit site', viewGithub: 'View on GitHub',
	interface: 'interface', ownedPrefix: 'This project belongs to',
	ownedSuffix: 'The live site is theirs to change or retire, so this link may stop working.',
	portfolio: 'Portfolio', notFound: 'This page does not exist.',
	notFoundHint: 'It may have been renamed, or the link may have been wrong to begin with.',
	backPortfolio: 'Back to the portfolio',
	description: 'Backend systems for fintech, e-commerce and enterprise clients. Explore my projects, technical challenges and experience.',
};
const es: typeof en = {
	home: 'Inicio', projects: 'Proyectos', stack: 'Tecnologías', about: 'Sobre mí', mail: 'Correo',
	welcome: 'Bienvenido', openMenu: 'Abrir menú', closeMenu: 'Cerrar menú', quickMenu: 'Menú rápido',
	menu: 'Menú', language: 'Idioma', site: 'Sitio', pages: 'Secciones', connect: 'Contacto',
	role: 'Ingeniero de software', roleFirst: 'Ingeniero', roleSecond: 'de software',
	viewProjects: 'Ver proyectos', scrollNext: 'Ir a la siguiente sección', scroll: 'Explorar',
	learnFirst: 'Nunca dejes', learnSecond: 'de aprender', moreThan: 'Más de', years: 'años creando soluciones',
	testing: 'Pruebas', deploy: 'Despliegue', infrastructure: 'Infraestructura', ai: 'IA',
	projectsTitle: 'Ideas hechas realidad.', projectsLead: 'Una selección de proyectos de producto, herramientas e infraestructura.',
	stackTitle: 'Las tecnologías que uso.', education: 'Formación', languages: 'Idiomas', downloadCV: 'Descargar CV',
	details: 'Detalles', allProjects: 'Todos los proyectos', challenges: 'Desafíos', builtWith: 'Tecnologías utilizadas',
	moreWork: 'Más proyectos', previous: 'Anterior', next: 'Siguiente', visitSite: 'Visitar sitio', viewGithub: 'Ver en GitHub',
	interface: 'interfaz', ownedPrefix: 'Este proyecto pertenece a',
	ownedSuffix: 'Sus propietarios pueden modificar o retirar el sitio, por lo que este enlace podría dejar de funcionar.',
	portfolio: 'Portfolio', notFound: 'Esta página no existe.',
	notFoundHint: 'Puede que haya cambiado de nombre o que el enlace sea incorrecto.',
	backPortfolio: 'Volver al portfolio',
	description: 'Sistemas backend para fintech, comercio electrónico y empresas. Conoce mis proyectos, desafíos técnicos y experiencia.',
};
export const ui = { en, es };
