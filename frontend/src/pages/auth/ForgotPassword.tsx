import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  faEnvelope,
  faCheckCircle,
  faShieldAlt,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logoImage from "../../assets/images/logoWhite.png";
import Button from "../../components/common/Button";
import FloatingInput from "../../components/common/FloatingInput";
import { validateEmailOrPhone, detectInputType } from "../../utils/validators";
import logoCaptcha from "../../assets/images/captcha.png";

type Step = "input" | "captcha" | "otp";

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<Step>("input");
  const [identifier, setIdentifier] = useState("");
  const [identifierError, setIdentifierError] = useState("");
  const [identifierSuccess, setIdentifierSuccess] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

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

  // Handle next step từ input
  const handleSendOTP = () => {
    const error = validateEmailOrPhone(identifier);
    setIdentifierError(error);
    setIdentifierSuccess(!error);

    if (error) {
      setShakeKey((prev) => prev + 1);
      return;
    }

    setStep("captcha");
  };

  // Handle captcha verification
  const handleCaptchaVerify = () => {
    if (!captchaChecked) {
      return;
    }

    // TODO: Gửi OTP về email/phone
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      setResendTimer(60); // 60 giây countdown

      // Countdown timer
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1500);
  };

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (value && !/^\d+$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    while (newOtp.length < 6) newOtp.push("");
    setOtp(newOtp);
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setShakeKey((prev) => prev + 1);
      return;
    }

    // TODO: Verify OTP with backend
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Navigate to reset password page with token/code
      navigate("/auth/reset-password", {
        state: {
          identifier,
          otpCode,
          verified: true,
        },
      });
    }, 1500);
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (resendTimer > 0) return;

    // TODO: Resend OTP
    setOtp(["", "", "", "", "", ""]);
    setResendTimer(60);

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step animations
  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-4">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logoImage} alt="Logo Vista" className="h-20 w-auto" />
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {["input", "captcha", "otp"].map((s, idx) => (
            <React.Fragment key={s}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step === s
                    ? "bg-[#c3923c] text-white scale-110 shadow-lg"
                    : ["input", "captcha", "otp"].indexOf(step) > idx
                    ? "bg-[#b4893e] text-white"
                    : "bg-white/20 text-white/60"
                }`}
              >
                {["input", "captcha", "otp"].indexOf(step) > idx ? (
                  <FontAwesomeIcon icon={faCheckCircle} />
                ) : (
                  idx + 1
                )}
              </div>
              {idx < 2 && (
                <div
                  className={`w-16 h-1 rounded transition-all ${
                    ["input", "captcha", "otp"].indexOf(step) > idx
                      ? "bg-[#b4893e]"
                      : "bg-white/20"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Input Email/Phone */}
          {step === "input" && (
            <motion.div
              key="input"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-yellow-50 mb-2">
                  Quên mật khẩu?
                </h1>
                <p className="text-sm text-yellow-50/80">
                  Nhập email hoặc số điện thoại của bạn để nhận mã xác thực
                </p>
              </div>

              <div
                key={`identifier-${shakeKey}`}
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
                      : "border-white/40"
                  }
                  focusBorderColor={
                    identifierError
                      ? "focus:border-red-500"
                      : identifierSuccess
                      ? "focus:border-green-500"
                      : "focus:border-[#c3923c]"
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
                      : "text-[#c3923c]"
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

              <div className="flex gap-3">
                <Button
                  text="Quay lại"
                  color="bg-white/10"
                  textColor="text-white"
                  size="lg"
                  rounded="md"
                  onClick={() => navigate("/auth/login")}
                  className="flex-1 font-semibold hover:bg-white/20 transition-colors border-2 border-white/30"
                />
                <Button
                  text="Tiếp tục"
                  color="bg-[#c3923c]"
                  textColor="text-white"
                  size="lg"
                  rounded="md"
                  onClick={handleSendOTP}
                  className="flex-1 font-semibold hover:bg-[#b4893e] transition-colors"
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Captcha Verification */}
          {step === "captcha" && (
            <motion.div
              key="captcha"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-[#c3923c]/20 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faShieldAlt}
                      className="text-4xl text-[#c3923c]"
                    />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-yellow-50 mb-2">
                  Xác thực bảo mật
                </h1>
                <p className="text-sm text-yellow-50/80">
                  Vui lòng xác nhận bạn không phải là robot
                </p>
              </div>

              {/* Mock Captcha */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    id="captcha"
                    checked={captchaChecked}
                    onChange={(e) => setCaptchaChecked(e.target.checked)}
                    className="w-6 h-6 mt-1 cursor-pointer accent-[#c3923c]"
                  />
                  <label
                    htmlFor="captcha"
                    className="flex-1 text-white cursor-pointer"
                  >
                    <span className="font-medium">Tôi không phải là robot</span>
                    <p className="text-xs text-white/60 mt-1">
                      Nhấn vào ô để xác thực
                    </p>
                  </label>
                  {/* Logo capcha  */}
                  <div className="text-white/40">
                    <img
                      src={logoCaptcha}
                      alt="captcha"
                      className="w-15 h-15"
                    />
                  </div>
                </div>

                {captchaChecked && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-[#00c853]/20 border border-[#00c853]/50 rounded-lg flex items-center gap-2 text-[#00c853] text-sm"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>Xác thực thành công!</span>
                  </motion.div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  text="Quay lại"
                  color="bg-white/10"
                  textColor="text-white"
                  size="lg"
                  rounded="md"
                  onClick={() => setStep("input")}
                  className="flex-1 font-semibold hover:bg-white/20 transition-colors border-2 border-white/30"
                />
                <Button
                  text={loading ? "Đang gửi mã..." : "Gửi mã xác thực"}
                  color="bg-[#c3923c]"
                  textColor="text-white"
                  size="lg"
                  rounded="md"
                  onClick={handleCaptchaVerify}
                  disabled={!captchaChecked || loading}
                  loading={loading}
                  className="flex-1 font-semibold hover:bg-[#8f6318] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: OTP Verification */}
          {step === "otp" && (
            <motion.div
              key="otp"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-[#c3923c]/20 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faKey}
                      className="text-4xl text-[#c3923c]"
                    />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-yellow-50 mb-2">
                  Nhập mã xác thực
                </h1>
                <p className="text-sm text-yellow-50/80">
                  Mã xác thực đã được gửi đến{" "}
                  <span className="font-semibold text-[#c3923c]">
                    {identifier}
                  </span>
                </p>
              </div>

              {/* OTP Input */}
              <div
                key={`otp-${shakeKey}`}
                className={`flex justify-center gap-2 mb-6 ${
                  shakeKey > 0 ? "animate-[shake_400ms_ease-in-out]" : ""
                }`}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    className="w-12 h-14 text-center text-2xl font-bold bg-white/10 border-2 border-white/40 rounded-lg text-white focus:border-[#c3923c] focus:outline-none transition-all"
                  />
                ))}
              </div>

              {/* Resend OTP */}
              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-white/60 text-sm">
                    Gửi lại mã sau{" "}
                    <span className="font-bold text-[#c3923c]">
                      {resendTimer}s
                    </span>
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    className="text-[#c3923c] hover:text-[#b4893e] text-sm font-medium transition-colors cursor-pointer"
                  >
                    Không nhận được mã? Gửi lại
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  text="Quay lại"
                  color="bg-white/10"
                  textColor="text-white"
                  size="lg"
                  rounded="md"
                  onClick={() => setStep("captcha")}
                  className="flex-1 font-semibold hover:bg-white/20 transition-colors border-2 border-white/30"
                />
                <Button
                  text={loading ? "Đang xác thực..." : "Xác thực"}
                  color="bg-[#c3923c]"
                  textColor="text-white"
                  size="lg"
                  rounded="md"
                  onClick={handleVerifyOtp}
                  disabled={otp.join("").length !== 6 || loading}
                  loading={loading}
                  className="flex-1 font-semibold hover:bg-[#b4893e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ForgotPassword;
