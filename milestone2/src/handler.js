const { parse } = require("url");
const { DEFAULT_HEADER } = require("./util/util.js");
const controller = require("./controller");
const { createReadStream } = require("fs");
const path = require("path");
const { pipeline } = require("stream");

const photos = path.join(__dirname, "photos");

const allRoutes = {
    // GET: localhost:3000/form
    "/form:get": (request, response) => {
        controller.getFormPage(request, response);
    },
    // POST: localhost:3000/form
    "/form:post": (request, response) => {
        controller.sendFormData(request, response);
    },
    // POST: localhost:3000/images
    "/images:post": (request, response) => {
        controller.uploadImages(request, response);
    },
    // GET: localhost:3000/feed
    // Shows instagram profile for a given user
    "/feed:get": (request, response) => {
        controller.getFeed(request, response);
    },
    "/:get": (request, response) => {
        controller.getMainPage(request, response);
    },

    // 404 routes
    default: (request, response) => {
        response.writeHead(404, DEFAULT_HEADER);
        createReadStream(path.join(__dirname, "views", "404.html"), "utf8").pipe(
            response
        );
    },
};

const handleImage = (response, photosPath) => {
    if (photosPath[2] && photosPath[3]) {
        pipeline(
            createReadStream(path.join(photos, photosPath[2], photosPath[3])),
            response,
            (err) => {
                if (err) {
                    console.log(err);
                }
            }
        );
    }
}

function handler(request, response) {
    const { url, method } = request;

    const { pathname } = parse(url, true);
    const splitPath = pathname.split("/");

    if (splitPath[1] === "photos") {
        handleImage(response, splitPath);
        return Promise.resolve();
    }

    const key = `${pathname}:${method.toLowerCase()}`;
    const chosen = allRoutes[key] || allRoutes.default;

    return Promise.resolve(chosen(request, response)).catch(
        handlerError(response)
    );
}

function handlerError(response) {
    return (error) => {
        console.log("Something bad has  happened**", error.stack);
        response.writeHead(500, DEFAULT_HEADER);
        response.write(
            JSON.stringify({
                error: "internet server error!!",
            })
        );

        return response.end();
    };
}

module.exports = handler;
