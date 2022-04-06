import express from "express";
import { Database } from "./database";

let server: any;

async function initialize() {
    const mainApp = express();


    Database.createDB().then(async (db) => {
        const {app} = await db.server({
            startServer: false,
            cors: true,
        });

        mainApp.use("/chatdb", app);

        db.chats.$.subscribe(data => {
            console.log('server is speaking: ', data);
        })

    }).catch(() => console.log('error'));


    mainApp.use("/import", (req, res) => {

        res.send("importing...")
    });


    server = mainApp.listen(5002, () => console.log(`Server listening on port 5002`));
}

initialize();
