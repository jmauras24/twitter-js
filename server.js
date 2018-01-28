const express = require('express');
const app = express();
const db = require('./db');
const nunjucks = require('nunjucks');
nunjucks.configure({ noCache: true });
const path = require('path');


app.set('view engine','html');
app.engine('html',nunjucks.render);

app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));

app.use((req, res, next)=> {
  res.locals.path = req.url;
  next();
});

app.get('/', (req, res, next)=> {
  res.render('index', { title: 'Twitter'});
});

app.get('/tweets', (req, res, next)=> {
  db.getTweets((err,tweets) => {
    res.render('tweets', { title: 'Tweets', tweets: tweets });
  });
});

app.get('/:id', (req, res, next)=> {
  db.getTweet(req.params.id,(err,tweet) => {
    const name = db.getUser(`${tweet.user_id}`,(err,user) => {
      if(err) return console.log(err)
      res.render('tweet', { title: `Tweet: ${user.name}`, user: user,tweet: tweet });
    })
  });
});

db.sync((err) => {
          if(err) return console.log(err)

          db.getUsers((err,users) => {
            if(err) return console.log(err)
            console.log(`Users: ${users.length} users`);
            db.getUserTweets(2,(err,userTweets) =>{
              if(err) return console.log(err)
              console.log(`Tweets from user 8 ${userTweets[0].content} ****`)
            });
              db.getTweets((err,tweets)=>{
                if(err) return console.log(err)
                console.log(`Tweets ${tweets}`)
                // tweets.forEach(element => {
                  //   console.log(element.id)
                  //   console.log(element.content)
                  // });
                });
                db.getUser(3,(err,user) =>{
                  if(err) return console.log(err)
                  console.log(`Single USER ${user}`)
                })

          });
        });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
