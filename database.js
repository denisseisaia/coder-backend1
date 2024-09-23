import mongoose from "mongoose";

const db = "MongoDB";

mongoose.connect("mongodb+srv://denisseisaia:coderhouse@backend1.1bx6h.mongodb.net/?retryWrites=true&w=majority&appName=Backend1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log(`Successful connection - ${db}`))
.catch((error) => console.log(`Error connecting - ${db}`, error));