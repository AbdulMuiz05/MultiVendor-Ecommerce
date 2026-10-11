const crypto = require("crypto");

const getConfig = () => ({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
});

const createSignature = (timestamp, folder) => {
  const payload = `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
  return crypto.createHash("sha1").update(payload).digest("hex");
};

const uploadImage = async (file, folder) => {
  const config = getConfig();

  if (!config.cloudName || !config.apiKey || !config.apiSecret) {
    throw new Error("Cloudinary is not configured");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createSignature(timestamp, folder);

  const form = new FormData();
  form.append("file", new Blob([file.buffer], { type: file.mimetype }), file.originalname);
  form.append("api_key", config.apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    {
      method: "POST",
      body: form,
    }
  );

  const data = await response.json();

  if (!response.ok || !data.secure_url) {
    throw new Error(data?.error?.message || "Cloudinary image upload failed");
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
};

const uploadImages = async (files, folder) => {
  const uploaded = [];

  for (const file of files) {
    uploaded.push(await uploadImage(file, folder));
  }

  return uploaded;
};

module.exports = {
  uploadImages,
};
