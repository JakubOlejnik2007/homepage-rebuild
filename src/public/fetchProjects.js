
const projectsDiv = document.querySelector('#projects-js');

const article = `
<article
                        class="shadow-[0_0px_10px_0px_rgba(0,0,0,0.5)] hover:shadow-[0_0_15px_2px_rgba(255,152,62,0.75)] hover:bg-[rgba(255,152,62,0.2)] border-2 border-[rgba(0,0,0,0)] hover:border-my_orange hover:scale-105 duration-300 ease-out hover:ease-in w-64 text-wrap p-6 rounded-lg">
                        <img src="https://tenco.waw.pl/img.png" alt="temp" class="m-auto scale-90 rounded-lg h-[178px]">
                        <h3 class="text-header text-xl lg:text-2xl text-justify">Lorem</h3>
                        <p class="text-base lg:text-lg text-text_on_gray">Lorem ipsum dolor sit amet consectetur
                            adipisicing
                            elit. Error
                            libero quos
                            facilis. Ea
                            accusantium
                            alias a! Repellendus cum esse voluptatibus, dolores animi quo reprehenderit, consequuntur
                            quis
                            iusto
                            quidem corporis deserunt.</p>
                            <p class="text-base lg:text-lg text-text_on_gray text-center">22.08.2024</p>
                        <p class="text-my_orange text-right block"><a href="">Czytaj więcej...</a></p>
                    </article>`

const generateProjectCard = (project) => {
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
        "rounded-lg"
    );

    const icon = document.createElement("img");
    icon.src = project.icon;
    icon.alt = project.title;
    icon.classList.add("m-auto", "scale-90", "rounded-lg", "h-[178px]");
    parent.appendChild(icon);

    const header = document.createElement("h3");
    header.textContent = project.title;
    header.classList.add("text-header", "text-xl", "lg:text-2xl", "text-justify");
    parent.appendChild(header);

    const teaser = document.createElement("p");
    teaser.textContent = project.teaser;
    teaser.classList.add("text-base", "lg:text-lg", "text-text_on_gray");
    parent.appendChild(teaser);

    const dateP = document.createElement("p");
    dateP.classList.add("text-base", "lg:text-lg", "text-text_on_gray", "text-center");
    dateP.textContent = date.toLocaleDateString("pl");
    parent.appendChild(dateP);

    const readMoreP = document.createElement("p");
    readMoreP.classList.add("text-right", "text-my_orange");
    const readMoreAnchor = document.createElement("a");
    readMoreAnchor.textContent = "Czytaj więcej...";
    readMoreAnchor.href = `http://localhost:2137/projekty/${project.urlTitle}`;
    readMoreP.appendChild(readMoreAnchor);
    parent.appendChild(readMoreP);


    projectsDiv.appendChild(parent);
}

const fetchAndDisplayProjects = async () => {
    try {
        const response = await axios.get("http://localhost:2137/api/getProjects");
        console.log(response.data);

        projectsDiv.innerHTML = "";

        response.data.forEach(project => generateProjectCard(project))



    } catch (e) {
        console.error("Failed to fetch projects", e);
        return;
    }

}

fetchAndDisplayProjects()