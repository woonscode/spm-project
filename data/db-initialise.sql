drop database ljps;
CREATE DATABASE IF NOT EXISTS ljps;

USE ljps;

CREATE TABLE IF NOT EXISTS Role (
	Role_ID int NOT NULL,
    Role_Name varchar(20) NOT NULL,
    PRIMARY KEY (Role_ID)
);

CREATE TABLE IF NOT EXISTS Staff (
	Staff_ID int NOT NULL,
    Staff_FName varchar(50) NOT NULL,
    Staff_LName varchar(50) NOT NULL,
    Dept varchar(50) NOT NULL,
    Email varchar(50) NOT NULL,
	Role int NOT NULL,
    PRIMARY KEY (Staff_ID),
    FOREIGN KEY (Role) REFERENCES Role(Role_ID)
);
-- All_Skills attribute of STAFF is derived attribute, so not stored in DB


CREATE TABLE IF NOT EXISTS Staff_External_Skills (
	Staff_ID int NOT NULL,
    External_Skill varchar(50) NOT NULL,
    PRIMARY KEY (Staff_ID, External_Skill),
    FOREIGN KEY (Staff_ID) REFERENCES Staff(Staff_ID)
);

CREATE TABLE IF NOT EXISTS Course (
	Course_ID varchar(20) NOT NULL,
    Course_Name varchar(50) NOT NULL,
    Course_Desc varchar(255),
    Course_Status varchar(15),
    Course_Type varchar(10),
    Course_Category varchar(50),
    PRIMARY KEY (Course_ID)
);

CREATE TABLE IF NOT EXISTS Registration (
	Reg_ID int NOT NULL,
    Course_ID varchar(20) NOT NULL,
    Staff_ID int NOT NULL,
    Reg_Status varchar(20) NOT NULL,
    Completion_Status varchar(20) NOT NULL,
    PRIMARY KEY (Reg_ID),
    FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID),
    FOREIGN KEY (Staff_ID) REFERENCES Staff(Staff_ID)
);

CREATE TABLE IF NOT EXISTS Skill (
    Skill_Name varchar(50) NOT NULL,
    flag int NOT NULL,
    PRIMARY KEY (Skill_Name)
);

CREATE TABLE IF NOT EXISTS Skill_Course (
    Skill_Name varchar(50) NOT NULL,
    Course_ID varchar(20) NOT NULL,
    PRIMARY KEY (Skill_Name, Course_ID),
    FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID),
    FOREIGN KEY (Skill_Name) REFERENCES Skill(Skill_Name)
);

CREATE TABLE IF NOT EXISTS Job_Role (
    Job_Role_Name varchar(25) NOT NULL,
    Job_Role_Description varchar(255),
    Job_Role_Status int NOT NULL,
    PRIMARY KEY (Job_Role_Name)
);

CREATE TABLE IF NOT EXISTS Job_Role_Skill (
    Job_Role_Name varchar(25) NOT NULL,
    Skill_Name varchar(50) NOT NULL,
    PRIMARY KEY (Job_Role_Name, Skill_Name),
	FOREIGN KEY (Job_Role_Name) REFERENCES Job_Role(Job_Role_Name),
    FOREIGN KEY (Skill_Name) REFERENCES Skill(Skill_Name)
);

CREATE TABLE IF NOT EXISTS Learning_Journey (
    LJ_ID int NOT NULL,
    Job_Role_Name varchar(25) NOT NULL,
    Staff_ID int NOT NULL,
    PRIMARY KEY (LJ_ID),
    FOREIGN KEY (Job_Role_Name) REFERENCES Job_Role(Job_Role_Name),
    FOREIGN KEY (Staff_ID) REFERENCES Staff(Staff_ID)
);

CREATE TABLE IF NOT EXISTS Learning_Journey_Course (
    LJ_ID int NOT NULL,
    Course_ID varchar(20) NOT NULL,
    PRIMARY KEY (LJ_ID, Course_ID),
    FOREIGN KEY (LJ_ID) REFERENCES Learning_Journey(LJ_ID),
    FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID)
);

