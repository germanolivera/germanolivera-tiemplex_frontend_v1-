Proyecto Frontend — tiemplex_v1 (ReactJS)

1. Descripción general
Aplicación frontend desarrollada en ReactJS con Vite, destinada al personal de la peluquería para la gestión de turnos. Esta interfaz permite a los empleados visualizar, crear, modificar o eliminar turnos de clientes, interactuando con el backend a través de una API REST.

2. Estructura de carpetas principal
tiemplex_v1/
├── public/                 # Archivos estáticos (favicon, imágenes públicas, etc.)
├── src/                   # Código fuente
│   ├── assets/            # Imágenes, fuentes u otros recursos
│   ├── components/        # Componentes React reutilizables
│   ├── App.jsx            # Componente principal de la aplicación
│   ├── App.css            # Estilos del componente principal
│   ├── main.jsx           # Punto de entrada de la app
│   └── index.css          # Estilos generales de la app
├── index.html             # HTML base que carga el bundle generado
├── vite.config.js         # Configuración de Vite
├── eslint.config.js       # Configuración de ESLint
├── .gitignore             # Archivos/Carpetas ignorados por Git
├── README.md              # Documentación del proyecto
├── README2.md             # Documentación adicional (opcional)
├── package.json           # Configuración del proyecto y dependencias
├── package-lock.json      # Control de versiones exactas de dependencias

3. Scripts útiles
npm run dev       # Inicia el servidor de desarrollo con Vite
npm run build     # Compila el proyecto para producción
npm run preview   # Visualiza el build de producción localmente
npm run lint      # Ejecuta ESLint para verificar el código

4. Dependencias principales
	•	React 19.1
	•	Vite 7
	•	ESLint + plugins para React y hooks
	•	Tipado opcional con @types/react y @types/react-dom

5. La interacción se realiza mediante fetch a endpoint RESTful.