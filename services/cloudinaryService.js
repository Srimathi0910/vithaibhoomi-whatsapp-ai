const cloudinary =
require("../config/cloudinary");


async function uploadImage(buffer){


return new Promise(
(resolve,reject)=>{


cloudinary.uploader
.upload_stream(

{
folder:"vithaibhoomi/crops"
},

(error,result)=>{


if(error)
reject(error);


else
resolve(result.secure_url);


}

)

.end(buffer);



});


}


module.exports=uploadImage;
