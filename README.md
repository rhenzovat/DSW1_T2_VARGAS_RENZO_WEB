# Biblioteca App - Gestión de Libros y Préstamos

Esta es una aplicación web sencilla para la gestión de una biblioteca, permitiendo administrar un catálogo de libros y registrar préstamos a estudiantes.

## Características Principales

-   **Gestión de Libros:** Crear, editar, eliminar y ver el listado de libros.
-   **Control de Stock:** Visualizar el stock disponible para cada libro.
-   **Gestión de Préstamos:** Registrar nuevos préstamos y marcar libros como devueltos.
-   **Interfaz Moderna:** Interfaz de usuario limpia y responsiva construida con Bootstrap.

## Tecnologías Utilizadas

-   **Frontend:** [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
-   **Bundler:** [Vite](https://vitejs.dev/)
-   **Estilos:** [Bootstrap 5](https://getbootstrap.com/)
-   **Routing:** [React Router](https://reactrouter.com/)
-   **Cliente HTTP:** [Axios](https://axios-http.com/)

## Páginas de la Aplicación

-   **/ (Libros):** Página principal que muestra el catálogo de libros. Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los libros.
-   **/loans (Préstamos):** Página para gestionar los préstamos. Muestra los préstamos activos y permite registrar nuevos préstamos o devoluciones.

## Cómo empezar

### Prerrequisitos

-   [Node.js](https://nodejs.org/) (versión 16 o superior)
-   El backend de la API debe estar en ejecución. (Repositorio de ejemplo: [DSW1_T2_MAYTAPRINQUE_GABRIELA_API](https://github.com/gabrielamapri/DSW1_T2_MAYTAPRINQUE_GABRIELA_API))

### Pasos de Instalación y Ejecución

1.  **Clonar el repositorio (si aplica):**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_DIRECTORIO>
    ```

2.  **Instalar dependencias:**
    Abre una terminal en la raíz del proyecto y ejecuta:
    ```bash
    npm install
    ```

3.  **Configurar la URL de la API (Opcional):**
    Por defecto, la aplicación intentará conectarse a la API en `http://localhost:5185`. Si tu API se está ejecutando en una dirección o puerto diferente:
    -   Crea una copia del archivo `.env.example` y renómbrala a `.env`.
    -   Modifica la variable `VITE_API_URL` en el archivo `.env` con la dirección correcta de tu backend.

4.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173` (o un puerto alternativo si el 5173 está en uso).

---
*Este README ha sido actualizado para reflejar el uso de Bootstrap y para mejorar la claridad de las instrucciones.*