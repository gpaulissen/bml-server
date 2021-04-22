'use strict';

const Hapi = require("@hapi/hapi");
const fs = require("fs");

const server = new Hapi.Server();

// Constants
const PORT = 8080;
const HOST = 'localhost';

const init = async () => {

    const server = Hapi.server({
        port: PORT,
        host: HOST
    });

		server.route({
				method: "GET",
				path: "/",
				config: {
						payload: {
								output: "stream",
								parse: true,
								allow: "multipart/form-data",
								maxBytes: 2 * 1000 * 1000
						}
				},
				handler: (request, response) => {
						var result = [];
						for(var i = 0; i < request.payload["file"].length; i++) {
								result.push(request.payload["file"][i].hapi);
								request.payload["file"][i].pipe(fs.createWriteStream(__dirname + "/uploads/" + request.payload["file"][i].hapi.filename))
						}
						response(result);
				}
		});

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();

