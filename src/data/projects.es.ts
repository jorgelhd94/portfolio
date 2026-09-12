import type { Project } from './projects';

type ProjectTranslation = Pick<Project, 'kind' | 'blurb' | 'challenges' | 'ownedBy'>;
export const spanishProjects: Record<string, ProjectTranslation> = {
	raliopay: {
		kind: 'Fintech · Banca como servicio',
		blurb: 'Plataforma de banca como servicio con cuentas bancarias y operaciones con criptomonedas. Desarrollo los microservicios en Go que coordinan sus pagos, con procesamiento asíncrono, tolerancia a fallos e idempotencia.',
		ownedBy: 'Ralio',
		challenges: [
			'Mantener el núcleo de la plataforma disponible y resistente a fallos.',
			'Coordinar pagos entre cuentas bancarias y redes de criptomonedas.',
			'Integrar servicios de cumplimiento normativo KYC/KYB y SEON.',
			'Procesar pagos asíncronos de forma fiable, con operaciones idempotentes que eviten efectos duplicados en los reintentos.',
		],
	},
	cubaofertas: {
		kind: 'Comparador de precios · IA',
		blurb: 'Comparador de precios para el mercado cubano: recolectores en Python unifican los datos de productos de distintas tiendas y un asistente de IA convierte un presupuesto en una lista de compra.',
		ownedBy: 'la empresa para la que lo desarrollé',
		challenges: [
			'Recolectar diariamente los datos de productos de todas las tiendas integradas y mantener el servicio con alta disponibilidad.',
			'Clasificar los productos y adaptar los datos de distintas tiendas a un formato único.',
			'Optimizar la búsqueda para encontrar productos rápidamente en la web.',
			'Entrenar un modelo de aprendizaje automático para clasificar productos de forma automática.',
			'Crear una canasta ajustada al presupuesto del usuario con los productos más baratos de las distintas tiendas.',
		],
	},
	asynqa: {
		kind: 'Herramienta de desarrollo · Código abierto',
		blurb: 'Cliente de escritorio para colas de tareas asynq en Redis: permite explorar colas, inspeccionar datos y reintentos, lanzar tareas desde un editor JSON y supervisar workers en tiempo real.',
		challenges: [
			'Facilitar la depuración de colas asynq en microservicios de Go sin un frontend de aplicación.',
			'Inspeccionar tareas asíncronas y periódicas para entender sus datos, estado de ejecución y reintentos.',
			'Lanzar tareas directamente con datos de prueba para reproducir problemas y probar distintos escenarios.',
		],
	},
	tiendi: {
		kind: 'Comercio electrónico',
		blurb: 'Tienda catálogo de artículos para el hogar con un panel de administración de comercio electrónico, sin integración de pagos. Next.js en el frontend y Supabase en el backend.',
		challenges: [
			'Crear un panel de administración de comercio electrónico para gestionar el catálogo de la tienda.',
			'Desarrollar una tienda catálogo para los clientes sin integración de pagos.',
		],
	},
	'claude-usage-widget': {
		kind: 'Aplicación de escritorio · Código abierto',
		blurb: 'Aplicación para la bandeja de Windows que muestra el consumo de Claude Code: límites y cuentas regresivas en tiempo real, con un icono que cambia de color al acercarse al límite.',
		challenges: ['Ofrecer una forma sencilla de consultar el consumo de la suscripción de Claude Code desde un widget de escritorio.'],
	},
};
