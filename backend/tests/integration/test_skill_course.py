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

class TestSkillCourse():
    def test_find_course_by_skill_success(self, client):
        course = Course(Course_ID="COR001", Course_Name="Computational Thinking", Course_Desc="This mod is not an easy mod.", Course_Status="Active", Course_Type="Internal", Course_Category="Core")
        skill_course = Skill_Course(Skill_Name="Critical Thinking", course_ID="COR001")
        skill_course_2 = Skill_Course(Skill_Name="Algorithms", course_ID="COR001")

        course_2 = Course(Course_ID="COR002", Course_Name="Test Course", Course_Desc="This mod is not an easy mod.", Course_Status="Active", Course_Type="Internal", Course_Category="Core")
        skill_course_3 = Skill_Course(Skill_Name="Critical Thinking", course_ID="COR002")
        skill_course_4 = Skill_Course(Skill_Name="Algorithms", course_ID="COR002")

        db.session.add(course)
        db.session.add(course_2)
        db.session.add(skill_course)
        db.session.add(skill_course_2)
        db.session.add(skill_course_3)
        db.session.add(skill_course_4)
        db.session.commit()

        payload = {
            "skills": ["Critical Thinking", "Algorithms"]
        }
        
        course_response = ["Computational Thinking", "Test Course"]
        
        response = client.post("/findcoursewithskills", data=json.dumps(payload), content_type="application/json")
        output = response.json
        assert response.status_code == 200
        assert output["code"] == 200
        assert output["data"]["courses"] == course_response

    def test_find_course_by_skill_fail(self, client):
        payload = {
            "skills": ["Critical Thinking"]
        }

        response = client.post("/findcoursewithskills", data=json.dumps(payload), content_type="application/json")
        output = response.json
        assert response.status_code == 404
        assert output["code"] == 404
        assert output["message"] == "Course not found."

    def test_find_skills_by_course_success(self, client):
        course = Course(Course_ID="COR001", Course_Name="Computational Thinking", Course_Desc="This mod is not an easy mod.", Course_Status="Active", Course_Type="Internal", Course_Category="Core")
        skill_course = Skill_Course(Skill_Name="Critical Thinking", course_ID="COR001")
        skill_course_2 = Skill_Course(Skill_Name="Algorithms", course_ID="COR001")

        db.session.add(course)
        db.session.add(skill_course)
        db.session.add(skill_course_2)
        db.session.commit()

        course_name = "Computational Thinking"
        skill_response = ["Critical Thinking", "Algorithms"]

        response = client.get(f"/findskillswithcourse/{course_name}")
        output = response.json
        assert response.status_code == 200
        assert output["code"] == 200
        assert output["data"]["skills"] == skill_response

    def test_find_skills_by_course_fail(self, client):
        course_name = "Computational Thinking"

        response = client.get(f"/findskillswithcourse/{course_name}")
        output = response.json
        assert response.status_code == 404
        assert output["code"] == 404
        assert output["message"] == "Skills not found."

    def test_assign_skill_success(self, client):
        payload = {
            "skillnames": ["Java"],
            "courseid": "IS442"
        }

        response = client.post("/assignskill", data=json.dumps(payload), content_type="application/json")
        output = response.json
        assert response.status_code == 201
        assert output["code"] == 201
        assert output["message"] == "Skills assigned to course successfully!"