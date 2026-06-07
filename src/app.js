const express = require("express");

const app = express();

const PORT = 3000;

app.use("/test", (req, res) => {
  res.send("hello from test");
});

app.use((req, res) => {
  res.send("hello for all other routes");
});

app.listen(PORT, () => {
  console.log(`Server is successfully listening on port ${PORT}`);
});
