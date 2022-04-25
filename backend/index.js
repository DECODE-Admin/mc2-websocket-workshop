const express = require("express");
const cors = require("cors");
const { createServer } = require("http");


const app = express();
app.use(express.json());
const whitelist = ["http://localhost", "http://192.168.9.203"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))
const httpServer = createServer(app);

const db = require("./database/database");
const { randomUUID } = require("crypto");


app.get("/api/reset", (req, res) => {
    const sql = "UPDATE answer SET votes = 0";
    db.run(sql);
    res.send("ok");
})


app.get("/api/poll", (req, res) => {
    db.all('SELECT id, name FROM poll', [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(rows);
      });
})

app.post("/api/poll", (req, res) => {
    console.log(req.body);

    const sql = 'INSERT INTO poll (id, name) VALUES (?,?)';
    const params = [randomUUID(), req.body.name];

    db.run(sql, params);

    const sql2 = 'INSERT INTO answer (id, name, poll_id) VALUES (?,?,?)';

    req.body.answers.forEach(element => {
        db.run(sql2, [randomUUID(), element.name, params[0]]);
    });

    res.send("ok");
});

app.get("/api/poll/:poll_id", (req, res) => {
    
    db.get("SELECT id, name FROM poll WHERE id = ?", [req.params.poll_id], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        const poll_res = row;
        db.all("SELECT id, name, votes FROM answer WHERE poll_id = ?", [req.params.poll_id], (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            const answers_res = rows;
            res.json({
                poll: poll_res || {
                    name: "Looks like you're lost.."
                },
                answers: answers_res
            });
        });
    });
});

const voteUpdated = (poll_id, res) => {
    db.get("SELECT id, name FROM poll WHERE id = ?", [poll_id], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        const poll_res = row;
        db.all("SELECT id, name, votes FROM answer WHERE poll_id = ?", [poll_id], (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            const answers_res = rows;
            return res.json({
                poll: poll_res,
                answers: answers_res
            })
        });
    });


}

app.post("/api/poll/:poll_id/:answer_id", (req, res) => {
    const sql = "UPDATE answer SET votes = votes + 1 WHERE id = ?";
    db.run(sql, [req.params.answer_id]);
    
    voteUpdated(req.params.poll_id, res);
});


httpServer.listen(3001, () => console.log("Server is listening to port 3001"));
