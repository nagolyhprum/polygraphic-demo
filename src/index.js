const express = require("express");

const app = express();

app.use("/todo", express.static("dist/todo"));

const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log("listening on port", port);
});