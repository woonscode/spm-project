from flask import Flask, request, jsonify
from sqlalchemy import func
from flask_cors import CORS
from models import db, Course, Skill, Skill_Course, Job_Role, Job_Role_Skill, Role, Staff, Learning_Journey, Learning_Journey_Course, Learning_Journey_Skill, Registration, Staff_External_Skills

app = Flask(__name__)

# Database config has been removed for security reasons
if __name__ == '__main__':
    app.config['SQLALCHEMY_DATABASE_URI'] = ""
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
CORS(app)

@app.route("/login", methods=["POST"])
def login():
    email = request.get_json()
    email = email["email"]
    staff = Staff.query.filter(Staff.Email.like("%"+email+"%")).first()
    if staff:
        roleid = staff.Role
        rolename = Role.query.filter(Role.Role_ID==roleid).first()
        rolename = rolename.Role_Name.strip()
        staff.Role = rolename
        return jsonify(
            {
                "code": 200,
                "staff": staff.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Invalid staff email."
        }
    ), 404

@app.route("/course")
def get_all_courses():
    courselist = Course.query.all()
    if len(courselist):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "courses": [course.json() for course in courselist]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no courses."
        }
    ), 404

@app.route("/course/<string:cname>")
def find_by_cname(cname):
    courselist = Course.query.filter(Course.Course_Name.like("%" + cname + "%")).all()
    if len(courselist):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "courses": [course.json() for course in courselist]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Course not found."
        }
    ), 404

@app.route("/courseid/<string:cname>")
def get_courseid(cname):
    course = Course.query.filter(Course.Course_Name.like("%" + cname + "%")).first()
    if course:
        return jsonify(
            {
                "code": 200,
                "courseid": course.Course_ID,
                "coursename": course.Course_Name
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Course not found."
        }
    ), 404

@app.route("/coursedetails/<string:cid>")
def get_course_details(cid):
    course = Course.query.filter(Course.Course_ID.like("%" + cid + "%")).first()
    if course:
        course.Course_Category = course.Course_Category[:-1] if course.Course_Category[-1] == "\r" else course.Course_Category
        skills = Skill_Course.query.filter(Skill_Course.Course_ID.like("%"+cid+"%")).all()
        skills = [s.Skill_Name for s in skills]
        return jsonify(
            {
                "code": 200,
                "coursedetails": course.json(),
                "skills": skills
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Course not found."
        }
    ), 404

@app.route("/jobrole")
def get_all_jobroles():
    jobrolelist = Job_Role.query.all()
    if len(jobrolelist):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "jobroles": [jobrole.json() for jobrole in jobrolelist]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no jobroles."
        }
    ), 404

@app.route("/get_jobrole_with_skills")
def get_all_jobroles_with_skills():
    jobrolelist = Job_Role_Skill.query.all()
    templist = list(set([j.Job_Role_Name for j in jobrolelist]))
    ans = []
    for t in templist:
        temp = {"Job_Role_Name": t}
        temp['Job_Role_Description'] = Job_Role.query.filter_by(Job_Role_Name=t).first().Job_Role_Description
        skills = Job_Role_Skill.query.filter_by(Job_Role_Name=t).all()
        temp['skills'] = [s.Skill_Name for s in skills]
        ans.append(temp)
    if len(jobrolelist):
        return jsonify(
            {
                "code": 200,
                "jobroles": ans
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no jobroles."
        }
    ), 404

## Search for jobrole with a search term. Can remove this function if search/filtering is done in frontend
@app.route("/jobrole/<string:jname>")
def find_by_jname(jname):
    jobrolelist = Job_Role.query.filter(Job_Role.Job_Role_Name.like("%" + jname + "%")).all()
    if len(jobrolelist):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "jobroles": [jrole.json() for jrole in jobrolelist]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Jobrole not found."
        }
    ), 404

