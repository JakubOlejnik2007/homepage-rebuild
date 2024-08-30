let currPage = 0;
let intervalId = null;

const projectsPagesDiv = document.querySelector('#projectspages-js');

const generatePages = (pagesCount) => {
    projectsPagesDiv.innerHTML = "";

    for (let i = 0; i < pagesCount; i++) {
        const button = document.createElement("span");
        button.classList.add(
            "block",
            "w-4",
            "h-4",
            i == currPage ? "bg-my_orange" : "bg-[rgb(60,60,60)]",
            "rounded-full",
            i == currPage ? "scale-125" : "hover:scale-125",
            "duration-300",
        );
        button.addEventListener("click", () => {
            currPage = i;
            console.log(currPage)
            generatePages(pagesCount);
            fetchAndDisplayProjects(currPage);
            resetInterval(pagesCount);
        });

        projectsPagesDiv.appendChild(button);
    }
}

const getProjectsCount = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/getProjectsCount");
        const data = await response.json();
        console.log(data)
        return data.count;
    } catch (e) {
        console.error("Failed to fetch projects", e);
        return;
    }
}

const resetInterval = (pagesCount) => {
    if (intervalId) {
        clearInterval(intervalId);
    }

    intervalId = setInterval(() => {
        currPage = (currPage + 1) % pagesCount;
        fetchAndDisplayProjects(currPage);
        generatePages(pagesCount);
    }, 10000);
}

const managePages = async () => {
    const projectsCount = await getProjectsCount();
    fetchAndDisplayProjects();

    if (projectsCount <= 4) {
        return;
    }

    const pagesCount = Math.ceil(projectsCount / 4);
    generatePages(pagesCount);
    resetInterval(pagesCount);
}

managePages();