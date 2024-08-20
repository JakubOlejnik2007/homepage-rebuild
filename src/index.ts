import express from "express";
import config from "./config";
import cors from "cors";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

console.log(path.join(__dirname, "public"))

app.get("/get-posts", (req, res) => {
    res.send([
        {
            title: "Post 1",
            content: "Lorem Ipsum",
        }
    ])
})

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('homepagedata.db');

db.serialize(() => {

    const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (let i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", (_err: any, row: { id: string; info: string; }) => {
        console.log(row.id + ": " + row.info);
    });
});

db.close();

app.listen(config.port, () =>
    console.log(`[⚡] Server is listening on port: ${config.port}!`)
)