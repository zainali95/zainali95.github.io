
 function len(obj) {
        var size = 0,
            key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    var a = [];
    var unique = [];
    var covers = '';
    var cover = '';
    var fields=[];
     var $container = $('.images');
   $(window).load(function(){
        
       
            $container.isotope({
            filter: '*',
            animationOptions: {
            duration: 750,
            easing: 'linear',
            queue: false
            }
          
            });
             });
$(document).ready(function() {
    //scrolling nav change
    $(".nav-link:first").addClass('active');
    $(window).scroll(function() {

    var nav = $('nav');
        var top = 100;
        var scrolled_val = $(window).scrollTop().valueOf();
        if (scrolled_val < top) {
            nav.removeClass('bg-primary');
        } else {
            nav.addClass('bg-primary');
        }
    });
 $(".nav-link").on('click', function(event) {
    $(".nav-link").removeClass('active');
    $(this).addClass('active');
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){


        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
    $.get({
        url: "https://api.behance.net/v2/users/zainalidesigns/projects?api_key=NoXD4d6Xe6F4jZpDSiTxkf9NBWwmr2zb",
        dataType: 'jsonp',
        success: function(data) {

            var t = len(data.projects);
            for (i = 0; i < t; i++) {
                var name = data.projects[i].name;
                
                fields = data.projects[i].fields.toString().split(' ').join('-').split('/').join('-').split(',');
                a.push(fields);

                cover= "<div class='col-md-4 text-center'><a href="+data.projects[i].url+"><img src=" + data.projects[i].covers['404'] + " class='img-fluid' ><p class='my-3'>" + name + "</p></a></div>";
                cover=$(cover);
                $.each(fields, function( i, value ) {
                    cover=cover.addClass(value);
                });
                
                $(".images").append(cover);
    
           
              }
             a= a.toString().split(',');
            var b = '';
            unique = a.filter(onlyUnique);
            for (i = 0; i < unique.length; i++) {
                b = "<div data-filter='."+unique[i]+"'  class='btn btn-outline-primary my-1 mx-1 col-sm-12 col-md-auto filter '>" + unique[i].toString().split('-').join(' ') + "</div>";
                $(".filters").append(b);
            }

            
           
          
        }
    });
 
     $(document).on('click','.filter',function(){
              $(this).siblings().removeClass("btn-primary").addClass("btn-outline-primary");
              $(this).removeClass("btn-outline-primary").addClass("btn-primary");
               var selector = $(this).attr('data-filter');
              
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
     // $(".filter").addClass("btn-outline-primary").removeClass("btn-primary");

});