@app.route("/jobroledetails/<string:jname>")
def jobroledetails(jname):
    jobrole = Job_Role.query.filter(Job_Role.Job_Role_Name.like("%" + jname + "%")).first()
    if jobrole:
        skills = Job_Role_Skill.query.filter(Job_Role_Skill.Job_Role_Name.like("%"+jname+"%")).all()
        skills = [s.Skill_Name for s in skills]
        return jsonify(
            {
                "code": 200,
                "data": {
                    "jobroles": jobrole.json(),
                    "skills": skills
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Jobrole not found."
        }
    ), 404

@app.route("/createjobrole", methods=["POST"])
def create_jobrole():
    data = request.get_json()
    jobrolename, jobrolestatus, jobroledesc, relatedskills = data['jobrolename'], data['jobrolestatus'], data['jobroledesc'], data['relatedskills']
    if Job_Role.query.filter(Job_Role.Job_Role_Name.like("%"+jobrolename+"%")).first():
        return jsonify(
            {
                "code": 500,
                "message": "The job role already exists"
            }
        ), 500
    db.session.add(Job_Role(jobrolename, jobroledesc, jobrolestatus))
    db.session.commit()
    for skill in relatedskills:
        print(skill)
        db.session.add(Job_Role_Skill(jobrolename, skill))
        db.session.commit()
    return jsonify(
        {
            "code": 201,
            "message": "the job role and its related skills have been created successfully!"
        }
    ), 201

@app.route("/editjobrole/<string:currjobrolename>", methods=['POST'])
def editjobrole(currjobrolename):
    data = request.get_json()
    newjobrolename, newdesc, status, relatedskills = data['newjobrolename'], data['newdesc'], data['status'], data['relatedskills']
    if newjobrolename == currjobrolename:
        jr = Job_Role.query.filter(Job_Role.Job_Role_Name.like("%"+currjobrolename+"%")).first()
        if newdesc != "":
            jr.Job_Role_Description = newdesc
            db.session.commit()
        jr.Job_Role_Status = status
        db.session.commit()
        Job_Role_Skill.query.filter_by(Job_Role_Name=currjobrolename).delete()
        db.session.commit()
        for s in relatedskills:
            db.session.add(Job_Role_Skill(currjobrolename, s))
            db.session.commit()
        return jsonify(
            {
                "code": 200,
                "message": "The job role and its related skills have been edited successfully!"
            }
        ), 200
    else:
        db.session.add(Job_Role(newjobrolename, newdesc, status))
        affected_ljs = Learning_Journey.query.filter(Learning_Journey.Job_Role_Name.like("%"+currjobrolename+"%")).all()
        for lj in affected_ljs:
            lj.Job_Role_Name = newjobrolename
            db.session.commit()
        Job_Role_Skill.query.filter_by(Job_Role_Name=currjobrolename).delete()
        db.session.commit()
        for s in relatedskills:
            db.session.add(Job_Role_Skill(newjobrolename, s))
            db.session.commit()
        Job_Role.query.filter_by(Job_Role_Name=currjobrolename).delete()
        db.session.commit()
        return jsonify(
            {
                "code": 200,
                "message": "The job role and its related skills have been edited successfully!"
            }
        ), 200


## Create another function to search for job role based on job description??
@app.route("/findcoursewithskills", methods=["POST"])
def find_by_sname():
    skills = request.get_json()
    skills = skills["skills"]
    courselist = Course.query.join(Skill_Course, Course.Course_ID == Skill_Course.Course_ID).add_columns(Course.Course_Name, Course.Course_Status).filter(Skill_Course.Skill_Name.in_(skills)).group_by(Course.Course_Name).having(func.count(Course.Course_Name) == len(skills)).all()
    if len(courselist):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "courses": [c.Course_Name for c in courselist if c.Course_Status == "Active"]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Course not found."
        }
    ), 404

@app.route("/findskillswithcourse/<string:cname>")
def find_by_cname2(cname):
    skills = Skill_Course.query.join(Course, Course.Course_ID == Skill_Course.Course_ID).add_columns(Skill_Course.Skill_Name).filter(Course.Course_Name.like("%" + cname + "%")).all()
    if len(skills):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "skills": [s.Skill_Name for s in skills]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Skills not found."
        }
    ), 404

@app.route("/job_role_skill/<string:jname>")
def find_skills_by_jname(jname):
    skilllist = Job_Role_Skill.query.filter(Job_Role_Skill.Job_Role_Name.like("%"+ jname +"%")).join(Skill, Skill.Skill_Name == Job_Role_Skill.Skill_Name).filter_by(Flag=1).all()
    if len(skilllist):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "skills": [s.Skill_Name for s in skilllist]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "skills not found."
        }
    ), 404

@app.route("/skills")
def get_all_skills():
    skills = Skill.query.all()
    if len(skills):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "skills": [s.json() for s in skills]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no skills."
        }
    ), 404

@app.route("/skills/<string:skillname>", methods=['POST'])
def create_skill(skillname):
    if (Skill.query.filter_by(Skill_Name=skillname).first()):
        return jsonify(
            {
                "code": 400,
                "data": {
                    "Skill_Name": skillname
                },
                "message": "Skill already exists."
            }
        ), 400
    data = request.get_json()
    skill = Skill(skillname, data["Flag"])
    try:
        db.session.add(skill)
        db.session.commit()
    except:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "skillname": skillname
                },
                "message": "An error occurred creating the skill."
            }
        ), 500
    return jsonify(
        {
            "code": 201,
            "data": skill.json()
        }
    ), 201

