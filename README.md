# OpenFoodFilter

OpenFoodFilter es una herramienta diseñada para exportar y filtrar datos de alimentos desde la base de datos de Open Food Facts. Esta herramienta permite migrar información relevante a una base de datos destino con un formato estructurado y optimizado.

## Características
- Migración eficiente de datos desde una base de datos MongoDB de origen a una de destino.
- Filtrado de campos relevantes para optimizar el almacenamiento y la consulta de información.
- Procesamiento por lotes para mejorar el rendimiento en grandes volúmenes de datos.

## Instalación
### Requisitos previos
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Configuración del proyecto
1. Clonar el repositorio:
   ```sh
   git clone https://github.com/tu-usuario/OpenFoodFilter.git
   cd OpenFoodFilter
   ```
2. Instalar dependencias:
   ```sh
   npm install
   ```
3. Crear un archivo `.env` basado en `.env.example` y configurar las credenciales de las bases de datos:
   ```sh
   cp .env.example .env
   ```
   Editar `.env` con las URI correctas de MongoDB:
   ```env
   MONGO_URI_ORIGIN=mongodb://localhost:27017/origin_database
   MONGO_URI_DEST=mongodb://localhost:27017/destination_database
   ```

## Uso
### Migración de datos
Para iniciar el proceso de migración, ejecutar el siguiente comando:
```sh
node migrateData.js
```
El script procesará los datos en lotes de 10,000 registros para mejorar la eficiencia.

### Estructura de datos migrados
Cada documento migrado tendrá la siguiente estructura:
```json
{
  "_id": "string",
  "allergens_tags": ["string"],
  "product_name": "string",
  "nutriments": {
    "energy_100g": "number",
    "fat_100g": "number",
    "carbohydrates_100g": "number",
    "proteins_100g": "number",
    "sugars_100g": "number"
  }
}
```

## Dependencias
Las dependencias utilizadas en el proyecto están listadas en `package.json`:
```json
{
  "dependencies": {
    "dotenv": "^16.4.7",
    "mongoose": "^8.9.5"
  }
}
```
Elaborado por David Guillén
