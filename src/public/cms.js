const projectEntriesDiv = document.querySelector('#project-entries');
const generatorResults = document.querySelector('#generator-results');
const controlsDiv = document.querySelector('#controls');
const refresh = document.querySelector('#refresh');
const submitChanges = document.querySelector('#submit-changes');
const docTree = document.querySelector('#doc-tree');

const titleEntryInput = document.querySelector('#title');
const teaserEntryInput = document.querySelector('#teaser');
const iconEntryInput = document.querySelector('#icon');
const dateEntryInput = document.querySelector('#date');
const urlTitleEntryInput = document.querySelector('#urlTitle');

console.log('Generating')

refresh.addEventListener("click", (e) => {
    e.preventDefault();
    getNewWorkflow();
    updateCMS();
})

submitChanges.addEventListener("click", async (e) => {
    console.log('Submit')
    e.preventDefault();
    getNewWorkflow();
    currentProject.content = currentWorkflow
    console.log(currentProject)

    const response = await fetch("http://localhost:5000/api/updateProject", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentProject)
    })
})




let draggedElement = null;

const handleDragStart = (e) => {
    draggedElement = e.target;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
    setTimeout(() => { e.target.style.display = "none"; }, 0);
};

const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
};

const handleDrop = (e) => {
    e.preventDefault();
    if (draggedElement !== e.target) {
        draggedElement.style.display = "block";
        docTree.insertBefore(draggedElement, e.target.nextSibling || e.target);
        getNewWorkflow();
    }
};

const handleDragEnd = (e) => {
    draggedElement.style.display = "block";
    draggedElement = null;
};






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

        control.addEventListener("click", () => {

            getNewWorkflow();
            if (operand === "heading 1" || operand === "heading 2" || operand === "heading 3" || operand === "paragraph") {
                currentWorkflow.push({ name: operand, text: [] });
            }
            if (operand === "image") {
                currentWorkflow.push({ name: operand, src: "", alt: "", label: "" });
            }
            if (operand === "link") {
                currentWorkflow.push({ name: operand, href: "", text: "" });
            }
            generateWorkTree();
        })
    })
}

const displayAllProjects = async () => {
    const data = await allProjects;
    const list = document.createElement("ul");

    [...data, { id: -1, urlTitle: "New Project" }].forEach(element => {
        console.log(element);
        const node = document.createElement("li");
        node.textContent = `${element.id}. ${element.urlTitle}`;
        node.addEventListener("click", () => {
            currentProject = element;
            currentWorkflow = []
            if (element.id >= 0) currentWorkflow = JSON.parse(currentProject.content);
            else {
                console.log(Date.now())
                currentProject = {
                    id: -1,
                    title: "",
                    teaser: "",
                    content: [],
                    icon: "",
                    date: Date.now(),
                    urlTitle: ""
                }
                console.log(currentProject)
            }


            titleEntryInput.value = currentProject.title;
            teaserEntryInput.value = currentProject.teaser;
            iconEntryInput.value = currentProject.icon;

            const date = new Date(currentProject.date).toISOString().split("T")[0];

            dateEntryInput.value = date;
            urlTitleEntryInput.value = currentProject.urlTitle;

            updateView();
            generateControls();
            generateWorkTree();
        })
        list.appendChild(node);

    });
    projectEntriesDiv.appendChild(list);
}

const updateCMS = () => {
    console.log("Update CMS")
    getNewWorkflow();
    console.log(currentProject)
    updateView();
    generateControls();
    generateWorkTree();
}

const updateView = () => {
    generatorResults.innerHTML = "";
    generatorResults.appendChild(generateHTML(currentWorkflow, currentProject.date));
}

const generateWorkTree = () => {
    console.log("Generating work tree...");
    docTree.innerHTML = "";
    currentWorkflow.forEach(node => {
        let controlElement;
        switch (node.name) {
            case "heading 1":
            case "heading 2":
            case "heading 3":
                controlElement = headingControl(node);
                break;
            case "paragraph":
                controlElement = paragraphControl(node);
                break;
            case "image":
                controlElement = imageControl(node);
                break;
            case "link":
                controlElement = linkControl(node);
                break;
        }

        controlElement.addEventListener('dragstart', handleDragStart);
        controlElement.addEventListener('dragover', handleDragOver);
        controlElement.addEventListener('drop', handleDrop);
        controlElement.addEventListener('dragend', handleDragEnd);



        docTree.appendChild(controlElement);
    });
    console.log(currentProject)

    titleEntryInput.value = currentProject.title;
    teaserEntryInput.value = currentProject.teaser;
    iconEntryInput.value = currentProject.icon;

    const date = new Date(currentProject.date).toISOString().split("T")[0];

    dateEntryInput.value = date;
    urlTitleEntryInput.value = currentProject.urlTitle;
};

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
        "p-3", "border-my_orange", "border-2", "mx-2", "my-2", "relative"
    );
    const controlName = document.createElement('p');
    controlName.textContent = name;
    controlName.classList.add("text-center");

    parent.setAttribute('draggable', "true");
    parent.appendChild(controlName);

    const close = document.createElement('span');
    close.classList.add("text-[rgb(220,38,38)]", "block", "absolute", "top-2", "right-2", "cursor-pointer", "rounded-full", "bg-[rgb(220,38,38)]", "w-3", "h-3");
    parent.appendChild(close);

    close.addEventListener("click", (e) => {
        parent.remove();
    });

    return parent;
}

