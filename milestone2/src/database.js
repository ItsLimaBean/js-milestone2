const { readFile, writeFile } = require("fs").promises;
const path = require("path");

let database = {}
let dbPath = path.join(__dirname, "..", "database", "data.json");

const load = () => {
    return readFile(dbPath).then(data => {
        return database = JSON.parse(data);
    });
}

const getUsers = () => {
    return database;
}

const getDetails = (user) => {
    return {
        username: user.username,
        profileImage: `/photos/${user.username}/${user.profile}`,
        profile: `/feed?username=${user.username}`,
        photos: user.photos.map(u => `/photos/${user.username}/${u}`),
        stats: user.stats,
        description: user.description
    };
}

const getUserDetails = (username) => {
    for (const u of getUsers()) {
        if (u.username === username) {
            return getDetails(u);
        }
    }

    return undefined
}

const addPhoto = (username, photoName) => {
    for (let i = 0; i < database.length; i++) {
        if (database[i].username === username) {
            database[i].photos.push(photoName);
            break;
        }
    }

    return writeFile(dbPath, JSON.stringify(database, null, 2));
}

module.exports = { load, getUsers, getDetails, getUserDetails, addPhoto };