const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database("./database/poll.db", (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.run('CREATE TABLE IF NOT EXISTS poll(id int NOT NULL PRIMARY KEY, name TEXT)');
        db.run('CREATE TABLE IF NOT EXISTS answer(id INT NOT NULL PRIMARY KEY, name TEXT, poll_id int, votes int DEFAULT 0, FOREIGN KEY(poll_id) REFERENCES poll(id))');
    }
});


module.exports = db
