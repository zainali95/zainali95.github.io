document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.getElementById('hamburger');
    const navLink = document.querySelector('.nav-links');
    hamburger.addEventListener('click', () => {
        navLink.classList.toggle('top-[-28px]');
        hamburger.classList.toggle('open');
    });

    // Add 'active' class to the first .nav-link
    document.querySelector(".nav-link").classList.add("active");
    // Handle scrolling event
    window.addEventListener('scroll', function () {
        var header = document.querySelector('header');
        var top = 100;
        var scrolled_val = window.scrollY;
        if (scrolled_val < top) {
            header.classList.remove('md:bg-primary');
            header.classList.add('md:bg-transparent');
        } else {
            header.classList.remove('md:bg-transparent');
            header.classList.add('md:bg-primary');
        }
    });
    // Convert HTMLCollection to array and add click event listeners to .nav-link elements
    var navLinks = Array.from(document.getElementsByClassName("nav-link"));
    navLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Update the URL hash without jumping
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });

    // Handle back/forward browser buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetElement = document.getElementById(hash);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });


});

class PortfolioComponent extends HTMLElement {
    constructor() {
        super();
    }

    async jsonp(url) {
        return new Promise((resolve, reject) => {
            const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
            window[callbackName] = resolve;

            const script = document.createElement('script');
            script.src = url + (url.includes('?') ? '&' : '?') + 'callback=' + callbackName;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    async fetchProjects() {
        const data = await this.jsonp("https://api.behance.net/v2/users/zainalidesigns/projects?api_key=NoXD4d6Xe6F4jZpDSiTxkf9NBWwmr2zb");
        const projectsComponent = this.querySelector('project-component');
        projectsComponent.setProjects(data);
        const filtersComponent = this.querySelector('filters-component');
        filtersComponent.setFilters(data);
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="container py-3 pb-5 mx-auto">
                <div class="text-center mt-4">
                    <h1 class="text-2xl md:text-4xl">Portfolio</h1>
                </div>
                <filters-component class="filters justify-center text-center cursor-pointer flex flex-wrap my-4 gap-3 w-11/12 mx-auto m-w-3xl "></filters-component>
                <project-component  id="portfolio-wrapper" class="my-8 mx-auto w-11/12 justify-items-center text-center grid grid-cols-1 md:grid-cols-3 images gap-5" />
            </div>
        `;
        this.fetchProjects();
    }
}
customElements.define('portfolio-component', PortfolioComponent);

class FiltersComponent extends HTMLElement {
    constructor() {
        super();
    }

    setFilters(data) {
        const categories = [];
        data.projects.forEach((element) => {
            const fields = element.fields.toString().split(' ').join('-').split('/').join('-').split(',');
            categories.push(fields);
        });

        const uniqueCategories = categories.toString().split(',').filter((value, index, self) => self.indexOf(value) === index);

        uniqueCategories.forEach(e => {
            const string = e.toString().split('-').join(' ');
            const node = `<div data-filter='${e}' class="border border-primary rounded-md text-primary cursor-pointer hover:bg-primary hover:text-white p-3 filter" >${string}</div>`;
            this.innerHTML += node;
        });

        const filters = [...this.getElementsByClassName('filter')];
        filters.forEach(e => {
            e.addEventListener('click', (event) => {
                event.preventDefault();
                var selector = event.target.getAttribute('data-filter');
                document.querySelector('project-component').filterElements(selector);

                const active = this.querySelector('filters-component .bg-primary');
                if (active) {
                    active.classList.toggle('bg-primary');
                    active.classList.toggle('text-primary');
                }
                event.target.classList.toggle('text-white');
                event.target.classList.toggle('bg-primary');
            });
        });
    }
}
customElements.define('filters-component', FiltersComponent);

class ProjectComponent extends HTMLElement {
    constructor() {
        super();
        this.projects = [];
    }
    item(project) {
        return `<div class='p-4 text-center group'>
                    <a href="${project.link}">
                        <img src="${project.image}" class='img-fluid'>
                        <p class='m-3 text-black group-hover:text-primary'>${project.name}</p>
                    </a>
                </div>`;
    }
    setProjects(data) {
        let projectDom = [];
        data.projects.forEach((element, index) => {
            const fields = element.fields.toString().split(' ').join('-')
                .split('/').join('-').split(',').join(', ');
            let project = {
                name: element.name,
                link: data.projects[index].url,
                image: element.covers['404'],
                fields
            }

            this.projects.push(project);
            projectDom.push(this.item(project));
        });
        this.innerHTML = projectDom.join(' ');

    }

    filterElements(selector) {
        const filteredProjects = this.projects.filter(project => project.fields.includes(selector));
        let filterProjectsDom = filteredProjects.map(item => this.item(item), '').join(' ');
        this.innerHTML = filterProjectsDom;
    }
}
customElements.define('project-component', ProjectComponent);