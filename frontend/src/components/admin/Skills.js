// react
import { useEffect, useState } from 'react';

// axios
import axios from 'axios';

// material ui

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
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

import AddSkill from './AddSkill';
import EditSkill from './EditSkill'

export default function Skills(){
    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

    const [searchSkill, setSearchSkill] = useState("");
    const [skills, setSkills] = useState([]);
    const [displaySkills, setDisplaySkills] = useState([]);

    const [refresh, setRefresh] = useState(false);
    const [skillName, setSkillName] = useState('');

    useEffect(()=>{
        const getSkills = async () => {
            try {
                const response = await axios.get(`${url}skills`)
                let data = response.data.data.skills
                let formatted = []
                data.forEach((skill) =>
                    formatted.push( {
                        "Skill_Name": skill.Skill_Name,
                        "Flag": skill.Flag === 1 ? <Button variant="contained" style={{backgroundColor:"green"}}>active</Button>:<Button variant="contained" style={{backgroundColor:"red"}}>Inactive</Button>
                    })
                )

                setSkills(formatted)
                setDisplaySkills(formatted)

            }catch(e) {
                const response = await axios.get(`${url}skills`)
                alert("Axios Error")

                let data = response.data.data.skills
                let formatted = []
                data.forEach((skill) =>
                    formatted.push( {
                        "Skill_Name": skill.Skill_Name,
                        "Flag": skill.Flag === 1 ? <Button variant="contained" style={{backgroundColor:"green"}}>active</Button>:<Button variant="contained" style={{backgroundColor:"red"}}>Inactive</Button>
                    })
                )
                setSkills(formatted)
                setDisplaySkills(formatted)
            }
        }

        // invoke api to get all skills
        getSkills();
    }, [refresh])

    useEffect(() =>{

        if (skills && skills.length){
            let filtered = skills.filter(word=>{
            return word.Skill_Name.toLowerCase().includes(searchSkill.toLowerCase())
            })

            setDisplaySkills(filtered)

        } else {
            setDisplaySkills([])
        }
        },[searchSkill,skills])

    const tile = {
        width: '100%',
        backgroundColor: 'white',
        paddingBottom: '50px',
        borderRadius: '20px'
    };

    const columns = [
        { id: 'skillName', label: 'Skill Name', minWidth: 170 },
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

        <div className="adminSkills" style={tile}>
            <Container>

                <Grid sx={{mt: 3, position: 'relative'}} container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 2  }}>
                    <Grid item xs={6} padding-top='20px'>
                        <Typography variant="h1" sx={{ pt: 3, mb:3 }}>Skill List</Typography>
                    </Grid>
                    <Grid item xs={6} padding-top='20px' columnSpacing={{ xs: 1, sm: 2, md: 2}}>
                        <AddSkill
                        refresh={refresh}
                        setRefresh={setRefresh}
                        />
                    </Grid>
                </Grid>




                {/* search component */}
                <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', backgroundColor: '#F3F3F3', marginBottom: '20px'}}
                    >

                    <InputBase
                        onChange={(e)=>{setSearchSkill(e.target.value)}}
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search skills..."
                        value={searchSkill}
                        inputProps={{ 'aria-label': 'search' }}
                    />

                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>

                {/* display skills */}

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
                          displaySkills.length?
                          displaySkills.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row,index) => {
                            return (

                              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                {
                                  Object.entries(row).map((value,i) => {

                                      return (
                                        <TableCell key={i} align="left">
                                          {value[1]}
                                        </TableCell>
                                      );

                                  })
                                }
                                {/* Button For every Row */}
                                <TableCell align="left">
                                    {/* <p>{row.Skill_Name}</p> */}
                                    <EditSkill
                                    skillName={row.Skill_Name}
                                    refresh={refresh}
                                    setRefresh={setRefresh}
                                    flag={row.Flag}
                                    />

                                </TableCell>

                            </TableRow>
                            );
                          }) : <Typography variant="body1" >No Skills Found</Typography>
                        }
                    </TableBody>
                    </Table>
                </TableContainer>


                <TablePagination
                    rowsPerPageOptions={[25, 50, 100]}
                    component="div"
                    count={displaySkills.length}
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
