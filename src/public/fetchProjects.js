
const projectsDiv = document.querySelector('#projects-js');

const generateProjectCard = (project, hide = false) => {
    const date = new Date(project.date);

    const parent = document.createElement("article");
    parent.classList.add(
        "shadow-[0_0px_10px_0px_rgba(0,0,0,0.5)]",
        "hover:shadow-[0_0_15px_2px_rgba(255,152,62,0.75)]",
        "hover:bg-[rgba(255,152,62,0.2)]",
        "border-2",
        "border-[rgba(0,0,0,0)]",
        "hover:border-my_orange",
        "hover:scale-105",
        "duration-300",
        "ease-out",
        "hover:ease-in",
        "w-64",
        "text-wrap",
        "p-6",
        "rounded-lg",
        "flex", "flex-col", "justify-between",
        hide ? "opacity-0" : "opacity-100"
    );

    const headerSection = document.createElement("div");

    const icon = document.createElement("img");
    icon.src = project.icon;
    icon.alt = project.title;
    icon.classList.add("mx-auto", "scale-90", "rounded-lg", "h-[178px]");
    headerSection.appendChild(icon);



    const header = document.createElement("h3");
    header.textContent = project.title;
    header.classList.add("text-header", "text-xl", "lg:text-2xl", "text-center");
    headerSection.appendChild(header);

    const teaser = document.createElement("p");
    teaser.textContent = project.teaser;
    teaser.classList.add("text-base", "lg:text-lg", "text-text_on_gray");
    headerSection.appendChild(teaser);

    parent.appendChild(headerSection);
    const footerSection = document.createElement("div");

    const dateP = document.createElement("p");
    dateP.classList.add("text-base", "lg:text-lg", "text-text_on_gray", "text-center");
    dateP.textContent = date.toLocaleDateString("pl");
    footerSection.appendChild(dateP);

    const readMoreP = document.createElement("p");
    readMoreP.classList.add("text-right", "text-my_orange");
    const readMoreAnchor = document.createElement("a");
    readMoreAnchor.textContent = "Czytaj więcej...";
    readMoreAnchor.href = `http://localhost:5000/projekty/${project.urlTitle}`;
    readMoreP.appendChild(readMoreAnchor);
    footerSection.appendChild(readMoreP);

    parent.appendChild(footerSection);

    projectsDiv.appendChild(parent);
}

const fetchAndDisplayProjects = async (page = 0) => {
    try {
        const response = await fetch(`http://localhost:5000/api/getProjects?page=${page}`);
        const data = await response.json();

        projectsDiv.innerHTML = "";

        data.forEach(project => generateProjectCard(project));

        const responseLength = data.length;
        if (responseLength < 4) {
            for (let i = 0; i < 4 - responseLength; i++) {
                generateProjectCard({}, true);
            }
        }

    } catch (e) {
        console.error("Failed to fetch projects", e);
        return;
    }
}

fetchAndDisplayProjects()