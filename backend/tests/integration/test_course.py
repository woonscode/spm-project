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

class TestCourse():
    def add_sample_course(self):
        course_1 = Course(Course_ID="COR001", Course_Name="Computational Thinking", Course_Desc="This mod is not an easy mod.", Course_Status="Active", Course_Type="Internal", Course_Category="Core")
        db.session.add(course_1)
        db.session.commit()

    def test_get_all_courses_success(self, client):
        self.add_sample_course()
        course_2 = Course(Course_ID="IS212", Course_Name="Software Project Management", Course_Desc="This mod is also not an easy mod.", Course_Status="Active", Course_Type="Internal", Course_Category="Information Systems")

        db.session.add(course_2)
        db.session.commit()

        course_1_response = {
            "Course_ID": "COR001",
            "Course_Name": "Computational Thinking",
            "Course_Desc": "This mod is not an easy mod.", 
            "Course_Status": "Active", 
            "Course_Type": "Internal", 
            "Course_Category": "Core"
        }

        course_2_response = {
            "Course_ID": "IS212",
            "Course_Name": "Software Project Management",
            "Course_Desc": "This mod is also not an easy mod.", 
            "Course_Status": "Active", 
            "Course_Type": "Internal", 
            "Course_Category": "Information Systems"
        }

        response = client.get("/course")
        output = response.json
        assert response.status_code == 200
        assert output["code"] == 200
        assert output["data"]["courses"][0] == course_1_response
        assert output["data"]["courses"][1] == course_2_response

    def test_get_all_courses_fail(self, client):
        response = client.get("/course")
        output = response.json
        assert response.status_code == 404
        assert output["code"] == 404
        assert output["message"] == "There are no courses."
    
    def test_find_by_course_name_success(self, client):
        self.add_sample_course()
        course_2 = Course(Course_ID="IS212", Course_Name="Software Project Management", Course_Desc="This mod is also not an easy mod.", Course_Status="Active", Course_Type="Internal", Course_Category="Information Systems")

        db.session.add(course_2)
        db.session.commit()

        course_2_response = {
            "Course_ID": "IS212",
            "Course_Name": "Software Project Management",
            "Course_Desc": "This mod is also not an easy mod.", 
            "Course_Status": "Active", 
            "Course_Type": "Internal", 
            "Course_Category": "Information Systems"
        }

        course_name = "Software Project Management"
        response = client.get(f"/course/{course_name}")
        output = response.json
        assert response.status_code == 200
        assert output["code"] == 200
        assert output["data"]["courses"][0] == course_2_response

    def test_find_by_course_name_fail(self, client):
        course_name = "Software Project Management"
        response = client.get(f"/course/{course_name}")
        output = response.json
        assert response.status_code == 404
        assert output["code"] == 404
        assert output["message"] == "Course not found."

    def test_get_course_id_success(self, client):
        self.add_sample_course()
        course_name = "Computational Thinking"

        response = client.get(f"/courseid/{course_name}")
        output = response.json
        assert response.status_code == 200
        assert output["code"] == 200
        assert output["courseid"] == "COR001"
        assert output["coursename"] == course_name

    def test_get_course_id_fail(self, client):
        course_name = "Computational Thinking"

        response = client.get(f"/courseid/{course_name}")
        output = response.json
        assert response.status_code == 404
        assert output["code"] == 404
        assert output["message"] == "Course not found."


    def test_get_specific_course_success(self, client):
        self.add_sample_course()
        skill_course = Skill_Course(Skill_Name="Algorithms", course_ID="COR001")

        db.session.add(skill_course)
        db.session.commit()

        course_response = {
            "Course_ID": "COR001",
            "Course_Name": "Computational Thinking",
            "Course_Desc": "This mod is not an easy mod.", 
            "Course_Status": "Active", 
            "Course_Type": "Internal", 
            "Course_Category": "Core"
        }

        skills_response = ["Algorithms"]

        response = client.get("/coursedetails/COR001")
        output = response.json
        assert response.status_code == 200
        assert output["code"] == 200
        assert output["coursedetails"] == course_response
        assert output["skills"] == skills_response

    def test_get_specific_course_fail(self, client):
        response = client.get("/coursedetails/COR001")
        output = response.json
        assert response.status_code == 404
        assert output["code"] == 404
        assert output["message"] == "Course not found."
