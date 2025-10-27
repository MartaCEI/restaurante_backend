import mongoose from 'mongoose'
import { mongodbUri } from '../config/config.js'

// Crear una conexion con un try catch. 
const connectDB = async () => {
    try {
        await mongoose.connect(mongodbUri);
        console.log("Conectado a la base de datos de MongoDB");
    } catch (error) {
        console.log("Error conectando a MongoDB", error.message);
        process.exit(1);
    }
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    cp: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    deletedAt: {
        type: String,
        default: null
    }
},
{
    timestamps: true,   // createdAt, updatedAt
    strict: false,      // Permite guardar campos no definidos en el esquema
    versionKey: false   // Desactiva el campo __v
});

// Exportar el modelo
export const User = mongoose.model('User', userSchema);
export default connectDB;
