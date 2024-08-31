const projectEntriesDiv = document.querySelector('#project-entries');
const generatorResults = document.querySelector('#generator-results');
const controlsDiv = document.querySelector('#controls');
const refresh = document.querySelector('#refresh');
const docTree = document.querySelector('#doc-tree');

refresh.addEventListener("click", (e) => {
    e.preventDefault();
    updateCMS();
})

let currentProject;
let currentWorkflow = [];

const operands = [
    "heading 1", "heading 2", "heading 3", "paragraph", "image", "link"
]

const allProjects = fetch("http://localhost:5000/api/getAllProjects").then(response => response.json());

const generateControls = () => {
    controlsDiv.innerHTML = "";
    operands.forEach((operand) => {
        const control = document.createElement("div");
        control.classList.add("border-2", "border-my_orange", "p-2", "hover:bg-my_white/40", "hover:text-my_orange", "duration-300");
        control.textContent = operand;
        controlsDiv.appendChild(control);
    })
}

const displayAllProjects = async () => {
    const data = await allProjects;
    const list = document.createElement("ul");
    data.forEach(element => {
        const node = document.createElement("li");
        node.textContent = `${element.id}. ${element.urlTitle}`;
        node.addEventListener("click", () => {
            currentProject = element;
            currentWorkflow = JSON.parse(currentProject.content);
            updateCMS();
        })
        list.appendChild(node);

    });
    projectEntriesDiv.appendChild(list);
}

const updateCMS = async () => {
    updateView();
    generateControls();
    generateWorkTree();
}

const updateView = async () => {
    generatorResults.innerHTML = "";
    generatorResults.appendChild(generateHTML(currentWorkflow, currentProject.date));
}

const generateWorkTree = () => {
    docTree.innerHTML = "";
    console.log(docTree)
    currentWorkflow.forEach(node => {
        switch (node.name) {
            case "heading 1":
            case "heading 2":
            case "heading 3":
                const heading = document.createElement('h3');
                heading.textContent = node.text;
                docTree.appendChild(heading);
                break;
            case "paragraph":
                docTree.appendChild(paragraphControl(node));
                break;
            case "image":
                const image = document.createElement('img');
                image.src = node.src;
                docTree.appendChild(image);
                break;
            case "link":
                const link = document.createElement('a');
                link.href = node.href;
                link.textContent = node.text;
                docTree.appendChild(link);
                break;
        }
    })
}

/*
<div class="p-3 border-my_orange border-2">
                        <p>paragraph</p>
                        <textarea class="w-full"></textarea>
                        <div class="grid grid-cols-[1fr_1fr]">
                            <div class="text-center hover:text-my_orange duration-300 cursor-pointer">+ Link</div>
                            <div class="text-center hover:text-my_orange duration-300 cursor-pointer">+ Tekst</div>
                        </div>
                    </div>
*/

const createControlContainer = (name) => {
    const parent = document.createElement('div');
    parent.classList.add(
        "p-3", "border-my_orange", "border-2", "mx-2"
    );
    const controlName = document.createElement('p');
    controlName.textContent = name;
    parent.appendChild(controlName);
    return parent;
}

const textareaFill = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.classList.add("w-full", 'block', "my-2", "h-20", "p-2");
    return textArea;
}

const paragraphControl = ({ name, text }) => {
    const parent = createControlContainer(name);
    const textBlock = document.createElement('div');
    parent.appendChild(textBlock);
    text.forEach(elem => {
        if (elem.name === "link") textBlock.appendChild(linkControl(elem));
        else {
            textBlock.appendChild(textareaFill(elem));
        }
    })

    return parent;

}

const linkControl = ({ name, href, text }) => {
    const parent = createControlContainer(name);


    const hrefInputLabel = document.createElement("label");
    hrefInputLabel.textContent = "Href: ";
    hrefInputLabel.classList.add("block", "my-2");
    parent.appendChild(hrefInputLabel);

    const hrefInput = document.createElement("input");
    hrefInput.type = "url";
    hrefInput.value = href;
    hrefInputLabel.appendChild(hrefInput);

    const textInputLabel = document.createElement("label");
    textInputLabel.textContent = "Text: ";
    textInputLabel.classList.add("block", "my-2");
    parent.appendChild(textInputLabel)

    const textInput = document.createElement("input");
    textInput.value = text;
    textInputLabel.appendChild(textInput)

    return parent;
}

docTree.addEventListener("input", () => console.log("event"))

displayAllProjects();
generateControls();