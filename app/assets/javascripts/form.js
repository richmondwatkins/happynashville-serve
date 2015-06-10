$(document).ready(function(){

	$('.add-special').on('click', function(e){
		console.log('first event');
		addSpecial($(this).parent().children('.special-list')[0]);
		// $('.add-special').unbind();
		e.preventDefault();
	})

	function createASpecial(isFirst) {
		var $li = $('<li class="special special-item js-special" ></li>');
		var $priceInput = $('<input type="text" name="specialPrice" placeHolder="Special Price" class="field special js-special-price block" required>');
		var $itemInput = $('<input type="text" name="specialItem" placeHolder="Special Item" class="field special js-special-item block" required>');
		var $descriptionInput = $('<input type="text" name="specialDescription" placeHolder="Special Description" class="field special js-special-description block" required>');
		var $allDayLabel = $('<label for="allDay">All day?</label>');
		var $allDayDropDown = $($('.js-special-allDay')[0]).clone();
		var $starTimeLabel = $('<label for="startTime" class="block">Start Time</label>');
		var $startTimeDrop = $($('.js-special-startTime')[0]).clone();
		var $endTimeLabel = $('<label for="endTime">End Time</label>')[0];
		var $endTimeDrop = $($('.js-special-endTime')[0]).clone();
		var $specialTypeLabel = $('<label for="specialType" class="field special">Special Type </label>');
		var $specialType = $($('.special-type')[0]).clone();

		if (!isFirst) {
			var $exit = $('<a href="#" class="delete delete-special">Delete Special</a>');
		}

		$($li).append($specialTypeLabel);
		$($li).append($specialType);
		$($li).append($priceInput);
		$($li).append($itemInput);
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
		var $sunday = $('<span>Sunday</span><input type="checkbox" class="day-of-week" name="sunday" value="1"><span>:::</span>');
		var $monday = $('<span>Monday</span><input type="checkbox" class="day-of-week" name="monday" value="2"><span>:::</span>');
		var $tuesday = $('<span>Tuesday</span><input type="checkbox" class="day-of-week" name="tuesday" value="3"><span>:::</span>');
		var $wednesday = $('<span>Wednesday</span><input type="checkbox" class="day-of-week" name="wednesday" value="4"><span>:::</span>');
		var $thursday = $('<span>Thursday</span><input type="checkbox" class="day-of-week" name="thursday" value="5"><span>:::</span>');
		var $friday = $('<span>Friday</span><input type="checkbox" class="day-of-week" name="friday" value="6"><span>:::</span>');
		var $saturday = $('<span>Saturday</span><input type="checkbox" class="day-of-week" name="saturday" value="7"><span>:::</span>');
		var $specialLabel = $('<h3>Special</h3>');
		var $specialList = $('<ul class="special special-list">');
		$($specialList).append(createASpecial(true));
		var $addSpecial = $('<a href="#" class="add-special">Add Special</a>');
		var $exit = $('<a href="#" class="delete"> Delete Day</a>');

		$($li).append($label);
		$($li).append($sunday);
		$($li).append($monday);
		$($li).append($tuesday);
		$($li).append($wednesday);
		$($li).append($thursday);
		$($li).append($friday);
		$($li).append($saturday);
		$($li).append($specialLabel);
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
			name : $('.location-name').val().trim(),
			address : $('.location-address').val().trim(),
			phoneNumber : $('.location-phone').val().trim(),
			website : $('.location-website').val().trim(),
			dealDays : dealDaysArray
		};

		var dealDays = $('li.js-deal-day').toArray();

		$(dealDays).each(function( index ) {

			var dealDay = $(this),
				specials = [];

			var fSpecials = dealDay.children('.special-list').children('.special-item').toArray();
			var daysOfWeek = dealDay.children('.day-of-week').toArray();
			var checkedDays = [];

			for (var i = 0; i < daysOfWeek.length; i++) {
				if (daysOfWeek[i].checked) {
					checkedDays.push($(daysOfWeek[i]).val());
				}
			}
		
			for (var k = 0; k < checkedDays.length; k++) {
				var deal = {
					day : checkedDays[k],
					specials : specials
				};
			
				for (var j = 0; j < fSpecials.length; j++) {
					console.log(j);
					var specialElm = $(fSpecials[j]);
					
					var special = {
						specialPrice : specialElm.children('.js-special-price').val().trim(),
						specialItem : specialElm.children('.js-special-item').val().trim(),
						specialDescription : specialElm.children('.js-special-description').val().trim(),
						specialType : specialElm.children('.special-type').val(),
						allDay : specialElm.children('.js-special-allDay').val(),
						startTime : specialElm.children('.js-special-startTime').val(),
						endTime : specialElm.children('.js-special-endTime').val()
					};
					
					deal.specials.push(special);
				}

				specials = [];

				dealDaysArray.push(deal);
			}
		});

		console.log(location);

		$.ajax({
				type: "POST",
				url: "/form",
				beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
				data: location,
				dataType: "json",
				success: function(data) {
						alert('Nice job cocs! I love you!');
						window.location.reload()
				},
				error: function(data){
					console.log(data);
						alert("Something went wrong cocs. Make sure all the fields are filled out. If they are and it still failed then let me know");
				}
		});
	});

});