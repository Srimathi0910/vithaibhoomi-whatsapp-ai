require("dotenv").config();

const cloudinary = require("./config/cloudinary");


cloudinary.uploader.upload(
    "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    {
        folder:"test"
    },
    (error,result)=>{

        if(error){

            console.log("FAILED");
            console.log(error);

        }
        else{

            console.log("SUCCESS");
            console.log(result.secure_url);

        }

    }
);
