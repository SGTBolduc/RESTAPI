const express = require("express");
const bodyparser = require("body-parser");
const { default: nodemon } = require("nodemon");
const app = express();
app.use(bodyparser.json());


let patients = new Object();
patients[420129999] = ["John", "Cena", "303-867-5309"]
patients[666209696] = ["Patrick","Bateman","212-555-6342"]


let records = new Object();
records["420129999"] = "Status: Invisible"
records["666209696"] = "Status: Crazy"


// Get patient medical records
app.get("/records", (req, res) => {
     

    // Verify patient exists
    if (records[req.headers.ssn] === undefined) {
        res.status(404).send({"msg":"patient not found."})
        return;
    }

    // Verify SNN matches first and last name
    if (req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][1]) {
        if(req.body.reasonforvisit === "medicalrecords") {
                // return medical records
                res.status(200).send(records[req.headers.ssn]);
                return;
        }
         else {
              //return error
            res.status(501).send({"msg":"unable to complete request at this time: " + req.body.reasonforvisit})
            return; 
        }
 }
    else {
        res.status(401).send({"msg":"first or last didn't match ssn."})
        return;  
    }     
    
    // Return appropriate record 
    res.status(200).send({"msg": "HTTP GET - SUCCESS!"})
 });


// Create a new patient 
app.post("/", (req, res) => {
    
    
    //Creat new patient in database
    patients[req.headers.ssn] = [req.headers.firstname, req.headers.lastname, req.headers.phone]
    res.status(200).send(patients)
});


// Update existing patient phone number
app.put("/", (req, res) => {

    // Verify patient exists
    if (records[req.headers.ssn] === undefined) {
        res.status(404).send({"msg":"patient not found."})
        return;
    }

    
    if (req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][1]) {
      //update the phone number and return the patient info
        patients[req.headers.ssn] = [req.headers.firstname, req.headers.lastname, req.body.phone]
        res.status(200).send(patients[req.headers.ssn]);
        return;
    }
    else {
        res.status(401).send({"msg":"first or last didn't match ssn. (trying to update phone #)"})
        return;  
    }    

    //Makure sure
    res.status(200).send({"msg": "HTTP PUT - SUCCESS!"})

});


// Delete patient records
app.delete("/", (req, res) => {

    // Verify patient exists
    if (records[req.headers.ssn] === undefined) {
        res.status(404).send({"msg":"patient not found."})
        return;
    }

    // Verify SNN matches first and last name
    if (req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][1]) {
        // delete patient and medical records from database

        delete patients[req.headers.ssn]
        delete records[req.headers.ssn] 

        res.status(200).send({"msg": "successfully deleted patient."});
        return;
    }   
    else {
        res.status(401).send({"msg":"first or last didn't match ssn. (trying to delete)"})
        return;  
    }  
    
});


app.listen(3000);