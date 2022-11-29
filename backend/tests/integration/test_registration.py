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

class TestRegistration():
    # Reusable functions to help with test case writing
    def add_sample_course(self, client):
        first_course = Course(Course_ID="COR001",Course_Name="Systems Thinking and Design", Course_Desc="Sample Description",Course_Status="Active", Course_Type="Internal", Course_Category="Core")
        second_course = Course(Course_ID="IS001",Course_Name="React Native 101", Course_Desc="Sample Description",Course_Status="Active", Course_Type="Internal", Course_Category="Core")
        db.session.add(first_course)
        db.session.add(second_course)
        db.session.commit()

    def add_sample_registration(self, client):
        registration_1 = Registration(Reg_ID=1000,Course_ID="COR001",Staff_ID=130001,Reg_Status="Completed",Completion_Status="Completed\r")
        registration_2 = Registration(Reg_ID=1,Course_ID="IS001",Staff_ID=130001,Reg_Status="Completed",Completion_Status="Pending")
        db.session.add(registration_1)
        db.session.add(registration_2)
        db.session.commit()

    def add_sample_staff(self, client):
        staff = Staff(Staff_ID=130001, Staff_FName="Jack", Staff_LName="Sim", Dept="CEO", Email="jack.sim@allinone.com.sg", Role=1)
        db.session.add(staff)
        db.session.commit()

    def test_read_registration(self, client):
        self.add_sample_staff(self)
        self.add_sample_course(self)
        self.add_sample_registration(self)

        test_response = [{
            'Course_ID': 'COR001', 
            'Course_Name': 'Systems Thinking and Design'
        }]

        # Triggering the API
        response = client.get("/coursedonebystaff/130001")
        output = response.json
        
        # Checking outputs
        assert response.status_code == 200
        assert output["code"] == 200
        assert output["courses"] == test_response

