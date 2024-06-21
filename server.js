const express = require('express')
const app = express()
const { initializeApp } = require("firebase/app")
const { MongoClient, ObjectId } = require('mongodb')
const  bodyParser = require('body-parser')
const {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} = require('firebase/auth')

const url = 'mongodb+srv://walther:examenux2coso@examen2ux.ipcjqh9.mongodb.net/?retryWrites=true&w=majority&appName=examen2UX';

const firebaseConfig = {
    apiKey: "AIzaSyBJ9uUQ1aSmLwpMmOxtn4Ao9Lk6TwY6gpg",
    authDomain: "examen2ux-2c3e1.firebaseapp.com",
    projectId: "examen2ux-2c3e1",
    storageBucket: "examen2ux-2c3e1.appspot.com",
    messagingSenderId: "1011066366020",
    appId: "1:1011066366020:web:af91ba7499ee494ce2b411"
};


async function dbConnect() {
    const client = new MongoClient(url);
    await client.connect().then(() => {
        console.log('Connected to the database');
    }).catch((error) => {
        console.log('Error connecting to the database');
        console.log(error);
        process.exit(1);
    });
    return client.db('examen2ux');
}

const firebase = initializeApp(firebaseConfig);
const db = dbConnect();


app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))


//crea un usuario en firebase
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


// inicia sesion de un usuario pasado por medio del body
app.get('/logIn', async (req, res) => {
    var auth = getAuth(firebase);
    const email = req.body.email;
    const password = req.body.pass;
    try{
        await signInWithEmailAndPassword(auth, email, password);
        auth = await getAuth();
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


//cierra sesion de un usuario si es que hay uno
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


//crea un post del usuario que esta actualmente logueado
app.post('/createPost', async (req, res) => {
    const auth = getAuth(firebase);
    const user = auth.currentUser;
    if(!user)
        res.status(401).send('No hay un usuario logeado');
    const description = req.body.description;
    const title = req.body.title;
    const post = {user: user.uid, title: title, description: description};
    try{
        const posts = (await db).collection('Post');
        await posts.insertOne(post);
        res.status(200).send({
            descripcion: 'Post Creado con Exito',
            resultado: post
        });
    }catch(error){
        console.error('Hubo un error al crear el post', error)
        res.status(500).send({
            descripcion: 'No se pudo crear el post',
            resultado: error
        });
    }
});


//lista los post de el usuario que esta actualmente logueado
app.get('/listPost', async(req, res) => {
    const auth = getAuth(firebase);
    const user = auth.currentUser;
    if(!user)
        res.status(401).send('No hay un usuario logeado');
    try{
        const posts = (await db).collection('Post');
        const result = await posts.find({user: user.uid}).toArray();
        res.status(200).send(result);
    }catch(error){
        console.error('Hubo un error al listar los posts', error)
        res.status(500).send({
            descripcion: 'No se pudo listar los posts'
        });
    }    
});


//Edita un post en especifico de el usuario que esta actualmente logueado
app.put('/esitPost/:id', async (req, res) => {
    const auth = getAuth(firebase);
    const user = auth.currentUser;
    if(!user)
        res.status(401).send('No hay un usuario logeado');
    try{
        const posts = (await db).collection('Post');
        await posts.updateOne({user: user.uid, _id: new ObjectId(req.params.id)}, {$set: req.body});
        res.status(200).send({
            descripcion: 'Post Editado con Exito',
            resultado: req.body
        });
    }catch(error){
        console.error('Hubo un error al editar el post')
        res.status(500).send({
            descripcion: 'No se pudo editar el post'
        });
    }
    console.log('Editing post...')
    res.status(200).send('Post edited!')
});


//Elimina un post de el usuario que esta actualmente logueado
app.delete('/deletePost/:id', async (req, res) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if(!user)
        res.status(401).send('No hay un usuario logeado');
    try{
        const posts = (await db).collection('Post');
        await posts.deleteOne({user: user.uid, _id: new ObjectId(req.params.id)});
        res.status(200).send('Post deleted!');
    }catch(error){
        console.error('Hubo un error al eliminar el post', error)
        res.status(500).send({
            descripcion: 'No se pudo eliminar el post'
        });
    }
});

app.get('/user', (req, res) => {
    const a = getAuth();
    res.status(200).send(a.currentUser);
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
});