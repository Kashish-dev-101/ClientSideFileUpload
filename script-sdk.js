"use strict";

/**
 * ImageKit Client-Side Upload using ImageKit JS SDK
 * This file uses the @imagekit/javascript SDK instead of the direct Upload API
 *
 * To use this file:
 * 1. Include the SDK in your HTML before this script:
 *    <script src="https://unpkg.com/@imagekit/javascript@5.0.0/dist/imagekit.min.js"></script>
 * 2. Replace script.js with script-sdk.js in your HTML
 */

const fileInput = document.querySelector("#fileInput");
const urlInput = document.querySelector("#urlInput");
const uploadBtn = document.querySelector("#uploadBtn");
const message = document.querySelector("#message");
const result = document.querySelector("#result");

const ImageKitAuthEndpoint = "http://localhost:8000/ik-auth";
const ImageKitPublicKey = "public_sJrPBaYYLXh2XueaJI16CpTHhBw=";

// store original button content
const originalBtnContent = uploadBtn.innerHTML;

// helper to show loading state
function setLoading(isLoading) {
  if (isLoading) {
    uploadBtn.classList.add("loading");
    uploadBtn.innerHTML = '<div class="spinner"></div> Uploading...';
  } else {
    uploadBtn.classList.remove("loading");
    uploadBtn.innerHTML = originalBtnContent;
  }
}

uploadBtn.addEventListener("click", async () => {
  // reset the message and result
  message.textContent = "";
  message.classList.remove("success", "error");
  result.textContent = "";

  try {
    // pick the file from input or URL
    let file = fileInput.files[0];
    let url = urlInput.value.trim();

    if (!file && !url) {
      message.textContent = "Please select a file or enter a URL.";
      message.classList.add("error");
      return;
    }

    // show loading state
    setLoading(true);

    // get authentication parameters from the server
    const authResponse = await fetch(ImageKitAuthEndpoint);
    const authData = await authResponse.json();

    // prepare upload options for ImageKit SDK
    const uploadOptions = {
      publicKey: ImageKitPublicKey,
      token: authData.token,
      signature: authData.signature,
      expire: authData.expire,
      folder: "/clientSideUpload",
      useUniqueFileName: true,
    };

    // set file or URL based on input
    if (file) {
      uploadOptions.file = file;
      uploadOptions.fileName = file.name;
    } else {
      uploadOptions.file = url;
      uploadOptions.fileName = "image-from-url";
    }

    // upload using ImageKit SDK
    const uploadResponse = await ImageKit.upload(uploadOptions);

    // handle success
    message.textContent = "Upload successful!";
    message.classList.add("success");
    result.innerHTML = `<a href="${uploadResponse.url}" target="_blank">${uploadResponse.url}</a>`;

  } catch (err) {
    // handle error
    message.textContent = `Error: ${err.message}`;
    message.classList.add("error");
  } finally {
    setLoading(false);
  }
});
