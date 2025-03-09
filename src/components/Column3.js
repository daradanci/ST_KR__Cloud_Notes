import Note from "./Note";
import {Button, Container, CssBaseline, Grid} from "@mui/material";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addNote, editNote, getUserNotes, setCurrentNote, setNotes} from "../store/NoteSlice";
import {exit, getUser,} from "../store/UserSlice";
import DeleteDialog from "./DeleteDialog";




function Column3() {
    const _notes=[
        {title:'Названиеaaaaa aaaaaa aaaaaaa aaaaaaa1', date:'13.01.2023 10:48', content:'_текст_1', user:'daradanci'},
        {title:'Название2', date:'13.01.2023 10:48', content:'_текст_2', user:'daradanci'},
    ]
    const dispatch = useDispatch();
    const {notes} = useSelector((state) => state.notes);
    const {userId} = useSelector((state) => state.userId);
    const {username} = useSelector((state) => state.username);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await dispatch(getUser());
    
                // Ждём userId
                const fetchedUserId = userResponse.payload?.id || userId;
    
                if (fetchedUserId) {
                    console.log(`📌 Загружаем заметки для userId: ${fetchedUserId}`);
                    await dispatch(getUserNotes(fetchedUserId));
                } else {
                    console.error("❌ Ошибка: userId не найден");
                }
            } catch (error) {
                console.error("❌ Ошибка при загрузке данных:", error);
            }
        };
    
        fetchData();
    }, [dispatch]);
    
    
    const handleAdd = async () => {
        if (!userId) {
            console.error("❌ Ошибка: userId отсутствует, не могу добавить заметку");
            return;
        }
    
        const now = new Date().toLocaleString();
    
        let newNote = { 
            title: "new_note", 
            content: "", 
            date: now, 
            userId 
        };
    
        try {
            await dispatch(addNote(newNote));
    
            console.log(`📌 Заметка добавлена:`, newNote);
            await dispatch(getUserNotes(userId));
        } catch (error) {
            console.error("❌ Ошибка при добавлении заметки:", error);
        }
    };
    

    return(

        <Grid element
              // xs={3}
        sx={{backgroundColor:'secondary.semitransparent1'}}
              width={'25vw'}
        >
            <Grid container columns={1} rowSpacing={0}
>

            <Button variant={"contained"}
                    onClick={async()=>{handleAdd()}}
            sx={{backgroundColor:'button.add.main', color:'button.add.text', border:'1px solid', borderColor:'button.add.text',
                width:'100%', borderRadius:'0px', height:'13vh', fontSize:'20px',
            ":hover":{
                backgroundColor:'button.add.border',
            }
            }}
            >
                    Добавить
            </Button>

        </Grid>
            <CssBaseline />
            <Grid container sx={{overflow: 'auto', maxHeight: "87vh",
                    "&::-webkit-scrollbar": {
                      width: 10
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: 'secondary.semitransparent'
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "secondary.button",
                      borderRadius: 2
                    }

            }}
            >
                {notes.map((item, index) => {
                            return (
                                <Grid element key={index} sx={{width:"100%"}} >
                                    <Note {...item}/>
                                </Grid>
                            )
                        })}
            </Grid>



        </Grid>

    )
}

export default Column3;
