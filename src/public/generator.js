const generateHTML = (jsonArrayInput) => {
    const parent = document.createElement('div');

    jsonArrayInput.forEach(object => {
        let element;
        if (object.name === "heading 1" || object.name === "heading 2" || object.name === "heading 3") element = generateHeading(object);
        else if (object.name === "paragraph") element = generateParagraph(object);


        if (element === undefined) return;

        parent.appendChild(element);
    });

    console.log(parent);
    return parent;
}

const generateParagraph = (object) => {
    const heading = document.createElement(`p`);
    object.text.forEach(text => {
        if (typeof text === "string") {
            const textNode = document.createTextNode(text);
            heading.appendChild(textNode);
        } else {
            heading.appendChild(generateLink(text))
        }
    })
    return heading;
}

const generateHeading = (object) => {
    const level = object.name.split(" ")[1]
    const heading = document.createElement(`h${level}`);
    object.text.forEach(text => {
        if (typeof text === "string") {
            const textNode = document.createTextNode(text);
            heading.appendChild(textNode);
        } else {
            heading.appendChild(generateLink(text))
        }
    })
    return heading;
}

const generateLink = (object) => {
    const link = document.createElement('a');
    link.href = object.href;
    link.textContent = object.text;
    return link;
}

const jsonString = `[
    {
        "name": "heading 1",
        "text": [
            "Nagłówek 1 stopnia artykułu"
        ]
    },
    {
        "name": "paragraph",
        "text": [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis massa justo, efficitur eget tempus nec, aliquam in ex. Phasellus sollicitudin leo interdum, congue augue convallis, suscipit nulla. Vivamus tristique finibus mi. Donec sapien orci, tincidunt vel fermentum non, maximus quis tortor. Phasellus in lacus augue. Sed bibendum cursus ante a dapibus. Praesent turpis elit, consectetur sit amet erat a, malesuada fringilla quam. Fusce volutpat, metus vel iaculis laoreet, ante tortor efficitur ex, eu tempor lectus augue ac tortor. Fusce laoreet diam vitae massa aliquet euismod. Duis vulputate porttitor tellus ullamcorper mollis. Phasellus iaculis est ac diam dignissim vestibulum. Nunc sed quam a ex ullamcorper egestas a volutpat libero. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;",
            {
                "name": "link",
                "href": "https://github.com/JakubOlejnik2007",
                "text": "Github Autora Tekstu"
            },
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis massa justo, efficitur eget tempus nec, aliquam in ex. Phasellus sollicitudin leo interdum, congue augue convallis, suscipit nulla. Vivamus tristique finibus mi. Donec sapien orci, tincidunt vel fermentum non, maximus quis tortor. Phasellus in lacus augue. Sed bibendum cursus ante a dapibus. Praesent turpis elit, consectetur sit amet erat a, malesuada fringilla quam. Fusce volutpat, metus vel iaculis laoreet, ante tortor efficitur ex, eu tempor lectus augue ac tortor. Fusce laoreet diam vitae massa aliquet euismod. Duis vulputate porttitor tellus ullamcorper mollis. Phasellus iaculis est ac diam dignissim vestibulum. Nunc sed quam a ex ullamcorper egestas a volutpat libero. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;"
        ]
    },
    {
        "name": "image",
        "src": "https://via.placeholder.com/200x200",
        "alt": "Placeholder Image",
        "label": "testowy obrazen"
    }
]`

generateHTML(JSON.parse(jsonString))