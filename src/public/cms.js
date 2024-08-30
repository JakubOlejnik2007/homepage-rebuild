const projectEntriesDiv = document.querySelector('#project-entries');
const generatorResults = document.querySelector('#generator-results');
const controlsDiv = document.querySelector('#controls');

let currentProject;
let currentWorkflow = [];

const operands = [
    "heading 1", "heading 2", "heading 3", "paragraph", "image", "link"
]

const allProjects = fetch("http://localhost:5000/api/getAllProjects").then(response => response.json());

const generateControls = () => {
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
            updateCMS();
        })
        list.appendChild(node);

    });
    projectEntriesDiv.appendChild(list);
}

const updateCMS = async () => {
    updateView();
}

const updateView = async () => {
    generatorResults.innerHTML = "";
    generatorResults.appendChild(generateHTML(JSON.parse(currentProject.content)));
}

displayAllProjects();
generateControls();