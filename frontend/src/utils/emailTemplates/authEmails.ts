export const registerSuccessEmail = (fullName: string) => `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Đăng ký thành công - Vista Hotel</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" 
               style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:#6b5430;padding:24px 32px;color:#ffffff;">
              <h1 style="margin:0;font-size:22px;">Chào mừng đến với VISTA HOTEL</h1>
              <p style="margin:8px 0 0;font-size:14px;opacity:0.9;">
                Cảm ơn bạn đã đăng ký tài khoản.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px 32px;color:#333333;font-size:14px;line-height:1.6;">
              <p>Xin chào <strong>${fullName}</strong>,</p>
              <p>
                Tài khoản của bạn tại <strong>VISTA HOTEL</strong> đã được tạo thành công.
                Từ bây giờ, bạn có thể: 
              </p>
              <ul style="padding-left:18px;margin:8px 0;">
                <li>Đặt phòng nhanh chóng và dễ dàng.</li>
                <li>Nhận ưu đãi độc quyền dành cho thành viên.</li>
                <li>Theo dõi lịch sử đặt phòng và điểm tích luỹ.</li>
              </ul>
              <p style="margin-top:16px;">
                Nhấn vào nút bên dưới để đăng nhập ngay:
              </p>
              <p style="text-align:center;margin:24px 0;">
                <a href="http://localhost:5173/auth/login"
                   style="background:#6b5430;color:#ffffff;text-decoration:none;padding:12px 32px;
                          border-radius:999px;font-weight:bold;display:inline-block;font-size:14px;">
                  Đăng nhập ngay
                </a>
              </p>
              <p style="font-size:12px;color:#777777;margin-top:16px;">
                Nếu bạn không thực hiện hành động này, vui lòng bỏ qua email này.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f2eee7;padding:16px 32px;text-align:center;font-size:12px;color:#777777;">
              © ${new Date().getFullYear()} VISTA HOTEL. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const loginWelcomeBackEmail = (fullName: string) => `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Chào mừng trở lại - Vista Hotel</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:#6b5430;padding:24px 32px;color:#ffffff;">
              <h1 style="margin:0;font-size:22px;">Rất vui được gặp lại bạn!</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px 32px;color:#333333;font-size:14px;line-height:1.6;">
              <p>Xin chào <strong>${fullName}</strong>,</p>
              <p>
                Cảm ơn bạn đã đăng nhập lại vào <strong>VISTA HOTEL</strong>.  
                Đừng quên kiểm tra các ưu đãi và voucher hiện có dành cho bạn nhé.
              </p>
              <p style="margin-top:16px;">
                Chúc bạn có trải nghiệm đặt phòng thật tuyệt vời cùng chúng tôi!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f2eee7;padding:16px 32px;text-align:center;font-size:12px;color:#777777;">
              Đây là email tự động, vui lòng không trả lời lại email này.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const otpEmailTemplate = (otp: string) => `
  <div style="font-family: Arial, sans-serif; padding:20px; background:#f8f5f0;">
    <div style="text-align:center; margin-bottom:20px;">
      <h2 style="color:#c3923c;">Vista Hotel</h2>
      <p style="font-size:14px;">Mã xác thực đặt lại mật khẩu của bạn</p>
    </div>

    <div style="text-align:center; margin:30px 0;">
      <div style="font-size:32px; font-weight:bold; letter-spacing:10px; color:#c3923c;">
        ${otp}
      </div>
    </div>

    <p>Mã OTP có hiệu lực trong <b>5 phút</b>.</p>
    <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>

    <hr style="margin-top:30px; border:none; border-top:1px solid #ddd;" />

    <p style="font-size:12px; color:#999; text-align:center;">
      © Vista Hotel – Hệ thống đặt phòng & chăm sóc khách hàng
    </p>
  </div>
`;


export const passwordChangedTemplate = (name: string) => `
  <div style="font-family:Arial;padding:20px;">
    <h2 style="color:#c3923c;">Xin chào ${name},</h2>
    <p>Mật khẩu tài khoản Vista Hotel của bạn đã được thay đổi thành công.</p>
    <p>Nếu bạn KHÔNG thực hiện hành động này, vui lòng liên hệ ngay với bộ phận hỗ trợ.</p>

    <div style="margin-top:20px;padding:15px;background:#f6f2e8;border-left:4px solid #c3923c;">
      <p><strong>Vista Hotel Security Team</strong></p>
    </div>
  </div>
`;