CREATE TABLE IF NOT EXISTS Learning_Journey_Skill (
    LJ_ID int NOT NULL,
    Skill_Name varchar(20) NOT NULL,
    PRIMARY KEY (LJ_ID, Skill_Name),
    FOREIGN KEY (LJ_ID) REFERENCES Learning_Journey(LJ_ID),
    FOREIGN KEY (Skill_Name) REFERENCES Skill(Skill_Name)
);

-- DELETE FROM Course;
-- DELETE FROM Job_Role_Skill;
-- DELETE FROM Job_Role;
-- DELETE FROM Learning_Journey_Course;
-- DELETE FROM Learning_Journey_Skill;
-- DELETE FROM Learning_Journey;
-- DELETE FROM Registration;
-- DELETE FROM Role;
-- DELETE FROM Skill_Course;
-- DELETE FROM Skill;
-- DELETE FROM Staff;
-- DELETE FROM Staff_External_Skills;

LOAD DATA LOCAL INFILE './data/MockData/Role.csv'
INTO TABLE Role
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE './data/MockData/Staff.csv'
INTO TABLE Staff
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE './data/MockData/Staff_External_Skills.csv'
INTO TABLE Staff_External_Skills
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE './data/MockData/Course.csv'
INTO TABLE Course
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE './data/MockData/Registration.csv'
INTO TABLE Registration
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

/*LOAD DATA LOCAL  INFILE './data/MockData/Skill.csv'
INTO TABLE Skill
FIELDS TERMINATED BY '\n'
ENCLOSED BY '"'
LINES TERMINATED BY '\n'  
IGNORE 1 ROWS;*/

INSERT IGNORE INTO Skill values ("Python", 1);
INSERT IGNORE INTO Skill values ("Computer Science", 1);
INSERT IGNORE INTO Skill values ("System Hardware", 1);
INSERT IGNORE INTO Skill values ("Database Systems", 1);
INSERT IGNORE INTO Skill values ("Data Pipeline", 1);
INSERT IGNORE INTO Skill values ("Dart", 1);
INSERT IGNORE INTO Skill values ("React", 1);
INSERT IGNORE INTO Skill values ("Java", 1);
INSERT IGNORE INTO Skill values ("React Native", 1);
INSERT IGNORE INTO Skill values ("Kotlin", 1);
INSERT IGNORE INTO Skill values ("Swift", 1);
INSERT IGNORE INTO Skill values ("Communication", 1);
INSERT IGNORE INTO Skill values ("Data Analytics", 1);
INSERT IGNORE INTO Skill values ("Design Thinking", 1);
INSERT IGNORE INTO Skill values ("Business Acumen", 1);
INSERT IGNORE INTO Skill values ("Mathematics", 1);
INSERT IGNORE INTO Skill values ("Payroll", 1);

/*LOAD DATA LOCAL  INFILE './data/MockData/Skill_Course.csv'
INTO TABLE Skill_Course
FIELDS TERMINATED BY ',' 
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;*/

