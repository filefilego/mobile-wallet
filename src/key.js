import * as secp from '@noble/secp256k1'; 
import { Preferences } from '@capacitor/preferences';
import sha256 from 'crypto-js/sha256';
import AES from 'crypto-js/aes';
import CryptoJS from 'crypto-js';
import scrypt from 'scrypt-async';
import aes from 'js-crypto-aes';


const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
const toHexString = (bytes) => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
var lut = []; for (var i=0; i<256; i++) { lut[i] = (i<16?'0':'')+(i).toString(16); }
function e7() {
    var d0 = Math.random()*0xffffffff|0;
    var d1 = Math.random()*0xffffffff|0;
    var d2 = Math.random()*0xffffffff|0;
    var d3 = Math.random()*0xffffffff|0;
    return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
    lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
    lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
    lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
}

function getRangeFromArray(array, start, end) {
  if (start < 0) {
    start = 0;
  }
  if (end > array.length) {
    end = array.length;
  }
  const result = array.subarray(start, end);
  return result;
}

const PeformScrypt =  async (password, salt) => {
  return await new Promise((resolve, reject) => {
    scrypt(password, salt, {
      N: 262144,
      r: 8,
      p: 1,
      dkLen: 32,
      encoding: 'hex'
    }, function(derivedKey) {
      resolve(derivedKey);
    });
  });
}

function aesEncryptCtr(message, secretKey, iv) {
  const encrypted = AES.encrypt(message, secretKey , {
    iv : iv,
    mode: CryptoJS.mode.CTR,
    // padding: CryptoJS.pad.NoPadding
  });

  return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
}

function aesDecryptCtr(message, secretKey, iv) {
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: message,
    iv: iv,
  });

  const decrypted = CryptoJS.AES.decrypt(cipherParams, secretKey, {
    mode: CryptoJS.mode.CTR
  });


  return decrypted
}

function concatenateUint8Arrays(arr1, arr2) {
  const concatenated = new Uint8Array(arr1.length + arr2.length);
  concatenated.set(arr1);
  concatenated.set(arr2, arr1.length);
  return concatenated;
}

export async function SignMessage(privKey, message) {
    const signature = await secp.signAsync(message, privKey);
    // const isValid = secp.verify(signature, msgHash, pubKey); // verify
    // console.log("isvalid ", isValid)

    // const hashDigest = sha256("hello").toString();
    console.log(hashDigest)
}

export async function GenerateKey(password) {
    const privKey = secp.utils.randomPrivateKey();
    const salt32 = secp.utils.randomPrivateKey();

    const privKeyHex = toHexString(privKey);
    const pubKey = secp.getPublicKey(privKey);
  
    const pubkeyhex = toHexString(pubKey);

    const result = await PeformScrypt(password, salt32);
    const dk = fromHexString(result);

    const enckey = getRangeFromArray(dk, 0, 16);
    const encKeyHex = toHexString(enckey);
    console.log("generate: encKeyHex", encKeyHex)
    const iv = CryptoJS.lib.WordArray.random(16);
    const cipherText = aesEncryptCtr(CryptoJS.enc.Hex.parse(privKeyHex), CryptoJS.enc.Hex.parse(encKeyHex), iv);

    console.log("encrypted cipherText", cipherText)

    const cipherTextBytes = fromHexString(cipherText)
    const dkSecondPart = getRangeFromArray(dk, 16, 32);


    const dkWithCipherText = toHexString(concatenateUint8Arrays(dkSecondPart,cipherTextBytes));

    const mac = CryptoJS.SHA3(CryptoJS.enc.Hex.parse(dkWithCipherText), { outputLength: 256 }).toString();

    const publicKeyHashHex = CryptoJS.SHA3(CryptoJS.enc.Hex.parse(pubkeyhex), { outputLength: 256 }).toString();
    const publicKeyHashBytes = fromHexString(publicKeyHashHex)
    const address = getRangeFromArray(publicKeyHashBytes, 12, 32);
    const addressHex = "0x"+toHexString(address);
    const finalKeyJSON = JSONKey(addressHex, cipherText, CryptoJS.enc.Hex.stringify(iv),  262144, 8, 1, 32, toHexString(salt32), mac, e7())

    return { jsonKey: finalKeyJSON, privKeyHex: privKeyHex }
}

