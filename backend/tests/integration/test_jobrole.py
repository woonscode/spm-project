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

class TestJobRole():
    def test_get_all_job_roles_success(self, client):
        job_role = Job_Role(Job_Role_Name="DevOps Engineer", Job_Role_Description="DevOps Engineer placeholder description", Job_Role_Status=1)

        db.session.add(job_role)
        db.session.commit()

        job_role_response = {
            "Job_Role_Name": "DevOps Engineer",
            "Job_Role_Description": "DevOps Engineer placeholder description",
            "Job_Role_Status": 1
        }

        response = client.get("/jobrole")
        output = response.json
        assert response.status_code == 200
        assert output["code"] == 200
        assert output["data"]["jobroles"][0] == job_role_response
    
    def test_get_all_job_roles_fail(self, client):
        response = client.get("/jobrole")
        output = response.json
        assert response.status_code == 404
        assert output["code"] == 404
        assert output["message"] == "There are no jobroles."

    def test_find_by_job_name_success(self, client):
        job_role = Job_Role(Job_Role_Name="DevOps Engineer", Job_Role_Description="DevOps Engineer placeholder description", Job_Role_Status=1)

        db.session.add(job_role)
        db.session.commit()

        job_role_response = {
            "Job_Role_Name": "DevOps Engineer",
            "Job_Role_Description": "DevOps Engineer placeholder description",
            "Job_Role_Status": 1
        }

        job_name = "DevOps"
        response = client.get(f"/jobrole/{job_name}")
        output = response.json
        assert response.status_code == 200
        assert output["code"] == 200
        assert output["data"]["jobroles"][0] == job_role_response

    def test_find_by_job_name_fail(self, client):
        job_name = "DevOps"
        response = client.get(f"/jobrole/{job_name}")
        output = response.json
        assert response.status_code == 404
        assert output["code"] == 404
        assert output["message"] == "Jobrole not found."

    def test_get_job_role_details_success(self, client):
        job_role = Job_Role(Job_Role_Name="DevOps Engineer", Job_Role_Description="DevOps Engineer placeholder description", Job_Role_Status=1)
        job_role_skill = Job_Role_Skill(Job_Role_Name="DevOps Engineer", Skill_Name="GitHub Actions")
        db.session.add(job_role)
        db.session.add(job_role_skill)
        db.session.commit()

        job_role_response = {
            "Job_Role_Name": "DevOps Engineer",
            "Job_Role_Description": "DevOps Engineer placeholder description",
            "Job_Role_Status": 1
        }

        skill_response = ["GitHub Actions"]
        
        job_name = "DevOps"
        response = client.get(f"/jobroledetails/{job_name}")
        output = response.json
        assert response.status_code == 200
        assert output["code"] == 200
        assert output["data"]["jobroles"] == job_role_response
        assert output["data"]["skills"] == skill_response

    def test_get_job_role_details_fail(self, client):
        job_name = "DevOps"

        response = client.get(f"/jobroledetails/{job_name}")
        output = response.json
        assert response.status_code == 404
        assert output["code"] == 404
        assert output["message"] == "Jobrole not found." 

    def test_create_job_role_success(self, client):
        payload = {
            "jobrolename": "DevOps Engineer",
            "jobroledesc": "DevOps Engineer placeholder description",
            "jobrolestatus": 1,
            "relatedskills": []
        }

        response = client.post("/createjobrole", data=json.dumps(payload), content_type="application/json")
        output = response.json
        assert response.status_code == 201
        assert output["code"] == 201
        assert output["message"] == "the job role and its related skills have been created successfully!"

    def test_create_job_role_fail_already_exists(self, client):
        job_role = Job_Role(Job_Role_Name="DevOps Engineer", Job_Role_Description="DevOps Engineer placeholder description", Job_Role_Status=1)

        db.session.add(job_role)
        db.session.commit()

        payload = {
            "jobrolename": "DevOps Engineer",
            "jobroledesc": "DevOps Engineer placeholder description",
            "jobrolestatus": 1,
            "relatedskills": []
        }

        response = client.post("/createjobrole", data=json.dumps(payload), content_type="application/json")
        output = response.json
        assert response.status_code == 500
        assert output["code"] == 500
        assert output["message"] == "The job role already exists"

    def test_edit_job_role_success(self, client):
        job_role = Job_Role(Job_Role_Name="DevOps Engineer", Job_Role_Description="DevOps Engineer placeholder description", Job_Role_Status=0)

        db.session.add(job_role)
        db.session.commit()

        payload = {
            "newjobrolename": "DevOps Engineer",
            "newdesc": "DevOps Engineer placeholder description",
            "status": 1,
            "relatedskills": []
        }
        job_role_name = "DevOps Engineer"
        response = client.post(f"/editjobrole/{job_role_name}", data=json.dumps(payload), content_type="application/json")
        output = response.json
        assert response.status_code == 200
        assert output["code"] == 200
        assert output["message"] == "The job role and its related skills have been edited successfully!"

    def test_edit_job_role_alternative(self, client):
        payload = {
            "newjobrolename": "DevOps Engineer",
            "newdesc": "DevOps Engineer placeholder description",
            "status": 1,
            "relatedskills": []
        }
        job_role_name = "Backend Developer"
        response = client.post(f"/editjobrole/{job_role_name}", data=json.dumps(payload), content_type="application/json")
        output = response.json
        assert response.status_code == 200
        assert output["code"] == 200
        assert output["message"] == "The job role and its related skills have been edited successfully!"
