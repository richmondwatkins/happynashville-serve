$(document).ready(function(){

  $('.add-special').on('click', function(e){
    console.log('first event');
    addSpecial($(this).parent().children('.special-list')[0]);
    // $('.add-special').unbind();
    e.preventDefault();
  })

  function createASpecial(isFirst) {
    console.log('new spec');
    var $li = $('<li class="special special-item js-special" ></li>');
    var $descriptionInput = $('<input type="text" name="specialDescription" placeHolder="Special Description" class="field special js-special-description block" required>');
    var $allDayLabel = $('<label for="allDay">All day?</label>');
    var $allDayDropDown = $($('.js-special-allDay')[0]).clone();
    var $starTimeLabel = $('<label for="startTime" class="block">Start Time</label>');
    var $startTimeDrop = $($('.js-special-startTime')[0]).clone();
    var $endTimeLabel = $('<label for="endTime">End Time</label>')[0];
    var $endTimeDrop = $($('.js-special-endTime')[0]).clone();
   
    if (!isFirst) {
      var $exit = $('<a href="#" class="delete delete-special"> Delete Special</a>');
    }
    
 
    $($li).append($descriptionInput);
    $($li).append($allDayLabel);
    $($li).append($allDayDropDown);
    $($li).append($starTimeLabel);
    $($li).append($startTimeDrop);
    $($li).append($endTimeLabel);
    $($li).append($endTimeDrop);
    if (!isFirst) {
      $($li).append($exit);

      $exit.on('click', function(e) {
        $($li).remove();
       e.preventDefault();
      });
    }

    return $li;
  }

  function addSpecial(specialList) {
    var specialElm = $('.js-special')[0];
    $(specialList).append(createASpecial(false));
  }

  $('.add-day').on('click', function(e){

    var $li = $('<li class="special special-item js-deal-day">');
    var $label = $('<label for="day" class="block">Day of Week</label>');
    var $dayDrop = $($('.deal-day-day')[0]).clone();
    var $specialLabel = $('<h3>Special</h3>');
    var $specialTypelabel = $('<label for="type" class="field special">Special Type </label>');
    var $specialDrop = $($('.deal-day-type')[0]).clone();
    var $specialList = $('<ul class="special special-list">');
    $($specialList).append(createASpecial(true));
    var $addSpecial = $('<a href="#" class="add-special">Add Special</a>');
    var $exit = $('<a href="#" class="delete"> Delete Day</a>');

    $($li).append($label);
    $($li).append($dayDrop);
    $($li).append($specialLabel);
    $($li).append($specialTypelabel);
    $($li).append($specialDrop);
    $($li).append($specialList);
    $($li).append($exit);
    $($li).append($addSpecial);
    
    var $dealDayList = $('.deal-day-list');
    $($dealDayList).append($li);

    $exit.on('click', function(e) {
      $($li).remove();
      e.preventDefault();
    });
        
    $($addSpecial).on('click', function(e) {
      addSpecial($specialList);
      e.preventDefault();
    });

    // $(specialElm).children('.add-special').on('click', function(e) {
    //   addSpecial($(this).parent().children('.special-list')[0]);
    //   e.preventDefault();
    // });
    // console.log( $(specialElm).last().children());
    // $(specialElm).last().children('delete-special').on('click', function(e) {
    //   console.log('touched');
    //   $(this).parent().remove();
    //   e.preventDefault();
    // });

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
        url: "/form",
        beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
        data: location,
        dataType: "json",
        success: function(data) {
            alert('Nice job cocs!');
            location.reload();
        },
        error: function(data){
          console.log(data);
            alert("Something went wrong cocs. Make sure all the fields are filled out. If they are and it still failed then let me know");
        }
    });
  });

});