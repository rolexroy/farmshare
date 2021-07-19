const express = require("express");
const mysql = require('mysql');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const multer = require('multer');
const uuid = require('uuid').v4;

const app = express();
app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
      const { originalname } = file;
      cb(null, `${uuid()}-${originalname}`);
      
    }
   
  });
const upload = multer({ storage });




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.set('views', './views');
app.set('view engine', 'ejs');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'farmshare'

});

connection.connect(function(err) {
    if(err) {
        console.log('error connecting: ' + err.stack);
        return;
    }
});

app.get('/', (req, res) => {
    res.render("index");
}); 

app.get('/blog', (req, res) => {
    const blog = 'SELECT * FROM blog';
    const activities = ' SELECT * FROM activities';
    connection.query(
        blog,
        (error, results) => {
            res.render('blog' , {
                items:results,
            });
        }
    );
});

app.get('/blog/new', (req, res) => {
    res.render('create')
});

app.post('/posts/store', upload.single('myImage'), (req, res) => {
    let articleName = req.body.title;
    let image = req.file.filename;
    connection.query('INSERT INTO blog (title, content, image) VALUES (?, ?, ?)',
    [articleName, req.body.content, image],
    
    (error,results) => { 
        if(error){
            console.log(error)
        } else {
            res.redirect('/blog');
            // console.log('inserted into db')
        }
        
    });
});

//view page
app.get('/post/:id',(req,res) => {
    // get route parameter (id)
    
    let id = Number(req.params.id);
   
        connection.query(        
            'SELECT * FROM blog WHERE id = ? ',[id] ,
            (error,results) => {
            //     console.log(results);
            //   console.log(typeof id)
                 if(results.length === 1){
                    res.render ('view' , {item : results[0]});
                 } else {
                    //  res.render ('error');
                 }
            }
        );
    
});


// edit page
app.get('/blog/:id', upload.single('myImage') ,(req,res) => {
    // get route parameter (id)
    let id = Number(req.params.id);
        connection.query(        
            'SELECT * FROM blog WHERE id = ? ',[id] ,
            (error,results) => {
                // if(results.length === 1){
                    res.render ('edit' , {item : results[0]});
                // } else {
                //     res.render ('error');
                // }
            }
        );
});

//update item
app.post('/update/:id', upload.single('myImage'), (req, res) => {
    let title = req.body.title;
    // console.log(req.file.filename);
    let content = req.body.content;
    // let image = req.body.image;
    let image = req.file.filename;

    connection.query('UPDATE blog SET title = ?, content = ?, image = ? WHERE id = ? ',
        [title, content, image, req.params.id],
        (error, results) => {
            if(error){
                console.log(error)
            } else {
                res.redirect('/blog');
            }
            
        }
    );
});

//delete item
app.post('/delete/:id', (req ,res) => {
    const id = Number(req.params.id);
    connection.query('DELETE FROM blog WHERE id = ?',[id], 
        (error, results) => {
            
                res.redirect('/blog');
            
        
        }
    );
})

app.listen(8080 , () => {
    console.log('App listening on port 8080');
});