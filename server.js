const express = require('express')
const app = express()
const { initializeApp } = require("firebase/app")
const { MongoClient } = require('mongodb')
const  bodyParser = require('body-parser')
const {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} = require('firebase/auth')



async function dbConnect() {
    const client = new MongoClient('mongodb+srv://walther:examenux2coso@examen2ux.ipcjqh9.mongodb.net/?retryWrites=true&w=majority&appName=examen2UX');
    await client.connect().then(() => {
        console.log('Connected to the database');
    }).catch((error) => {
        console.log('Error connecting to the database');
        console.log(error);
        process.exit(1);
    });
    return client.db('examen2ux');
}

const firebaseConfig = {
    apiKey: "AIzaSyBJ9uUQ1aSmLwpMmOxtn4Ao9Lk6TwY6gpg",
    authDomain: "examen2ux-2c3e1.firebaseapp.com",
    projectId: "examen2ux-2c3e1",
    storageBucket: "examen2ux-2c3e1.appspot.com",
    messagingSenderId: "1011066366020",
    appId: "1:1011066366020:web:af91ba7499ee494ce2b411"
};
  


const firebase = initializeApp(firebaseConfig);
const db = dbConnect();


app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))

app.post('/createUser', async (req, res) => {
    const auth = getAuth(firebase);
    const email = req.body.email;
    const password = req.body.pass;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        (await db).collection('Post').insertOne({user: userCredential.user.uid, Posts:[]})
        res.status(200).send({
            descripcion: 'Usuario Creado con Exito',
            resultado: userCredential
        });
    } catch (error) {
        console.error('Hubo un error al crear el usuario', error)
        res.status(500).send({
            descripcion: 'No se pudo crear el usuario en firebase',
            resultado: error
        });
    }
});

app.get('/logIn', (req, res) => {
    const auth = getAuth(firebase);
    const email = req.body.email;
    const password = req.body.pass;
    try{
        const userCredential = signInWithEmailAndPassword(auth, email, password);
        res.status(200).send({
            descripcion: 'Usuario Logeado con Exito',
            resultado: userCredential
        });
    } catch (error) {
        console.error('Hubo un error al Logearse', error)
        res.status(500).send({
            descripcion: 'No se pudologear el usuario en firebase',
            resultado: error
        });
    }
});

app.post('/createPost', (req, res) => {
    console.log('Creating post...')
    res.status(200).send('Post created!')
});

app.get('/listPost', (req, res) => {
    console.log('Listing posts...')
    res.status(200).send('Posts listed!')
});

app.put('/esitPost/:id', (req, res) => {
    console.log('Editing post...')
    res.status(200).send('Post edited!')
});

app.delete('/deletePost:id', (req, res) => {
    console.log('Deleting post...')
    res.status(200).send('Post deleted!')
});

app.get('/user', (req, res) => {
    const a = getAuth();
    res.status(200).send(a.currentUser);
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
});