import * as React from 'react';
import { Card, CardActions, CardContent, CardMedia }from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import RoleCard from './RoleCard';

// import axios from 'axios';
// import {useState, useEffect } from 'react';

import {
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom"

export default function LJCard({LJName, numCoursesCompleted, ljid, refresh, setRefresh}) {

    //const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/ManageLearningJourney/${encodeURIComponent(LJName.trim())}`, {
            state: {
                LJName: LJName,
                numCoursesCompleted: numCoursesCompleted,
                ljid: ljid
            }
        })
    }

        return (
          <Card variant='outlined' sx={{ minWidth: '40%', height: 250 }}>
              <CardMedia
                  component="img"
                  alt="courseImg"
                  height="140"
                  image= {require ("../assets/LJCardImg.jpg")}
                />

          <CardContent sx={{p: 1}}>
            <Typography color="primary" variant="body1">
                {LJName} Learning Journey
            </Typography>

            <Typography color="primary" sx={{mb:2}} variant="h2">
                {numCoursesCompleted} Courses Completed
            </Typography>

        </CardContent>

        <CardActions sx={{p: 0}}>
            <Button sx={{mx: '6px'}} size="small" onClick={handleClick}>Manage Learning Journey</Button>
        </CardActions>
    </Card>
    );
 }