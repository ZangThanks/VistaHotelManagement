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
    private static final String ACCOUNT_CORE = "0949770422";

    public static String buildVietQRUrl(String bank, String account, Double amount, String info) {
        return "https://img.vietqr.io/image/" +
                BANK_CORE + "-" + ACCOUNT_CORE + "-compact2.png?amount=" +
                amount + "&addInfo=" +
                URLEncoder.encode(info, StandardCharsets.UTF_8);
    }

    public static byte[] generateQrImage(String qrUrl) throws IOException {
        BufferedImage image = ImageIO.read(new URL(qrUrl));
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", baos);
        return baos.toByteArray();
    }
}
