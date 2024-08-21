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
    //db.run("DROP TABLE Projects");
    //db.run("CREATE TABLE Projects (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, teaser TEXT NOT NULL, content TEXT NOT NULL, icon TEXT NOT NULL, date INTEGER NOT NULL);");

    //db.run(`INSERT INTO Projects VALUES (0, "Testowy wpis", "Lorem ipsum sit dolor amit", "<h2> test </h2> <br><br> test2", "https://tenco.waw.pl/img/978454.jpg", 1724191576127);`);

    db.each("SELECT * FROM Projects;", (err: any, row: any) => {
        console.log(`${row.id}: ${row.title} ${row.content}`);
    });
});

db.close();

app.listen(config.port, () =>
    console.log(`[⚡] Server is listening on port: ${config.port}!`)
)