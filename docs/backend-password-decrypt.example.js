/**
 * Example Express middleware for Connect Work job portal login/register.
 * Place BEFORE your existing password validation / bcrypt.compare.
 *
 * Frontend sends: password = "enc:v1:<base64(iv + ciphertext + authTag)>"
 * Secret must match REACT_APP_PASSWORD_ENCRYPTION_SECRET on the React app,
 * or the default: connectwork-jobportal-v1-<api-hostname>
 */

const crypto = require("crypto");

const ENCRYPTION_PREFIX = "enc:v1:";

const getPasswordEncryptionSecret = () =>
  process.env.PASSWORD_ENCRYPTION_SECRET ||
  `connectwork-jobportal-v1-${process.env.API_HOSTNAME || "sisccltd.com"}`;

const decryptPasswordField = (value) => {
  if (typeof value !== "string" || !value.startsWith(ENCRYPTION_PREFIX)) {
    return value;
  }

  const secret = getPasswordEncryptionSecret();
  const key = crypto.createHash("sha256").update(secret).digest();
  const payload = Buffer.from(value.slice(ENCRYPTION_PREFIX.length), "base64");
  const iv = payload.subarray(0, 12);
  const authTag = payload.subarray(payload.length - 16);
  const ciphertext = payload.subarray(12, payload.length - 16);

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString("utf8");
};

const decryptAuthBodyPasswords = (req, res, next) => {
  const fields = ["password", "oldPassword", "newPassword", "confirmPassword"];

  fields.forEach((field) => {
    if (req.body?.[field]) {
      req.body[field] = decryptPasswordField(req.body[field]);
    }
  });

  next();
};

module.exports = { decryptAuthBodyPasswords, decryptPasswordField };

// app.use("/api/user/login", decryptAuthBodyPasswords, loginHandler);
// app.use("/api/user/register", decryptAuthBodyPasswords, registerHandler);
