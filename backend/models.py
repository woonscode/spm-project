from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Course(db.Model):
    __tablename__ = 'Course'

    Course_ID = db.Column(db.String(20), primary_key=True)
    Course_Name = db.Column(db.String(50), nullable=False)
    Course_Desc = db.Column(db.String(255))
    Course_Status = db.Column(db.String(15))
    Course_Type = db.Column(db.String(10))
    Course_Category = db.Column(db.String(50))

    def __init__(self, Course_ID, Course_Name, Course_Desc, Course_Status, Course_Type, Course_Category):
        self.Course_ID = Course_ID
        self.Course_Name = Course_Name
        self.Course_Desc = Course_Desc
        self.Course_Status = Course_Status
        self.Course_Type = Course_Type
        self.Course_Category = Course_Category

    def json(self):
        return {"Course_ID": self.Course_ID, "Course_Name": self.Course_Name, "Course_Desc": self.Course_Desc, "Course_Status": self.Course_Status, "Course_Type":self.Course_Type, "Course_Category": self.Course_Category.strip()}

class Skill(db.Model):
    __tablename__ = 'Skill'

    Skill_Name = db.Column(db.String(50), primary_key=True)
    Flag = db.Column(db.Integer, nullable=False)

    def __init__(self, Skill_Name, Flag):
        self.Skill_Name = Skill_Name
        self.Flag = Flag

    def json(self):
        return {"Skill_Name": self.Skill_Name, "Flag": self.Flag}

class Skill_Course(db.Model):
    __tablename__ = 'Skill_Course'

    Skill_Name = db.Column(db.String(50), db.ForeignKey('Skill.Skill_Name'), primary_key=True)
    Course_ID = db.Column(db.String(20), db.ForeignKey('Course.Course_ID'), primary_key=True)

    def __init__(self, Skill_Name, course_ID):
        self.Skill_Name = Skill_Name
        self.Course_ID = course_ID

    def json(self):
        return {"Skill_Name": self.Skill_Name, "Course_ID": self.Course_ID}

class Job_Role(db.Model):
    __tablename__ = 'Job_Role'

    Job_Role_Name = db.Column(db.String(25), primary_key=True)
    Job_Role_Description = db.Column(db.String(255), nullable=False)
    Job_Role_Status = db.Column(db.Integer, nullable=False)

    def __init__(self, Job_Role_Name, Job_Role_Description, Job_Role_Status):
        self.Job_Role_Name = Job_Role_Name
        self.Job_Role_Description = Job_Role_Description
        self.Job_Role_Status = Job_Role_Status

    def json(self):
        return {"Job_Role_Name": self.Job_Role_Name, "Job_Role_Description": self.Job_Role_Description, "Job_Role_Status": self.Job_Role_Status}

class Job_Role_Skill(db.Model):
    __tablename__ = 'Job_Role_Skill'

    Job_Role_Name= db.Column(db.String(25), db.ForeignKey('Job_Role.Job_Role_Name'), primary_key=True)
    Skill_Name = db.Column(db.String(50), db.ForeignKey('Skill.Skill_Name'), primary_key=True)

    def __init__(self, Job_Role_Name, Skill_Name):
        self.Job_Role_Name = Job_Role_Name
        self.Skill_Name = Skill_Name

    def json(self):
        return {"Job_Role_Name": self.Job_Role_Name, "Skill_Name": self.Skill_Name}

class Role(db.Model):
    __tablename__ = 'Role'

    Role_ID = db.Column(db.Integer, nullable=False)
    Role_Name = db.Column(db.String(50), nullable=False, primary_key=True)

    def __init__(self, Role_ID, Role_Name):
        self.Role_ID = Role_ID
        self.Role_Name = Role_Name

    def json(self):
        return {"Role_ID": self.Role_ID, "Role_Name": self.Role_Name}

