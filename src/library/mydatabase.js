import Dexie from 'dexie';

const db = new Dexie('myDb');
db.version(1).stores({
    user: `id, login, access_token, refresh_token`
});

export default db;