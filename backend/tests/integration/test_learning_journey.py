import pytest
import json
from ljps import app
from models import db, Course, Skill, Skill_Course, Job_Role, Job_Role_Skill, Role, Staff, Learning_Journey, Learning_Journey_Course, Learning_Journey_Skill, Registration, Staff_External_Skills

@pytest.fixture
def app_ctx():
    with app.app_context():
        yield

@pytest.fixture
def database(app_ctx):
    db.create_all()

    yield app

    db.session.remove()
    db.drop_all()

@pytest.fixture
def client(database):
    client = app.test_client()
    yield client

class TestLearningJourney():
    # Reusable functions to help with test case writing
    def add_sample_course(self, client):
        first_course = Course(Course_ID="COR001",Course_Name="Systems Thinking and Design", Course_Desc="Sample Description",Course_Status="Active", Course_Type="Internal", Course_Category="Core")
        second_course = Course(Course_ID="IS001",Course_Name="React Native 101", Course_Desc="Sample Description",Course_Status="Active", Course_Type="Internal", Course_Category="Core")
        third_course = Course(Course_ID="IS002",Course_Name="React Native Advanced", Course_Desc="Sample Description",Course_Status="Active", Course_Type="Internal", Course_Category="Core")
        db.session.add(first_course)
        db.session.add(second_course)
        db.session.add(third_course)
        db.session.commit()

    def add_sample_learning_journey(self, client):
        learning_journey = Learning_Journey(Job_Role_Name="Mobile Developer",Staff_ID=1)
        learning_journey_course_1 = Learning_Journey_Course(LJ_ID=1,Course_ID="COR001")
        learning_journey_course_2 = Learning_Journey_Course(LJ_ID=1,Course_ID="IS001")
        db.session.add(learning_journey)
        db.session.add(learning_journey_course_1)
        db.session.add(learning_journey_course_2)
        db.session.commit()

    def add_sample_registration(self, client):
        registration_1 = Registration(Reg_ID=1000,Course_ID="COR001",Staff_ID=1,Reg_Status="Completed",Completion_Status="Completed")
        registration_2 = Registration(Reg_ID=1,Course_ID="IS001",Staff_ID=1,Reg_Status="Completed",Completion_Status="Pending")
        db.session.add(registration_1)
        db.session.add(registration_2)
        db.session.commit()

    def add_sample_job_role(self, client):
        job_role = Job_Role(Job_Role_Name="Mobile Developer",Job_Role_Description="Sample Description",Job_Role_Status="Active")
        db.session.add(job_role)
        db.session.commit()

    def add_sample_skill_course(self, client):
        skill_course_1 = Skill_Course(Skill_Name="React",course_ID="IS001")
        skill_course_2 = Skill_Course(Skill_Name="Mobile",course_ID="IS001")
        skill_course_3 = Skill_Course(Skill_Name="Sample",course_ID="COR001")
        db.session.add(skill_course_1)
        db.session.add(skill_course_2)
        db.session.add(skill_course_3)
        db.session.commit()

    def test_create_learning_journey_success(self, client):
        # Adding test data to the database
        self.add_sample_course(self)

        # Sample responses that should be received
        response = {
            "staffid": 1,
            "jobrole": "Mobile Developer"
        }

        # Learning journey data to pass into POST request
        learning_journey_data = {
            "courses": [ "Systems Thinking and Design", "React Native 101" ],
            "staffid": 1,
            "jobrole": "Mobile Developer"
        }

        # Triggering the API
        api_response = client.post("/createlearningjourney", data=json.dumps(learning_journey_data), content_type="application/json")
        output = api_response.json

        # Checking output 
        assert api_response.status_code == 201
        assert output["code"] == 201
        assert output["data"]["staffid"] == response["staffid"]
        assert output["data"]["jobrole"] == response["jobrole"]

    def test_create_learning_journey_fail_alreadyExists(self, client):
        # Adding learning journey data to DB
        self.add_sample_learning_journey(self)

        # Sample responses that should be received
        response = {
            "staffid": 1,
            "jobrole": "Mobile Developer"
        }

        # Learning journey data to pass into POST request
        learning_journey_data = {
            "courses": [ "Systems Thinking and Design", "React Native 101" ],
            "staffid": 1,
            "jobrole": "Mobile Developer"
        }

        # Triggering the API
        api_response = client.post("/createlearningjourney", data=json.dumps(learning_journey_data), content_type="application/json")
        output = api_response.json
        
        # Checking output 
        assert api_response.status_code == 400
        assert output["code"] == 400
        assert output["data"] == response
        assert output["message"] == "Learning Journey already exists."

    def test_view_learning_journey(self, client):
        # Adding data to DB for testing
        self.add_sample_course(self)
        self.add_sample_learning_journey(self)
        self.add_sample_registration(self)

        # Sample responses that should be received
        response = {
            "learning_journeys": [
                {
                    "courses_completed": "1 / 2",
                    "jobrole": "Mobile Developer",
                    "ljid": 1
                }
            ]
        }

        # Triggering the API
        api_response = client.get("/viewlearningjourneys/1")
        output = api_response.json

        # Checking output 
        assert api_response.status_code == 200
        assert output["code"] == 200
        assert output["data"] == response

    def test_view_learning_journey_detail(self, client):
        # Adding data to DB for testing
        self.add_sample_course(self)
        self.add_sample_job_role(self)
        self.add_sample_skill_course(self)
        self.add_sample_learning_journey(self)
        self.add_sample_registration(self)

        # Sample responses that should be received
        response = {
            'LJ_ID': '1', 
            'acquired_skills': ['Sample'], 
            'all_courses': [
                {
                    'Course_Category': 'Core', 
                    'Course_Desc': 'Sample Description', 
                    'Course_ID': 'COR001', 
                    'Course_Name': 'Systems Thinking and Design', 
                    'Course_Status': 'Active', 
                    'Course_Type': 'Internal', 
                    'completed': 'Completed'
                }, 
                {
                    'Course_Category': 'Core', 
                    'Course_Desc': 'Sample Description', 
                    'Course_ID': 'IS001', 
                    'Course_Name': 'React Native 101', 
                    'Course_Status': 'Active', 
                    'Course_Type': 'Internal', 
                    'completed': 'Not Completed'
                }
            ], 
            'all_skills': ['Sample', 'React', 'Mobile'], 
            'jobrole': 'Mobile Developer', 
            'jobroledesc': 'Sample Description'
        }

        # Triggering the API
        api_response = client.get("/viewlearningjourneydetail/1")
        output = api_response.json

        # Checking output 
        assert api_response.status_code == 200
        assert output["code"] == 200
        assert output["data"] == response

    def test_update_learning_journey(self, client):
        # Add test data to DB
        self.add_sample_course(self)
        self.add_sample_learning_journey(self)

        # Data to send to API
        params = [
            "Systems Thinking and Design",
            "React Native Advanced"
        ]

        # New courses
        test_output = [ "COR001", "IS002" ]
        
        # Triggering the API
        api_response = client.post("/editlearningjourney/1", data=json.dumps(params), content_type="application/json")
        output = api_response.json

        learning_journey_courses = Learning_Journey_Course.query.filter_by(LJ_ID=1).all()
        response = []
        for ljc in learning_journey_courses:
            response.append(ljc.Course_ID)
        
        # Checking output 
        assert api_response.status_code == 201
        assert output["code"] == 201
        assert output["message"] == "Edit successful"
        assert response == test_output

    def test_delete_learning_journey(self, client):
        # Adding learning journey data to DB
        self.add_sample_learning_journey(self)
        size_of_table_before = Learning_Journey.query.count()

        # Triggering the API
        api_response = client.get("/deletelearningjourney/1")
        output = api_response.json
        size_of_table_after = Learning_Journey.query.count()

        assert api_response.status_code == 201
        assert output["code"] == 201
        assert output["message"] == "Deletion of Learning Journey successful."
        assert size_of_table_before == 1
        assert size_of_table_after == 0