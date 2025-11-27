/**
 * Kiểm tra định dạng Email hợp lệ.
 *
 * @param {string} email - Chuỗi email cần kiểm tra.
 * @returns {string} Trả về chuỗi lỗi nếu email không hợp lệ, ngược lại trả về chuỗi rỗng "".
 *
 * @example
 * validateEmail("test@gmail.com"); // ""
 * validateEmail("abc"); // "Email không hợp lệ"
 */
export const validateEmail = (email: string): string => {
  if (!email) return "Email is required";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";

  return "";
};

/**
 * Kiểm tra định dạng số điện thoại Việt Nam hợp lệ.
 *
 * @param {string} phone - Chuỗi số điện thoại cần kiểm tra.
 * @returns {string} Thông báo lỗi nếu không hợp lệ, ngược lại là chuỗi rỗng.
 *
 * @example
 * validatePhone("0987654321"); // ""
 * validatePhone("12345"); // "Số điện thoại không hợp lệ"
 */
export const validatePhone = (phone: string): string => {
  if (!phone) return "Phone number is required";

  const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
  if (!phoneRegex.test(phone)) return "Invalid phone number format";

  return "";
};

/**
 * Kiểm tra đầu vào có phải là email hoặc số điện thoại hợp lệ hay không.
 *
 * @param {string} value - Chuỗi cần kiểm tra.
 * @returns {string} Trả về thông báo lỗi nếu không hợp lệ, ngược lại là chuỗi rỗng.
 *
 * @example
 * validateEmailOrPhone("test@gmail.com"); // ""
 * validateEmailOrPhone("0987654321"); // ""
 * validateEmailOrPhone("abc"); // "Email hoặc số điện thoại không hợp lệ"
 */
export const validateEmailOrPhone = (value: string): string => {
  if (!value) return "Email or phone number is required";

  const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (phoneRegex.test(value) || emailRegex.test(value)) return "";

  return "Invalid email or phone number format";
};

/**
 * Kiểm tra độ mạnh của mật khẩu theo quy tắc bảo mật.
 *
 * @param {string} password - Mật khẩu cần kiểm tra.
 * @returns {string} Chuỗi lỗi nếu không hợp lệ, ngược lại là chuỗi rỗng.
 *
 * @example
 * validatePassword("Abc@1234"); // ""
 * validatePassword("abc123"); // "Mật khẩu phải có ít nhất một ký tự in hoa"
 */
export const validatePassword = (password: string): string => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (password.length > 50) return "Password must not exceed 50 characters";

  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one digit";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return "Password must contain at least one special character";

  return "";
};

/**
 * Kiểm tra xác nhận mật khẩu trùng khớp với mật khẩu chính.
 *
 * @param {string} password - Mật khẩu chính.
 * @param {string} confirmPassword - Mật khẩu nhập lại để xác nhận.
 * @returns {string} Trả về lỗi nếu không khớp hoặc bị trống, ngược lại là chuỗi rỗng.
 *
 * @example
 * validateConfirmPassword("Abc@1234", "Abc@1234"); // ""
 * validateConfirmPassword("Abc@1234", "Abc1234"); // "Mật khẩu xác nhận không khớp"
 */
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string => {
  if (!confirmPassword) return "Confirm password is required";
  if (password !== confirmPassword)
    return "Password confirmation does not match";
  return "";
};

/**
 * Kiểm tra tính hợp lệ của họ và tên người dùng.
 *
 * @param {string} fullName - Họ và tên cần kiểm tra.
 * @returns {string} Thông báo lỗi nếu không hợp lệ, ngược lại là chuỗi rỗng.
 *
 * @example
 * validateFullName("Nguyễn Văn A"); // ""
 * validateFullName("A"); // "Họ và tên phải có ít nhất 2 ký tự"
 */
export const validateFullName = (fullName: string): string => {
  if (!fullName) return "Full name is required";

  const trimmed = fullName.trim();
  if (trimmed.length < 2) return "Full name must be at least 2 characters";
  if (trimmed.length > 100) return "Full name must not exceed 100 characters";

  const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
  if (!nameRegex.test(trimmed)) return "Full name can only contain letters";

  return "";
};

/**
 * Kiểm tra hợp lệ của tên đăng nhập.
 *
 * @param {string} userName - Tên đăng nhập người dùng.
 * @returns {string} Thông báo lỗi nếu không hợp lệ, ngược lại là chuỗi rỗng.
 *
 * @example
 * validateUserName("tranlongvu"); // ""
 * validateUserName("ab"); // "Tên đăng nhập phải có ít nhất 6 ký tự"
 */
export const validateUserName = (userName: string): string => {
  if (!userName) return "Username is required";

  const trimmed = userName.trim();
  if (trimmed.length < 6) return "Username must be at least 6 characters";
  if (trimmed.length > 30) return "Username must not exceed 30 characters";

  return "";
};

/**
 * Xác định kiểu dữ liệu người dùng nhập vào là Email, Số điện thoại hay không hợp lệ.
 *
 * @param {string} value - Chuỗi đầu vào.
 * @returns {"email" | "phone" | "unknown"} Kiểu dữ liệu nhận diện được.
 *
 * @example
 * detectInputType("test@gmail.com"); // "email"
 * detectInputType("0987654321"); // "phone"
 * detectInputType("abc"); // "unknown"
 */
export const detectInputType = (
  value: string
): "email" | "phone" | "unknown" => {
  const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
  if (phoneRegex.test(value)) return "phone";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(value)) return "email";

  return "unknown";
};
