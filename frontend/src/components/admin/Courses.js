// react
import { useEffect, useState } from 'react';

// axios
import axios from 'axios';

// material ui

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import AddRole from './AddRole';
import ViewCourse from './ViewCourse'

/// Need to change editSkill to editRole!!


export default function Courses(){
    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

    const [searchCourses, setSearchCourses] = useState("");
    const [courses, setCourses] = useState([]);
    const [displayCourses, setDisplayCourses] = useState([]);

    const [refresh, setRefresh] = useState(false);

    useEffect(()=>{
        const getCourses = async () => {
            try {
                const response = await axios.get(`${url}course`)
                let data = response.data.data.courses

                let formatted = []
                data.forEach((course) =>
                    formatted.push( {
                        "Course_Name": course.Course_Name,
                        "Flag": course.Course_Status === "Active" ? <Button variant="contained" style={{backgroundColor:"green"}}>Active</Button>:<Button variant="contained" style={{backgroundColor:"red"}}>Inactive</Button>,
                        "Course_Desc": course.Course_Desc,
                        "Course_ID":course.Course_ID
                    })
                )

                setCourses(formatted)
                setDisplayCourses(formatted)

            }catch(e) {
              
                const response = await axios.get(`${url}course`)
                alert("Axios Error")

                let data = response.data.data.courses

                let formatted = []
                data.forEach((course) =>
                    formatted.push( {
                        "Course_Name": course.Course_Name,
                        "Flag": course.Course_Status === "Active" ? <Button variant="contained" style={{backgroundColor:"green"}}>Active</Button>:<Button variant="contained" style={{backgroundColor:"red"}}>Inactive</Button>,
                        "Course_Desc": course.Course_Desc,
                        "Course_ID":course.Course_ID
                    })
                )

                setCourses(formatted)
                setDisplayCourses(formatted)
            }
        }

        // invoke api to get all skills
        getCourses();
    }, [refresh])

    useEffect(() =>{

        if (courses && courses.length){
            let filtered = courses.filter(i=>{
            return i.Course_Name.toLowerCase().includes(searchCourses.toLowerCase())
            })
            setDisplayCourses(filtered)
        } else {
            setDisplayCourses([])
        }
        },[searchCourses, courses])

    const tile = {
        width: '100%',
        backgroundColor: 'white',
        paddingBottom: '50px',
        borderRadius: '20px'
    };

    const columns = [
        { id: 'courseName', label: 'Course Name', minWidth: 170 },
        { id: 'status', label: 'Status', minWidth: 100 },
        { id: 'edit', label: '', minWidth: 100}
    ];

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const handleChangePage = (event, newPage) => {
    setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    };


    return (

        <div className="adminCourses" style={tile}>
            <Container>

                <Grid sx={{mt: 3, position: 'relative'}} container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 2  }}>
                    <Grid item xs={6} padding-top='20px'>
                        <Typography variant="h1" sx={{ pt: 3, mb:3 }}>Course List</Typography>
                    </Grid>
                    {/* <Grid item xs={6} padding-top='20px' columnSpacing={{ xs: 1, sm: 2, md: 2}}>
                        <AddRole
                        refresh={refresh}
                        setRefresh={setRefresh}
                        />
                    </Grid> */}
                </Grid>



                {/* search component */}
                <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', backgroundColor: '#F3F3F3', marginBottom: '20px'}}
                    >

                    <InputBase
                        onChange={(e)=>{setSearchCourses(e.target.value)}}
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search courses..."
                        value={searchCourses}
                        inputProps={{ 'aria-label': 'search' }}
                    />

                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>

                {/* display courses */}

                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 'max-content' }}>
                    {/* <Table> */}
                    <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                        {columns.map((column) => (
                            <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth, backgroundColor:'#223843', color: 'white', fontSize:'18px' }}
                            >
                            {column.label}
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {
                          displayCourses.length ?
                          displayCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row,index) => {
                            return (

                              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                {
                                  Object.entries(row).map((value,i) => {

                                    if (value[0]!=="Course_Desc" && value[0]!=="Course_ID"){
                                      return (
                                        <TableCell key={i} align="left">
                                          {value[1]}
                                        </TableCell>
                                      );
                                    }

                                  })
                                }
                                {/* Button For every Row */}
                                <TableCell align="left">
                                    <ViewCourse
                                    courseName={row.Course_Name}
                                    courseDescription={row.Course_Desc}
                                    courseID={row.Course_ID}
                                    refresh={refresh}
                                    setRefresh={setRefresh}
                                    flag={row.Flag}
                                    />

                                </TableCell>

                            </TableRow>
                            );
                          }): <Typography variant="body1" sx={{mx: 2, py: 2, textAlign: 'center', width:'100%'}}>No Courses Found</Typography>
                        }
                    </TableBody>
                    </Table>
                </TableContainer>


                <TablePagination
                    rowsPerPageOptions={[25, 50, 100]}
                    component="div"
                    count={displayCourses.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                </Paper>


            </Container>
        </div>
    );
}
