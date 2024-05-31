import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { config } from "../config/config";

interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
} as CloudinaryConfig);

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfull
    // console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const deleteOnCloudinary = async (imageUrl: string) => {
  try {
    const incomingImageUrl = imageUrl;
    const imageArray = incomingImageUrl.split("/");
    const image = imageArray[imageArray.length - 1];
    const imageName = image.split(".")[0];

    const response = await cloudinary.uploader.destroy(
      imageName,
      (err, result) => {
        if (err) return console.log(err);
        console.log("file is deleted on cloudinary ", result);
      }
    );
    return response;
  } catch (error) {
    console.error("Error deleting file on Cloudinary: ", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
