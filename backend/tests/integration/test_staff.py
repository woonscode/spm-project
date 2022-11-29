import pytest
import json
from models import db, Course, Skill, Skill_Course, Job_Role, Job_Role_Skill, Role, Staff, Learning_Journey, Learning_Journey_Course, Learning_Journey_Skill, Registration, Staff_External_Skills
from ljps import app

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


class TestStaff():
    # Reusable functions to help with test case writing
    def add_sample_role(self, roleId, roleName):
        role = Role(Role_ID=roleId, Role_Name=roleName)
        db.session.add(role)
        db.session.commit()

    def add_sample_staff(self, staffId, staffFName, staffLName, dept, email, role):
        staff = Staff(Staff_ID=staffId, Staff_FName=staffFName, Staff_LName=staffLName, Dept=dept, Email=email, Role=role)
        db.session.add(staff)
        db.session.commit()

    def test_read_staff_getAll_pass(self, client):
        # Adding test data to the database
        self.add_sample_staff("130001", "Jack", "Sim", "CEO", "jack.sim@allinone.com.sg", "1")
        self.add_sample_staff("140001", "Derek", "Tan", "Sales", "derek.tan@allinone.com.sg", "3")
        self.add_sample_staff("140002", "Susan", "Goh", "Sales", "susan.goh@allinone.com.sg", "2")

        # Sample responses that should be received
        staff_1_response = {
            "Staff_ID": 130001,
            "Staff_FName": "Jack", 
            "Staff_LName": "Sim",
            "Dept": "CEO",
            "Email": "jack.sim@allinone.com.sg",
            "Role": 1
        }

        staff_2_response = {
            "Staff_ID": 140001,
            "Staff_FName": "Derek", 
            "Staff_LName": "Tan",
            "Dept": "Sales",
            "Email": "derek.tan@allinone.com.sg",
            "Role": 3
        }

        staff_3_response = {
        "Staff_ID": 140002,
            "Staff_FName": "Susan", 
            "Staff_LName": "Goh",
            "Dept": "Sales",
            "Email": "susan.goh@allinone.com.sg",
            "Role": 2
        }

        # Triggering the API
        response = client.get("/getallstaffs")
        output = response.json
        
        # Checking outputs
        assert response.status_code == 200
        assert output["code"] == 200
        assert output["data"]["staffs"][0] == staff_1_response
        assert output["data"]["staffs"][1] == staff_2_response
        assert output["data"]["staffs"][2] == staff_3_response

    def test_read_staff_getAll_fail(self, client):
        response = client.get("/getallstaffs")
        output = response.json
        assert response.status_code == 404
        assert output["code"] == 404
        assert output["message"] == "There are no staffs."

    def test_staff_login_pass(self, client):
        # Adding test data to the database
        self.add_sample_role("1", "Admin")
        self.add_sample_role("2", "User")
        self.add_sample_staff("130001", "Jack", "Sim", "CEO", "jack.sim@allinone.com.sg", "1")
        self.add_sample_staff("140002", "Susan", "Goh", "Sales", "susan.goh@allinone.com.sg", "2")

        # Sample responses that should be received
        staff_1_response = {
            "Staff_ID": 130001,
            "Staff_FName": "Jack", 
            "Staff_LName": "Sim",
            "Dept": "CEO",
            "Email": "jack.sim@allinone.com.sg",
            "Role": "Admin"
        }

        staff_2_response = {
        "Staff_ID": 140002,
            "Staff_FName": "Susan", 
            "Staff_LName": "Goh",
            "Dept": "Sales",
            "Email": "susan.goh@allinone.com.sg",
            "Role": "User"
        }

        # Staff data to pass into POST request
        staff_1_data = {
            "email": "jack.sim@allinone.com.sg"
        }

        staff_2_data = {
            "email": "susan_goh@allinone.com.sg"
        }

        # Triggering the API
        response_staff_1 = client.post("/login", data=json.dumps(staff_1_data), content_type="application/json")
        output_staff_1 = response_staff_1.json
    
        response_staff_2 = client.post("/login", data=json.dumps(staff_2_data), content_type="application/json")
        output_staff_2 = response_staff_2.json


        # Checking output for Staff 1
        assert response_staff_1.status_code == 200
        assert output_staff_1["code"] == 200
        assert output_staff_1["staff"] == staff_1_response

        # Checking output for Staff 2
        assert response_staff_2.status_code == 200
        assert output_staff_2["code"] == 200
        assert output_staff_2["staff"] == staff_2_response

    def test_staff_login_fail(self,client):
        # Staff data that does not exist to pass into POST request
        staff_data = {
            "email": "jack.goh@allinone.com.sg"
        }

        # Triggering the API
        response_staff = client.post("/login", data=json.dumps(staff_data), content_type="application/json")
        output_staff = response_staff.json

        # Checking output
        assert response_staff.status_code == 404
        assert output_staff["code"] == 404
        assert output_staff["message"] == "Invalid staff email."
    