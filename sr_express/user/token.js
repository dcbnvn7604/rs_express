import EncryptJWT from 'jose/jwt/encrypt';
import jwtDecrypt from 'jose/jwt/decrypt'

export class Generator {
  #secret;

  init(secret) {
    this.#secret = Uint8Array.from(Buffer.from(secret));
  }

  async create(payload) {
    return await new EncryptJWT(payload)
      .setProtectedHeader({alg: 'dir', enc: 'A256GCM'})
      .encrypt(this.#secret);
  }

  async verify(token) {
    const { payload } = await jwtDecrypt(token, this.#secret);
    return payload;
  }
}

let generator = new Generator();

export default generator;