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

class TestStaffExternalSkills():
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

    def add_sample_skill_course(self, client):
        skill_course_1 = Skill_Course(Skill_Name="React",course_ID="IS001")
        skill_course_2 = Skill_Course(Skill_Name="Mobile",course_ID="IS001")
        skill_course_3 = Skill_Course(Skill_Name="Sample",course_ID="COR001")
        db.session.add(skill_course_1)
        db.session.add(skill_course_2)
        db.session.add(skill_course_3)
        db.session.commit()

    def add_sample_staff_external_skill(self, client):
        staff_external_skill = Staff_External_Skills(sid=1,exskill="Skill 1 External")
        db.session.add(staff_external_skill)
        db.session.commit()

    def test_create_staff_external_skill(self, client):
        # Learning journey data to pass into POST request
        data = {
            "staffid": 1,
            "newskill": "Test Skill"
        }

        # Triggering the API
        api_response = client.post("/addstaffskill", data=json.dumps(data), content_type="application/json")
        output = api_response.json

        # Checking output 
        assert api_response.status_code == 200
        assert output["code"] == 200
        assert output["message"] == "New skill added successfully!"

    def test_read_staff_external_skill(self, client):
        self.add_sample_course(self)
        self.add_sample_registration(self)
        self.add_sample_learning_journey(self)
        self.add_sample_skill_course(self)
        self.add_sample_staff_external_skill(self)

        test_response = ['Skill 1 External']

        # Triggering the API
        api_response = client.get("/skillsofstaff/1")
        output = api_response.json

        # Checking output 
        assert api_response.status_code == 200
        assert output["code"] == 200
        assert output["skills"] == test_response
