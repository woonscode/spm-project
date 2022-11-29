// react
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"

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

export default function Staff(){
    const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'

    const [searchStaff, setSearchStaff] = useState("");
    const [staff, setStaff] = useState([]);
    const [displayStaff, setDisplayStaff] = useState([]);

    const [refresh, setRefresh] = useState(false);

    const navigate = useNavigate();

    const changePage = (e) => {
        
        navigate(`/StaffDetails/${e.target.value}`)
        
        
   }

    useEffect(()=>{
        const getStaff = async () => {
            try {
                const response = await axios.get(`${url}getallstaffs`)
                let data = response.data.data.staffs
                let formatted = []
                data.forEach((staff) =>
                    formatted.push( {
                        
                        "Staff_ID": staff.Staff_ID,
                        "Full_Name": staff.Staff_FName + " " + staff.Staff_LName
                    })
                )

                // formatted is an array of objects
                
                setStaff(formatted)
                setDisplayStaff(formatted)

            }catch(e) {
                const response = await axios.get(`${url}getallstaffs`)
                alert("Axios Error")

                let data = response.data.data.staffs
                // console.log(data)
                let formatted = []
                data.forEach((staff) =>
                    formatted.push( {
                        "Full_Name": staff.Staff_FName + " " + staff.Staff_LName,
                        "Staff_ID": staff.Staff_ID
                    })
                )

                setStaff(formatted)
                setDisplayStaff(formatted)
            }
        }

        // invoke api to get all skills
        getStaff();
    }, [refresh])

    useEffect(() =>{
        
        if (staff && staff.length){
            let filtered = staff.filter(i=>{
                return i.Full_Name.toLowerCase().includes(searchStaff.toLowerCase())
            })
            setDisplayStaff(filtered)
        } else {
            setDisplayStaff([])
        }
        },[searchStaff, staff])

    const tile = {
        width: '100%',
        backgroundColor: 'white',
        paddingBottom: '50px',
        borderRadius: '20px'
    };

    const columns = [
        { id: 'staffID', label: 'Staff ID', minWidth: 100 },
        { id: 'staffName', label: 'Staff Name', minWidth: 180 },
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

        <div className="viewStaff" style={tile}>
            <Container>

                <Grid sx={{mt: 3, position: 'relative'}} container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 2  }}>
                    <Grid item xs={12} padding-top='20px'>
                        <Typography variant="h1" sx={{ pt: 3, mb:3 }}>Staff List</Typography>
                    </Grid>
                </Grid>

                {/* search component */}
                <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', backgroundColor: '#F3F3F3', marginBottom: '20px'}}
                    >

                    <InputBase
                        onChange={(e)=>{setSearchStaff(e.target.value)}}
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search staff..."
                        value={searchStaff}
                        inputProps={{ 'aria-label': 'search' }}
                    />

                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>

                {/* display staff */}

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
                        
                          displayStaff.length ? 
                          displayStaff.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row,index) => {
                            return (
                                

                              <TableRow hover role="checkbox" tabIndex={-1} key={row.First_Name}>
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
                                    <Button onClick={changePage} value={row.Staff_ID}variant="contained" color="primary" size="small" sx={{ mr: 1}}>View Details</Button>
                                </TableCell>

                            </TableRow>
                            );
                          }) : <Typography variant="body1" sx={{mx: 2, py: 2, textAlign: 'center', width:'100%'}}>No Staff Found</Typography>
                        }
                    </TableBody>
                    </Table>
                </TableContainer>


                <TablePagination
                    rowsPerPageOptions={[25, 50, 100]}
                    component="div"
                    count={displayStaff.length}
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

