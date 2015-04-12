class FormController < ApplicationController
	require "net/http"
	require "uri"

	def test 
		
	end

	def save
		puts '============='
		puts params[:name]
		puts '=========+++++'
		location = {
			'name' => params[:name],
			'slug' => makeSlug(params[:name].dup),
			'address' => params[:address],
			'phoneNumber' => params[:phoneNumber],
			'website' => params[:website],
			'dealDays' => []
		}

		params['dealDays'].each{ |i| 
			tempDay = i[1]

			dealDay = {
				'type' => tempDay['type'],
				'day' => tempDay['day'],
				'specials' => []
			}

		  tempDay['specials'].each { |j|
		  	tempSpecial = j[1]

		  	special = {
		  		'allDay' => getAllDay(tempSpecial['allDay']),
		  		'specialDescription' => tempSpecial['specialDescription']
		  	}
		 		
		  	if special['allDay'] == 0
		  		special['hourStart'] = getHour(tempSpecial['startTime'])
		  		special['minuteStart'] = getMinute(tempSpecial['startTime'])
		  		special['hourEnd'] = getHour(tempSpecial['endTime'])
		  		special['minutEend'] = getMinute(tempSpecial['endTime'])
		  	end

		  	dealDay['specials'] << special
		  }

		  location['dealDays'] << dealDay
		}

		coords = getCoords(location['address'])

		if coords 
			location['coords'] = coords
			location['rating'] = getGoogleRating(location)
		end

		Form.create(
			location: location
		)

	respond_to do |format|
			msg = { :status => "ok", :message => "Success!", :html => "<b>...</b>" }
			format.json  { render :json => msg } # don't do msg.to_json
	end
			
	end

	def getCoords(address) 
		address.gsub! ' ', '+'
		url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+ address +'&key=AIzaSyBMh7KtIgBBbvY_p_jTIrwij824dN8dy6U'
		response = Net::HTTP.get(URI.parse(url))

		jsonResults = JSON.parse(response)
		if response['results']
			{
				'lat' => jsonResults['results'][0]['geometry']['location']['lat'], 
				'lng' => jsonResults['results'][0]['geometry']['location']['lng']
			}
		else
			nil 
		end
	end

	def getGoogleRating(location)
		name = location['name']
		name.gsub! ' ', '+'
		url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+location["coords"]["lat"].to_s+','+location["coords"]["lng"].to_s+'&name='+name+'&radius=500&types=food|bar&key=AIzaSyBMh7KtIgBBbvY_p_jTIrwij824dN8dy6U'
		response = Net::HTTP.get(URI.parse(URI.encode(url)))
	
		if response 

		end
	end

	def getMinute(timeString)
		minute = timeString.split(':')[1]
		minute.gsub! 'PM', ''
		minute.gsub! 'AM', ''
		minute.gsub! ' ', ''
		Integer(minute)
	end

	def getHour(timeString)
		hour = Integer(timeString.split(':')[0])

		if timeString.include? "PM"
			hour += 12

			if hour == 12
				hour = 24
			end
		end

		hour
	end

	def getAllDay(allDay) 
		if allDay 
			Integer(allDay)
	 	else 
			0
		end
	end

	def makeSlug(name) 
		slug = name
		slug.gsub! ' ', ''
		slug.downcase!
		slug
	end

end
