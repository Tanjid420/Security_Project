document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("encryptButton").addEventListener("click", do_encrypt);
});

function do_status(s) {
  document.rsatest1.status.value = s;
}

function do_encrypt() {
  var before = new Date();
  var rsa = new RSAKey();
  rsa.setPublic(document.rsatest2.n.value, document.rsatest2.e.value);
  var res = rsa.encrypt(document.rsatest1.plaintext.value);
  var after = new Date();
  if (res) {
      document.rsatest1.ciphertext.value = res;
      document.rsatest1.decrypted.value = "";
      do_status("Encryption Time: " + (after - before) + "ms");
  }
}