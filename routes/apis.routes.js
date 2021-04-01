//https://api.edamam.com/api/food-database/v2/parser?ingr=red%20apple&app_id=ce31059e&app_key=7cf99899a948acf6b7b125388190aae3
//f25480f8713d55a9d637ca7eba61f202
const {Router} = require('express')
const Api = require('../models/Api')
const router = Router()

router.get('/',async(req,res)=>{
    try{
        const api = await Api.find()
        res.json(api)
    }catch(e){
        res.status(500).json({message: `Ошибка сервера из post router: ${e}`})
    }
})

router.get('/:id',async(req,res)=>{
    try{
        const api = await Api.findById(req.params.id)
        res.json(api)
    }catch(e){
        res.status(500).json({message: `Ошибка сервера из api router: ${e}`})
    }
})

module.exports = router