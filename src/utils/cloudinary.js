import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const upload_file_on_cloudinary = async (file) => {
    try{
        if(!file) return null
        const response = await cloudinary.uploader.upload(file, {
            resource_type:"auto"
        })
        console.log("File uploaded on cloudinary")
        return response
    }catch(err){
        fs.unlinkSync(local_file)
        return null
    }
}
export default upload_file_on_cloudinary