const path= require("path");
const multer =require('multer');

var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/')
    },
    filename: function(req, file, cb) {
        console.log(req.user);
        let ext = path.extname(file.originalname);
        if (ext === '.csv') {
            cb(null, file.originalname);
        } else {
            cb(null, Date.now() + "-" + req.user.id + "-" + file.originalname);
        }
    }
    
})

var upload=multer({
    storage:storage,
    fileFilter:function(req,file,callback){
        if(
            true
        )
        {
            callback(null,true)

        }
        else{
            console.log('pnly jpg & png file supported')
            callback(null,false)
        }

    },

})

module.exports=upload