const textareaFill = (text) => {

    const parent = document.createElement("div");
    parent.classList.add("relative");

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.classList.add("w-full", 'block', "my-2", "h-20", "p-2");
    parent.appendChild(textArea);

    const close = document.createElement('span');
    close.classList.add("text-[rgb(220,38,38)]", "block", "absolute", "top-2", "right-2", "cursor-pointer", "rounded-full", "bg-[rgb(220,38,38)]", "w-3", "h-3");
    parent.appendChild(close);

    close.addEventListener("click", (e) => {
        parent.remove();
    });
    return parent;
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

    const addNewElement = document.createElement("div");
    addNewElement.classList.add("grid", "grid-cols-[1fr_1fr]");

    const addText = document.createElement("div");
    addText.textContent = "+ Tekst";
    addText.classList.add("text-center", "hover:text-my_orange", "duration-300", "cursor-pointer");
    addText.addEventListener("click", () => {
        textBlock.appendChild(textareaFill(""));
    })
    addNewElement.appendChild(addText);

    const addLink = document.createElement("div");
    addLink.textContent = "+ Link";
    addLink.classList.add("text-center", "hover:text-my_orange", "duration-300", "cursor-pointer");
    addLink.addEventListener("click", () => {
        textBlock.appendChild(linkControl({
            name: "link",
            href: "",
            text: ""
        }));
    })
    addNewElement.appendChild(addLink);
    parent.appendChild(addNewElement);

    return parent;

}

const headingControl = ({ name, text }) => {
    const parent = createControlContainer(name);
    const textBlock = document.createElement('div');
    parent.appendChild(textBlock);


    const textInputLabel = document.createElement("label");
    textInputLabel.textContent = "Text: ";
    textInputLabel.classList.add("block", "my-2");
    textBlock.appendChild(textInputLabel);

    const textInput = document.createElement("input");
    textInput.value = text;
    textInputLabel.appendChild(textInput);

    return parent;

}

const imageControl = ({ name, src, alt, label }) => {
    const parent = createControlContainer(name);

    const srcLabel = document.createElement("label");
    srcLabel.textContent = "Src: ";
    srcLabel.classList.add("block", "my-2");
    parent.appendChild(srcLabel);
    const srcInput = document.createElement("input");
    srcInput.value = src;
    srcLabel.appendChild(srcInput);

    const altLabel = document.createElement("label");
    altLabel.textContent = "Alt: ";
    altLabel.classList.add("block", "my-2");
    parent.appendChild(altLabel);
    const altInput = document.createElement("input");
    altInput.value = alt;
    altLabel.appendChild(altInput);

    const labelLabel = document.createElement("label");
    labelLabel.textContent = "Label: ";
    labelLabel.classList.add("block", "my-2");
    parent.appendChild(labelLabel);
    const labelInput = document.createElement("input");
    labelInput.value = label;
    labelLabel.appendChild(labelInput);

    console.log(parent)

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

const getNewWorkflow = () => {
    console.log("getNewWorkflow")
    const newWorkflow = [];

    currentProject.title = titleEntryInput.value;
    currentProject.teaser = teaserEntryInput.value;
    currentProject.icon = iconEntryInput.value;
    const date = new Date(dateEntryInput.value);
    currentProject.date = date.getTime()
    currentProject.urlTitle = urlTitleEntryInput.value;
    console.log(currentProject)
    console.log(docTree.children.toArray)
    Array.from(docTree.children).forEach((docTreeChild, docTreeChildIndex) => {
        console.log(docTreeChildIndex, docTreeChild)
        const docTreeChildName = docTreeChild.querySelector("p").textContent;
        if (docTreeChildName === "link") {
            newWorkflow.push({
                name: docTreeChildName,
                href: docTreeChild.querySelectorAll("input")[0],
                text: docTreeChild.querySelectorAll("input")[1]
            })
        }

        if (docTreeChildName === "heading 1" ||
            docTreeChildName === "heading 2" ||
            docTreeChildName === "heading 3"
        ) newWorkflow.push({
            name: docTreeChildName,
            text: [docTreeChild.querySelector("input").value.trim()]
        })

        if (docTreeChildName === "paragraph") {
            const textNode = docTreeChild.children[2];
            const newTextArray = [];

            Array.from(textNode.children).forEach((textChild) => {
                console.log('Textchild:', textChild.tagName)
                if (textChild.tagName === "DIV" && textChild.children[0].tagName !== "TEXTAREA") {
                    console.log("p", textChild.querySelector("p"))
                    newTextArray.push({
                        name: textChild.querySelector("p").textContent,
                        href: textChild.querySelectorAll("input")[0].value,
                        text: textChild.querySelectorAll("input")[1].value
                    })
                }
                else newTextArray.push(textChild.children[0].value);

            });

            newWorkflow.push({
                name: docTreeChildName,
                text: newTextArray
            })
        }

        if (docTreeChildName === "image") {
            newWorkflow.push({
                name: docTreeChildName,
                src: docTreeChild.querySelectorAll("input")[0].value,
                alt: docTreeChild.querySelectorAll("input")[1].value,
                label: docTreeChild.querySelectorAll("input")[2].value
            })
        }

        console.log(newWorkflow)
        currentWorkflow = newWorkflow;




    })
}

displayAllProjects();
generateControls();