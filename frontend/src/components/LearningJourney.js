import * as React from 'react';
import {useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import axios from 'axios';

import Summary from './Summary'
import LeftCol from './LeftCol'

import { useNavigate, useParams, useLocation } from "react-router-dom"

  export default function LearningJourney(){

    // Defining constants temporarily -to be updated:
    // URL
    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'
    // Role
    const params = useParams();
    const role = params.role;
    const staffId = localStorage.getItem("staffId");

    // hook to determine if its edit or create
    const [type, setType] = useState("Create")

    // Defining states required to maintain this page
    const  [skills,setSkills] = useState([]);
    const  [selectedSkills,setSelectedSkills] = useState([]);
    const  [courses,setCourses] = useState([]);

    // To do for second part of the page(Summary):
    // Add states tracking for selected course-> need to pass the state and mutator function as props all the way down (Learning Journey->Left_Col->SearchBar->ComponentForCoursesListedUnderSearchBar)
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [attainedSkills, setAttainedSkills] = useState({});
    const [lj, setlj] = useState([]);

    const { state } = useLocation();
    const [ljDetails, setLjDetails] = useState([])

    // First useEffect - only when page load
    useEffect(()=>{
        // Get the details for the specific learning journey
        const getLJDetails = async () => {
            try {
                const response = await axios.get(`${url}viewlearningjourneydetail/${state.ljid}`)

                setLjDetails(response.data.data)
                const selectedCourses = response.data.data.all_courses
                const attainedSkills = response.data.data.all_skills

                if(selectedCourses.length > 0 && attainedSkills.length > 0){
                    let courseNameArr = [];
                    selectedCourses.forEach(course => {
                        courseNameArr.push(course.Course_Name)
                    })

                    setSelectedCourses(courseNameArr)

                    let temp = {};
                    attainedSkills.forEach(skill => {
                        if (temp[skill] === undefined) {
                            temp[skill] = 1;
                        } else {
                            temp[skill] += 1;
                        }
                    })
                    setAttainedSkills(temp);
                }
            }catch(e) {
                console.log("Axios Error");
                // alert("Axios Error")
            }
        }

       // Get the skills needed for selected role
       const getSkills = async () => {
            try {

                const response = await axios.get( `${url}job_role_skill/${encodeURIComponent(params.role.trim())}`)

                setSkills(response.data.data.skills)

            }catch(e) {
                console.log("Axios Error");
                // alert("Axios Error")
            }
        }
        console.log(skills)

        // Invoke api
        if (params && params.role){
            getSkills();
        }
        if (state && state.ljid) {
            getLJDetails();
            setType("Edit")
        }

    },[state,params])

    // Second useEffect - dependency selectedSkills
    useEffect(()=>{
        // To query for all courses that has the selected skills
        const getCourses = async (role) => {

            try {
                const response = await axios.post( `${url}findcoursewithskills`,
                {
                    skills: [...selectedSkills]
                })
                    // Iniitalise the all
                    setCourses(response.data.data.courses)
            }catch(e) {
                console.log("Axios Error");
                setCourses([])
                // alert("Axios Error")
            }
        }

        // Invoke api only if at least skill is selected
        if (selectedSkills && selectedSkills.length > 0){
            getCourses();
        }else{
            setCourses([]);
        }
    },[selectedSkills])

    const navigate = useNavigate();

    const handleClick = () => {
        // if its meant to edit, edit Learnign Journey,else create
        if (type==="Create"){
            createLJ()
        }else{
            updateLJ()
        }
        navigate(`/LearningJourney`);
   }

   const createLJ = async () => {

        try {
            const response = await axios.post( `${url}createlearningjourney`,
            {
                courses: selectedCourses,
                staffid: staffId,
                jobrole: role
            })

                setlj(response.data.data);

        }catch(e) {

            alert("Axios Error")
        }
    }

   const updateLJ = async () => {

        try {
            const response = await axios.post( `${url}editlearningjourney/${state.ljid}`,
            selectedCourses
            )

                setlj(response.data.data);

        }catch(e) {

            alert("Axios Error")
        }
    }

    return(
        <>
            <Grid container spacing={2}>
                <Grid item lg={8} md={12} s={12}>
                    <LeftCol
                        role={params.role}
                        skills = {skills}
                        courses= {courses}

                        selectedSkills={selectedSkills}
                        setSelectedSkills={setSelectedSkills}
                        selectedCourses={selectedCourses}
                        setSelectedCourses={setSelectedCourses}

                        attainedSkills={attainedSkills}
                        setAttainedSkills={setAttainedSkills}
                    />
                </Grid>

                <Grid item lg={4} md={12} s={12}>
                    <Summary
                        skills={skills}
                        courses={courses}
                        selectedSkills={selectedSkills}
                        setSelectedSkills={setSelectedSkills}
                        selectedCourses={selectedCourses}
                        setSelectedCourses={setSelectedCourses}
                        attainedSkills={attainedSkills}
                        setAttainedSkills={setAttainedSkills}
                        handleClick = {handleClick}
                    />
                </Grid>

            </Grid>
        </>
    )
  }