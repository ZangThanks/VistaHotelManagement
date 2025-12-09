package com.hotelvista.util;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class QRGenerateUtil {
    private static final String BANK_CORE = "MBBank";
    private static final String ACCOUNT_NUMBER = "VQRQAFMGQ4306";

    //VQRQAFMGQ4306 là tài khoản ảo trên SePay muốn test trên local thì tải ngrok - chạy ngrok http 8080
    //Cop link generated xong cấu hình lại webhook trên sepay
    //https://qr.sepay.vn/img?acc=VQRQAFREV1664&bank=MBBank&amount=100000&des=B2411250001
    public static String buildVietQRUrl(String bookingId, Double amount) {
        return "https://qr.sepay.vn/img?acc=" + ACCOUNT_NUMBER + "&bank=" +
                BANK_CORE + "&amount=" + amount + "&des=" + bookingId;
    }

    public static byte[] generateQrImage(String qrUrl) throws IOException {
        BufferedImage image = ImageIO.read(new URL(qrUrl));
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", baos);
        return baos.toByteArray();
    }
}
