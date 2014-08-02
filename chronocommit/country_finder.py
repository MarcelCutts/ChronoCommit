import json

'''
Given a user-entered location, will return the area code of the country the user is in (if the country name is in location)
'''
def get_country_code(location):

    countriesFile = 'chronocommit/resources/countries.json'
    capitalsFile = 'chronocommit/resources/capitals.json'
    usStatesFile = 'chronocommit/resources/us_states.txt'
    usStatesAbbreviationsFile = 'chronocommit/resources/us_states_abbreviations.txt'

    # try/catch is to catch any exceptions raised due to unconventional characters
    try:
        json_data = open(countriesFile)
        # load the json data into a dictionary
        data = json.load(json_data)

        country_code = ''

        # search for exact country name match
        for country in data:
            if country['country'].lower() in location.lower():
                country_code = country['code']
                break;

        # if no match, search for UK and US (uppercase  and space followed by lowercase only)
        if country_code == '':
            if ('US' in location or ' us' in location):
                country_code = 'USA'
            elif ('UK' in location or ' uk' in location):
                country_code = 'GBR'
            elif 'U.K' in location:
                country_code = 'GBR'

        # if still no match, search for country capitals
        if country_code == '':
            json_data_capitals = open(capitalsFile)
            capitals_data = json.load(json_data_capitals)
            for capital in capitals_data:
                if capital['capital'].lower() in location.lower():
                    country_code = capital['code']
                    break;

        # if still no match, try for US state
        if country_code == '':
            us_states = open(usStatesFile)
            for line in us_states:
                if line.rstrip().lower() in location.lower():
                    country_code = 'USA'

        # if still no match, try for US state abbreviation
        if country_code == '':
            us_states_abbreviations = open(usStatesAbbreviationsFile)
            for line in us_states_abbreviations:
                if (line.rstrip() in location or ' ' + line.rstrip().lower() in location.lower()):
                    country_code = 'USA'

        return country_code

    except BaseException as e:
        print(e)
        country_code = ''
        return country_code
