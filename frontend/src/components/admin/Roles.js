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

import AddRole from './AddRole';
import ViewRole from './ViewRole'

export default function Roles(){
    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

    const [searchRoles, setSearchRoles] = useState("");
    const [roles, setRoles] = useState([]);
    const [displayRoles, setDisplayRoles] = useState([]);

    const [refresh, setRefresh] = useState(false);

    useEffect(()=>{
        const getRoles = async () => {
            try {
                const response = await axios.get(`${url}jobrole`)
                let data = response.data.data.jobroles
              
                let formatted = []
                data.forEach((role) =>
                    formatted.push( {
                        "Role_Name": role.Job_Role_Name,
                        "Flag": role.Job_Role_Status === 1 ? <Button variant="contained" style={{backgroundColor:"green"}}>active</Button>:<Button variant="contained" style={{backgroundColor:"red"}}>Inactive</Button>,
                        "Role_Description": role.Job_Role_Description
                    })
                )

                setRoles(formatted)
                setDisplayRoles(formatted)

            }catch(e) {
                const response = await axios.get(`${url}jobrole`)
                alert("Axios Error")

                let data = response.data.data.jobroles
                let formatted = []
                data.forEach((role) =>
                    formatted.push( {
                        "Role_Name": role.Job_Role_Name,
                        "Flag": role.Job_Role_Status === 1 ? <Button variant="contained" key={role.Job_Role_Name} style={{backgroundColor:"green"}}>active</Button>:<Button variant="contained" style={{backgroundColor:"red"}}>Inactive</Button>
                    })
                )

                setRoles(formatted)
                setDisplayRoles(formatted)
            }
        }

        // invoke api to get all skills
        getRoles();
    }, [refresh])


    useEffect(() =>{

        if (roles && roles.length){
            let filtered = roles.filter(i=>{
            // return role.Job_Role_Name.toLowerCase().includes(searchRoles.toLowerCase())
            return i.Role_Name.toLowerCase().includes(searchRoles.toLowerCase())
            })
            setDisplayRoles(filtered)
        } else {
            setDisplayRoles([])
        }
        },[searchRoles, roles])

    const tile = {
        width: '100%',
        backgroundColor: 'white',
        paddingBottom: '50px',
        borderRadius: '20px'
    };

    const columns = [
        { id: 'roleName', label: 'Role Name', minWidth: 170 },
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
                        <Typography variant="h1" sx={{ pt: 3, mb:3 }}>Role List</Typography>
                    </Grid>
                    <Grid item xs={6} padding-top='20px' columnSpacing={{ xs: 1, sm: 2, md: 2}}>
                        <AddRole
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
                        onChange={(e)=>{setSearchRoles(e.target.value)}}
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search roles..."
                        value={searchRoles}
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

                          displayRoles.length&&
                          displayRoles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row,index) => {
                            return (

                              <TableRow hover role="checkbox" tabIndex={-1} key={row.Role_Name}>
                                {
                                  Object.entries(row).map((value,i) => {

                                      if (value[0]!=="Role_Description"){
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

                                    <ViewRole
                                    roleName={row.Role_Name}
                                    refresh={refresh}
                                    setRefresh={setRefresh}
                                    flag={row.Flag}
                                    roleDescription={row.Role_Description}
                                    />

                                </TableCell>

                            </TableRow>
                            );
                          })
                        }
                    </TableBody>
                    </Table>
                </TableContainer>


                <TablePagination
                    rowsPerPageOptions={[25, 50, 100]}
                    component="div"
                    count={displayRoles.length}
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