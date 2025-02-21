const app = require('express').Router()
const multer = require('multer');
const productmodel = require("../model/product")
const categorymodel = require("../model/category");
const usignupmodel = require('../Umodel/usignup');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//for saving admin and user
app.post('/pnew', upload.single('Pphoto'), async (request, response) => {
    try {
        const { Pname, Pdescr, Price, Cname, Status, userId } = request.body
        console.log(request.body)
        const newdata = new productmodel({
            Pname,
            Pdescr,
            Price,
            Cname,
            Status,
            userId,
            Pphoto: {
                data: request.file.buffer,
                contentType: request.file.mimetype,
            }})
        await newdata.save();
        res.status(200).json({ message: 'product added successfully' });
    }
    catch (error) {
        response.status(500).json({ error: 'Internal Server Error' });
    }})

//editing product details admin
app.put('/pedit/:id', upload.single('Pphoto'), async (request, response) => {
    try {
        const id = request.params.id;
        const { Pname, Pdescr, Price, Cname, Status } = request.body
        let result = null;
        if (request.file) {
            console.log("hi")
            const updatedData = {
                Pname,
                Pdescr,
                Price,
                Cname,
                Status,
                Pphoto: {
                    data: request.file.buffer,
                    contentType: request.file.mimetype,
                }
            };
            console.log(updatedData)
            result = await productmodel.findByIdAndUpdate(id,updatedData);

        }
        else {
            const updatedData = {
                Pname,
                Pdescr,
                Price,
                Cname,
                Status,
            }
            result = await productmodel.findByIdAndUpdate(id, updatedData);

        }
        if (!result) {
            return response.status(404).json({ message: 'Item not found' });
        }
        response.status(200).json({ message: 'Item updates successfully', data: result });


    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});



//adminview fetch product
app.get('/pview',async(request,response)=>{
    var data = await productmodel.find();
    response.send(data)
})

//userview fetch product
app.get('/upview',async(request,response)=>{
    var data = await productmodel.find({Status:'ACTIVE'});
    response.send(data)
})

//user details on each product
app.get('/puview',async(request,response)=>{
    var data = await usignupmodel.find();
    response.send(data)
})

//deleting product admin
app.put('/updatestatus/:id',async(request,response)=>{
    let id = request.params.id
    await productmodel.findByIdAndUpdate(id,{$set:{Status:"INACTIVE"}})
    response.send("Record Deleted")
})

//For modifing product admin
app.put('/pedit/:id',async(request,response)=>{
    let id = request.params.id
    await productmodel.findByIdAndUpdate(id,request.body)
    response.send("Record updated")
})


//For retriving category data admin and user
app.get('/caview',async(request,response)=>{
    var data = await categorymodel.find({Status:'ACTIVE'});
    response.send(data)
})




app.get('/pdetails/:id', async (request, response) => {   
    try {
        const id = request.params.id;
        const result = await productmodel.findById(id);
        if (!result) {
            return response.status(404).json({ message: 'Product not found' });
        }
        response.json(result);
    } catch (error) {
        response.status(500).json({ message: 'Server error', error: error.message });
    }
});
module.exports = app