 // Caesar Cipher functions
 function caesarEncrypt(text, shiftAmount) {
    const encryptedText = [];
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char.match(/[a-z]/i)) {
      const isLowerCase = char === char.toLowerCase();
      const charCode = char.charCodeAt(0);
      const encryptedCharCode = isLowerCase
        ? ((charCode - 97 + shiftAmount) % 26) + 97
        : ((charCode - 65 + shiftAmount) % 26) + 65;
      encryptedText.push(String.fromCharCode(encryptedCharCode));
    } else {
      encryptedText.push(char);
    }
  }
  return encryptedText.join('');
  }

  function caesarDecrypt(encryptedText, shiftAmount) {
    const decryptedText = [];
  for (let i = 0; i < encryptedText.length; i++) {
    const char = encryptedText[i];
    if (char.match(/[a-z]/i)) {
      const isLowerCase = char === char.toLowerCase();
      const charCode = char.charCodeAt(0);
      const decryptedCharCode = isLowerCase
        ? ((charCode - 97 - shiftAmount + 26) % 26) + 97
        : ((charCode - 65 - shiftAmount + 26) % 26) + 65;
      decryptedText.push(String.fromCharCode(decryptedCharCode));
    } else {
      decryptedText.push(char);
    }
  }
  return decryptedText.join('');
  }

  // Text encryption and decryption
  document.getElementById("encryptTextButton").addEventListener("click", () => {
    const textToEncrypt = document.getElementById("textToEncrypt").value;
    const textShiftAmount = parseInt(document.getElementById("textShiftAmount").value);
    const encryptedText = caesarEncrypt(textToEncrypt, textShiftAmount);
    document.getElementById("encryptedText").textContent = "Encrypted: " + encryptedText;
  });

  document.getElementById("decryptTextButton").addEventListener("click", () => {
    const encryptedText = document.getElementById("encryptedText").textContent.substring(11);
    const textShiftAmount = parseInt(document.getElementById("textShiftAmount").value);
    const decryptedText = caesarDecrypt(encryptedText, textShiftAmount);
    document.getElementById("decryptedText").textContent = "Decrypted: " + decryptedText;
  });


 // Image encryption and decryption logic
 document.getElementById("encryptImageButton").addEventListener("click", () => {
    const imageFile = document.getElementById("imageFile").files[0];
    const imageShiftAmount = parseInt(document.getElementById("imageShiftAmount").value);

    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < imageData.data.length; i += 4) {
          imageData.data[i] = (imageData.data[i] + imageShiftAmount) % 256; // Red channel
          imageData.data[i + 1] = (imageData.data[i + 1] + imageShiftAmount) % 256; // Green channel
          imageData.data[i + 2] = (imageData.data[i + 2] + imageShiftAmount) % 256; // Blue channel
        }

        ctx.putImageData(imageData, 0, 0);

        const encryptedImageDataUrl = canvas.toDataURL();
        document.getElementById("encryptedImage").src = encryptedImageDataUrl;
        document.getElementById("encryptedImage").style.display = "block";
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(imageFile);
  });

  document.getElementById("decryptImageButton").addEventListener("click", () => {
  const encryptedImage = document.getElementById("encryptedImage");
  const imageShiftAmount = parseInt(document.getElementById("imageShiftAmount").value);
  const img = new Image();
  img.onload = function() {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = (imageData.data[i] - imageShiftAmount + 256) % 256; // Red channel
      imageData.data[i + 1] = (imageData.data[i + 1] - imageShiftAmount + 256) % 256; // Green channel
      imageData.data[i + 2] = (imageData.data[i + 2] - imageShiftAmount + 256) % 256; // Blue channel
    }

    ctx.putImageData(imageData, 0, 0);

    const decryptedImageDataUrl = canvas.toDataURL();
    const decryptedImage = document.getElementById("decryptedImage");
    console.log(decryptedImageDataUrl)
    decryptedImage.src = decryptedImageDataUrl;
    decryptedImage.style.display = "block";
    console.log(decryptedImage)
  };

  img.src = encryptedImage.src;
});
    

  // Audio encryption and decryption 
  document.getElementById("encryptAudioButton").addEventListener("click", () => {
    const audioFile = document.getElementById("audioFile").files[0];
    const audioShiftAmount = parseInt(document.getElementById("audioShiftAmount").value);

    const reader = new FileReader();
    reader.onload = function(event) {
      const audioBlob = new Blob([event.target.result], { type: audioFile.type });
      const encryptedAudioBlob = new Blob([applyCaesarCipherToArrayBuffer(audioBlob, audioShiftAmount)]);
      
      const encryptedAudioUrl = URL.createObjectURL(encryptedAudioBlob);
      document.getElementById("encryptedAudio").src = encryptedAudioUrl;
      document.getElementById("encryptedAudio").style.display = "block";
    };
    reader.readAsArrayBuffer(audioFile);
  });

  // Video encryption and decryption 
  document.getElementById("encryptVideoButton").addEventListener("click", () => {
    const videoFile = document.getElementById("videoFile").files[0];
    const videoShiftAmount = parseInt(document.getElementById("videoShiftAmount").value);

    const reader = new FileReader();
    reader.onload = function(event) {
      const videoBlob = new Blob([event.target.result], { type: videoFile.type });
      const encryptedVideoBlob = new Blob([applyCaesarCipherToArrayBuffer(videoBlob, videoShiftAmount)]);
      
      const encryptedVideoUrl = URL.createObjectURL(encryptedVideoBlob);
      document.getElementById("encryptedVideo").src = encryptedVideoUrl;
      document.getElementById("encryptedVideo").style.display = "block";
    };
    reader.readAsArrayBuffer(videoFile);
  });

  function applyCaesarCipherToArrayBuffer(inputBlob, shiftAmount) {
    const inputArrayBuffer = inputBlob.arrayBuffer();
    const encryptedArrayBuffer = new ArrayBuffer(inputArrayBuffer.byteLength);
    const encryptedDataView = new DataView(encryptedArrayBuffer);

    for (let i = 0; i < inputArrayBuffer.byteLength; i++) {
      const byteValue = new DataView(inputArrayBuffer).getUint8(i);
      encryptedDataView.setUint8(i, (byteValue + shiftAmount) % 256);
    }

    return encryptedArrayBuffer;
  }