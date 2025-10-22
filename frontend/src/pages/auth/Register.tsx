import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import logoImage from "../../assets/images/logoWhite.png";
import googleLogo from "../../assets/images/google-logo.svg";
import Button from "../../components/Button";
import FloatingInput from "../../components/FloatingInput";

const Register: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement register logic with validation
    console.log("Register:", { fullName, email, password, confirmPassword });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="w-full flex flex-col">
      <form onSubmit={handleRegister} className="flex flex-col space-y-5 pb-6">
        {/* Logo Section */}
        <div className="flex justify-center mb-2">
          <img src={logoImage} alt="Logo Vista" className="h-16 w-auto" />
        </div>

        {/* Title Section */}
        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold text-yellow-50 mb-2">Đăng ký</h1>
          <p className="text-sm text-yellow-50">
            Tạo tài khoản để trải nghiệm Vista Hotel
          </p>
        </div>

        {/* Full Name Input with Error */}
        <div className="min-h-[70px] mt-5">
          <FloatingInput
            label="Họ và tên"
            type="text"
            value={fullName}
            onChange={setFullName}
            iconLeft={faUser}
            size="md"
            borderColor={fullNameError ? "border-red-500" : "border-gray-300"}
            focusBorderColor={
              fullNameError ? "focus:border-red-500" : "focus:border-amber-400"
            }
            labelColor={fullNameError ? "text-red-500" : "text-white"}
            focusLabelColor={fullNameError ? "text-red-500" : "text-amber-400"}
            className="bg-transparent"
          />
          {fullNameError && (
            <p className="text-red-500 text-xs mt-1">{fullNameError}</p>
          )}
        </div>

        {/* Email Input with Error */}
        <div className="min-h-[70px]">
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
        <div className="min-h-[70px]">
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

        {/* Confirm Password Input with Error */}
        <div className="min-h-[70px]">
          <FloatingInput
            label="Xác nhận mật khẩu"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            iconLeft={faLock}
            size="md"
            borderColor={
              confirmPasswordError ? "border-red-500" : "border-gray-300"
            }
            focusBorderColor={
              confirmPasswordError
                ? "focus:border-red-500"
                : "focus:border-amber-400"
            }
            labelColor={confirmPasswordError ? "text-red-500" : "text-white"}
            focusLabelColor={
              confirmPasswordError ? "text-red-500" : "text-amber-400"
            }
            className="bg-transparent"
          />
          {confirmPasswordError && (
            <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>
          )}
        </div>

        {/* Register Button */}
        <Button
          text="Đăng ký"
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
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-white/30"></div>
          <span className="text-white/70 text-xs">Hoặc tiếp tục với</span>
          <div className="flex-1 h-px bg-white/30"></div>
        </div>

        {/* Social Login Buttons */}
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

        {/* Login Link */}
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
