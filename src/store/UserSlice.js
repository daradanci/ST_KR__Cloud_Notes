import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ErrorStatus, LoadingStatus, SuccessStatus } from "./pref";
import { addUserToDB, getUserFromDB } from "./db";

export const addUser = createAsyncThunk(
    'users/addUser',
    async (newUser) => {
        const existingUser = await getUserFromDB(newUser.username);
        if (existingUser) {
            throw new Error("Пользователь уже существует");
        }
        await addUserToDB({
            username: newUser.username,
            password: newUser.password,
        });
        return { username: newUser.username };
    }
);

export const authUser = createAsyncThunk(
    'users/authUser',
    async (user) => {
        const existingUser = await getUserFromDB(user.username);
        if (!existingUser || existingUser.password !== user.password) {
            throw new Error("Неверные учетные данные");
        }
        localStorage.setItem('accessToken', JSON.stringify(existingUser));
        return existingUser;
    }
);

export const getUser = createAsyncThunk(
    'users/getUser',
    async () => {
        const userData = JSON.parse(localStorage.getItem('accessToken'));
        if (!userData) throw new Error("Нет сохраненного пользователя");
        return userData;
    }
);

export const userSlice = createSlice({
    name: "userSlice",
    initialState: {
        userId: 0,
        username: "",
        password: "",
        accessToken: "",
        userStatus: "",
        userError: "",
        alertOpen: false,
        deleteDialogOpen: false
    },
    reducers: {
        exit: (state) => {
            state.userId = 0;
            state.username = "";
            state.password = "";
            state.accessToken = "";
            localStorage.clear();
            state.userStatus = "";
            state.userError = "";
            state.alertOpen = false;
            state.deleteDialogOpen = false;
        },
        updateUsername: (state, action) => {
            state.username = action.payload;
        },
        updatePassword: (state, action) => {
            state.password = action.payload;
        },
        openAlert: (state) => {
            state.alertOpen = true;
        },
        closeAlert: (state) => {
            state.alertOpen = false;
        },
        openDeleteDialog: (state) => {
            state.deleteDialogOpen = true;
        },
        closeDeleteDialog: (state) => {
            state.deleteDialogOpen = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addUser.pending, (state) => {
                state.userStatus = LoadingStatus;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.userStatus = SuccessStatus;
                state.username = action.payload.username;
            })
            .addCase(addUser.rejected, (state, action) => {
                state.userStatus = ErrorStatus;
                state.userError = action.error.message;
            })
            .addCase(authUser.pending, (state) => {
                state.userStatus = LoadingStatus;
            })
            .addCase(authUser.fulfilled, (state, action) => {
                state.accessToken = action.payload;
                state.userStatus = SuccessStatus;
            })
            .addCase(authUser.rejected, (state, action) => {
                state.userStatus = ErrorStatus;
                state.userError = action.error.message;
            })
            .addCase(getUser.pending, (state) => {
                state.userStatus = LoadingStatus;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.userId = action.payload.id;
                state.username = action.payload.username;
                state.userStatus = SuccessStatus;
                localStorage.setItem('userId',state.userId )
                localStorage.setItem('username',state.username )
            })
            .addCase(getUser.rejected, (state, action) => {
                state.userStatus = ErrorStatus;
                state.userError = action.error.message;
                state.userId=localStorage.getItem('userId')
                state.username=localStorage.getItem('username')
            });
    }
});

export const { exit, updateUsername, updatePassword, openAlert, closeAlert, openDeleteDialog, closeDeleteDialog } = userSlice.actions;
export default userSlice.reducer;