class Staff(db.Model):
    __tablename__ = 'Staff'

    Staff_ID = db.Column(db.Integer, nullable=False, primary_key=True)
    Staff_FName = db.Column(db.String(50), nullable=False)
    Staff_LName = db.Column(db.String(50), nullable=False)
    Dept = db.Column(db.String(50), nullable=False)
    Email = db.Column(db.String(50), nullable=False)
    Role = db.Column(db.Integer, db.ForeignKey('Role.Role_ID') , nullable=False)

    def __init__(self, Staff_ID, Staff_FName, Staff_LName, Dept, Email, Role):
        self.Staff_ID = Staff_ID
        self.Staff_FName = Staff_FName
        self.Staff_LName = Staff_LName
        self.Dept = Dept
        self.Email = Email
        self.Role = Role

    def json(self):
        return {"Staff_ID": self.Staff_ID, "Staff_FName": self.Staff_FName, "Staff_LName": self.Staff_LName, "Dept": self.Dept, "Email": self.Email, "Role": self.Role}

class Learning_Journey(db.Model):
    __tablename__ = 'Learning_Journey'

    LJ_ID = db.Column(db.Integer, nullable=False, primary_key=True, autoincrement='auto')
    Job_Role_Name = db.Column(db.String(25), db.ForeignKey('Job_Role.Job_Role_Name'), nullable=False)
    Staff_ID = db.Column(db.Integer, db.ForeignKey("Staff.Staff_ID"), nullable=False)

    def __init__(self, Job_Role_Name, Staff_ID):
        #self.LJ_ID = LJ_ID
        self.Job_Role_Name = Job_Role_Name
        self.Staff_ID = Staff_ID

    def json(self):
        return {"LJ_ID": self.LJ_ID, "Job_Role_Name": self.Job_Role_Name, "Staff_ID": self.Staff_ID}

class Learning_Journey_Course(db.Model):
    __tablename__ = 'Learning_Journey_Course'

    LJ_ID = db.Column(db.Integer, db.ForeignKey('Learning_Journey.LJ_ID'), nullable=False, primary_key=True, )
    Course_ID = db.Column(db.String(20), db.ForeignKey('Course.Course_ID'), nullable=False, primary_key=True)

    def __init__(self, LJ_ID, Course_ID):
        self.LJ_ID = LJ_ID
        self.Course_ID = Course_ID

    def json(self):
        return {"LJ_ID": self.LJ_ID, "Course_ID": self.Course_ID}

## Determine if this table is needed
class Learning_Journey_Skill(db.Model):
    __tablename__ = 'Learning_Journey_Skill'

    LJ_ID = db.Column(db.Integer, db.ForeignKey("Learning_Journey.LJ_ID"), nullable=False, primary_key=True)
    Skill_Name = db.Column(db.String(20), db.ForeignKey("Skill.Skill_Name"), nullable=False, primary_key=True)

    def __init__(self, LJ_ID, Skill_Name):
        self.LJ_ID = LJ_ID
        self.Skill_Name = Skill_Name

    def json(self):
        return {"LJ_ID": self.LJ_ID, "Skill_Name": self.Skill_Name}

class Registration(db.Model):
    __tablename__ = "Registration"

    Reg_ID = db.Column(db.Integer, nullable=False, primary_key=True)
    Course_ID = db.Column(db.String(20), db.ForeignKey("Course.Course_ID"), nullable=False)
    Staff_ID = db.Column(db.Integer, db.ForeignKey("Staff.Staff_ID"), nullable=False)
    Reg_Status = db.Column(db.String(20), nullable=False)
    Completion_Status = db.Column(db.String(20), nullable=False)

    def __init__(self, Reg_ID, Course_ID, Staff_ID, Reg_Status, Completion_Status):
        self.Reg_ID = Reg_ID
        self.Course_ID = Course_ID
        self.Staff_ID = Staff_ID
        self.Reg_Status = Reg_Status
        self.Completion_Status = Completion_Status

    def json(self):
        return {"Reg_ID": self.Reg_ID, "Course_ID": self.Course_ID, "Staff_ID": self.Staff_ID, "Reg_Status": self.Reg_Status, "Completion_Status": self.Completion_Status}
    
class Staff_External_Skills(db.Model):
    __tablename__ = "Staff_External_Skills"

    Staff_ID = db.Column(db.Integer, db.ForeignKey("Staff.Staff_ID"), nullable=False, primary_key=True)
    External_Skill = db.Column(db.String(50), nullable=False, primary_key=True)

    def __init__(self, sid, exskill):
        self.Staff_ID = sid
        self.External_Skill = exskill

    def json(self):
        return {"Staff_ID": self.Staff_ID, "External_Skill": self.External_Skill}
    