@app.route("/assignskill", methods=['POST'])
def assign_skill_to_course():
    data = request.get_json()
    skills, courseid = data["skillnames"], data["courseid"]
    Skill_Course.query.filter_by(Course_ID=courseid).delete()
    db.session.commit()
    for skill in skills:
        db.session.add(Skill_Course(skill, courseid))
        db.session.commit()
    return jsonify(
        {
            "code": 201,
            "message": "Skills assigned to course successfully!"
        }
    ), 201

@app.route("/updateskill/<string:skillname>", methods=['POST'])
def update_skill(skillname):
    data = request.get_json()
    new_skillname, flag = data['Skillname'], data['Flag']
    if skillname != new_skillname and Skill.query.filter_by(Skill_Name=new_skillname).first():
        return jsonify(
            {
                "code": 500,
                "message": "Skill name already exists"
            }
        ), 500
    temp_skill = Skill.query.filter_by(Skill_Name=new_skillname).first()
    if temp_skill:
        temp_skill.Flag = flag
        db.session.commit()
        return jsonify(
            {
                "code": 201,
                "data": temp_skill.json(),
                "message": "Update successful!"
            }
        ), 201
    try:
        newskill = Skill(new_skillname, flag)
        db.session.add(newskill)
        db.session.commit()
    except:
        return jsonify(
            {
                "code": 500,
                "message": "Skill name already exists"
            }
        ), 500
    try:
        skillcourselist = Skill_Course.query.filter_by(Skill_Name=skillname).all()
        if len(skillcourselist):
            for sc in skillcourselist:
                sc.Skill_Name = new_skillname
                db.session.commit()
        jobroleskills = Job_Role_Skill.query.filter_by(Skill_Name=skillname).all()
        if len(jobroleskills):
            for jrs in jobroleskills:
                jrs.Skill_Name = new_skillname
                db.session.commit()
        dele = Skill.query.filter_by(Skill_Name=skillname).delete()
        db.session.commit()
    except:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "skillname": skillname
                },
                "message": "An error occurred updating the skill."
            }
        ), 500
    return jsonify(
        {
            "code": 201,
            "data": newskill.json(),
            "message": "Update successful!"
        }
    ), 201

@app.route("/createlearningjourney", methods=['POST'])
def create_lj():
    data = request.get_json()
    coursenames, staffid, jobrole = data['courses'], data['staffid'], data['jobrole']
    check = Learning_Journey.query.filter_by(Staff_ID=staffid, Job_Role_Name=jobrole).first()
    if check:
        return jsonify(
            {
                "code": 400,
                "data": {
                    "staffid": staffid,
                    "jobrole": jobrole
                },
                "message": "Learning Journey already exists."
            }
        ), 400
    lj = Learning_Journey(jobrole, staffid)
    try:
        db.session.add(lj)
        db.session.commit()
    except:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "staffid": staffid,
                    "jobrole": jobrole
                },
                "message": "An error occurred creating the Learning Journey."
            }
        ), 500
    ljid = Learning_Journey.query.filter_by(Staff_ID=staffid, Job_Role_Name=jobrole).first()
    ljid = ljid.LJ_ID
    try:
        for c in coursenames:
            cid = Course.query.filter(Course.Course_Name.like("%" + c + "%")).first()
            cid = cid.Course_ID
            db.session.add(Learning_Journey_Course(ljid, cid))
        db.session.commit()
    except:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "staffid": staffid,
                    "jobrole": jobrole
                },
                "message": "An error occurred creating the Learning Journey."
            }
        ), 500
    return jsonify(
        {
            "code": 201,
            "data": {
                "staffid": staffid,
                "jobrole": jobrole,
                "ljid": ljid
            }
        }
    ), 201

@app.route("/viewlearningjourneys/<string:sid>")
def viewlearningjourneys(sid):
    ljs = Learning_Journey.query.filter_by(Staff_ID=int(sid)).all()
    ljs = [{"ljid": l.LJ_ID, "jobrole": l.Job_Role_Name, "courses_completed": ""} for l in ljs]
    for lj in range(len(ljs)):
        total = len(Learning_Journey_Course.query.filter(Learning_Journey_Course.LJ_ID==ljs[lj]['ljid']).join(Course, Course.Course_ID == Learning_Journey_Course.Course_ID).all())
        completed = len(Learning_Journey_Course.query.filter(Learning_Journey_Course.LJ_ID==ljs[lj]['ljid']).join(Course, Course.Course_ID == Learning_Journey_Course.Course_ID).join(Registration, Registration.Course_ID == Learning_Journey_Course.Course_ID).filter_by(Staff_ID=sid).filter(Registration.Completion_Status.like("%Completed%")).all())
        ljs[lj]['courses_completed'] = str(completed) + " / " + str(total)
    return jsonify(
            {
                "code": 200,
                "data": {
                    "learning_journeys": [lj for lj in ljs]
                }
            }
        )

