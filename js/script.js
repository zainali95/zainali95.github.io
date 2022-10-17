function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
var categories = [];
var unique = [];
var covers = '';
var cover = '';
var fields = [];
var $container = $('.images');
window.onload = () => {
    $container.isotope({
        filter: '*',
        animationOptions: {
            duration: 750,
            easing: 'linear',
            queue: false
        }

    });
};

document.addEventListener("DOMContentLoaded", function() {
    //scrolling nav change
    document.querySelector(".nav-link").classList.add("active");
    window.addEventListener('scroll', function() {
        var nav = $('nav');
        var top = 100;
        var scrolled_val = $(window).scrollTop().valueOf();
        if (scrolled_val < top) {
            nav.removeClass('bg-primary');
        } else {
            nav.addClass('bg-primary');
        }
    });
    var navlink = [];
    navlink.push(...document.getElementsByClassName("nav-link"));

    navlink.forEach(e => {

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

                // Using jQuery's animate() method to add smooth page scroll
                // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
                var offset = document.querySelector(hash).offsetTop;
                $('html, body').animate({
                    scrollTop: offset
                }, 800, function() {
                    // Add hash (#) to URL when done scrolling (default click behavior)
                    window.location.hash = hash;
                });
            } // End if
        });

        //         
    });

    $.get({
        url: "https://api.behance.net/v2/users/zainalidesigns/projects?api_key=NoXD4d6Xe6F4jZpDSiTxkf9NBWwmr2zb",
        dataType: 'jsonp',
        success: (data) => {
            console.log(data);
            data.projects.forEach((element, index) => {
                var name = element.name;
                fields = element.fields.toString().split(' ').join('-').split('/').join('-').split(',');
                categories.push(fields);
                fields = fields.join(', ');

                cover = `<div class='col-md-4 ` + fields + ` text-center'>
                                    <a href=" + data.projects[i].url + ">
                                        <img src=` + element.covers['404'] + ` class='img-fluid' >
                                        <p class='my-3'>` + name + `</p>
                                    </a>
                            </div>`;
                cover = $(cover);

                $(".images").append(cover);
            });

            categories = categories.toString().split(',');
            var nodes = '';
            unique = categories.filter(onlyUnique);
            unique.forEach(e => {
                const string = e.toString().split('-').join(' ')
                nodes = `<div data-filter='.` + e + `'  class='btn btn-outline-primary my-1 mx-1 col-sm-12 col-md-auto filter '>` +
                    string +
                    `</div>`;
                $(".filters").append(nodes);
            });




        },
        complete: () => {
            var filters = [];
            filters.push(...document.getElementsByClassName('filter'));
            // console.log(filters);
            filters.forEach(e => {
                e.addEventListener('click', (event) => {
                    event.preventDefault();

                    var selector = $(event.target).attr('data-filter');

                    $container.isotope({
                        filter: selector,
                        animationOptions: {
                            duration: 750,
                            easing: 'linear',
                            queue: false
                        }
                    });
                    return false;
                });

                e.onclick = () => {

                    const active = document.querySelector('.btn-primary');
                    if (active) {
                        active.classList.toggle('btn-outline-primary');
                        active.classList.toggle('btn-primary');
                    }
                    event.target.classList.toggle('btn-primary');
                    event.target.classList.toggle('btn-outline-primary');
                };
            });
        }
    });


});