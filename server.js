const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bp = require('body-parser')


const app = express();
app.use(cors());

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
            
            console.log(messages)
            console.log(typeof data)

            messages.push(data);
            messagesjson = JSON.stringify(messages);
            console.log(messagesjson);
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

// create a route for the app
app.get('/', (req, res) => {
    res.send("API routes only!!")
});
app.post( '/contact', ( req, res ) => {
    console.log(req.body)
    var timestamp = new Date().getTime();

    data = req.body
    data.timestamp = timestamp;

    saveData(data);

    res.redirect( 200, 'thank-you' )
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
