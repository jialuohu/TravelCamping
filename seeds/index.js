
const mongoose = require('mongoose');;
const CampGround = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log('Mongoose Connected');
    })
    .catch((err) => {
        console.log('Error!', err);
    })


const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await CampGround.deleteMany({});

    // only for testing
    // const c = new CampGround({title: 'purple field'});
    // await c.save();

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20) + 10;
        const camp = new CampGround({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://source.unsplash.com/random/600x400?camping,adventure`,
            description: 'Lorem kasdfjksadjfkasdjf kasdfjkasd kasdf ksad ksdf ksaskjdfjkasdfj asdkf ',
            price
        });
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})