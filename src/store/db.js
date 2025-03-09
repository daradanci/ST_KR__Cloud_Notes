import { openDB } from 'idb';

const DB_NAME = 'appDatabase';
const DB_VERSION = 4;
const STORE_NOTES = 'notes';
const STORE_USERS = 'users';

// 🛠 Инициализация IndexedDB
export async function initDB() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion) {
            console.log(`Обновление IndexedDB: ${oldVersion} → ${newVersion}`);

            if (!db.objectStoreNames.contains(STORE_NOTES)) {
                db.createObjectStore(STORE_NOTES, { keyPath: 'id', autoIncrement: true });
                console.log('✅ Создан STORE_NOTES');
            }

            if (!db.objectStoreNames.contains(STORE_USERS)) {
                const userStore = db.createObjectStore(STORE_USERS, { keyPath: 'id', autoIncrement: true });
                userStore.createIndex("username", "username", { unique: true });
                console.log('✅ Создан STORE_USERS с id');
            }
        },
    });
}

// Функции для работы с заметками
export async function getNotesFromDB(userId) {
    const db = await initDB();
    const tx = db.transaction(STORE_NOTES, 'readonly');
    const store = tx.objectStore(STORE_NOTES);
    const notes = await store.getAll();

    const numericUserId = Number(userId);
    
    console.log(" Все заметки в БД:", notes);

    const userNotes = notes.filter(note => Number(note.userId) === numericUserId);

    console.log(` Фильтрованные заметки для userId ${numericUserId}:`, userNotes);
    
    return userNotes;
}




export async function addNoteToDB(note) {
    const db = await initDB();
    const tx = db.transaction(STORE_NOTES, 'readwrite');
    const store = tx.objectStore(STORE_NOTES);

    if (!note.date) {
        note.date = new Date().toLocaleString();
    }

    const id = await store.add(note);
    await tx.done;
    
    console.log(`✅ Добавлена заметка с ID ${id} для userId ${note.userId}:`, note);
    return id;
}



export async function updateNoteInDB(note) {
    const db = await initDB();
    const tx = db.transaction(STORE_NOTES, 'readwrite');
    const store = tx.objectStore(STORE_NOTES);

    const notes = await store.getAll();

    const numericUserId = Number(note.userId);
    
    const existingNote = notes.find(n => n.title === note.old_title && Number(n.userId) === numericUserId);

    if (!existingNote) {
        console.error(`❌ Ошибка: Заметка "${note.old_title}" для userId ${numericUserId} не найдена`);
        return;
    }

    const updatedNote = { 
        id: existingNote.id,
        title: note.title, 
        content: note.content, 
        date: note.date, 
        userId: numericUserId 
    };

    await store.put(updatedNote);
    await tx.done;
    console.log(`✅ Обновлена заметка с ID ${updatedNote.id}:`, updatedNote);
}

export async function deleteNoteFromDB(title, userId) {
    const db = await initDB();
    const tx = db.transaction(STORE_NOTES, 'readwrite');
    const store = tx.objectStore(STORE_NOTES);

    const notes = await store.getAll();

    const numericUserId = Number(userId);

    const noteToDelete = notes.find(note => note.title === title && Number(note.userId) === numericUserId);

    if (!noteToDelete) {
        console.error(`❌ Ошибка: Заметка "${title}" для userId ${numericUserId} не найдена`);
        return;
    }

    await store.delete(noteToDelete.id);
    await tx.done;
    console.log(`🗑 Удалена заметка с ID ${noteToDelete.id}:`, noteToDelete);
}


//  Функции для работы с пользователями

export async function addUserToDB(user) {
    const db = await initDB();
    const tx = db.transaction(STORE_USERS, 'readwrite');
    const store = tx.objectStore(STORE_USERS);

    const existingUser = await store.index("username").get(user.username);
    if (existingUser) {
        console.warn(`⚠ Пользователь ${user.username} уже существует.`);
        return existingUser;
    }

    const id = await store.add(user);
    await tx.done;
    console.log(`✅ Пользователь добавлен: ${user.username} (ID: ${id})`);
    return { ...user, id };
}

export async function getUserFromDB(username) {
    const db = await initDB();
    const tx = db.transaction(STORE_USERS, 'readonly');
    const store = tx.objectStore(STORE_USERS);
    const index = store.index("username");
    const user = await index.get(username);
    return user || null;
}

export async function getUserById(userId) {
    const db = await initDB();
    const tx = db.transaction(STORE_USERS, 'readonly');
    const store = tx.objectStore(STORE_USERS);
    const user = await store.get(userId);
    return user || null;
}
