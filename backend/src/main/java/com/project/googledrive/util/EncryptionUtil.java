package com.project.googledrive.util;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

public class EncryptionUtil {
    
    private static final String ALGORITHM = "AES";
    
    public static String generateKey() throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance(ALGORITHM);
        keyGen.init(256, new SecureRandom());
        SecretKey secretKey = keyGen.generateKey();
        return Base64.getEncoder().encodeToString(secretKey.getEncoded());
    }
    
    public static byte[] encrypt(byte[] data, String key) throws Exception {
        SecretKeySpec secretKey = new SecretKeySpec(Base64.getDecoder().decode(key), ALGORITHM);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        return cipher.doFinal(data);
    }
    
    public static byte[] decrypt(byte[] encryptedData, String key) throws Exception {
        SecretKeySpec secretKey = new SecretKeySpec(Base64.getDecoder().decode(key), ALGORITHM);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, secretKey);
        return cipher.doFinal(encryptedData);
    }
}