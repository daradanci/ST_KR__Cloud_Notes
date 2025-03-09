import {Button, Container, Grid, Box, Paper, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {deleteNote, getUserNotes, setCurrentNote, setDeletingNote, setOldTitle} from "../store/NoteSlice";
import {openDeleteDialog} from "../store/UserSlice";
import DeleteDialog from "./DeleteDialog";


function Note(item) {
    const [color, setColor] = useState('primary.main')
    const dispatch = useDispatch();
    const {userId} = useSelector((state) => state.userId);
    const {username} = useSelector((state) => state.username);
    const {currentNote} = useSelector((state) => state.currentNote);
    const {oldTitle} = useSelector((state) => state.oldTitle);

    const clickHandler=async ()=>{
        await dispatch(setOldTitle(item.title))
        await dispatch(setCurrentNote({title:item.title, content:item.content, date:item.date}))
    }
    useEffect(() => {
        const updateColor = async () => {
            if(oldTitle!==item.title){
                setColor('primary.main')
            }
            else{
                setColor('primary.dark')
            }
        }
        updateColor()
    }, [currentNote])
    const deleteHandler = async () => {
        if (!userId) {
            console.error("❌ Ошибка: userId отсутствует, не могу удалить заметку");
            return;
        }
    
        try {
            await dispatch(deleteNote({ userId, title: item.title }));
            await dispatch(getUserNotes(userId)); 
            console.log(`✅ Удалена заметка: ${item.title}`);
        } catch (error) {
            console.error("❌ Ошибка при удалении заметки:", error);
        }
    };
    
    return(

        <Box sx={{ display: 'flex' }}>
            <Paper elevation={2} onClick={async()=>{clickHandler()}}
                   sx={{width:'80%', borderRadius:'1px', borderBottom:'1px solid',
                borderLeft:'1px solid', borderColor:'secondary.main',
                backgroundColor:color, cursor: 'pointer'}

            }>
                <Typography sx={{fontSize:'10px', marginTop:'10px', marginLeft:'20px', color:'button.add.main'}}>
                    {item.date}
                </Typography>

                <Typography sx={{marginLeft:'10px', color:'text.text1',
                    // textOverflow: 'ellipsis',
                    // overflow: 'hidden ',
                    // width:'100px'
                }}

                >
                    {item.title.length>10 ?
                        item.title
                        :
                        item.title


                    }
                </Typography>
            </Paper>
            <Button variant={"contained"} onClick={async()=>{deleteHandler()}}
                    sx={{backgroundColor:'button.exit.main', color:'button.exit.text',
                        width:'20%', borderRadius:'0px', height:'70px', fontSize:'14px',
                        borderLeft:'1px solid',borderRight:'1px solid',borderBottom:'1px solid ', borderColor:'button.exit.text',

                    ":hover":{
                        backgroundColor:'button.exit.border',
                    }
                    }}
                    >
                            X
            </Button>
        </Box>
    )
}

export default Note;
