import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import logoImage from "../../assets/images/logoWhite.png";
import googleLogo from "../../assets/images/google-logo.svg";
import Button from "../../components/Button";
import FloatingInput from "../../components/FloatingInput";
import { handleLogin } from "../../services/authService";
import {
  validateEmailOrPhone,
  validatePassword,
  detectInputType,
} from "../../utils/validators";
import { useToastContext } from "../../hooks/useToastContext";

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState(""); // Email hoặc phone
  const [password, setPassword] = useState("");
  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [identifierSuccess, setIdentifierSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const navigate = useNavigate();
  const toast = useToastContext();

  // Real-time validation cho identifier
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

  // Real-time validation cho password
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value) {
      const error = validatePassword(value);
      setPasswordError(error);
      setPasswordSuccess(!error);
    } else {
      setPasswordError("");
      setPasswordSuccess(false);
    }
  };

  // Xử lý submit form đăng nhập
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const idErr = validateEmailOrPhone(identifier);
    const pwErr = validatePassword(password);
    setIdentifierError(idErr);
    setPasswordError(pwErr);
    setIdentifierSuccess(!idErr);
    setPasswordSuccess(!pwErr);

    if (idErr || pwErr) {
      setShakeKey((prev) => prev + 1); // Trigger shake animation
      return;
    }

    setLoading(true);

    // Kiểm tra xem email hay phone và gửi payload tương ứng
    const inputType = detectInputType(identifier.trim());
    const loginPayload: { email?: string; phone?: string; password: string } = {
      password,
    };

    if (inputType === "email") {
      loginPayload.email = identifier.trim();
    } else if (inputType === "phone") {
      loginPayload.phone = identifier.trim();
    }

    const res = await handleLogin(loginPayload);
    setLoading(false);

    if (res.success) {
      if (res.token) localStorage.setItem("token", res.token);
      if (res.data) localStorage.setItem("user", JSON.stringify(res.data));

      toast.success("Đăng nhập thành công!", { duration: 2000 });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      setPasswordError(res.message);
      setPasswordSuccess(false);
      toast.error(res.message, { duration: 3000 });
    }
  };

  // Chuyển đến quên mật khẩu
  const handleForgotPassword = () => navigate("/auth/forgot-password");

  // Chuyển đến đăng ký
  const handleRegister = () => navigate("/auth/register");

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} className="flex flex-col space-y-4">
        <div className="flex justify-center mb-2">
          <img src={logoImage} alt="Logo Vista" className="h-16 w-auto" />
        </div>

        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold text-yellow-50 mb-2">Đăng nhập</h1>
          <p className="text-sm text-yellow-50">
            Chào mừng bạn trở lại với Vista Hotel
          </p>
        </div>

        {/* Email hoặc Số điện thoại  */}
        <div
          key={`identifier-${shakeKey}`}
          className={`min-h-[70px] mt-5 ${
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
                : "border-white/40"
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
                : "text-white/80"
            }
            focusLabelColor={
              identifierError
                ? "text-red-500"
                : identifierSuccess
                ? "text-green-500"
                : "text-amber-400"
            }
            className="bg-transparent text-white"
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
        
        {/* Mật khẩu  */}
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
                : "border-white/40"
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
                : "text-white/80"
            }
            focusLabelColor={
              passwordError
                ? "text-red-500"
                : passwordSuccess
                ? "text-green-500"
                : "text-amber-400"
            }
            className="bg-transparent text-white"
          />
          {passwordError && (
            <p className="text-red-500 text-xs mt-1">{passwordError}</p>
          )}
          {passwordSuccess && !passwordError && (
            <p className="text-green-500 text-xs mt-1">✓ Mật khẩu hợp lệ</p>
          )}
        </div>
        
        {/* Quên mật khẩu? */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-amber-400 hover:text-amber-500 text-sm font-medium transition-colors cursor-pointer"
          >
            Quên mật khẩu?
          </button>
        </div>

        {/* Button đăng nhập */}
        <Button
          text={loading ? "Đang đăng nhập..." : "Đăng nhập"}
          color="bg-amber-400"
          textColor="text-gray-900"
          size="lg"
          rounded="md"
          fullWidth
          shadow
          type="submit"
          disabled={loading}
          className="font-semibold hover:bg-amber-500 transition-colors"
          loading={loading}
        />

        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-white/30" />
          <span className="text-white/70 text-xs">Hoặc tiếp tục với</span>
          <div className="flex-1 h-px bg-white/30" />
        </div>
        {/* Đăng nhập với mạng xã hội  */}
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

        {/* Chuyển đến đăng ký */}
        <p className="text-center text-xs text-white/70 leading-relaxed">
          Khi đăng ký, bạn đồng ý với{" "}
          <a href="#" className="text-amber-300 hover:underline font-medium">
            Điều khoản
          </a>{" "}
          và{" "}
          <a href="#" className="text-amber-300 hover:underline font-medium">
            Chính sách
          </a>
        </p>

        {/* Chuyển đến đăng ký  */}
        <p className="text-center text-sm text-white/80">
          Chưa phải thành viên?{" "}
          <button
            type="button"
            onClick={handleRegister}
            className="text-amber-300 hover:text-amber-200 font-semibold transition-colors cursor-pointer"
          >
            Đăng ký
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
