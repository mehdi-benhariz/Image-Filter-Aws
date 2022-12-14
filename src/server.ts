import { filterImageFromURL, deleteLocalFiles } from "./util/util";
import express from "express";

(async () => {
  // Init the Express application
  const app = express();
  require("dotenv").config();
  // Set the network port
  const port = process.env.PORT || 8082;
  require("./startup/security")(app);
  require("./startup/db")();

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  app.get("/filteredimage", async (req, res) => {
    try {
      const { image_url } = req.query as { image_url: string };

      if (!image_url) return res.status(400).send("Image url is required");
      const isValideUrl = image_url.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      );
      if (isValideUrl == null)
        return res.status(400).send("Inavlid url! Try again with valid url");
      const filteredpath = await filterImageFromURL(image_url);
      //check if the filter was successful
      if (filteredpath === undefined || filteredpath === null)
        return res.status(400).send(`Error while filtering the image`);
      res.sendFile(filteredpath, () => {
        deleteLocalFiles([filteredpath]);
      });
    } catch (error) {
      logger.error(error);
    }
  });
  const { IndexRouter } = require("./controllers/v0/index.router");
  app.use("/", IndexRouter);

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
