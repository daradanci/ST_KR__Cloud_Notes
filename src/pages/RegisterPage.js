import {useNavigate} from "react-router-dom";
import {
    Box,
    Checkbox,
    Container,
    FormControlLabel,
    Grid,
    TextField,
    Typography,
    Link,
    Button,
    InputLabel, InputAdornment,

} from "@mui/material";
import MainTitle from "../components/MainTitle";
import {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {addUser, closeAlert, openAlert, resetUserStatus} from "../store/UserSlice";
import {ErrorStatus, LoadingStatus, SuccessStatus} from "../store/pref";
import AlertDialog from "../components/AlertDialog";


function RegisterPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [alertMessage, setAlertMessage] = useState({});
    const { userStatus} = useSelector((state) => state.userStatus);
    const { userError} = useSelector((state) => state.userError);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
    
        if (data.get("password") === data.get("password2")) {
            await dispatch(addUser({
                username: data.get("username"),
                password: data.get("password")
            }));
    
            dispatch(resetUserStatus());
        }
    };
    
    useEffect(() => {
        console.log("🔹 useEffect сработал, userStatus:", userStatus);
    
        const alerting = async () => {
            switch (userStatus) {
                case ErrorStatus:
                    setAlertMessage({ type: ErrorStatus, title: "Ошибка", text: userError, mode: "registering" });
                    await dispatch(openAlert());
                    break;
                case SuccessStatus:
                    setAlertMessage({ type: SuccessStatus, title: "Готово!", text: "Аккаунт успешно создан.", mode: "registering" });
                    await dispatch(openAlert());
                    break;
                case LoadingStatus:
                    setAlertMessage({ type: LoadingStatus, title: "Загрузка", text: "", mode: "registering" });
                    await dispatch(openAlert());
                    break;
            }
        };
    
        alerting();
    }, [userStatus, dispatch]);
    
    
    
    return(
        <>
            <MainTitle/>
        <Container  component="main" maxWidth="xs" sx={{backgroundColor:'secondary.semitransparent',
        borderRadius:'20px'
        }}>

        <Box
            sx={{
                marginTop: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height:'440px',
                paddingY:'40px',
            }}
        >
            <Typography component="h1" variant="h5" sx={{color:'white'}}>Регистрация</Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1}}>
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >

                    <Typography sx={{color:'text.text1',textAlign:'left',
                        justifySelf:'left',
                        display:'block',
                        width:'100%'
                    }}>Логин</Typography>


                <TextField
                    required
                    fullWidth
                    id="username"
                    // label="Логин"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    sx={{backgroundColor:'white',
                        // padding:'4px',
                        borderRadius:'20px',
                        marginBottom:'10px',
                        ":hover":{
                        },


                    }}

                />
                    <Typography sx={{color:'text.text1',textAlign:'left',
                        justifySelf:'left',
                        display:'block',
                        width:'100%'
                    }}>Пароль</Typography>
                <TextField
                    required
                    fullWidth
                    name="password"
                    // label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    sx={{backgroundColor:'white', borderRadius:'20px',
                                                marginBottom:'10px',

                    }}
                />

                    <Typography sx={{color:'text.text1',textAlign:'left',
                        justifySelf:'left',
                        display:'block',
                        width:'100%'
                    }}>Повтор пароля</Typography>
                <TextField

                    required
                    fullWidth
                    name="password2"
                    // label="Password"
                    type="password"
                    id="password2"
                    autoComplete="current-password"
                    sx={{backgroundColor:'white', borderRadius:'20px',

                    }}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"

                    sx={{ mt: 3, mb: 2, height:'50px', color:'secondary.main', backgroundColor:'white',
                        borderRadius:'20px',
                        ":hover":{
                        color:'text.text1'
                        }
                    }}
                >
                    Регистрация
                </Button>
                    <AlertDialog {...alertMessage}/>
                </Grid>
            </Box>
        </Box>
        </Container>
        </>
    )

}

export default RegisterPage;

