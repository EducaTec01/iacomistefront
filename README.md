# IAComiste - Aplicación de Recetas con Escaneo de Ingredientes

## Descripción
IAComiste es una aplicación móvil desarrollada con React Native y Expo que permite a los usuarios escanear ingredientes y obtener sugerencias de recetas basadas en los ingredientes disponibles. La aplicación está diseñada para hacer más fácil la planificación de comidas y la preparación de recetas.

## Características Principales

### 1. Escaneo de Ingredientes
- Captura de fotos de ingredientes usando la cámara del dispositivo
- Opción para subir imágenes desde la galería
- Identificación automática de ingredientes en las imágenes
- Capacidad para eliminar o modificar ingredientes identificados

### 2. Sistema de Recetas
- Búsqueda de recetas por nombre, ingredientes o etiquetas
- Filtrado de recetas por categorías (Vegetariano, Rápido, Saludable, Desayuno)
- Recomendaciones personalizadas basadas en ingredientes escaneados
- Visualización detallada de recetas con ingredientes y pasos

### 3. Perfil de Usuario
- Gestión de preferencias alimentarias
- Historial de recetas favoritas
- Restricciones dietéticas personalizables

## Estructura del Proyecto

```
├── app/                    # Directorio principal de la aplicación
│   ├── (auth)/            # Pantallas de autenticación
│   ├── (tabs)/            # Pantallas principales (tabs)
│   │   ├── index.tsx      # Pantalla de inicio
│   │   ├── scan.tsx       # Pantalla de escaneo
│   │   ├── recipes.tsx    # Pantalla de recetas
│   │   └── profile.tsx    # Pantalla de perfil
│   └── recipe/            # Pantallas relacionadas con recetas
├── components/            # Componentes reutilizables
├── constants/            # Constantes y configuración
├── context/             # Contexto de la aplicación
├── hooks/               # Hooks personalizados
├── types/               # Definiciones de tipos TypeScript
└── assets/             # Recursos estáticos
```

## Tecnologías Utilizadas

- **React Native**: Framework principal para desarrollo móvil
- **Expo**: Plataforma para desarrollo y despliegue
- **TypeScript**: Lenguaje de programación tipado
- **Expo Router**: Sistema de navegación
- **Expo Camera**: Integración con la cámara del dispositivo
- **React Context**: Gestión del estado global
- **Lucide Icons**: Biblioteca de iconos

## Componentes Principales

### 1. ScanScreen
- Manejo de permisos de cámara
- Captura de fotos y selección de imágenes
- Procesamiento de imágenes para identificación de ingredientes
- Interfaz de usuario intuitiva para gestión de ingredientes

### 2. RecipesScreen
- Sistema de búsqueda y filtrado de recetas
- Visualización de recetas recomendadas
- Gestión de categorías y etiquetas
- Interfaz de usuario optimizada para móviles

### 3. Componentes Reutilizables
- `Button`: Componente de botón personalizado
- `RecipeCard`: Tarjeta de visualización de recetas
- `RecipeList`: Lista de recetas con funcionalidades de filtrado
- `PreferenceSelector`: Selector de preferencias alimentarias
- `CustomRestrictionInput`: Input personalizado para restricciones dietéticas

## Instalación y Configuración

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el proyecto:
```bash
npm run dev
```

## Requisitos del Sistema

- Node.js (versión recomendada: 18.x o superior)
- npm o yarn
- Expo CLI
- Dispositivo móvil con cámara o emulador

## Dependencias Principales

```json
{
  "expo": "52.0.33",
  "react": "18.3.1",
  "react-native": "0.76.6",
  "expo-camera": "^16.0.18",
  "expo-image-picker": "^15.0.5",
  "expo-router": "4.0.17",
  "react-native-gesture-handler": "^2.23.0",
  "react-native-reanimated": "^3.16.7"
}
```

## Contribución

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

[Información de contacto del equipo de desarrollo] 