export async function UnlockKey(jsonKey, password) {
  const salt32 = fromHexString(jsonKey.crypto.kdfparams.salt)
  const result = await PeformScrypt(password, salt32);
  const dk = fromHexString(result);
  const cipherTextBytes = fromHexString(jsonKey.crypto.ciphertext)
  const dkSecondPart = getRangeFromArray(dk, 16, 32);
  const dkWithCipherText = toHexString(concatenateUint8Arrays(dkSecondPart,cipherTextBytes));
  const mac = CryptoJS.SHA3(CryptoJS.enc.Hex.parse(dkWithCipherText), { outputLength: 256 }).toString();
  if (mac !== jsonKey.crypto.mac) {
    throw new Error("mac mismatch");
  }

  const enckey = getRangeFromArray(dk, 0, 16);
  const encKeyHex = toHexString(enckey);

  console.log("encKeyHex", encKeyHex)
  const iv = CryptoJS.enc.Hex.parse(jsonKey.crypto.cipherparams.iv)

  // const cipherParams = CryptoJS.lib.CipherParams.create({
  //   ciphertext: CryptoJS.enc.Hex.parse(jsonKey.crypto.ciphertext),
  //   iv: CryptoJS.enc.Hex.parse(jsonKey.crypto.cipherparams.iv)
  // });

  // const decrypted = CryptoJS.AES.decrypt(cipherParams,encKeyHex, {
  //   mode: CryptoJS.mode.CTR
  // });

  // const plainTextPrivateKeyHex = decrypted.toString(CryptoJS.enc.Utf8);
  const wordCipherText = CryptoJS.lib.WordArray.create(cipherTextBytes)
  
  console.log("dec: wordCipherText", CryptoJS.enc.Hex.stringify(wordCipherText), wordCipherText)


  // var bytes  = CryptoJS.AES.decrypt(wordCipherText, CryptoJS.enc.Hex.parse(encKeyHex));

  const decKey = CryptoJS.enc.Hex.parse(encKeyHex) 
  console.log("dec: decKey",decKey)

  console.log("dec: iv: ", iv)

  var decrypted = CryptoJS.AES.decrypt(wordCipherText, decKey, {
    iv: iv, 
    mode: CryptoJS.mode.CTR,
    keySize: 16,
    // padding: CryptoJS.pad.NoPadding
  });
 


  // const aesDecryptor = CryptoJS.algo.AES.createDecryptor(CryptoJS.enc.Hex.parse(encKeyHex), { 
  //   iv: iv,
  //   mode: CryptoJS.mode.CTR,
  //   padding: CryptoJS.pad.NoPadding
  // });


  // const part1 = aesDecryptor.process(CryptoJS.enc.Hex.parse(jsonKey.crypto.ciphertext));
  // const part1Hex = CryptoJS.enc.Hex.stringify(plainTextPrivateKey);
  // const plainTextPrivateKey = aesDecryptor.finalize();
  // const plainTextPrivateKeyHex = CryptoJS.enc.Hex.stringify(plainTextPrivateKey);
  console.log("private key", decrypted)

  return true
}

function JSONKey(address, ciphertext, cipherparamsIV, kdfparamsN, kdfparamsR, kdfparamsP, kdfparamsDklen, kdfparamsSalt, mac, keyUUID ) {
    const key = {
        address: address,
        crypto: {
          cipher: "aes-128-ctr",
          ciphertext: ciphertext,
          cipherparams: {
            iv: cipherparamsIV
          },
          kdf: "scrypt",
          kdfparams: {
            n: kdfparamsN,
            r: kdfparamsR,
            p: kdfparamsP,
            dklen: kdfparamsDklen,
            salt: kdfparamsSalt
          },
          mac: mac
        },
        id: keyUUID,
        version: 3
      }
      
    return key;
}

export async function SaveKeyToStorage(data) {
    await Preferences.set({
        key: 'key',
        value: data
      });   
}

export async function GetKeyFromStorage() {
    const ret = await Preferences.get({ key: 'key' });
    return ret.value
}

