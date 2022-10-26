import crypto from "crypto";

export const encrypt = (clear: string) => {
  const length = 16;
  const salt = crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);

  const hash = crypto.createHmac("sha512", salt);
  hash.update(clear);
  return {
    salt: salt,
    hash: hash.digest("hex"),
  };
};

export const validate = (password: string, hashed: string, salt: string) => {
  let hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  const hp = hash.digest("hex")
  return hp === hashed;
};
