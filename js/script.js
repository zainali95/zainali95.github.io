document.addEventListener("DOMContentLoaded", function() {
    // Add 'active' class to the first .nav-link
    document.querySelector(".nav-link").classList.add("active");    
    // Handle scrolling event
    window.addEventListener('scroll', function() {
        var nav = document.querySelector('nav');
        var top = 100;
        var scrolled_val = window.scrollY;
        if (scrolled_val < top) {
            nav.classList.remove('bg-primary');
        } else {
            nav.classList.add('bg-primary');
        }
    });
    // Convert HTMLCollection to array and add click event listeners to .nav-link elements
    var navLinks = Array.from(document.getElementsByClassName("nav-link"));
    navLinks.forEach(function(e) {
        e.addEventListener('click', function(event) {
            const active = document.querySelector('.active');
            if (active) {
                active.classList.remove('active');
            }
            this.classList.add('active');

            // Make sure this.hash has a value before overriding default behavior
            if (this.hash !== "") {
                // Prevent default anchor click behavior
                event.preventDefault();
                // Store hash
                var hash = this.hash;
                // Smooth page scroll
                var offset = document.querySelector(hash).offsetTop;
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
                // Add hash (#) to URL when done scrolling
                window.location.hash = hash;
            }
        });
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
            <div class="container py-3 pb-5">
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="text-center mt-4">Portfolio</h1>
                    </div>
                    <filters-component class="col-md-7 p-5 mx-auto mb-5 text-center filters"></filters-component>
                </div>
                
                <project-component  id="portfolio-wrapper" class="row images" />
                
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
        data.projects.forEach((element, index) => {
            const fields = element.fields.toString().split(' ').join('-').split('/').join('-').split(',');
            categories.push(fields);
        });
        
        const uniqueCategories = categories.toString().split(',').filter((value, index, self) => self.indexOf(value) === index);

        uniqueCategories.forEach(e => {
            const string = e.toString().split('-').join(' ');
            const node = `<div data-filter='${e}' class='btn btn-outline-primary my-1 mx-1 col-sm-12 col-md-auto filter'>${string}</div>`;
            this.innerHTML += node;
        });

        const filters = [...this.getElementsByClassName('filter')];
        filters.forEach(e => {
            e.addEventListener('click', (event) => {
                event.preventDefault();
                var selector = event.target.getAttribute('data-filter');
                document.querySelector('project-component').filterElements(selector);

                const active = document.querySelector('.btn-primary');
                if (active) {
                    active.classList.toggle('btn-outline-primary');
                    active.classList.toggle('btn-primary');
                }
                event.target.classList.toggle('btn-outline-primary');
                event.target.classList.toggle('btn-primary');
            });
        });
    }
}
customElements.define('filters-component', FiltersComponent);
class ProjectsComponent extends HTMLElement {
    constructor() {
        super();
        this.projects = [];
    }
    item (project){
        return `<div class='col-md-4 ${project.fields} text-center'>
                            <a href="${project.link}">
                                <img src="${project.image}" class='img-fluid'>
                                <p class='my-3'>${project.name}</p>
                            </a>
                        </div>`;
    }
    setProjects(data) {
        let projectDom  =[];
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
            projectDom.push( this.item(project));
        });
        this.innerHTML = projectDom;

    }

    filterElements(selector) {
       const filteredProjects = this.projects.filter(project => project.fields.includes(selector));
       let   filterProjectsDom = filteredProjects.map( item => this.item(item), '');
       this.innerHTML = filterProjectsDom;
    }
}
customElements.define('project-component', ProjectsComponent);