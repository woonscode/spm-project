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

class TestSkills():
    def test_get_all_skills_success(self, client):
        skill = Skill(Skill_Name="Python", Flag=1)
        db.session.add(skill)
        db.session.commit()

        skill_response = [
            { "Skill_Name": "Python", "Flag": 1}
        ]

        response = client.get("/skills")
        output = response.json
        assert response.status_code == 200
        assert output["code"] == 200
        assert output["data"]["skills"] == skill_response

    def test_get_all_skills_fail(self, client):
        response = client.get("/skills")
        output = response.json
        assert response.status_code == 404
        assert output["code"] == 404
        assert output["message"] == "There are no skills."

    def test_create_skill_success(self, client):
        payload = { "Flag": 1 }
        skill_name = "Python"
        skill_response = {
            "Skill_Name": "Python",
            "Flag": 1
        }
        
        response = client.post(f"/skills/{skill_name}", data=json.dumps(payload), content_type="application/json")
        output = response.json
        assert response.status_code == 201
        assert output["code"] == 201
        assert output["data"] == skill_response

    def test_create_skill_fail_exists_already(self, client):
        skill = Skill(Skill_Name="Python", Flag=1)
        db.session.add(skill)
        db.session.commit()

        payload = { "Flag": 1 }
        skill_name = "Python"

        response = client.post(f"/skills/{skill_name}", data=json.dumps(payload), content_type="application/json")
        output = response.json
        assert response.status_code == 400
        assert output["code"] == 400
        assert output["data"]["Skill_Name"] == skill_name
        assert output["message"] == "Skill already exists."

    def test_update_skill_success(self, client):
        skill = Skill(Skill_Name="Python", Flag=1)
        db.session.add(skill)
        db.session.commit()
        payload = { 
            "Skillname": "Python", 
            "Flag": 1 
        }
        skill_name = "Python"
        
        skill_response = {
            "Skill_Name": "Python",
            "Flag": 1
        }

        response = client.post(f"/updateskill/{skill_name}", data=json.dumps(payload), content_type="application/json")
        output = response.json
        assert response.status_code == 201
        assert output["code"] == 201
        assert output["data"] == skill_response
        assert output["message"] == "Update successful!"

    def test_update_skill_fail(self, client):
        skill = Skill(Skill_Name="Python", Flag=1)
        skill_2 = Skill(Skill_Name="Java", Flag=1)

        db.session.add(skill)
        db.session.add(skill_2)
        db.session.commit()

        payload = { 
            "Skillname": "Java", 
            "Flag": 1 
        }

        skill_name = "Python"
        
        response = client.post(f"/updateskill/{skill_name}", data=json.dumps(payload), content_type="application/json")
        output = response.json
        assert response.status_code == 500
        assert output["code"] == 500
        assert output["message"] == "Skill name already exists"