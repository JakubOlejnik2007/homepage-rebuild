const generateHTML = (jsonArrayInput, date) => {
    const parent = document.createElement('div');
    parent.classList.add(
        "mt-4", "w-full", "lg:w-[70%]", "md:w-[80%]",
        "mx-auto", "p-3"
    );

    jsonArrayInput.forEach(object => {
        let element;
        if (object.name === "heading 1" || object.name === "heading 2" || object.name === "heading 3") element = generateHeading(object);
        else if (object.name === "paragraph") element = generateParagraph(object);
        else if (object.name === "image") element = generateImage(object);

        if (element === undefined) return;

        parent.appendChild(element);
    });
    parent.appendChild(addFooter(date));
    console.log(parent);
    return parent;
}

const generateParagraph = (object) => {
    const paragraph = document.createElement(`p`);
    paragraph.classList.add(
        "text-text_on_gray", "my-5", "text-justify"
    )
    object.text.forEach(text => {
        if (typeof text === "string") {
            const textNode = document.createTextNode(`${text} `);
            paragraph.appendChild(textNode);
        } else {
            paragraph.appendChild(generateLink(text))
        }
    })
    return paragraph;
}

const generateHeading = (object) => {
    const level = object.name.split(" ")[1]
    const heading = document.createElement(`h${level}`);
    console.log(level)
    heading.classList.add(
        "text-my_white", `text-${level === "3" ? "" : 4 - level}xl`,
        "font-bold", "p-5", "my-5", "border-b-2", "border-my_white"
    )
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
    link.target = "_blank";
    link.classList.add(
        "underlined", "text-my_orange/80", "hover:text-my_orange",
        "hover:scale-110"
    )
    return link;
}

const generateImage = (object) => {
    const imageParent = document.createElement('div');
    imageParent.classList.add(
        "mx-auto", "w-full", "md:w-[75%]", "lg:w-[50%]", "p-8"
    )
    const image = document.createElement('img');
    image.classList.add(
        "w-full"
    )
    image.src = object.src;
    image.alt = object.alt;
    imageParent.appendChild(image);

    const imageLabel = document.createElement('p');
    imageLabel.classList.add(
        "text-text_on_gray", "mt-2", "text-center"
    )
    imageLabel.textContent = object.label;
    imageParent.appendChild(imageLabel);
    return imageParent;
}

const addFooter = (date) => {
    const footer = document.createElement("footer");
    const objDate = new Date(date);
    footer.textContent = `~ Jakub Olejnik, ${objDate.toLocaleDateString("pl")}`

    footer.classList.add(
        "text-text_on_gray", "text-right"
    )

    return footer;
}
