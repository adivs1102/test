const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser")
const app=express()
// mongodb://localhost:27017/Sample

mongoose.connect("mongodb://127.0.0.1:27017/Sample").then(()=>{
    console.log("connected with mongodb")
}).catch((err)=>{
    console.log(err)
})

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json())


const animalSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    lifeSpan:{
        type:Number,
        required:true,
    }
})

const Animal=new mongoose.model("Animal",animalSchema)

// get animals
app.get("/animals",async(req,res)=>{
    
    const animals=await Animal.find();

    res.status(200).json({success:true,
        animals
    })
})

// Add new animal
app.post("/animal/new",async(req,res)=>{
    // console.log(req.body);

    const animal=await Animal.create(req.body);

    res.status(201).json({
        success:true,
        animal
    })

})

// update animal
app.put("/animal/:id",async(req,res)=>{
    
    let animal = await Animal.findById(req.params.id);

    if(!animal){
        return res.status(500).json({
            success:false,
            message:"Animal not found"
        })
    }

    animal = await Animal.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        useFindAndModify:false,
        runValidators:true
    })

    res.status(200).json({
        success:true,
        animal
    })
})

// Delete animal
app.delete("/animal/:id",async(req,res)=>{

    let animal = await Animal.findById(req.params.id);

    if(!animal){
        return res.status(500).json({
            success:false,
            message:"Animal not found"
        })
    }

    await animal.deleteOne();

    res.status(200).json({
        success:true,
        message:"Animal is deleted successfully"
    })
})


app.listen(4500,()=>{
    console.log("Server is working http://localhost:4500")
})