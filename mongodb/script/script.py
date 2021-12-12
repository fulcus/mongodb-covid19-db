import json
import os
import random


def convert_to_GeoJSON(covid_centers):
    '''
    Convert lat e long to GeoJSON object type.

    Refer to https://docs.mongodb.com/manual/reference/geojson/

    location: {
        type: "Point",
        coordinates: [-73.856077, 40.848447]
    }
    '''

    for covid_center in covid_centers:
        covid_center['location'] = {
            "type": "Point",
            "coordinates": [covid_center['lat'], covid_center['long']]
        }
        del covid_center['lat']
        del covid_center['long']

    return covid_centers


def main():

    # Load the JSON files
    cwd = os.getcwd() + '/mongodb'
    with open(cwd + '/data/people.json') as f:
        persons = json.load(f)

    with open(cwd + '/data/covid-centers.json') as f:
        covid_centers = json.load(f)

    with open(cwd + '/data/tests.json') as f:
        tests = json.load(f)

    with open(cwd + '/data/vaccines.json') as f:
        vaccines = json.load(f)

    # Add emergency contact to each person
    for person in persons:
        random_person = random.sample(persons, 1)[0]
        person['emergency_contact'] = dict((k, random_person[k]) for k in ('first_name', 'last_name', 'phone_number', 'email'))

    # Convert lat and long fields to GeoJSON object type
    covid_centers = convert_to_GeoJSON(covid_centers)

    # get doctors from persons
    doctors = [d for d in persons if d['is_doctor'] == True]

    # Add covid center and doctor to each test
    for test in tests:
        random_center = random.sample(covid_centers, 1)[0]
        test['covid_center'] = random_center
        random_doctor = random.sample(doctors, 1)[0]
        test['health_worker'] = dict((k, random_doctor[k]) for k in ('first_name', 'last_name', 'phone_number', 'email'))

    # Add covid center and doctor to each vaccine
    for vaccine in vaccines:
        random_center = random.sample(covid_centers, 1)[0]
        vaccine['covid_center'] = random_center
        random_doctor = random.sample(doctors, 1)[0]
        vaccine['health_worker'] = dict((k, random_doctor[k]) for k in ('first_name', 'last_name', 'phone_number', 'email'))


    # Add persons, tests and vaccines to each certificate
    certificates = []

    for person in persons:
        certificate = {}
        certificate['person'] = person

        # this should actually be saved in different collection
        random_tests = random.sample(tests, random.randint(0, min(10, len(tests))))
        random_tests_temp = random_tests
        certificate['tests'] = random_tests
        for test in random_tests:
            tests.remove(test)
        
        # Add all vaccines to each person
        if len(random_tests_temp) > 0:
            random_vaccines = random.sample(vaccines, random.randint(0, 2))
        else:
            random_vaccines = random.sample(vaccines, random.randint(1, 2))
        certificate['vaccines'] = random_vaccines
        for vaccine in random_vaccines:
            vaccines.remove(vaccine)
        
        certificates.append(certificate)
    

    # Save the JSON file, can import as collection from compass
    with open(cwd + '/data/certificates.json', 'w') as f:
        json.dump(certificates, f)


if __name__ == '__main__':
    main()
