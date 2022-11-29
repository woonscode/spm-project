from models import Course, Skill, Skill_Course, Job_Role, Job_Role_Skill, Role, Staff, Learning_Journey, Learning_Journey_Course, Learning_Journey_Skill, Registration, Staff_External_Skills

# This test file tests the models of all the tables in the database, specifically, the creation of a record in each table

def test_course_model():
    course = Course(Course_ID="COR001", Course_Name="Computational Thinking", Course_Desc="This mod is not an easy mod.", Course_Status="Active", Course_Type="Internal", Course_Category="Core")

    assert course.Course_ID == "COR001"
    assert course.Course_Name == "Computational Thinking"
    assert course.Course_Desc == "This mod is not an easy mod."
    assert course.Course_Status == "Active"
    assert course.Course_Type == "Internal"
    assert course.Course_Category == "Core"

def test_skill_model():
    skill = Skill(Skill_Name="Python", Flag=1)

    assert skill.Skill_Name == "Python"
    assert skill.Flag == 1

def test_skill_course_model():
    skill_course = Skill_Course(Skill_Name="Java", course_ID="IS442")

    assert skill_course.Skill_Name == "Java"
    assert skill_course.Course_ID == "IS442"

def test_job_role_model():
    job_role = Job_Role(Job_Role_Name="DevOps Engineer", Job_Role_Description="DevOps Engineer placeholder description", Job_Role_Status=1)

    assert job_role.Job_Role_Name == "DevOps Engineer"
    assert job_role.Job_Role_Description == "DevOps Engineer placeholder description"
    assert job_role.Job_Role_Status == 1

def test_job_role_skill_model():
    job_role_skill = Job_Role_Skill(Job_Role_Name="Backend Engineer", Skill_Name="Java")

    assert job_role_skill.Job_Role_Name == "Backend Engineer"
    assert job_role_skill.Skill_Name == "Java"

def test_role_model():
    role = Role(Role_ID=1, Role_Name="Admin")

    assert role.Role_ID == 1
    assert role.Role_Name == "Admin"

def test_staff_model():
    staff = Staff(Staff_ID=10101, Staff_FName="Ming", Staff_LName="Yao", Dept="HR", Email="mingyao@gmail.com", Role=2)

    assert staff.Staff_ID == 10101
    assert staff.Staff_FName == "Ming"
    assert staff.Staff_LName == "Yao"
    assert staff.Dept == "HR"
    assert staff.Email == "mingyao@gmail.com"
    assert staff.Role == 2

def test_learning_journey_model():
    learning_journey = Learning_Journey(Job_Role_Name="Backend Engineer", Staff_ID=10203)

    assert learning_journey.LJ_ID == None
    assert learning_journey.Job_Role_Name == "Backend Engineer"
    assert learning_journey.Staff_ID == 10203

def test_learning_journey_course_model():
    learning_journey_course = Learning_Journey_Course(LJ_ID=1, Course_ID="COR001")

    assert learning_journey_course.LJ_ID == 1
    assert learning_journey_course.Course_ID == "COR001"

def test_learning_journey_skill_model():
    learning_journey_skill = Learning_Journey_Skill(LJ_ID=2, Skill_Name="GitHub Actions")

    assert learning_journey_skill.LJ_ID == 2
    assert learning_journey_skill.Skill_Name == "GitHub Actions"

def test_registration_model():
    registration = Registration(Reg_ID=123, Course_ID="COR001", Staff_ID=13242, Reg_Status="Registered", Completion_Status="Completed")

    assert registration.Reg_ID == 123
    assert registration.Course_ID == "COR001"
    assert registration.Staff_ID == 13242
    assert registration.Reg_Status == "Registered"
    assert registration.Completion_Status == "Completed"

def test_registration_model_empty_fields():
    registration = Registration(Reg_ID=123, Course_ID="COR001", Staff_ID=13242, Reg_Status="", Completion_Status="")

    assert registration.Reg_ID == 123
    assert registration.Course_ID == "COR001"
    assert registration.Staff_ID == 13242
    assert registration.Reg_Status == ""
    assert registration.Completion_Status == ""

def test_staff_external_skills_model():
    staff_external_skill = Staff_External_Skills(sid=14212, exskill="Project Management")

    assert staff_external_skill.Staff_ID == 14212
    assert staff_external_skill.External_Skill == "Project Management"