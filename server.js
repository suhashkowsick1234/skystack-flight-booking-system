const app = require("./app");
const port = process.env.port || 8081;

app.listen(port, () => console.log(`App is listening on port ${port}!`));
