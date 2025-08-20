"use strict";

const fileInput = document.querySelector("#fileInput");
console.log(fileInput);

const urlInput = document.querySelector("#urlInput");
console.log(urlInput);

const uploadBtn = document.querySelector("#uploadBtn");
console.log(uploadBtn);

const message = document.querySelector("#message");
console.log(message);

const result = document.querySelector("#result");
console.log(result);

const ImageKitAuthEndpoint = "http://localhost:8000/ik-auth";

uploadBtn.addEventListener("click", async () => {
  console.log("Upload button clicked");

  // reset the message and result
  message.textContent = "";
  result.textContent = "";

  try {
    // pick the file from input or URL
    let file = fileInput.files[0];
    console.log("File selected:", file);
    let url = urlInput.value.trim();
    console.log("URL entered:", url);

    if (!file && !url) {
      message.textContent = "Please select a file or enter a URL.";
      return;
    }

    // get authentication parameters from the server
    const authResponse = await fetch(ImageKitAuthEndpoint);
    const authData = await authResponse.json();
    console.log("Auth data:", authData);

    const formData = new FormData();

    if (file) {
      formData.append("file", file); // binary upload
      formData.append("fileName", file.name);
    } else {
      formData.append("file", url); // remote URL upload
      formData.append("fileName", "image-from-url");
    }

    formData.append("useUniqueFileName", "true");
    formData.append("publicKey", "public_sJrPBaYYLXh2XueaJI16CpTHhBw=");
    formData.append("signature", authData.signature);
    formData.append("token", authData.token);
    formData.append("expire", authData.expire);
    formData.append("folder", "/clientSideUpload"); // optional folder path

    const uploadResponse = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const uploadData = await uploadResponse.json();
    console.log("Upload response:", uploadData);

    if (uploadResponse.ok) {
      message.textContent = "Upload successful!";
      message.classList.add("success");
      result.innerHTML = `<a href="${uploadData.url}" target="_blank">${uploadData.url}</a>`;
    } else {
      throw new Error(uploadData.message || "Upload failed");
    }
  } catch (err) {
    console.error("Upload error:", err);
    message.textContent = `Error: ${err.message}`;
    message.classList.add("error");
  }
});
