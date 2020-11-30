const express = require('express')
const app = express();
const bodyParser = require("body-parser");
const studentArray = require('./initialData.js');
const Joi = require('joi');
const port = 8080

app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/api/student', (req, res) => {
    res.send(studentArray);
});

app.get('/api/student/:id', (req, res) => {
    const id = req.params.id;
    const student = studentArray.find(student => student.id === parseInt(id));
    if (!student) {
        res.status(404).send(`Student with id ${id} was not found!`);
        return;
    }
    res.send(student);
});

app.post('/api/student', (req, res) => {
    //req.body
    const schema = Joi.object({
        name: Joi.string().required(),
        currentClass: Joi.number().required(),
        division: Joi.string().required()
    });
    const validationObject = schema.validate(req.body);
    if (validationObject.error) {
        res.status(400).send(validationObject.error.details[0].message);
        return;
    }
    const newId=studentArray.length+1;

    const student = {
        id: newId,
        ...req.body,
        currentClass: parseInt(req.body.currentClass)
    };
    studentArray.push(student);
    res.send({"id":student.id});
});

app.put('/api/student/:id', (req, res) => {
    const id = req.params.id;
    const studentIndex = studentArray.findIndex(student => student.id === parseInt(id));

    if (studentIndex===-1) {
        res.status(400).send("Student with Invalid id");
        return;
    }

    const schema = Joi.object({
        name: Joi.string().required(),
        currentClass: Joi.string().required(),
        division: Joi.string().required()
    });
    
    const validationObject = schema.validate(req.body);
    if (validationObject.error) {
        res.status(400).send("Invalid Update");
        return;
    }
    if(!Number.isInteger(req.body.currentClass)){
            res.status(400).send();
            return; 
    }
    if(studentArray[studentIndex].name!== req.body.name)
        studentArray.splice(studentIndex, 1, {id: parseInt(id),...studentArray[studentIndex],name:req.body.name});
    else if(studentArray[studentIndex].currentClass!== req.body.currentClass)
        studentArray.splice(studentIndex, 1, {id: parseInt(id),...studentArray[studentIndex],currentClass:req.body.currentClass);
    else if(studentArray[studentIndex].division!== req.body.division)                                 
        studentArray.splice(studentIndex, 1, {id: parseInt(id),...studentArray[studentIndex],division:req.body.division);
    //studentArray[studentIndex].id=parseInt(id);
    res.send(studentArray[studentIndex].name);
});

app.delete('/api/student/:id', (req, res) => {
    const id = req.params.id;
    //if id does not exist, return 404
    const studentIndex = studentArray.findIndex(student => student.id === parseInt(id));
    if (studentIndex===-1) {
        res.status(404).send("Student with Invalid id provided");
        return;
    }
    const student = studentArray[studentIndex];
    studentArray.splice(studentIndex, 1);
    res.send(student);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
