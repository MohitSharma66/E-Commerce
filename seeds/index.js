const mongoose = require('mongoose');
const Product = require('../models/Product'); // Changed to Product model
const Review = require('../models/review');
const { places, descriptors } = require('./seedHelpers.js');
const cities = require('./cities.js');

mongoose.connect('mongodb://localhost:27017/e-commerce');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Product.deleteMany({}); // Changed from Campground to Product
    await Review.deleteMany({}); // Remove reviews from profile after re-seeding
    
    for (let i = 0; i < 175; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const product = new Product({
            author: '66a7f97c7da2687ccd9a28cf', // Example user ID
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price,
            images: [
                {
                    url: `https://res.cloudinary.com/dbgnfh8ef/image/upload/v1726318476/YelpCamp/t69vvzco3rhs4zcj6cbt.png`,
                    filename: 'YelpCamp/pvstfhrqmgdrgvpme2os'
                },
                {
                    url: `https://res.cloudinary.com/dbgnfh8ef/image/upload/v1726318476/YelpCamp/t69vvzco3rhs4zcj6cbt.png`,
                    filename: 'YelpCamp/hvfaqemoq7b2rr91ec7s'
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, voluptatem quo adipisci earum quis cupiditate voluptates. Neque, natus aspernatur. Corporis nulla iure quibusdam nostrum hic rerum animi possimus debitis reiciendis.',
        });
        await product.save(); // Changed from camp.save() to product.save()
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
