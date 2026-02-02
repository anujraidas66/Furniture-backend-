import cloudinary from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const fileUpload = async (files) => {
    try {
        const uploads = files.map((file) => {
            const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

            return cloudinary.uploader.upload(base64, {
                folder: "furnitureStore",
                resource_type: "auto",
            });
        });

        const result = await Promise.all(uploads);
        return result.map(item => item.secure_url);

    } catch (err) {
        console.error("Cloudinary upload error:", err);
        return null;
    }
};
