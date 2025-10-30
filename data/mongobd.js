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

// Modelo Menu
const menuSchema = new mongoose.Schema({
    type: { 
        type: String,
        required: true 
    },
    name: { 
        type: String,
        required: true 
    },
    description: { 
        type: String,
        required: true 
    },
    price: { 
        type: Number,
        required: true 
    },
    imageUrl: String,
    deletedAt: { 
        type: String,
        default: null  
    }
},
{
    timestamps: true,
    strict: false,
    versionKey: false
});

const eventSchema = new mongoose.Schema({
    title: 
    {
        type: String, 
        required: true 

    },
    description: 
    {
        type: String, 
        required: true 

    },
    date: 
    {
        type: String, 
        required: true 

    },
    time: 
    {
        type: String, 
        required: true 

    },
    deletedAt: {
        type: Date,
        default: null
    },
    img: 
    {
        type: String, 
        required: true 

    }
}, {
    timestamps: true,
    strict: false,
    versionKey: false
});

// Modelo Pedido
const orderSchema = new mongoose.Schema({
    userId: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [
        {
            menuId: 
            { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Menu', required: true 
            },
            quantity: 
            { 
                type: Number, 
                required: true 
            }
        }
    ],
    totalPrice: 
    {   
        type: Number, 
        required: true 
    },
    orderStatus: 
    {
        type: String, 
        default: 'pending' 
    }
}, {
    timestamps: true,
    strict: false,
    versionKey: false
});


// Exportar el modelos
export const Order = mongoose.model('Order', orderSchema);
export const Event = mongoose.model('Event', eventSchema);
export const User = mongoose.model('User', userSchema);
export const Menu = mongoose.model('Menu', menuSchema);
export default connectDB;
