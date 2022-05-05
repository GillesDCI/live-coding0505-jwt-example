import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

const teas = [
    {
        name:'Tea',
        description:'This is a very tasty tea.'
    },
    {
        name:'Tea 2',
        description:'This is a very tasty tea 2.'
    },
    {
        name:'Tea 3',
        description:'This is a very tasty tea 3.'
    }
];
//Check the token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    console.log("the auth header is", authHeader);

    if(token === null){
        //status unauthorized
        return res.status(401).json({message:'Unauthorized'});
    }

    //we have found a token, verify this token.
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if(err) return res.status(401).json({message:'Unauthorized'});
        
        console.log("User is good to go", payload)

        next();
    })
}


app.get('/teas', authenticateToken, (req ,res) => {
    res.status(200).json(teas);
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const id = req.body.userID;

    //WE SKIP: authenticate this user using bcrypt (DONE!)

    const user = {sub:id, name:username};

    const token = jwt.sign(user,process.env.JWT_SECRET,{expiresIn:'15s'});

    return res.status(200).json({token:token});

});




app.listen(3001, () => {
    console.log("the server is listening for requests...");
})