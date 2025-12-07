import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import logoImage from '../../assets/images/logoWhite.png';
import googleLogo from '../../assets/images/google-logo.svg';
import Button from '../../components/common/Button';
import FloatingInput from '../../components/common/FloatingInput';
import { handleRegister } from '../../services/authService';
import {
    validateFullName,
    validateEmail,
    validatePhone,
    validatePassword,
    validateConfirmPassword,
    validateUserName,
} from '../../utils/validators';
import { useToastContext } from '../../hooks/useToastContext';

const Register: React.FC = () => {
    const [userName, setUserName] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [userNameError, setUserNameError] = useState('');
    const [fullNameError, setFullNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    // Trạng thái thành công cho border màu xanh
    const [userNameSuccess, setUserNameSuccess] = useState(false);
    const [fullNameSuccess, setFullNameSuccess] = useState(false);
    const [emailSuccess, setEmailSuccess] = useState(false);
    const [phoneSuccess, setPhoneSuccess] = useState(false);
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
            setUserNameError('');
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
            setFullNameError('');
            setFullNameSuccess(false);
        }
    };

    const handleEmailChange = (value: string) => {
        setEmail(value);
        if (value.trim()) {
            const error = validateEmail(value);
            setEmailError(error);
            setEmailSuccess(!error);
        } else {
            setEmailError('');
            setEmailSuccess(false);
        }
    };

    const handlePhoneChange = (value: string) => {
        setPhone(value);
        if (value.trim()) {
            const error = validatePhone(value);
            setPhoneError(error);
            setPhoneSuccess(!error);
        } else {
            setPhoneError('');
            setPhoneSuccess(false);
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
                const confirmError = validateConfirmPassword(
                    value,
                    confirmPassword,
                );
                setConfirmPasswordError(confirmError);
                setConfirmPasswordSuccess(!confirmError);
            }
        } else {
            setPasswordError('');
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
            setConfirmPasswordError('');
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

        // Email
        const emailErr = validateEmail(email);
        setEmailError(emailErr);
        setEmailSuccess(!emailErr);
        if (emailErr) isValid = false;

        // Phone
        const phoneErr = validatePhone(phone);
        setPhoneError(phoneErr);
        setPhoneSuccess(!phoneErr);
        if (phoneErr) isValid = false;

        // Password
        const passwordErr = validatePassword(password);
        setPasswordError(passwordErr);
        setPasswordSuccess(!passwordErr);
        if (passwordErr) isValid = false;

        // Confirm password
        const confirmPasswordErr = validateConfirmPassword(
            password,
            confirmPassword,
        );
        setConfirmPasswordError(confirmPasswordErr);
        setConfirmPasswordSuccess(!confirmPasswordErr);
        if (confirmPasswordErr) isValid = false;

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear lỗi cũ
        setUserNameError('');
        setFullNameError('');
        setEmailError('');
        setPhoneError('');
        setPasswordError('');
        setConfirmPasswordError('');

        // Validate
        if (!validateForm()) {
            setShakeKey((prev) => prev + 1); // Trigger shake animation
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                userName: userName.trim(),
                fullName: fullName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                password,
            };

            const result = await handleRegister(payload);

            if (result.success) {
                toast.success(
                    'Đăng ký thành công! Đang chuyển sang trang đăng nhập...',
                    {
                        duration: 2000,
                    },
                );

                setTimeout(() => {
                    navigate('/auth/login');
                }, 1500);
            } else {
                toast.error(result.message, { duration: 3000 });
            }
        } catch {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại.', { duration: 3000 });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${
            import.meta.env.VITE_API_BASE_URL
        }/oauth2/authorization/google`;
    };

    const handleFacebookLogin = () => {
        window.location.href = `${
            import.meta.env.VITE_API_BASE_URL
        }/oauth2/authorization/facebook`;
    };

    return (
        <div className="w-full flex flex-col">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col space-y-4 pb-6"
            >
                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <img
                        src={logoImage}
                        alt="Logo Vista"
                        className="h-20 w-auto"
                    />
                </div>

                {/* Title */}
                <div className="text-center mb-4">
                    <h1 className="text-2xl font-bold text-yellow-50 mb-2">
                        Đăng ký tài khoản
                    </h1>
                    <p className="text-sm text-yellow-50/80">
                        Tạo tài khoản để trải nghiệm Vista Hotel
                    </p>
                </div>

                {/* Username */}
                <div
                    key={`userName-${shakeKey}`}
                    className={`min-h-[70px] ${
                        userNameError ? 'animate-[shake_400ms_ease-in-out]' : ''
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
                                ? 'border-red-500'
                                : userNameSuccess
                                ? 'border-green-500'
                                : 'border-white/40'
                        }
                        focusBorderColor={
                            userNameError
                                ? 'focus:border-red-500'
                                : userNameSuccess
                                ? 'focus:border-green-500'
                                : 'focus:border-[#c3923c]'
                        }
                        labelColor={
                            userNameError
                                ? 'text-red-500'
                                : userNameSuccess
                                ? 'text-green-500'
                                : 'text-white/80'
                        }
                        focusLabelColor={
                            userNameError
                                ? 'text-red-500'
                                : userNameSuccess
                                ? 'text-green-500'
                                : 'text-[#c3923c]'
                        }
                        className="bg-transparent text-white"
                    />
                    {userNameError && (
                        <p className="text-red-500 text-xs mt-1">
                            {userNameError}
                        </p>
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
                        fullNameError ? 'animate-[shake_400ms_ease-in-out]' : ''
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
                                ? 'border-red-500'
                                : fullNameSuccess
                                ? 'border-green-500'
                                : 'border-white/40'
                        }
                        focusBorderColor={
                            fullNameError
                                ? 'focus:border-red-500'
                                : fullNameSuccess
                                ? 'focus:border-green-500'
                                : 'focus:border-[#c3923c]'
                        }
                        labelColor={
                            fullNameError
                                ? 'text-red-500'
                                : fullNameSuccess
                                ? 'text-green-500'
                                : 'text-white/80'
                        }
                        focusLabelColor={
                            fullNameError
                                ? 'text-red-500'
                                : fullNameSuccess
                                ? 'text-green-500'
                                : 'text-[#c3923c]'
                        }
                        className="bg-transparent text-white"
                    />
                    {fullNameError && (
                        <p className="text-red-500 text-xs mt-1">
                            {fullNameError}
                        </p>
                    )}
                    {fullNameSuccess && !fullNameError && (
                        <p className="text-green-500 text-xs mt-1">
                            ✓ Họ và tên hợp lệ
                        </p>
                    )}
                </div>

                {/* Email */}
                <div
                    key={`email-${shakeKey}`}
                    className={`min-h-[70px] ${
                        emailError ? 'animate-[shake_400ms_ease-in-out]' : ''
                    }`}
                >
                    <FloatingInput
                        label="Email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        iconLeft={faEnvelope}
                        size="md"
                        borderColor={
                            emailError
                                ? 'border-red-500'
                                : emailSuccess
                                ? 'border-green-500'
                                : 'border-white/40'
                        }
                        focusBorderColor={
                            emailError
                                ? 'focus:border-red-500'
                                : emailSuccess
                                ? 'focus:border-green-500'
                                : 'focus:border-[#c3923c]'
                        }
                        labelColor={
                            emailError
                                ? 'text-red-500'
                                : emailSuccess
                                ? 'text-green-500'
                                : 'text-white/80'
                        }
                        focusLabelColor={
                            emailError
                                ? 'text-red-500'
                                : emailSuccess
                                ? 'text-green-500'
                                : 'text-[#c3923c]'
                        }
                        className="bg-transparent text-white"
                    />
                    {emailError && (
                        <p className="text-red-500 text-xs mt-1">
                            {emailError}
                        </p>
                    )}
                    {emailSuccess && !emailError && (
                        <p className="text-green-500 text-xs mt-1">
                            ✓ Email hợp lệ
                        </p>
                    )}
                </div>

                {/* Phone */}
                <div
                    key={`phone-${shakeKey}`}
                    className={`min-h-[70px] ${
                        phoneError ? 'animate-[shake_400ms_ease-in-out]' : ''
                    }`}
                >
                    <FloatingInput
                        label="Số điện thoại"
                        type="text"
                        value={phone}
                        onChange={handlePhoneChange}
                        iconLeft={faEnvelope}
                        size="md"
                        borderColor={
                            phoneError
                                ? 'border-red-500'
                                : phoneSuccess
                                ? 'border-green-500'
                                : 'border-white/40'
                        }
                        focusBorderColor={
                            phoneError
                                ? 'focus:border-red-500'
                                : phoneSuccess
                                ? 'focus:border-green-500'
                                : 'focus:border-[#c3923c]'
                        }
                        labelColor={
                            phoneError
                                ? 'text-red-500'
                                : phoneSuccess
                                ? 'text-green-500'
                                : 'text-white/80'
                        }
                        focusLabelColor={
                            phoneError
                                ? 'text-red-500'
                                : phoneSuccess
                                ? 'text-green-500'
                                : 'text-[#c3923c]'
                        }
                        className="bg-transparent text-white"
                    />
                    {phoneError && (
                        <p className="text-red-500 text-xs mt-1">
                            {phoneError}
                        </p>
                    )}
                    {phoneSuccess && !phoneError && (
                        <p className="text-green-500 text-xs mt-1">
                            ✓ Số điện thoại hợp lệ
                        </p>
                    )}
                </div>

                {/* Password */}
                <div
                    key={`password-${shakeKey}`}
                    className={`min-h-[70px] ${
                        passwordError ? 'animate-[shake_400ms_ease-in-out]' : ''
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
                                ? 'border-red-500'
                                : passwordSuccess
                                ? 'border-green-500'
                                : 'border-white/40'
                        }
                        focusBorderColor={
                            passwordError
                                ? 'focus:border-red-500'
                                : passwordSuccess
                                ? 'focus:border-green-500'
                                : 'focus:border-[#c3923c]'
                        }
                        labelColor={
                            passwordError
                                ? 'text-red-500'
                                : passwordSuccess
                                ? 'text-green-500'
                                : 'text-white/80'
                        }
                        focusLabelColor={
                            passwordError
                                ? 'text-red-500'
                                : passwordSuccess
                                ? 'text-green-500'
                                : 'text-[#c3923c]'
                        }
                        className="bg-transparent text-white"
                    />
                    {passwordError && (
                        <p className="text-red-500 text-xs mt-1">
                            {passwordError}
                        </p>
                    )}
                    {passwordSuccess && !passwordError && (
                        <p className="text-green-500 text-xs mt-1">
                            ✓ Mật khẩu hợp lệ
                        </p>
                    )}
                </div>

                {/* Confirm password */}
                <div
                    key={`confirmPassword-${shakeKey}`}
                    className={`min-h-[70px] ${
                        confirmPasswordError
                            ? 'animate-[shake_400ms_ease-in-out]'
                            : ''
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
                                ? 'border-red-500'
                                : confirmPasswordSuccess
                                ? 'border-green-500'
                                : 'border-white/40'
                        }
                        focusBorderColor={
                            confirmPasswordError
                                ? 'focus:border-red-500'
                                : confirmPasswordSuccess
                                ? 'focus:border-green-500'
                                : 'focus:border-[#c3923c]'
                        }
                        labelColor={
                            confirmPasswordError
                                ? 'text-red-500'
                                : confirmPasswordSuccess
                                ? 'text-green-500'
                                : 'text-white/80'
                        }
                        focusLabelColor={
                            confirmPasswordError
                                ? 'text-red-500'
                                : confirmPasswordSuccess
                                ? 'text-green-500'
                                : 'text-[#c3923c]'
                        }
                        className="bg-transparent text-white"
                    />
                    {confirmPasswordError && (
                        <p className="text-red-500 text-xs mt-1">
                            {confirmPasswordError}
                        </p>
                    )}
                    {confirmPasswordSuccess && !confirmPasswordError && (
                        <p className="text-green-500 text-xs mt-1">
                            ✓ Mật khẩu khớp
                        </p>
                    )}
                </div>

                {/* Submit */}
                <Button
                    text={isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
                    color="bg-[#c3923c]"
                    textColor="text-white"
                    size="lg"
                    rounded="md"
                    fullWidth
                    shadow
                    type="submit"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    className="font-semibold hover:bg-[#b4893e] transition-colors mt-2"
                />

                {/* Divider */}
                <div className="flex items-center gap-3 my-2">
                    <div className="flex-1 h-px bg-white/30"></div>
                    <span className="text-white/70 text-xs">
                        Hoặc tiếp tục với
                    </span>
                    <div className="flex-1 h-px bg-white/30"></div>
                </div>

                {/* Social buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-white/50 rounded-md text-white font-medium text-sm hover:border-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        <img
                            src={googleLogo}
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Google
                    </button>
                    <button
                        onClick={handleFacebookLogin}
                        type="button"
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-white/50 rounded-md text-white font-medium text-sm hover:border-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
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
                    Khi đăng ký, bạn đồng ý với{' '}
                    <a
                        href="#"
                        className="text-[#eab354] hover:text-[#c3923c] hover:underline font-medium"
                    >
                        Điều khoản
                    </a>{' '}
                    và{' '}
                    <a
                        href="#"
                        className="text-[#eab354] hover:text-[#c3923c] hover:underline font-medium"
                    >
                        Chính sách
                    </a>
                </p>

                {/* Login link*/}
                <p className="text-center text-sm text-white/80">
                    Đã có tài khoản?{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/auth/login')}
                        className="text-[#eab354] hover:text-[#c3923c] font-semibold transition-colors cursor-pointer"
                    >
                        Đăng nhập
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Register;