@app.route("/viewlearningjourneydetail/<string:ljid>")
def viewlearningjourneydetail(ljid):
    lj = Learning_Journey.query.filter_by(LJ_ID=ljid).join(Job_Role, Job_Role.Job_Role_Name == Learning_Journey.Job_Role_Name).add_columns(Job_Role.Job_Role_Name, Job_Role.Job_Role_Description, Learning_Journey.Staff_ID).first()
    sid = lj.Staff_ID
    lj = {"ljid": ljid, "jobrole": lj.Job_Role_Name, "jobroledesc": lj.Job_Role_Description}
    skills = Learning_Journey_Course.query.filter(Learning_Journey_Course.LJ_ID==ljid).join(Course, Course.Course_ID == Learning_Journey_Course.Course_ID).join(Registration, Registration.Course_ID == Learning_Journey_Course.Course_ID).filter_by(Staff_ID=sid).filter(Registration.Completion_Status.like("%Completed%")).join(Skill_Course, Skill_Course.Course_ID == Learning_Journey_Course.Course_ID).add_columns(Skill_Course.Skill_Name).all()
    total = Learning_Journey_Course.query.filter(Learning_Journey_Course.LJ_ID==ljid).join(Course, Course.Course_ID == Learning_Journey_Course.Course_ID).add_columns(Course.Course_Name, Course.Course_ID).all()
    completed = Learning_Journey_Course.query.filter(Learning_Journey_Course.LJ_ID==ljid).join(Course, Course.Course_ID == Learning_Journey_Course.Course_ID).add_columns(Course.Course_Name).join(Registration, Registration.Course_ID == Learning_Journey_Course.Course_ID).filter_by(Staff_ID=sid).filter(Registration.Completion_Status.like("%Completed%")).all()
    completed = [c.Course_Name for c in completed]
    all_skills = Learning_Journey_Course.query.filter(Learning_Journey_Course.LJ_ID==ljid).join(Course, Course.Course_ID==Learning_Journey_Course.Course_ID).join(Skill_Course, Skill_Course.Course_ID==Learning_Journey_Course.Course_ID).add_columns(Skill_Course.Skill_Name).all()
    courses = []
    for t in total:
        tempcourse = Course.query.filter(Course.Course_ID==t.Course_ID).first()
        tempjson = tempcourse.json()
        tempjson["completed"] = "Completed" if t.Course_Name in completed else "Not Completed"
        courses.append(tempjson)
    if len(lj):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "LJ_ID": ljid,
                    "jobrole": lj['jobrole'],
                    "jobroledesc": lj['jobroledesc'],
                    "acquired_skills": list(set([s.Skill_Name for s in skills])),
                    "all_skills": [a.Skill_Name for a in all_skills],
                    "all_courses": courses
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Error in returning Learning Journey detail."
        }
    ), 404

@app.route("/editlearningjourney/<string:ljid>", methods=['POST'])
def editlearningjourneys(ljid):
    ljid = int(ljid)
    newcourses = request.get_json()
    courses = Learning_Journey_Course.query.filter_by(LJ_ID=ljid).delete()
    db.session.commit()
    for nc in newcourses:
        cid = Course.query.filter(Course.Course_Name.like("%" + nc + "%")).first()
        db.session.add(Learning_Journey_Course(ljid, cid.Course_ID))
        db.session.commit()
    try:
        return jsonify(
            {
                "code": 201,
                "message": "Edit successful"
            }
        ), 201
    except:
        return jsonify(
            {
                "code": 500,
                "message": "An error occurred when editing the Learning Journey."
            }
        ), 500

@app.route("/deletelearningjourney/<string:ljid>")
def deletelearningjourney(ljid):
    ljid = int(ljid)
    try:
        courses = Learning_Journey_Course.query.filter_by(LJ_ID=ljid).delete()
        db.session.commit()
        lj = Learning_Journey.query.filter_by(LJ_ID=ljid).delete()
        db.session.commit()
        return jsonify(
            {
                "code": 201,
                "message": "Deletion of Learning Journey successful."
            }
        ), 201
    except:
        return jsonify(
            {
                "code": 500,
                "message": "An error occurred when deleting the Learning Journey."
            }
        ), 500

