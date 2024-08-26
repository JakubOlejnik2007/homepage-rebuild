import express from "express";
import config from "./config";
import cors from "cors";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const staticPath = path.join(__dirname, "public");

app.use(express.static(staticPath));

app.get("/get-posts", (req, res) => {
    res.send([
        {
            title: "Post 1",
            content: "Lorem Ipsum",
        }
    ])
})

const sqlite3 = require('sqlite3').verbose();

app.get("/api/getProjects", (req, res) => {
    const db = new sqlite3.Database('homepagedata.db');
    db.all("SELECT * FROM Projects;", (err: any, rows: any) => {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }
        const page = Number(req.query.page)
        const rowsToSend = []
        for (let i = page * 4; i < rows.length && i < (page + 1) * 4; i++) {
            rowsToSend.push(rows[i]);
        }
        res.send(rowsToSend);
    });
    db.close();
})

app.get("/projekty/:projectTitle", (req, res) => {
    console.log(req.params.projectTitle)
    res.sendFile(`${staticPath}/projekt.html`)
})

app.get("/cms", (req, res) => {
    res.sendFile(`${staticPath}/cms.html`)
})


app.get("/api/getProjectsCount", (req, res) => {
    const db = new sqlite3.Database('homepagedata.db');
    db.all("SELECT COUNT(*) as count FROM Projects;", (err: any, row: any) => {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }
        res.send(row[0]);
    });
    db.close();

})

app.listen(config.port, () =>
    console.log(`[⚡] Server is listening on port: ${config.port}!`)
)