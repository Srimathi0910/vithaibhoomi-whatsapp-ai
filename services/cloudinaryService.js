const cloudinary = require("../config/cloudinary");


const uploadImage = (buffer) => {

    return new Promise((resolve, reject) => {


        const stream =
            cloudinary.uploader.unsigned_upload_stream(
                "vithaibhoomi-whatsapp", // your unsigned preset name
                {
                    folder: "crops"
                },

                (error, result) => {

                    if (error) {

                        console.log(
                            "Cloudinary Upload Error",
                            error
                        );

                        reject(error);

                    }
                    else {

                        console.log(
                            "Cloudinary Upload Completed"
                        );

                        resolve(
                            result.secure_url
                        );

                    }

                }
            );


        stream.end(buffer);


    });

};


module.exports = {
    uploadImage
};
