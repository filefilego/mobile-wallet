import * as secp from '@noble/secp256k1'; 
import { Preferences } from '@capacitor/preferences';


export async function GenerateKey() {
    const privKey = secp.utils.randomPrivateKey(); // Secure random private key
    const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    const toHexString = (bytes) => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
    
    const privateKey = fromHexString("bf1b1d26a0ec7cf5e3ba5add3e29c361fb9cb56c232a6c73076442bedd049a3e");
    const msgHash = 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9';
    const pubKey = secp.getPublicKey(privateKey); // Make pubkey from the private key
    
    const pubkeyhex = toHexString(pubKey);
    console.log("public key ", pubkeyhex)
    const signature = await secp.signAsync(msgHash, privateKey); // sign
    const isValid = secp.verify(signature, msgHash, pubKey); // verify
    console.log("isvalid ", isValid)

    // await Preferences.set({
    //     key: 'user',
    //     value: "hello world"
    //   });

    const ret = await Preferences.get({ key: 'user' });
    console.log(ret.value)

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

