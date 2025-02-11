require("dotenv").config();
const mongoose = require("mongoose");

// Conectar a la base de datos origen
const originConnection = mongoose.createConnection(process.env.MONGO_URI_ORIGIN);

// Conectar a la base de datos destino
const destinationConnection = mongoose.createConnection(process.env.MONGO_URI_DEST);

// Modelo para la colección de origen
const originSchema = new mongoose.Schema({}, { strict: false });
const OriginModel = originConnection.model("OriginFood", originSchema, "mycollection");

// Modelo para la colección de destino
const destinationSchema = new mongoose.Schema({
  _id: String,
  allergens_tags: [String],
  product_name: String,
  nutriments: {
    energy_100g: Number,
    fat_100g: Number,
    carbohydrates_100g: Number,
    proteins_100g: Number,
    sugars_100g: Number,
  },
});
const DestinationModel = destinationConnection.model("DestinationFood", destinationSchema, "foods");

const BATCH_SIZE = 10000; // Tamaño del lote

(async () => {
  try {
    console.log("Conectando a las bases de datos...");

    // Esperar conexiones
    await Promise.all([originConnection, destinationConnection]);

    console.log("Obteniendo conteo total de registros...");
    const totalRecords = await OriginModel.countDocuments();
    console.log(`Total de registros a procesar: ${totalRecords}`);

    let processedRecords = 0;

    for (let i = 0; i < totalRecords; i += BATCH_SIZE) {
      console.log(`Procesando registros ${i + 1} a ${Math.min(i + BATCH_SIZE, totalRecords)}...`);

      // Obtener lote de registros
      const records = await OriginModel.find()
        .skip(i)
        .limit(BATCH_SIZE);

      // Filtrar los campos necesarios
      const filteredRecords = records.map((record) => ({
        _id: record._id,
        allergens_tags: record.allergens_tags,
        product_name: record.product_name,
        nutriments: {
          energy_100g: record.nutriments?.energy_100g,
          fat_100g: record.nutriments?.fat_100g,
          carbohydrates_100g: record.nutriments?.carbohydrates_100g,
          proteins_100g: record.nutriments?.proteins_100g,
          sugars_100g: record.nutriments?.sugars_100g,
        },
      }));

      // Insertar lote en la base de datos destino
      await DestinationModel.insertMany(filteredRecords);

      // Actualizar progreso
      processedRecords += records.length;
      console.log(`Lote procesado. Progreso: ${processedRecords}/${totalRecords} (${((processedRecords / totalRecords) * 100).toFixed(2)}%)`);
    }

    console.log("Migración completada exitosamente.");
    process.exit(0);
  } catch (error) {
    console.error("Error durante la migración:", error);
    process.exit(1);
  }
})();
