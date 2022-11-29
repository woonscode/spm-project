// NEED TO ADD IN NEW SKILL NAME

import { useEffect, useState } from 'react';
import axios from 'axios';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Container from '@mui/material/Container';

import EditCourse from './EditCourse'

export default function ViewCourse ({courseName, courseDescription, courseID, refresh, setRefresh, flag}) {
    const [openCourse, setOpenCourse] = useState(false);
    // const handleOpenRole = () => setOpenRole(true);
    const handleCloseCourse = () => setOpenCourse(false);

    const [newCourseStatus, setNewCourseStatus] = useState(flag.props.children==="Active"?1:0);

    const [courseSkills, setCourseSkills] = useState([])

    const [newCourseSkills, setNewCourseSkills] = useState(courseSkills);

    const [openEdit, setOpenEdit] = useState(false);

    // const [updatedCourseName, setUpdatedCoursName] = useState(courseName);
    // const [updatedCourseDescription, setUpdatedCourseDescription] = useState(courseDescription);

    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        height: '70%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 5,
        minWidth: '400px'
      };

    const handleOpenCourse = async () => {
        setOpenCourse(true);
        try{
            const response = await axios.get(`${url}coursedetails/${encodeURIComponent(courseID.trim())}`)

            let data = response.data.skills
            setCourseSkills(data)
            setNewCourseSkills(data)

        }catch(e){
            alert("Axios Error")
        }

    }
    useEffect(() => {
        if(openCourse){
            handleOpenCourse();
        }
    }, [refresh])

    const handleSubmit = async () => {
        setOpenEdit(false);

        try{
            const response = await axios.post(`${url}assignskill`,
                {
                    skillnames: newCourseSkills,
                    courseid: courseID
                })

                if (response.status === 200) {
                    setCourseSkills(newCourseSkills)
                    setRefresh(!refresh)
                }          // set new stuff here
        }

        catch(e){
            alert("Axios Error")
        }


    }

    const saveEdit = (event) => {
        setCourseSkills(newCourseSkills)
        setNewCourseSkills(event.target.value)
      };


    return(
        <div className = "ViewCourse">
            <Button onClick={handleOpenCourse} variant="contained" color="primary" size="small" sx={{ mr: 1}}>View Details</Button>

            <Modal

                open={openCourse}
                onClose={handleCloseCourse}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>

                        <Typography id="modal-modal-description" sx={{ mt: 2 }} variant="h1" component="h2">
                            {courseName} [{courseID}]
                        </Typography>

                        <Container sx={{overflowY: "scroll", height: '340px'}}>
                        <Typography id="modal-modal-description" sx={{ mt: 2, fontWeight: 'bold' }} variant="h6" component="h2">
                            Status: {newCourseStatus===1?"Active":"Inactive"}
                        </Typography>

                        <Typography id="modal-modal-description" sx={{ mt: 2, fontWeight: 'bold' }} variant="h6" component="h2">
                            Course Description
                        </Typography>
                        <p>{courseDescription}</p>

                        <Typography id="modal-modal-description" sx={{ mt: 2, fontWeight: 'bold' }} variant="h6" component="h2">
                            Skills Acquired
                        </Typography>

                        <p>
                        {newCourseSkills.map(skillName => (
                            <li key={skillName}>
                                {skillName}
                            </li>
                            ))}
                        </p>
                        </Container>
                        <EditCourse
                            handleSubmit = {handleSubmit}
                            openEdit = {openEdit}
                            setOpenEdit = {setOpenEdit}
                            saveEdit = {saveEdit}
                            newCourseSkills = {newCourseSkills}
                            setNewCourseSkills = {setNewCourseSkills}
                            courseSkills = {courseSkills}
                        />

                    <CloseIcon sx={{ position: 'absolute', top: '20px', right: '20px'}} onClick={handleCloseCourse}></CloseIcon>

                </Box>
            </Modal>
        </div>
    )
}