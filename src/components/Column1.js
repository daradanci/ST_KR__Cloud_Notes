import {Button, Container, Grid, IconButton, Typography} from "@mui/material";
import {exit} from "../store/UserSlice";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {clearNotes} from "../store/NoteSlice";
import GitHubIcon from '@mui/icons-material/GitHub';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { Icon } from '@iconify/react';

function Column1() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {username} = useSelector((state) => state.username);
    const {notes} = useSelector((state) => state.notes);

    const quit=async()=>{
        await dispatch(exit())
        await dispatch(clearNotes())
        // navigate('/');
    }
    return(

        <Grid element
              // xs={3} md={3}
            width={'25vw'}
        sx={{backgroundColor:'secondary.semitransparent1', borderRight:'1px solid', borderColor:'primary.dark'}}

        >
            <Grid container columns={1}
            justifyContent="center"
                    alignItems="center"
            >

                <Grid element xs={12}>
                    <Button variant={"contained"} onClick={quit}
                                                    href="/ST_KR__Cloud_Notes/"
                    sx={{backgroundColor:'button.exit.main', color:'button.exit.text',
                        width:'100%', borderRadius:'0px', height:'13vh', fontSize:'20px',
                    ":hover":{
                        backgroundColor:'button.exit.border',
                    }
                    }}
                    >
                            Выйти
                    </Button>
                </Grid>


                <Grid element
                sx={{marginY:'20px'}}
                >
                    <Typography paragraph
                    sx={{color:'text.text1', marginY:'20px'}}  align={'center'}
                    >
                        Здравствуйте, {username}!
                    </Typography>
                    <Typography paragraph
                    sx={{color:'text.text1', marginY:'20px'}}  align={'center'}
                    >
                        У Вас {notes.length} заметок
                    </Typography>
                    <Typography paragraph
                    sx={{color:'text.text1', borderTop:'solid 1px', borderColor:'primary.dark'}}  align={'center'}
                    >
                        CelestialNotes - сервис облачного хранения Ваших заметок.
                    </Typography>
                    <Typography paragraph
                    sx={{color:'text.text1', borderTop:'solid 1px', borderColor:'primary.dark'}}  align={'center'}
                    >
                        Наши контакты:
                    </Typography>


                </Grid>
                <Grid element
                sx={{marginX:'20px'}}
                >

                    <IconButton sx={{}}
                        target="_blank"
                        href="https://www.twitch.tv/nuclearnecron"
                        >
                            <Icon icon="mdi:twitch"
                                  onMouseOver={({target})=>target.style.color="white"}
                                  onMouseOut={({target})=>target.style.color='#A09DA6'}
                                  style={{
                                        color:'#A09DA6', fontSize:'200%',
                            }}/>
                    </IconButton>

                    <IconButton sx={{}}
                        target="_blank"
                        href="https://github.com/Eaglise/ST_KR__Cloud_Notes/"
                        >
                            <GitHubIcon sx={{
                                color:'text.text2', fontSize:'200%',
                            ":hover":{
                                color:'text.text1',
                            }
                            }}/>
                    </IconButton>

                    <IconButton sx={{}}
                        target="_blank"
                        href="mailto:daradanci@gmail.com"
                        >
                            <AlternateEmailIcon sx={{
                                color:'text.text2', fontSize:'200%',
                            ":hover":{
                                color:'text.text1',
                            }
                            }}/>
                    </IconButton>
                </Grid>

            </Grid>
        </Grid>


    )
}

export default Column1;
