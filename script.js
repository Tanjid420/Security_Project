document.addEventListener("DOMContentLoaded", () => {
  const encryptTextButton = document.getElementById("encryptTextButton");
  const decryptTextButton = document.getElementById("decryptTextButton");
  const textToEncrypt = document.getElementById("textToEncrypt");
  const textKey = document.getElementById("textKey");
  const encryptedText = document.getElementById("encryptedText");
  const decryptedText = document.getElementById("decryptedText");
  var encryptedFinalText = "";
  encryptTextButton.addEventListener("click", () => {
    const text = textToEncrypt.value;
    const key = textKey.value;
    const encrypted = encryptVigenere(text, key);
    encryptedFinalText += encrypted;
    encryptedText.textContent += encrypted;
  });

  decryptTextButton.addEventListener("click", () => {
    const key = textKey.value;
    const decrypted = decryptVigenere(encryptedFinalText, key);
    decryptedText.textContent += decrypted;
  });

  function encryptVigenere(plainText, key) {
    plainText = plainText.toUpperCase();
    key = key.toUpperCase();
    let encryptedText = "";

    for (let i = 0, j = 0; i < plainText.length; i++) {
      const plainChar = plainText.charCodeAt(i);
      if (plainChar >= 65 && plainChar <= 90) {
        const keyChar = key.charCodeAt(j % key.length);
        const encryptedChar = String.fromCharCode(
          ((plainChar + keyChar - 130) % 26) + 65
        );
        encryptedText += encryptedChar;
        j++;
      } else {
        encryptedText += plainText.charAt(i);
      }
    }
    return encryptedText;
  }

  // Vigenère Cipher Decryption
  function decryptVigenere(encryptedText, key) {
    console.log(encryptedText);
    encryptedText = encryptedText.toUpperCase();
    key = key.toUpperCase();
    let decryptedText = "";

    for (let i = 0, j = 0; i < encryptedText.length; i++) {
      const encryptedChar = encryptedText.charCodeAt(i);
      if (encryptedChar >= 65 && encryptedChar <= 90) {
        const keyChar = key.charCodeAt(j % key.length);
        const decryptedChar = String.fromCharCode(
          ((encryptedChar - keyChar + 26) % 26) + 65
        );
        decryptedText += decryptedChar;
        j++;
      } else {
        decryptedText += encryptedText.charAt(i);
      }
    }
    console.log(decryptedText);
    return decryptedText;
  }

  //   image encryption and decryption
  const inputImage = document.getElementById("inputImage");
  const encryptimgButton = document.getElementById("encryptimgButton");
  const decryptedImage = document.getElementById("decryptedImage");
  const imgTextKey = document.getElementById("imgTextKey");

  encryptimgButton.addEventListener("click", () => {
    const file = inputImage.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = new Uint8Array(e.target.result);
        const key = imgTextKey.value;
        const encryptedData = encryptImageVigenere(imageData, key);

        downloadTextFile(encryptedData);
        const encryptedBlob = new Blob([encryptedData], { type: file.type });
        console.log(URL.createObjectURL(encryptedBlob));

        // Decrypt and display the decrypted image
        const decryptedData = decryptImageVigenere(encryptedData, key);
        const decryptedBlob = new Blob([decryptedData], { type: file.type });
        console.log(URL.createObjectURL(decryptedBlob));
        decryptedImage.src = URL.createObjectURL(decryptedBlob);
      };
      reader.readAsArrayBuffer(file);
    }
  });

  function encryptImageVigenere(imageData, key) {
    const encryptedData = new Uint8Array(imageData.length);
    console.log(encryptedData);
    for (let i = 0, j = 0; i < imageData.length; i++) {
      encryptedData[i] = (imageData[i] + key.charCodeAt(j % key.length)) % 256;
      j++;
    }
    console.log(encryptedData);
    return encryptedData;
  }

  function decryptImageVigenere(encryptedData, key) {
    const decryptedData = new Uint8Array(encryptedData.length);

    for (let i = 0, j = 0; i < encryptedData.length; i++) {
      decryptedData[i] =
        (encryptedData[i] - key.charCodeAt(j % key.length) + 256) % 256;
      j++;
    }

    return decryptedData;
  }

  // Audio encryption & decryption
  const keyInput = document.getElementById("audioTextKey");
  const audioFileInput = document.getElementById("audioFile");
  const encryptaudioButton = document.getElementById("encryptaudioButton");
  const decryptaudioButton = document.getElementById("decryptaudioButton");
  const outputAudio = document.getElementById("outputAudio");

  encryptaudioButton.addEventListener("click", async () => {
    console.log("Audio");
    const key = keyInput.value.toUpperCase();
    const audioFile = audioFileInput.files[0];
    if (key && audioFile) {
      const encryptedAudioBlob = await encryptAudio(audioFile, key);
      const encryptedAudioUrl = URL.createObjectURL(encryptedAudioBlob);
      outputAudio.src = encryptedAudioUrl;
    }
  });

  decryptaudioButton.addEventListener("click", async () => {
    const key = keyInput.value.toUpperCase();
    const encryptedAudioFile = outputAudio.src;
    if (key && encryptedAudioFile) {
      const decryptedAudioBlob = await decryptAudio(encryptedAudioFile, key);
      outputAudio.src = URL.createObjectURL(decryptedAudioBlob);
    }
  });

  async function encryptAudio(audioFile, key) {
    const arrayBuffer = await audioFile.arrayBuffer();
    const encryptedBuffer = new Uint8Array(arrayBuffer).map((byte, index) => {
      const keyCharCode = key.charCodeAt(index % key.length);
      return (byte + keyCharCode) % 256;
    });
    // console.log(encryptedBuffer);
    downloadTextFile(encryptedBuffer, "ecnryptedText");
    return new Blob([encryptedBuffer], { type: audioFile.type });
  }

  async function decryptAudio(encryptedAudioFile, key) {
    const response = await fetch(encryptedAudioFile);
    const arrayBuffer = await response.arrayBuffer();
    const decryptedBuffer = new Uint8Array(arrayBuffer).map((byte, index) => {
      const keyCharCode = key.charCodeAt(index % key.length);
      return (byte - keyCharCode + 256) % 256;
    });
    return new Blob([decryptedBuffer], {
      type: response.headers.get("content-type"),
    });
  }

  // video encryption and decryption
  const videoKey = document.getElementById("videoKey");
  const videoFileInput = document.getElementById("videoFile");
  const encryptvideoButton = document.getElementById("encryptvideoButton");
  const decryptvideoButton = document.getElementById("decryptvideoButton");
  const outputVideo = document.getElementById("outputVideo");

  encryptvideoButton.addEventListener("click", async () => {
    const key = videoKey.value.toUpperCase();
    const videoFile = videoFileInput.files[0];
    if (key && videoFile) {
      const encryptedVideoBlob = await encryptVideo(videoFile, key);
      console.log(encryptedVideoBlob);
      const encryptedVideoUrl = URL.createObjectURL(encryptedVideoBlob);
      outputVideo.src = encryptedVideoUrl;
    }
  });

  decryptvideoButton.addEventListener("click", async () => {
    const key = videoKey.value.toUpperCase();
    const encryptedVideoFile = outputVideo.src;
    if (key && encryptedVideoFile) {
      const decryptedVideoBlob = await decryptVideo(encryptedVideoFile, key);
      outputVideo.src = URL.createObjectURL(decryptedVideoBlob);
    }
  });

  async function encryptVideo(videoFile, key) {
    const arrayBuffer = await videoFile.arrayBuffer();
    const encryptedBuffer = new Uint8Array(arrayBuffer).map((byte, index) => {
      const keyCharCode = key.charCodeAt(index % key.length);
      return (byte + keyCharCode) % 256;
    });
    console.log(encryptedBuffer);
    downloadTextFile(encryptedBuffer, "video");
    return new Blob([encryptedBuffer], { type: videoFile.type });
  }

  async function decryptVideo(encryptedVideoFile, key) {
    const response = await fetch(encryptedVideoFile);
    const arrayBuffer = await response.arrayBuffer();
    const decryptedBuffer = new Uint8Array(arrayBuffer).map((byte, index) => {
      const keyCharCode = key.charCodeAt(index % key.length);
      return (byte - keyCharCode + 256) % 256;
    });
    return new Blob([decryptedBuffer], {
      type: response.headers.get("content-type"),
    });
  }

  //   download encrypted text file
  function downloadTextFile(text, fileName) {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }
});
