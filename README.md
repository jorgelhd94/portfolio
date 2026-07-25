# Portfolio

Portafolio personal de Jorge Luis Hernández Dueñas.

Stack: [Astro](https://astro.build) · [React](https://react.dev) · [Tailwind CSS](https://tailwindcss.com)

## Comandos

Todos se ejecutan desde la raíz del proyecto:

| Comando        | Acción                                            |
| :------------- | :------------------------------------------------ |
| `pnpm install` | Instala las dependencias                           |
| `pnpm dev`     | Levanta el servidor de desarrollo en `localhost:4321` |
| `pnpm build`   | Compila el sitio de producción en `./dist/`        |
| `pnpm preview` | Previsualiza el build localmente                   |
| `pnpm astro`   | Ejecuta comandos del CLI de Astro                  |

## Estructura

```text
public/            # Assets estáticos servidos tal cual
src/
├── components/    # Componentes .astro y .tsx (React)
├── layouts/       # Layouts base
├── pages/         # Rutas basadas en archivos
└── styles/        # global.css (entrada de Tailwind)
```
