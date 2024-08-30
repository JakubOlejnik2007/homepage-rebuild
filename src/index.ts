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

app.get("/projekty/:projectTitle/", async (req, res) => {
    try {
        const project = await getProject(req.params.projectTitle) as {
            id: number;
            icon: string;
            date: number;
            title: string;
            content: any;
            teaser: string;
            urlTitle: string;
        };
        project.content = JSON.parse(project.content)
        res.send(`
            <!DOCTYPE html>
    <html lang="pl">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="${project.teaser}">
        <title>${project.title}</title>
        <link rel="stylesheet" href="/main.css">
    
        <meta property="og:title" content="${project.title}">
        <meta property="og:description" content="${project.teaser}">
        <meta property="og:image" content="${project.icon}">
        <meta property="og:url" content='https://tenco.waw.p/projekty/${project.urlTitle}'>
        <meta property="og:type" content="website">
    
        <meta property="og:site_name" content="Jakub Olejnik">
        <meta property="og:locale" content="pl_PL">
        <script>
            
        </script>
    
    </head>
    
    <body class="bg-my_black">
    
    <header
            class="m-2 px-2 text-center text-xs md:text-xl md:m-5 shadow-[0_2px_10px_0px_rgba(0,0,0,0.5)] flex justify-between items-center text-nav_font rounded-2xl">
            <h1 class="overflow-hidden invisible text-[0px]">Jakub Olejnik - strona o mnie
            </h1>
            <div class="flex self-stretch">
                <nav class="flex gap-8 m-3 self-stretch items-center">
                    <a href="/">O mnie</a>
                </nav>
                <div class="w-[5px] self-stretch bg-gradient-to-r from-[#222] to-[#171717] hidden sm:flex
                ">
                </div>
            </div>
    
            <div class="ml-auto flex">
                <div class="w-[5px] self-stretch bg-gradient-to-r from-[#222] to-[#171717] hidden sm:flex"></div>
                <div class="flex gap-6 items-center m-3">
                    <a href="https://www.youtube.com/@tenco2137" target="_blank"><img src="/img/youtube.svg" class="w-8"
                            alt="YouTube"></a>
                    <a href="https://github.com/JakubOlejnik2007" target="_blank"><img src="/img/github.svg" class="h-7"
                            alt="GitHub"></a>
                </div>
            </div>
        </header>
        <img src="${project.icon}" alt="Miniaturka wpisu"
                        class="h-[10rem] mx-auto mt-16">
        <main></main>
        <footer class="relative border-b-2 border-border">
            <p class="text-center text-my_orange m-5">
                &copy; 2024 Jakub Olejnik
            </p>
        </footer>
    </body>
    <script src="/generator.js"></script>
    <script>
    const rawData = JSON.parse('${JSON.stringify(project)}');
        const insertCode = async () => {
            console.log(rawData.content)
            const generatedHTML = generateHTML(rawData.content, rawData.date);
            document.querySelector('main').appendChild(generatedHTML);
        }
        insertCode();
    
    </script>
    
    </html>
            `)
    } catch {
        res.sendStatus(501)
    }

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

const getProject = async (title: string) => {
    const db = new sqlite3.Database('homepagedata.db');

    const result = await new Promise((resolve, reject) => {
        db.all(`SELECT * FROM Projects WHERE urlTitle="${title}";`, (err: any, rows: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows[0]);
            }
        });
    });

    db.close();
    console.log(result);
    return result;
};