import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LoadingStatus, SuccessStatus, ErrorStatus } from "./pref";
import { addNoteToDB, getNotesFromDB, updateNoteInDB, deleteNoteFromDB } from "./db";

export const getUserNotes = createAsyncThunk(
    'notes/getUserNotes',
    async (userId) => {
        console.log(`📌 Получаем заметки для userId:`, userId);
        const notes = await getNotesFromDB(userId);
        console.log(`📌 Найдено ${notes.length} заметок:`, notes);
        return notes;
    }
);



export const addNote = createAsyncThunk(
    'notes/addNote',
    async (note) => {
        await addNoteToDB(note);
        return note;
    }
);

export const editNote = createAsyncThunk(
    'notes/editNote',
    async (note) => {
        await updateNoteInDB(note);
        return note;
    }
);

export const deleteNote = createAsyncThunk(
    'notes/deleteNote',
    async (note) => {
        console.log(`📌 Удаляем заметку:`, note);
        await deleteNoteFromDB(note.title, note.userId); 
        return note;
    }
);

export const noteSlice = createSlice({
    name: "noteSlice",
    initialState: {
        notes: [],
        noteStatus: '',
        currentNote: { title: '', content: '', date: '' },
        deletingNote: { title: '', content: '', date: '' },
        oldTitle: '',
    },
    reducers: {
        clearNotes: (state) => {
            state.notes = [];
            state.noteStatus = '';
            state.currentNote = { title: '', content: '', date: '' };
            state.deletingNote = { title: '', content: '', date: '' };
            state.oldTitle = '';
            localStorage.clear();
        },
        setNotes: (state, action) => {
            state.notes = action.payload;
        },
        setCurrentNote: (state, action) => {
            state.currentNote = action.payload;
        },
        setDeletingNote: (state, action) => {
            state.deletingNote = action.payload;
        },
        setOldTitle: (state, action) => {
            state.oldTitle = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserNotes.pending, (state) => {
                state.noteStatus = LoadingStatus;
            })
            .addCase(getUserNotes.fulfilled, (state, action) => {
                state.noteStatus = SuccessStatus;
                state.notes = action.payload || [];
                state.currentNote = state.notes[0] || { title: '', content: '', date: '' };
                state.oldTitle = state.currentNote.title || '';
                localStorage.setItem('notes', JSON.stringify(state.notes));
            })
            .addCase(getUserNotes.rejected, (state) => {
                state.noteStatus = ErrorStatus;
                state.notes = JSON.parse(localStorage.getItem('notes')) || [];
            })
            .addCase(addNote.pending, (state) => {
                state.noteStatus = LoadingStatus;
            })
            .addCase(addNote.fulfilled, (state, action) => {
                state.noteStatus = SuccessStatus;
                state.notes.push(action.payload);
            })
            .addCase(addNote.rejected, (state) => {
                state.noteStatus = ErrorStatus;
            })
            .addCase(editNote.pending, (state) => {
                state.noteStatus = LoadingStatus;
            })
            .addCase(editNote.fulfilled, (state, action) => {
                state.noteStatus = SuccessStatus;
                const index = state.notes.findIndex(note => note.title === action.payload.old_title);
                if (index !== -1) {
                    state.notes[index] = action.payload;
                }
            })
            .addCase(editNote.rejected, (state) => {
                state.noteStatus = ErrorStatus;
            })
            .addCase(deleteNote.pending, (state) => {
                state.noteStatus = LoadingStatus;
            })
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.noteStatus = SuccessStatus;
                state.notes = state.notes.filter(note => note.title !== action.payload.title);
            })
            .addCase(deleteNote.rejected, (state) => {
                state.noteStatus = ErrorStatus;
            });
    }
});

export const { clearNotes, setNotes, setCurrentNote, setDeletingNote, setOldTitle } = noteSlice.actions;
export default noteSlice.reducer;
