const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/createUser', (req, res) => {
    console.log('Creating user...')
    res.status(200).send('User created!')
});

app.get('/logIn', (req, res) => {
    console.log('Login...')
    res.status(200).send('Login!')
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

app.delete('/deletePost', (req, res) => {
    console.log('Deleting post...')
    res.status(200).send('Post deleted!')
});


app.listen(3000, () => {
    console.log('Server is running on port 3000')
});