import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import logoImage from "../../assets/images/logoWhite.png";
import googleLogo from "../../assets/images/google-logo.svg";
import Button from "../../components/Button";
import FloatingInput from "../../components/FloatingInput";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic with validation
    console.log("Login:", { email, password });
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="w-full flex flex-col">
      <form onSubmit={handleLogin} className="flex flex-col space-y-4 pb-6">
        {/* Logo Section */}
        <div className="flex justify-center mb-1">
          <img src={logoImage} alt="Logo Vista" className="h-16 w-auto" />
        </div>

        {/* Title Section */}
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-yellow-50 mb-2">Đăng nhập</h1>
          <p className="text-sm text-yellow-50">
            Chào mừng bạn trở lại với Vista Hotel
          </p>
        </div>

        {/* Email Input with Error */}
        <div className="min-h-[65px] mt-6">
          <FloatingInput
            label="Email hoặc Số điện thoại"
            type="email"
            value={email}
            onChange={setEmail}
            iconLeft={faEnvelope}
            size="md"
            borderColor={emailError ? "border-red-500" : "border-gray-300"}
            focusBorderColor={
              emailError ? "focus:border-red-500" : "focus:border-amber-400"
            }
            labelColor={emailError ? "text-red-500" : "text-white"}
            focusLabelColor={emailError ? "text-red-500" : "text-amber-400"}
            className="bg-transparent"
          />
          {emailError && (
            <p className="text-red-500 text-xs mt-1">{emailError}</p>
          )}
        </div>

        {/* Password Input with Error */}
        <div className="min-h-[65px]">
          <FloatingInput
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={setPassword}
            iconLeft={faLock}
            size="md"
            borderColor={passwordError ? "border-red-500" : "border-gray-300"}
            focusBorderColor={
              passwordError ? "focus:border-red-500" : "focus:border-amber-400"
            }
            labelColor={passwordError ? "text-red-500" : "text-white"}
            focusLabelColor={passwordError ? "text-red-500" : "text-amber-400"}
            className="bg-transparent"
          />
          {passwordError && (
            <p className="text-red-500 text-xs mt-1">{passwordError}</p>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end -mt-1">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-amber-400 hover:text-amber-500 text-sm font-medium transition-colors"
          >
            Quên mật khẩu?
          </button>
        </div>

        {/* Login Button */}
        <Button
          text="Đăng nhập"
          color="bg-amber-400"
          textColor="text-gray-900"
          size="lg"
          rounded="md"
          fullWidth
          shadow
          type="submit"
          className="font-semibold hover:bg-amber-500 transition-colors"
        />

        {/* Divider */}
        <div className="flex items-center gap-3 mt-5">
          <div className="flex-1 h-px bg-white/30"></div>
          <span className="text-white/70 text-xs">Hoặc tiếp tục với</span>
          <div className="flex-1 h-px bg-white/30"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2 border border-white/50 rounded-md text-white font-medium text-sm hover:border-white hover:bg-white/10 transition-colors"
          >
            <img src={googleLogo} alt="Google" className="w-5 h-5" />
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2 border border-white/50 rounded-md text-white font-medium text-sm hover:border-white hover:bg-white/10 transition-colors"
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

        {/* Terms and Conditions */}
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

        {/* Register Link */}
        <p className="text-center text-sm text-white/80">
          Chưa phải thành viên?{" "}
          <button
            type="button"
            onClick={handleRegister}
            className="text-amber-300 hover:text-amber-200 font-semibold transition-colors"
          >
            Đăng ký
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
