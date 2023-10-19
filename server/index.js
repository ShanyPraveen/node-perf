// const cluster = require('cluster');
// const crypto = require('crypto');
// cluster.schedulingPolicy = cluster.SCHED_RR

// if (cluster.isMaster) {
//   console.log('Master')
//   cluster.fork()  
// } else {
//   console.log('Child')

//   app.get('/', (req, res) => {
//     crypto.pbkdf2('a', 'b', 100000, 515, 'sha512', () => {
//       res.send('Hello')
//     })
//   })
// }

const mongoose = require('mongoose')
const express = require('express');
const { mongoURI, cookieKey } = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
require('./models/User');
require('./services/passport');

mongoose.connect(mongoURI);

const app = express();

app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [cookieKey]
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/api/user/me', (req, res) => {
  res.send(req.user)
})

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000

app.listen(PORT)

console.log(`Listening on PORT: ${PORT}`)