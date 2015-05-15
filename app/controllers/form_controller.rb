class FormController < ApplicationController
	require "net/http"
	require "uri"

	# @googleRatingAttm = 0
	# @googleCoords = 0

	def form 	
	end

	def retrieve
	 render json: {version: 1, :locations => Location.all}
	end

	def save
		location = {
			'name' => params[:name],
			'slug' => makeSlug(params[:name].dup),
			'address' => params[:address],
			'phoneNumber' => params[:phoneNumber],
			'website' => params[:website],
			'isLocal' => params[:isLocal].to_i,
			'dealDays' => []
		}
	
		params['dealDays'].each{ |i| 
			tempDay = i[1]

			dealDay = {
				'type' => tempDay['type'].to_i,
				'day' => tempDay['day'].to_i,
				'specials' => []
			}
		
		  tempDay['specials'].each { |j|
		  	tempSpecial = j[1]

		  	special = {
		  		'allDay' => getAllDay(tempSpecial['allDay']),
		  		'specialDescription' => tempSpecial['specialDescription'],
		  		'type' => tempSpecial['specialType'].to_i
		  	}
		 		
		  	if special['allDay'] == 0
		  		special['hourStart'] = getHour(tempSpecial['startTime'])
		  		special['minuteStart'] = getMinute(tempSpecial['startTime'])
		  		special['hourEnd'] = getHour(tempSpecial['endTime'])
		  		special['minuteEnd'] = getMinute(tempSpecial['endTime'])
		  	end

		  	dealDay['specials'] << special
		  }

		  location['dealDays'] << dealDay
		}

		coords = getCoords(location['address'])
		
		if coords 
			location['coords'] = coords

			googleInfo = getGoogleRating(location)

			if googleInfo
				location['rating'] = googleInfo['rating']

				if googleInfo['priceLevel'] 
					location['priceLevel'] = googleInfo['priceLevel']
				else
					location['priceLevel'] = 4
				end

				Google.create(
					data:	googleInfo
				)
			end
		end

		foundLocation = Location.find_by(name: location['name'])

		if foundLocation != nil
			foundLocation['dealDays'] += location['dealDays']
			foundLocation.save
		else
			Location.create(
				location
			)
		end
	
		render :json => [{ :success => "Success" }], :status => 200	
	end

	def getCoords(address) 
		addressDup = address.dup
		addressDup.gsub! ' ', '+'
		url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+ addressDup +'&key=AIzaSyBMh7KtIgBBbvY_p_jTIrwij824dN8dy6U'
		response = Net::HTTP.get(URI.parse(url))

		jsonResults = JSON.parse(response)

		if jsonResults['status'] != "ZERO_RESULTS"
			{
				'lat' => jsonResults['results'][0]['geometry']['location']['lat'], 
				'lng' => jsonResults['results'][0]['geometry']['location']['lng']
			}
		else
			 # @googleCoords++
			 # puts self.googleCoords
			 # if  @googleCoords < 5 
			 # 		getCoords(address)
			 # end
			 nil
		end
	end

	def getGoogleRating(location)
		name = location['name'].dup
		name.gsub! ' ', '+'
		url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+location["coords"]["lat"].to_s+','+location["coords"]["lng"].to_s+'&name='+name+'&radius=500&types=food|bar&key=AIzaSyBMh7KtIgBBbvY_p_jTIrwij824dN8dy6U'
		response = Net::HTTP.get(URI.parse(URI.encode(url)))
		puts url
		jsonResults = JSON.parse(response)
		nameMatches = []

		if jsonResults['results']
			jsonResults['results'].each { |i|
				responseName = i['name'].downcase!
				firstName = location['name'].dup.split(' ')[0].downcase!
				if responseName.include? firstName 
					nameMatches << {'rating' => i['rating'], 'googleInfo' => i, 'priceLevel' => i['price_level']}
					puts '+++++++++++++++++++++++'
					puts nameMatches
					puts '+++++++++++++++++++++++'
				end
			}

		else 
			# @googleRatingAttm++

			# if @googleRatingAttm < 5
			# 	getGoogleRating(location)
			# end
			nil
		end

		if nameMatches.size > 0
			nameMatches[0]

		else
			return nil
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