@app.route("/getallstaffs")
def getallstaffs():
    stafflist = Staff.query.all()
    if len(stafflist):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "staffs": [s.json() for s in stafflist]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no staffs."
        }
    ), 404

@app.route("/coursedonebystaff/<string:staffid>")
def coursedonebystaff(staffid):
    staffid = int(staffid)
    courses = Staff.query.filter_by(Staff_ID=staffid).join(Registration, Registration.Staff_ID == Staff.Staff_ID).add_columns(Registration.Completion_Status, Registration.Course_ID).filter_by(Completion_Status="Completed\r").join(Course, Course.Course_ID == Registration.Course_ID).add_columns(Course.Course_Name, Course.Course_ID).all()
    if len(courses):
        return jsonify(
            {
                "code": 200,
                "courses": [{"Course_ID":c.Course_ID, "Course_Name": c.Course_Name} for c in courses]
            }
        )
    else:
        return jsonify(
            {
                "code": 404,
                "message": "There are no courses."
            }
        ), 404

@app.route("/skillsofstaff/<string:staffid>")
def skillsofstaff(staffid):
    staffid = int(staffid)
    internalskills = Staff.query.filter_by(Staff_ID=staffid).join(Registration, Registration.Staff_ID == Staff.Staff_ID).add_columns(Registration.Completion_Status, Registration.Course_ID).filter_by(Completion_Status="Completed\r").join(Course, Course.Course_ID == Registration.Course_ID).join(Skill_Course, Skill_Course.Course_ID == Course.Course_ID).add_columns(Skill_Course.Skill_Name).all()
    internalskills = [s.Skill_Name for s in internalskills]
    externalskills = Staff_External_Skills.query.filter_by(Staff_ID=staffid).all()
    externalskills = [s.External_Skill for s in externalskills]
    totskills = internalskills + externalskills
    if len(totskills):
        return jsonify(
            {
                "code": 200,
                "skills": totskills
            }
        )
    else:
        return jsonify(
            {
                "code": 404,
                "message": "There are no skills."
            }
        ), 404

@app.route("/addstaffskill", methods=['POST'])
def addstaffskill():
    data = request.get_json()
    staffid, newskill = int(data['staffid']), data['newskill']
    try:
        db.session.add(Staff_External_Skills(staffid, newskill))
        db.session.commit()
        return jsonify(
            {
                "code": 200,
                "message": "New skill added successfully!"
            }
        )
    except:
        return jsonify(
            {
                "code": 500,
                "message": "Error in adding new skill"
            }
        ), 500

@app.route("/filtered_skills")
def get_filtered_skills():
    skills = Skill.query.filter_by(Flag=1).all()
    if len(skills):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "skills": [s.json() for s in skills]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no skills."
        }
    ), 404

@app.route("/get_filtered_jobrole_with_skills")
def get_filtered_jobroles_with_skills():
    jobrolelist = Job_Role_Skill.query.all()
    templist = list(set([j.Job_Role_Name for j in jobrolelist]))
    ans = []
    for t in templist:
        if Job_Role.query.filter_by(Job_Role_Name=t).first().Job_Role_Status == 0:
            continue
        temp = {"Job_Role_Name": t}
        temp['Job_Role_Description'] = Job_Role.query.filter_by(Job_Role_Name=t).first().Job_Role_Description
        skills = Job_Role_Skill.query.filter_by(Job_Role_Name=t).join(Skill, Skill.Skill_Name == Job_Role_Skill.Skill_Name).add_columns(Skill.Skill_Name).filter_by(Flag=1).all()
        temp['skills'] = [s.Skill_Name for s in skills]
        if not temp['skills']: continue
        ans.append(temp)
    if len(jobrolelist):
        return jsonify(
            {
                "code": 200,
                "jobroles": ans
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no jobroles."
        }
    ), 404

@app.route("/findfilteredskillswithcourse/<string:cname>")
def find_by_cname3(cname):
    skills = Skill_Course.query.join(Course, Course.Course_ID == Skill_Course.Course_ID).add_columns(Skill_Course.Skill_Name).join(Skill, Skill.Skill_Name == Skill_Course.Skill_Name).filter_by(Flag=1).filter(Course.Course_Name.like("%" + cname + "%")).all()
    if len(skills):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "skills": [s.Skill_Name for s in skills]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Skills not found."
        }
    ), 404
    
@app.route("/test")
def test():
    return jsonify(
        {
            "code": 200,
            "message": "updated app"
        }
    ), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


