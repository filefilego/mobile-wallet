import { secp256k1 } from '@noble/curves/secp256k1'
import { Preferences } from '@capacitor/preferences';
import CryptoJS from 'crypto-js';
import scrypt from 'scrypt-async';
import aesjs from 'aes-js';


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

const aesEncryptCtr = async (message, secretKey, iv) => {
  return await new Promise((resolve, reject) => {
    var aesCtr = new aesjs.ModeOfOperation.ctr(secretKey, new aesjs.Counter(iv));
    let encryptedBytes = aesCtr.encrypt(message);
    resolve(toHexString(encryptedBytes))
  });
}

const aesDecryptCtr = async (message, secretKey, iv) => {
  return await new Promise((resolve, reject) => {
    var aesCtr = new aesjs.ModeOfOperation.ctr(secretKey, new aesjs.Counter(iv));
    let decryptedBytes = aesCtr.decrypt(message);
    resolve(toHexString(decryptedBytes))
  });
}

function concatenateUint8Arrays(arrays) {
  let totalLength = 0;
  for (let i = 0; i < arrays.length; i++) {
    totalLength += arrays[i].length;
  }
  
  let concatenatedArray = new Uint8Array(totalLength);
  
  let offset = 0;
  for (let i = 0; i < arrays.length; i++) {
    concatenatedArray.set(arrays[i], offset);
    offset += arrays[i].length;
  }
  
  return concatenatedArray;
}

function stringToUint8Array(str) {
  let encoder = new TextEncoder();
  return encoder.encode(str);
}

function bigIntToUint8Array(bigint) {
  const byteLength = Math.max(1, Math.ceil(bigint.toString(2).length / 8));
  const uint8Array = new Uint8Array(byteLength);

  for (let i = byteLength - 1; i >= 0; i--) {
    const byte = bigint & 0xffn;
    uint8Array[i] = Number(byte);
    bigint = bigint >> 8n;
  }

  return uint8Array;
}


export function SignTransaction(privKey, nounce, data, to, value, transactionFees) {
    const nounceBig = BigInt(nounce);
    const nounceBytes = bigIntToUint8Array(nounceBig);
    if (typeof privKey === 'string' || privKey instanceof String) {
      privKey = fromHexString(privKey);
    }

    if (typeof data === 'string' || data instanceof String) {
      data = fromHexString(data);
    }

    const chainID = fromHexString("01");
    const publicKey = secp256k1.getPublicKey(privKey);
    const myaddress =  publicKeyAddress(publicKey);
    const allData = toHexString(concatenateUint8Arrays([publicKey, nounceBytes, data, stringToUint8Array(myaddress), stringToUint8Array(to), stringToUint8Array(value), stringToUint8Array(transactionFees), chainID]));
    const txhash = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(allData)).toString();
    const dataArray = fromHexString(txhash);
    const signature = secp256k1.sign(dataArray, privKey, { prehash: true });
    
    const transaction =  {
      hash : "0x" + txhash,
      signature: "0x" + signature.toDERHex(),
      public_key : "0x" + toHexString(publicKey),
      nounce:  nounce,
      data: "0x" + toHexString(data),
      from: myaddress,
      to: to,
      value: value,
      transaction_fees: transactionFees,
      chain: "0x" + toHexString(chainID)
    }

  return JSON.stringify(transaction);
}

function publicKeyAddress(pubKey) {
  const pubkeyhex = toHexString(pubKey);
  const publicKeyHashHex = CryptoJS.SHA3(CryptoJS.enc.Hex.parse(pubkeyhex), { outputLength: 256 }).toString();
  const publicKeyHashBytes = fromHexString(publicKeyHashHex)
  const address = getRangeFromArray(publicKeyHashBytes, 12, 32);
  const addressHex = "0x"+toHexString(address);
  return addressHex;
}

export async function GenerateKey(password) {
    const privKey =  secp256k1.utils.randomPrivateKey();
    const salt32 =  secp256k1.utils.randomPrivateKey();
    const iv32 =  secp256k1.utils.randomPrivateKey();
    const privKeyHex = toHexString(privKey);
    const pubKey = secp256k1.getPublicKey(privKey);
    const pubkeyhex = toHexString(pubKey);
    const result = await PeformScrypt(password, salt32);
    const dk = fromHexString(result);
    const enckey = getRangeFromArray(dk, 0, 16);
    const iv = getRangeFromArray(iv32, 0, 16);
    const cipherText = await aesEncryptCtr(privKey, enckey, iv);
    const cipherTextBytes = fromHexString(cipherText)
    const dkSecondPart = getRangeFromArray(dk, 16, 32);
    const dkWithCipherText = toHexString(concatenateUint8Arrays([dkSecondPart,cipherTextBytes]));
    const mac = CryptoJS.SHA3(CryptoJS.enc.Hex.parse(dkWithCipherText), { outputLength: 256 }).toString();
    const publicKeyHashHex = CryptoJS.SHA3(CryptoJS.enc.Hex.parse(pubkeyhex), { outputLength: 256 }).toString();
    const publicKeyHashBytes = fromHexString(publicKeyHashHex)
    const address = getRangeFromArray(publicKeyHashBytes, 12, 100);
    const addressHex = "0x"+toHexString(address);
    const finalKeyJSON = JSONKey(addressHex, cipherText, toHexString(iv),  262144, 8, 1, 32, toHexString(salt32), mac, e7())

    return { jsonKey: finalKeyJSON, privKeyHex: privKeyHex };
}

export async function UnlockKey(jsonKey, password) {
  const salt32 = fromHexString(jsonKey.crypto.kdfparams.salt);
  const result = await PeformScrypt(password, salt32);
  const dk = fromHexString(result);
  const cipherTextBytes = fromHexString(jsonKey.crypto.ciphertext);
  const dkSecondPart = getRangeFromArray(dk, 16, 32);
  const dkWithCipherText = toHexString(concatenateUint8Arrays([dkSecondPart,cipherTextBytes]));
  const mac = CryptoJS.SHA3(CryptoJS.enc.Hex.parse(dkWithCipherText), { outputLength: 256 }).toString();
  if (mac !== jsonKey.crypto.mac) {
    throw new Error("mac mismatch");
  }

  const enckey = getRangeFromArray(dk, 0, 16);
  const iv = fromHexString(jsonKey.crypto.cipherparams.iv);
  const decryptedPrivateKey = await aesDecryptCtr(cipherTextBytes, enckey, iv);
  const pubKey = secp256k1.getPublicKey(fromHexString(decryptedPrivateKey));
  
  return decryptedPrivateKey;
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

export async function SaveUnlockedKeyToStorage(data) {
  await Preferences.set({
      key: 'unlockedkey',
      value: data
    });   
}

export async function GetUnlockedKeyFromStorage() {
  const ret = await Preferences.get({ key: 'unlockedkey' });
  return ret.value
}