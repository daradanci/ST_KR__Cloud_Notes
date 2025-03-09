import MainTitle from "./MainTitle";
import {Box, Button, Container, Grid, IconButton, TextField, Typography} from "@mui/material";
import SaveAsSharpIcon from '@mui/icons-material/SaveAsSharp';
import {useDispatch, useSelector} from "react-redux";
import {addNote, editNote, getUserNotes, setCurrentNote, setOldTitle} from "../store/NoteSlice";
import {useEffect, useState} from "react";

function Column2() {
    const dispatch = useDispatch();
    const {userId} = useSelector((state) => state.userId);
    const {username} = useSelector((state) => state.username);
    const {currentNote} = useSelector((state) => state.currentNote);
    const {oldTitle} = useSelector((state) => state.oldTitle);
    const [formTitle, setFormTitle] = useState(currentNote.title);
    const [formContent, setFormContent] = useState(currentNote.content);

    const handleUpdate = async () => {
        if (!userId) {
            console.error("❌ Ошибка: userId отсутствует");
            return;
        }
    
        let updatedCurrentNote = {
            title: formTitle,
            content: formContent,
            date: currentNote.date,
            userId,
            old_title: oldTitle
        };
    
        try {
            await dispatch(editNote(updatedCurrentNote));
            await dispatch(getUserNotes(userId));
            console.log("✅ Заметка успешно обновлена:", updatedCurrentNote);
        } catch (error) {
            console.error("❌ Ошибка при обновлении заметки:", error);
        }
    };
    

    useEffect(() => {
        setFormTitle(currentNote.title);
        setFormContent(currentNote.content);
    }, [currentNote]);
    return(
        <Grid element
              // xs={6}
            width={'50vw'}

        >
        <MainTitle/>
                <Box component="form"  noValidate sx={{ mt: 1, flexGrow: 1 }} >
            <Grid container columns={1} direction="column" justifyContent="center"  alignItems="center" width={'100%'}
>
                <Grid element sx={{ width:'100%'}}>
                    <Box sx={{ display: 'flex', flexDirection: 'row',
                     justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        // border:'2px solid pink',
                    }}>

                        <IconButton sx={{marginLeft:'25%'}}
                        onClick={async()=>{handleUpdate()}}
                        >
                            <SaveAsSharpIcon sx={{
                                color:'secondary.button', fontSize:'200%',
                            ":hover":{
                                color:'button.add.main',
                            }
                            }}/>
                        </IconButton>

                        <TextField
                          id="title"
                          label="Название заметки"
                          // multiline
                          rows={1}
                          variant="filled"

                          sx={{

                              backgroundColor:'primary.dark', width:'35%',
                              borderRadius:'5px',
                          "& .MuiInputBase-root": {
                                color: 'text.text1'
                            },
                          "& .MuiFormLabel-root": {
                                color: 'text.text1'
                          },
                          "& .MuiFormLabel-root.Mui-focused": {
                                color: 'text.text2'
                          },
                          }}
                          onChange={async(e)=>{
                              e.preventDefault();
                              setFormTitle(e.target.value)
                          }}
                          value={formTitle}
                        />
                    </Box>

                </Grid>
                <Grid element sx={{width:'100%', marginTop:'20px'}}>

                <TextField
                      id="content"
                      label="Текст заметки"
                      multiline
                      rows={18}
                      variant="filled"
                      sx={{backgroundColor:'primary.dark', width:'100%',
                      "& .MuiInputBase-root": {
                            color: 'text.text1',
                            // height:'70vh',
                        },
                      "& .MuiFormLabel-root": {
                            color: 'text.text1'
                      },
                      "& .MuiFormLabel-root.Mui-focused": {
                            color: 'text.text2'
                      }
                      }}
                      onChange={async(e)=>{
                              e.preventDefault();
                                setFormContent(e.target.value)
                          }}
                      value={formContent}


                />
                </Grid>
            </Grid>
                </Box>


        </Grid>
    )
}

export default Column2;