INSERT IGNORE INTO Skill_Course values ("People Management", "MGT001");
INSERT IGNORE INTO Skill_Course values ("Data Analytics", "COR002");
INSERT IGNORE INTO Skill_Course values ("Communication", "COR004");
INSERT IGNORE INTO Skill_Course values ("Managing People", "MGT007");
INSERT IGNORE INTO Skill_Course values ("Mathematics", "tch015");
INSERT IGNORE INTO Skill_Course values ("Python", "tch015");
INSERT IGNORE INTO Skill_Course values ("Computer Science", "tch015");
INSERT IGNORE INTO Skill_Course values ("Communication", "tch018");
INSERT IGNORE INTO Skill_Course values ("Managing People", "tch018");
INSERT IGNORE INTO Skill_Course values ("System Hardware", "tch012");
INSERT IGNORE INTO Skill_Course values ("Computer Science", "tch012");
INSERT IGNORE INTO Skill_Course values ("Java", "tch012");
INSERT IGNORE INTO Skill_Course values ("Data Analytics", "FIN001");
INSERT IGNORE INTO Skill_Course values ("Data Pipeline", "FIN001");
INSERT IGNORE INTO Skill_Course values ("Database Systems", "FIN001");
INSERT IGNORE INTO Skill_Course values ("Python", "FIN001");
INSERT IGNORE INTO Skill_Course values ("Mathematics", "FIN002");
INSERT IGNORE INTO Skill_Course values ("Business Acumen", "FIN002");
INSERT IGNORE INTO Skill_Course values ("Managing People", "COR006");
INSERT IGNORE INTO Skill_Course values ("Data Pipeline", "tch008");
INSERT IGNORE INTO Skill_Course values ("Database Systems", "tch013");

LOAD DATA LOCAL INFILE './data/MockData/Job_Role.csv'
INTO TABLE Job_Role
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

/*LOAD DATA LOCAL  INFILE './data/MockData/Job_Role_Skill.csv'
INTO TABLE Job_Role_Skill
FIELDS TERMINATED BY ',' 
-- ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;*/

INSERT IGNORE INTO Job_Role_Skill values ("Software Engineer", "Java");
INSERT IGNORE INTO Job_Role_Skill values ("Software Engineer", "Python");
INSERT IGNORE INTO Job_Role_Skill values ("Engineer (Hardware)", "Computer Science");
INSERT IGNORE INTO Job_Role_Skill values ("Engineer (Hardware)", "System Hardware");
INSERT IGNORE INTO Job_Role_Skill values ("Data Engineer", "Database Systems");
INSERT IGNORE INTO Job_Role_Skill values ("Data Engineer", "Data Pipeline");
INSERT IGNORE INTO Job_Role_Skill values ("Data Engineer", "Data Analytics");
INSERT IGNORE INTO Job_Role_Skill values ("Mobile Developer", "Dart");
INSERT IGNORE INTO Job_Role_Skill values ("Mobile Developer", "React");
INSERT IGNORE INTO Job_Role_Skill values ("Mobile Developer", "Java");
INSERT IGNORE INTO Job_Role_Skill values ("Mobile Developer", "React Native");
INSERT IGNORE INTO Job_Role_Skill values ("Mobile Developer", "Kotlin");
INSERT IGNORE INTO Job_Role_Skill values ("Mobile Developer", "Swift");
INSERT IGNORE INTO Job_Role_Skill values ("Product Manager", "Communication");
INSERT IGNORE INTO Job_Role_Skill values ("Product Manager", "Data Analytics");
INSERT IGNORE INTO Job_Role_Skill values ("Product Manager", "Design Thinking");
INSERT IGNORE INTO Job_Role_Skill values ("Product Manager", "Business Acumen");
INSERT IGNORE INTO Job_Role_Skill values ("Accountant", "Mathematics");
INSERT IGNORE INTO Job_Role_Skill values ("Human Resource", "Payroll");
INSERT IGNORE INTO Job_Role_Skill values ("People Operations", "Communication");
INSERT IGNORE INTO Job_Role_Skill values ("Public Affairs", "Communication");
INSERT IGNORE INTO Job_Role_Skill values ("Growth Lead", "Communication");
INSERT IGNORE INTO Job_Role_Skill values ("Social Media Lead", "Communication");
INSERT IGNORE INTO Job_Role_Skill values ("Marketing Lead", "Communication");

LOAD DATA LOCAL INFILE './data/MockData/Learning_Journey.csv'
INTO TABLE Learning_Journey
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE './data/MockData/Learning_Journey_Course.csv'
INTO TABLE Learning_Journey_Course
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE './data/MockData/Learning_Journey_Skill.csv'
INTO TABLE Learning_Journey_Skill
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
