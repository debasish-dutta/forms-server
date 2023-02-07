const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bp = require('body-parser')


const app = express();
app.use(cors());

require('dotenv').config();

// server port configuration
const PORT = process.env.PORT || 3001;

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));


function saveData(data) {
    var buffer = new Buffer.alloc(1024);

    fs.open('messages.json', 'a+', (err, fd) => {
        if (err) throw err;
        fs.read(fd,buffer, 0, buffer.length, 0, (err, byt) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.error('file does not exist');
                }

                throw err;
            }
            if (byt == 0) {
                fs.writeFile("messages.json", '[]', (err) => {
                    if (err) throw err;
                });
                messages = [];
            }
            if (byt > 0) {
                messagesjson = buffer.slice(0, byt).slice(0, byt).toString();
                messages =  JSON.parse(messagesjson);
            }
            

            messages.push(data);
            messagesjson = JSON.stringify(messages);
            fs.writeFile("messages.json",messagesjson, (err) => {
                if (err) throw err;
            });

            fs.close(fd, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        });
            
        });
   
    
}

function Auth(req, res, next) {
    const auth = req.headers.authorization;
    if (auth === process.env.AUTH_KEY) {
      next();
    } else {
      res.status(401);
      res.send('Access forbidden');
    }
}

// create a route for the app
app.get('/', (req, res) => {
    res.send("API routes only!!")
});
app.post( '/contact', ( req, res ) => {
    var timestamp = new Date().getTime();

    data = req.body
    data.timestamp = timestamp;

    saveData(data);

    res.redirect( 200, 'thank-you' )
});
app.get('/getMessages', Auth , (req, res) => {
    data = req.body;
    
    fs.readFile('messages.json', 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.error('file does not exist');
            }

            throw err;
        }

    
    return res.status(200).send(data);

    });   
})
app.get('/downloadJSON', Auth, function(req, res){
    const file = `messages.json`;
    res.download(file);
});

app.use( ( req, res ) => {
    res.status( 404 ).render( '404' ) 
});

app.use( ( err, req, res, next ) => {
    res.status( 500 ).render( 500 ) 
});
    
// server starts listening the `PORT`
app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}/`);
});
