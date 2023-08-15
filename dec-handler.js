document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("decryptButton").addEventListener("click", do_decrypt);
});

function do_decrypt() {
  do_status("Decrypting...");
  var before = new Date();
  var rsa = new RSAKey();
  var dr = document.rsatest2;
  rsa.setPrivateEx(dr.n.value, dr.e.value, dr.d.value, dr.p.value, dr.q.value, dr.dmp1.value, dr.dmq1.value, dr.coeff.value);
  if (document.rsatest1.ciphertext.value.length == 0) {
      do_status("No Ciphertext - encrypt something first");
      return;
  }
  var res = rsa.decrypt(document.rsatest1.ciphertext.value);
  var after = new Date();
  if (res == null) {
      document.rsatest1.decrypted.value = "*** Invalid Ciphertext ***";
      do_status("Decryption failed");
  }
  else {
      document.rsatest1.decrypted.value = res;
      do_status("Decryption Time: " + (after - before) + "ms");
  }
}