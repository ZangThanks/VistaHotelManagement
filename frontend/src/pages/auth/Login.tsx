import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import logoImage from "../../assets/images/logo.png";
import Button from "../../components/Button";
import FloatingInput from "../../components/FloatingInput";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log("Login:", { email, password });
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleLogin}
        className="space-y-6 max-h-[80vh] overflow-y-auto scrollbar-thin"
      >
        {/* Logo Section */}
        <div className="flex justify-center mb-4">
          <img src={logoImage} alt="Logo Vista" className="h-16 w-auto" />
        </div>

        {/* Title Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
          <p className="text-gray-600">Chào mừng bạn trở lại với Vista Hotel</p>
        </div>

        {/* Email Input */}
        <div>
          <FloatingInput
            label="Email hoặc Số điện thoại"
            type="email"
            value={email}
            onChange={setEmail}
            iconLeft={faEnvelope}
            size="md"
            borderColor="border-gray-300"
            focusBorderColor="focus:border-amber-400"
            labelColor="text-gray-500"
            focusLabelColor="text-amber-400"
            className="bg-transparent"
          />
        </div>

        {/* Password Input */}
        <div>
          <FloatingInput
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={setPassword}
            iconLeft={faLock}
            size="md"
            borderColor="border-gray-300"
            focusBorderColor="focus:border-amber-400"
            labelColor="text-gray-500"
            focusLabelColor="text-amber-400"
            className="bg-transparent"
          />
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
          >
            Quên mật khẩu?
          </button>
        </div>

        {/* Login Button */}
        <div>
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
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">Hoặc tiếp tục với</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            text="Google"
            color="bg-transparent"
            textColor="text-gray-900"
            borderColor="border-gray-300"
            size="md"
            rounded="md"
            outline
            fullWidth
            className="border font-medium hover:border-gray-400 hover:bg-gray-100 transition-colors"
            icon={faEnvelope}
            iconPosition="left"
          />
          <Button
            text="Facebook"
            color="bg-transparent"
            textColor="text-gray-900"
            borderColor="border-gray-300"
            size="md"
            rounded="md"
            outline
            fullWidth
            className="border font-medium hover:border-gray-400 hover:bg-gray-100 transition-colors"
            icon={faEnvelope}
            iconPosition="left"
          />
        </div>

        {/* Terms and Conditions */}
        <p className="text-center text-xs text-gray-600">
          Khi đăng ký, bạn đồng ý với{" "}
          <a href="#" className="text-amber-400 hover:underline">
            Điều khoản
          </a>{" "}
          và{" "}
          <a href="#" className="text-amber-400 hover:underline">
            Chính sách của chúng tôi
          </a>
        </p>

        {/* Register Link */}
        <p className="text-center text-gray-700">
          Chưa phải thành viên?{" "}
          <button
            type="button"
            onClick={handleRegister}
            className="text-amber-400 hover:text-amber-500 font-semibold transition-colors"
          >
            Đăng ký
          </button>{" "}
        </p>
      </form>
    </div>
  );
};

export default Login;
