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
            resultado: auth.currentUser
        });
    } catch (error) {
        console.error('Hubo un error al Logearse', error)
        res.status(500).send({
            descripcion: 'No se pudologear el usuario en firebase',
            resultado: error
        });
    }
});

app.get('/logOut', (req, res) => {
    const auth = getAuth(firebase);
    try{
        signOut(auth);
        res.status(200).send({
            descripcion: 'Usuario Deslogeado con Exito',
        });
    } catch (error) {
        console.error('Hubo un error al Deslogearse', error)
        res.status(500).send({
            descripcion: 'No se pudo deslogear el usuario en firebase',
            resultado: error
        });
    }
})

app.post('/createPost', async (req, res) => {
    const auth = getAuth(firebase);
    const user = auth.currentUser;
    if(!user)
        res.status(401).send('No hay un usuario logeado');
    const description = req.body.descripton;
    const title = req.body.title;
    const post = {user: user.uid, title: title, description: description};
    try{
        const posts = db.collection('Post');
        posts.insertOne(post);
        res.status(200).send('Post creado con exito');
    }catch(error){
        console.error('Hubo un error al crear el post', error)
        res.status(500).send({
            descripcion: 'No se pudo crear el post',
            resultado: error
        });
    }
});

app.get('/listPost', (req, res) => {
    const auth = getAuth(firebase);
    const user = auth.currentUser;
    if(!user)
        res.status(401).send('No hay un usuario logeado');
    try{
        const posts = db.collection('Post');
        const result = posts.find({user: user.currentUser.uid});
        res.status(200).send(result);
    }catch(error){
        console.error('Hubo un error al listar los posts', error)
        res.status(500).send({
            descripcion: 'No se pudo listar los posts',
            resultado: error
        });
    }    
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