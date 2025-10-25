import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import logoImage from "../../assets/images/logoWhite.png";
import googleLogo from "../../assets/images/google-logo.svg";
import Button from "../../components/Button";
import FloatingInput from "../../components/FloatingInput";
import { handleRegister } from "../../services/authService";
import {
  validateFullName,
  validateEmailOrPhone,
  validatePassword,
  validateConfirmPassword,
  validateUserName,
  detectInputType,
} from "../../utils/validators";
import { useToastContext } from "../../hooks/useToastContext";

const Register: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState(""); // Email or phone
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [userNameError, setUserNameError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Trạng thái thành công cho border màu xanh
  const [userNameSuccess, setUserNameSuccess] = useState(false);
  const [fullNameSuccess, setFullNameSuccess] = useState(false);
  const [identifierSuccess, setIdentifierSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [confirmPasswordSuccess, setConfirmPasswordSuccess] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const navigate = useNavigate();
  const toast = useToastContext();

  // Real-time validation
  const handleUserNameChange = (value: string) => {
    setUserName(value);
    if (value.trim()) {
      const error = validateUserName(value);
      setUserNameError(error);
      setUserNameSuccess(!error);
    } else {
      setUserNameError("");
      setUserNameSuccess(false);
    }
  };

  const handleFullNameChange = (value: string) => {
    setFullName(value);
    if (value.trim()) {
      const error = validateFullName(value);
      setFullNameError(error);
      setFullNameSuccess(!error);
    } else {
      setFullNameError("");
      setFullNameSuccess(false);
    }
  };

  const handleIdentifierChange = (value: string) => {
    setIdentifier(value);
    if (value.trim()) {
      const error = validateEmailOrPhone(value);
      setIdentifierError(error);
      setIdentifierSuccess(!error);
    } else {
      setIdentifierError("");
      setIdentifierSuccess(false);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value) {
      const error = validatePassword(value);
      setPasswordError(error);
      setPasswordSuccess(!error);
      // Xác nhận lại mật khẩu nếu nó tồn tại
      if (confirmPassword) {
        const confirmError = validateConfirmPassword(value, confirmPassword);
        setConfirmPasswordError(confirmError);
        setConfirmPasswordSuccess(!confirmError);
      }
    } else {
      setPasswordError("");
      setPasswordSuccess(false);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value) {
      const error = validateConfirmPassword(password, value);
      setConfirmPasswordError(error);
      setConfirmPasswordSuccess(!error);
    } else {
      setConfirmPasswordError("");
      setConfirmPasswordSuccess(false);
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // UserName
    const userNameErr = validateUserName(userName);
    setUserNameError(userNameErr);
    setUserNameSuccess(!userNameErr);
    if (userNameErr) isValid = false;

    // FullName
    const fullNameErr = validateFullName(fullName);
    setFullNameError(fullNameErr);
    setFullNameSuccess(!fullNameErr);
    if (fullNameErr) isValid = false;

    // Identifier (email or phone)
    const identifierErr = validateEmailOrPhone(identifier);
    setIdentifierError(identifierErr);
    setIdentifierSuccess(!identifierErr);
    if (identifierErr) isValid = false;

    // Password
    const passwordErr = validatePassword(password);
    setPasswordError(passwordErr);
    setPasswordSuccess(!passwordErr);
    if (passwordErr) isValid = false;

    // Confirm password
    const confirmPasswordErr = validateConfirmPassword(
      password,
      confirmPassword
    );
    setConfirmPasswordError(confirmPasswordErr);
    setConfirmPasswordSuccess(!confirmPasswordErr);
    if (confirmPasswordErr) isValid = false;

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear lỗi cũ
    setUserNameError("");
    setFullNameError("");
    setIdentifierError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Validate
    if (!validateForm()) {
      setShakeKey((prev) => prev + 1); // Trigger shake animation
      return;
    }

    setIsSubmitting(true);
    try {
      // Xác định xem identifier là email hay số điện thoại
      const inputType = detectInputType(identifier.trim());
      const payload: {
        userName: string;
        fullName: string;
        email?: string;
        phone?: string;
        password: string;
      } = {
        userName: userName.trim(),
        fullName: fullName.trim(),
        password,
      };

      if (inputType === "email") {
        payload.email = identifier.trim();
      } else if (inputType === "phone") {
        payload.phone = identifier.trim();
      }

      const result = await handleRegister(payload);

      if (result.success) {
        toast.success(
          "Đăng ký thành công! Đang chuyển sang trang đăng nhập...",
          {
            duration: 2000,
          }
        );

        setTimeout(() => {
          navigate("/auth/login");
        }, 1500);
      } else {
        toast.error(result.message, { duration: 3000 });
      }
    } catch {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.", { duration: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = () => navigate("/auth/login");

  return (
    <div className="w-full flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-5 pb-6">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <img src={logoImage} alt="Logo Vista" className="h-16 w-auto" />
        </div>

        {/* Title */}
        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold text-yellow-50 mb-2">Đăng ký</h1>
          <p className="text-sm text-yellow-50">
            Tạo tài khoản để trải nghiệm Vista Hotel
          </p>
        </div>

        {/* Username */}
        <div
          key={`userName-${shakeKey}`}
          className={`min-h-[70px] mt-5 ${
            userNameError ? "animate-[shake_400ms_ease-in-out]" : ""
          }`}
        >
          <FloatingInput
            label="Tên đăng nhập"
            type="text"
            value={userName}
            onChange={handleUserNameChange}
            iconLeft={faUser}
            size="md"
            borderColor={
              userNameError
                ? "border-red-500"
                : userNameSuccess
                ? "border-green-500"
                : "border-gray-300"
            }
            focusBorderColor={
              userNameError
                ? "focus:border-red-500"
                : userNameSuccess
                ? "focus:border-green-500"
                : "focus:border-amber-400"
            }
            labelColor={
              userNameError
                ? "text-red-500"
                : userNameSuccess
                ? "text-green-500"
                : "text-white"
            }
            focusLabelColor={
              userNameError
                ? "text-red-500"
                : userNameSuccess
                ? "text-green-500"
                : "text-amber-400"
            }
            className="bg-transparent"
          />
          {userNameError && (
            <p className="text-red-500 text-xs mt-1">{userNameError}</p>
          )}
          {userNameSuccess && !userNameError && (
            <p className="text-green-500 text-xs mt-1">
              ✓ Tên đăng nhập hợp lệ
            </p>
          )}
        </div>

        {/* Full name  */}
        <div
          key={`fullName-${shakeKey}`}
          className={`min-h-[70px] ${
            fullNameError ? "animate-[shake_400ms_ease-in-out]" : ""
          }`}
        >
          <FloatingInput
            label="Họ và tên"
            type="text"
            value={fullName}
            onChange={handleFullNameChange}
            iconLeft={faUser}
            size="md"
            borderColor={
              fullNameError
                ? "border-red-500"
                : fullNameSuccess
                ? "border-green-500"
                : "border-gray-300"
            }
            focusBorderColor={
              fullNameError
                ? "focus:border-red-500"
                : fullNameSuccess
                ? "focus:border-green-500"
                : "focus:border-amber-400"
            }
            labelColor={
              fullNameError
                ? "text-red-500"
                : fullNameSuccess
                ? "text-green-500"
                : "text-white"
            }
            focusLabelColor={
              fullNameError
                ? "text-red-500"
                : fullNameSuccess
                ? "text-green-500"
                : "text-amber-400"
            }
            className="bg-transparent"
          />
          {fullNameError && (
            <p className="text-red-500 text-xs mt-1">{fullNameError}</p>
          )}
          {fullNameSuccess && !fullNameError && (
            <p className="text-green-500 text-xs mt-1">✓ Họ và tên hợp lệ</p>
          )}
        </div>

        {/* Email / Phone */}
        <div
          key={`email-${shakeKey}`}
          className={`min-h-[70px] ${
            identifierError ? "animate-[shake_400ms_ease-in-out]" : ""
          }`}
        >
          <FloatingInput
            label="Email hoặc Số điện thoại"
            type="text"
            value={identifier}
            onChange={handleIdentifierChange}
            iconLeft={faEnvelope}
            size="md"
            borderColor={
              identifierError
                ? "border-red-500"
                : identifierSuccess
                ? "border-green-500"
                : "border-gray-300"
            }
            focusBorderColor={
              identifierError
                ? "focus:border-red-500"
                : identifierSuccess
                ? "focus:border-green-500"
                : "focus:border-amber-400"
            }
            labelColor={
              identifierError
                ? "text-red-500"
                : identifierSuccess
                ? "text-green-500"
                : "text-white"
            }
            focusLabelColor={
              identifierError
                ? "text-red-500"
                : identifierSuccess
                ? "text-green-500"
                : "text-amber-400"
            }
            className="bg-transparent"
          />
          {identifierError && (
            <p className="text-red-500 text-xs mt-1">{identifierError}</p>
          )}
          {identifierSuccess && !identifierError && (
            <p className="text-green-500 text-xs mt-1">
              ✓{" "}
              {detectInputType(identifier) === "email"
                ? "Email"
                : "Số điện thoại"}{" "}
              hợp lệ
            </p>
          )}
        </div>

        {/* Password */}
        <div
          key={`password-${shakeKey}`}
          className={`min-h-[70px] ${
            passwordError ? "animate-[shake_400ms_ease-in-out]" : ""
          }`}
        >
          <FloatingInput
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            iconLeft={faLock}
            size="md"
            borderColor={
              passwordError
                ? "border-red-500"
                : passwordSuccess
                ? "border-green-500"
                : "border-gray-300"
            }
            focusBorderColor={
              passwordError
                ? "focus:border-red-500"
                : passwordSuccess
                ? "focus:border-green-500"
                : "focus:border-amber-400"
            }
            labelColor={
              passwordError
                ? "text-red-500"
                : passwordSuccess
                ? "text-green-500"
                : "text-white"
            }
            focusLabelColor={
              passwordError
                ? "text-red-500"
                : passwordSuccess
                ? "text-green-500"
                : "text-amber-400"
            }
            className="bg-transparent"
          />
          {passwordError && (
            <p className="text-red-500 text-xs mt-1">{passwordError}</p>
          )}
          {passwordSuccess && !passwordError && (
            <p className="text-green-500 text-xs mt-1">✓ Mật khẩu hợp lệ</p>
          )}
        </div>

        {/* Confirm password */}
        <div
          key={`confirmPassword-${shakeKey}`}
          className={`min-h-[70px] ${
            confirmPasswordError ? "animate-[shake_400ms_ease-in-out]" : ""
          }`}
        >
          <FloatingInput
            label="Xác nhận mật khẩu"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            iconLeft={faLock}
            size="md"
            borderColor={
              confirmPasswordError
                ? "border-red-500"
                : confirmPasswordSuccess
                ? "border-green-500"
                : "border-gray-300"
            }
            focusBorderColor={
              confirmPasswordError
                ? "focus:border-red-500"
                : confirmPasswordSuccess
                ? "focus:border-green-500"
                : "focus:border-amber-400"
            }
            labelColor={
              confirmPasswordError
                ? "text-red-500"
                : confirmPasswordSuccess
                ? "text-green-500"
                : "text-white"
            }
            focusLabelColor={
              confirmPasswordError
                ? "text-red-500"
                : confirmPasswordSuccess
                ? "text-green-500"
                : "text-amber-400"
            }
            className="bg-transparent"
          />
          {confirmPasswordError && (
            <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>
          )}
          {confirmPasswordSuccess && !confirmPasswordError && (
            <p className="text-green-500 text-xs mt-1">✓ Mật khẩu khớp</p>
          )}
        </div>

        {/* Submit */}
        <Button
          text={isSubmitting ? "Đang xử lý..." : "Đăng ký"}
          color="bg-amber-400"
          textColor="text-gray-900"
          size="lg"
          rounded="md"
          fullWidth
          shadow
          type="submit"
          disabled={isSubmitting}
          className="font-semibold hover:bg-amber-500 transition-colors"
        />

        {/* Divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-white/30"></div>
          <span className="text-white/70 text-xs">Hoặc tiếp tục với</span>
          <div className="flex-1 h-px bg-white/30"></div>
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2 border border-white/50 rounded-md text-white font-medium text-sm hover:border-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <img src={googleLogo} alt="Google" className="w-5 h-5" />
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2 border border-white/50 rounded-md text-white font-medium text-sm hover:border-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                fill="#1877F2"
              />
            </svg>
            Facebook
          </button>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-white/70 leading-relaxed">
          Khi đăng ký, bạn đồng ý với{" "}
          <a href="#" className="text-amber-300 hover:underline font-medium">
            Điều khoản
          </a>{" "}
          và{" "}
          <a href="#" className="text-amber-300 hover:underline font-medium">
            Chính sách của chúng tôi
          </a>
        </p>

        {/* Login link*/}
        <p className="text-center text-sm text-white/80">
          Đã có tài khoản?{" "}
          <button
            type="button"
            onClick={handleLogin}
            className="text-amber-300 hover:text-amber-200 font-semibold transition-colors cursor-pointer"
          >
            Đăng nhập
          </button>
        </p>
      </form>
    </div>
  );
};

export default Register;
