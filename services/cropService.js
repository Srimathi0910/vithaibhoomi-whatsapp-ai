const db =
require("../config/firebase");



async function saveCrop(data,imageURL){


await db
.collection("crop")
.add({


name:data.name,


days:data.days,


status:data.status,


description:data.description,


imageURL:imageURL,


createdAt:
new Date(),


updatedAt:
new Date()


});


}


module.exports=saveCrop;
