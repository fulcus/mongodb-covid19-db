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
    tests_all = []

    for person in persons:
        certificate = {}
        test_obj = {}
        certificate['person'] = person
        test_obj['person'] = person

        # this should actually be saved in different collection
        random_tests = random.sample(tests, random.randint(0, min(10, len(tests))))

        test_obj['tests'] = random_tests
        if len(random_tests) > 0:
            certificate['latest_test'] = max(random_tests, key=lambda x: x['date'])
        
        # print(f"random_tests dates: {[d['date'] for d in random_tests]}, most recent test: {max(random_tests, key=lambda x: x['date'])['date']}")
        for test in random_tests:
            tests.remove(test)
        
        # Add all vaccines to each person
        random_vaccines = random.sample(vaccines, random.randint(0, min(4, len(vaccines))))
        certificate['vaccines'] = random_vaccines
        for vaccine in random_vaccines:
            vaccines.remove(vaccine)
        
        certificates.append(certificate)
        tests_all.append(test_obj)
    

    certificates_json = {
        "certificates": certificates,
        "tests_all": tests_all,
    }

    # Save the JSON file
    with open(cwd + '/data/certificates_tests_all.json', 'w') as f:    #/data/certificates_tests_all.json -> /data/certificates_tests_all_dateTime.json
        json.dump(certificates_json, f)


if __name__ == '__main__':
    main()
