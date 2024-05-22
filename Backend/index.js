import express from "express";
const app = express();
const port = 3000;

app.get("/",(req, res) => {
    res.send("<h1>Hello</h1>");
})

// Parameter1: Port Number; Parameter2: Call Back Function
app.listen(port, () => {
    console.log(`Sever running on port ${port}`)
});

