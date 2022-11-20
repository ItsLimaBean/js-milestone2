const http = require("http");
const { load } = require("./database.js");
const handler = require("./handler.js");


const PORT = process.env.PORT || 3000;

load().then(() => {
  http
  .createServer(handler)
  .listen(PORT, () => console.log(`server is running at  ${PORT}`));
}).catch((err) => {
  console.log(err);
})
