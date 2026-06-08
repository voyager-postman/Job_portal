import { webcrypto } from "crypto";
import {
  ENCRYPTION_PREFIX,
  decryptPasswordFromTransport,
  encryptPasswordForTransport,
  isEncryptedPasswordPayload,
} from "./passwordEncryption";

describe("passwordEncryption", () => {
  beforeAll(() => {
    Object.defineProperty(global, "crypto", {
      value: webcrypto,
    });
  });

  it("encrypts passwords into enc:v1 payload format", async () => {
    const encrypted = await encryptPasswordForTransport("123456");

    expect(isEncryptedPasswordPayload(encrypted)).toBe(true);
    expect(encrypted.startsWith(ENCRYPTION_PREFIX)).toBe(true);
    expect(encrypted).not.toContain("123456");
    expect(encrypted.length).toBeGreaterThan(40);
  });

  it("round-trips encrypted passwords", async () => {
    const encrypted = await encryptPasswordForTransport("MySecretPass!");
    const decrypted = await decryptPasswordFromTransport(encrypted);

    expect(decrypted).toBe("MySecretPass!");
  });
});
