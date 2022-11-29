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

class TestJobRoleSkill():
    def test_find_skills_by_job_success(self, client):
        job_role_skill = Job_Role_Skill(Job_Role_Name="Backend Engineer", Skill_Name="Java")
        db.session.add(job_role_skill)
        db.session.commit()

        job_name = "Backend Engineer"
        skill_response = ["Java"]

        response = client.get(f"/job_role_skill/{job_name}")
        output = response.json
        assert response.status_code == 200
        assert output["code"] == 200
        assert output["data"]["skills"] == skill_response

    def test_find_skills_by_job_fail(self, client):
        job_name = "Mobile Developer"
        response = client.get(f"/job_role_skill/{job_name}")
        output = response.json
        assert response.status_code == 404
        assert output["code"] == 404
        assert output["message"] == "skills not found."