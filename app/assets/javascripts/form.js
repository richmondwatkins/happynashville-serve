$(document).ready(function(){

  $('.add-special').on('click', function(e){
    addSpecial($(this).parent().children('.special-list')[0]);
    e.preventDefault();
  })

  function addSpecial(specialList) {
    var specialElm = $('.js-special')[0],
      newElement = $(specialElm).clone()[0],
      exit = $('<a href="#"> Delete Special</a>');

    exit.on('click', function(e) {
      $(newElement).remove();
      e.preventDefault();
    });

    $(newElement).append(exit);
    
    $(specialList).append(newElement);
  }

  $('.add-day').on('click', function(e){
    var specialElm = $('.js-deal-day')[0];
    specialElm = $(specialElm).clone()[0];
    var specialList = $('.deal-day-list')[0];
    var exit = $('<a href="#"> Delete Day</a>');

    exit.on('click', function(e) {
      $(specialElm).remove();
      e.preventDefault();
    });
    $(specialElm).append(exit);
    $(specialList).append(specialElm);
    
    $(specialElm).children('.add-special').on('click', function(e) {
      addSpecial($(this).parent().children('.special-list')[0]);
      e.preventDefault();
    });

    e.preventDefault();
  });

  $( '#form' ).on( 'submit', function( event ) {
    event.preventDefault();
    var dealDaysArray = [];

    var location = {
      name : $('.location-name').val(),
      address : $('.location-address').val(),
      phoneNumber : $('.location-phone').val(),
      website : $('.location-website').val(),
      dealDays : dealDaysArray
    };


    var dealDays = $('li.js-deal-day').toArray();

    $(dealDays).each(function( index ) {

      var dealDay = $(this),
        specials = [];

      var deal = {
        day : dealDay.children('.deal-day-day').val(),
        type : dealDay.children('.deal-day-type').val(),
        specials : specials
      };
      
      var specials = dealDay.children('.special-list').children().toArray();
        
      for (var j = 0; j < specials.length; j++) {
        var specialElm = $(specials[j]);
        
        var special = {
          specialDescription : specialElm.children('.js-special-description').val(),
          allDay : specialElm.children('.js-special-allDay').val(),
          startTime : specialElm.children('.js-special-startTime').val(),
          endTime : specialElm.children('.js-special-endTime').val()
        };
        
        deal.specials.push(special);
      }

      // console.log(deal);
      dealDaysArray.push(deal);
    });

    console.log(location);
  

    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:3000/form",
        beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
        data: location,
        dataType: "json",
        success: function(data) {
            alert(data.d);
        },
        error: function(data){
          console.log(data);
            alert("fail");
        }
    });
  });

});