import fs from 'fs';
import path from 'path';
import { parseStringPromise, Builder } from 'xml2js';


const rssFilePath = path.join(__dirname, 'public', 'rss.xml');

const newItem = {
    item: [
        {
            title: 'Nowy wpis na kanale RSS',
            link: 'https://www.tenco.waw.pl?num=5',
            description: 'Opis Nowego Wpisu',
            pubDate: new Date().toUTCString(),
        },
    ],
};

interface Item {
    title: string;
    link: string;
    description: string;
    pubDate: string;
}

const addItemToRss = async (item: Item) => {
    try {
        const rssXml = fs.readFileSync(rssFilePath, 'utf-8');

        const result = await parseStringPromise(rssXml);

        result.rss.channel[0].item.push(item);

        const builder = new Builder();
        const updatedXml = builder.buildObject(result);

        fs.writeFileSync(rssFilePath, updatedXml, 'utf-8');

        console.log('Nowy wpis został dodany do pliku RSS.');
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}
export default addItemToRss;