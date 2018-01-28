const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);

console.log(process.env.DATABASE_URL);
client.connect();

const SQL_SYNC = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT DEFAULT NULL,
    picture_url TEXT
  );

  CREATE TABLE IF NOT EXISTS tweets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    content TEXT DEFAULT NULL
    );
`;

const getUsers = (cb) => {
  client.query('SELECT * from users',(err, results) => {
    if(err) return cb(err)
    console.log(`results ${results.rows}`)
    cb(null,results.rows)
  })

};

const getUser = (id, cb) => {
  client.query('SELECT * from users where id = $1',[id],(err, results) => {
    if(err) return cb(err)
    console.log(`Person: ${results.length}`)
    cb(null,results.rows.length ? results.rows[0]:null)
  })

};
const getUserTweets = (id, cb) => {
  client.query('SELECT content from tweets where user_id = $1 ', [id],(err,results) => {
    if(err) return cb(err)
    console.log(results)
    cb(null,results.rows)
  })
};

const sync = (cb) => {
  client.query(SQL_SYNC,cb);
};

const getTweets = (cb) => {
  client.query('SELECT * from tweets',(err,results) =>{
    if(err) return cb(err)
    cb(null,results.rows)
  })
};

const getTweet = (id, cb) => {
  client.query('SELECT * from tweets where id = $1',[id],(err,results) =>{
    if(err) return cb(err)
    console.log(`Single tweet ${results}`)
    cb(null,results.rows ? results.rows[0] : null)
  })
}

module.exports = {
  sync,
  getUsers,
  getUser,
  getUserTweets,
  getTweets,
  getTweet
};
