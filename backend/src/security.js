const crypto = require("crypto");

// Only students with an email on this domain can register or sign in.
const STUDENT_EMAIL_DOMAIN = "usiu.ac.ke";

function isUsiuEmail(email) {
  return typeof email === "string" && email.toLowerCase().split("@")[1] === STUDENT_EMAIL_DOMAIN;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  return { salt, hash: crypto.scryptSync(password, salt, 64).toString("hex") };
}

function checkPassword(password, salt, hash) {
  const attempt = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(attempt), Buffer.from(hash));
}

module.exports = { STUDENT_EMAIL_DOMAIN, isUsiuEmail, hashPassword, checkPassword };
