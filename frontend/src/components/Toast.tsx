import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
  faTimesCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export type ToastType = "success" | "error" | "warning" | "info";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number; // milliseconds
  position?: ToastPosition;
  onClose?: (id: string) => void;
  showCloseButton?: boolean;
  pauseOnHover?: boolean;
}

const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = "info",
  duration = 3000,
  onClose,
  showCloseButton = true,
  pauseOnHover = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(duration);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    // Trigger slide-in animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleClose = React.useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.(id);
    }, 400); // Match animation duration
  }, [id, onClose]);

  useEffect(() => {
    if (duration <= 0) return;

    const scheduleClose = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        handleClose();
      }, remainingTimeRef.current);
    };

    if (!isPaused) {
      startTimeRef.current = Date.now();
      scheduleClose();

      // Animate progress bar with CSS
      if (progressRef.current) {
        progressRef.current.style.transition = `width ${remainingTimeRef.current}ms linear`;
        progressRef.current.style.width = "0%";
      }
    } else {
      // Pause
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Calculate remaining time
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(
        0,
        remainingTimeRef.current - elapsed
      );

      // Pause progress bar
      if (progressRef.current) {
        const computedStyle = window.getComputedStyle(progressRef.current);
        const currentWidth = computedStyle.width;
        progressRef.current.style.transition = "none";
        progressRef.current.style.width = currentWidth;
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPaused, duration, handleClose]);

  const getTypeConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: faCheckCircle,
          bgColor: "from-green-500 to-green-600",
          shadowColor: "shadow-green-500/50",
          iconBg: "bg-green-600/30",
          borderColor: "border-green-400",
          textColor: "text-white",
          progressColor: "bg-gradient-to-r from-green-300 to-green-200",
        };
      case "error":
        return {
          icon: faTimesCircle,
          bgColor: "from-red-500 to-red-600",
          shadowColor: "shadow-red-500/50",
          iconBg: "bg-red-600/30",
          borderColor: "border-red-400",
          textColor: "text-white",
          progressColor: "bg-gradient-to-r from-red-300 to-red-200",
        };
      case "warning":
        return {
          icon: faExclamationCircle,
          bgColor: "from-yellow-400 to-yellow-500",
          shadowColor: "shadow-yellow-500/50",
          iconBg: "bg-yellow-600/30",
          borderColor: "border-yellow-300",
          textColor: "text-gray-900",
          progressColor: "bg-gradient-to-r from-yellow-200 to-yellow-100",
        };
      case "info":
      default:
        return {
          icon: faInfoCircle,
          bgColor: "from-blue-500 to-blue-600",
          shadowColor: "shadow-blue-500/50",
          iconBg: "bg-blue-600/30",
          borderColor: "border-blue-400",
          textColor: "text-white",
          progressColor: "bg-gradient-to-r from-blue-300 to-blue-200",
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div
      className={`
        relative flex items-center gap-3 min-w-[320px] max-w-[450px] p-4 pr-3
        rounded-xl shadow-2xl ${config.shadowColor}
        bg-gradient-to-br ${config.bgColor}
        border ${config.borderColor}
        backdrop-blur-sm
        ${isExiting ? "toast-exit" : isVisible ? "toast-enter" : "opacity-0"}
        hover:scale-105 hover:shadow-3xl
        transition-transform duration-200
      `}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      role="alert"
    >
      {/* Icon with background */}
      <div
        className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${config.iconBg}`}
      >
        <FontAwesomeIcon
          icon={config.icon}
          className={`text-xl ${config.textColor}`}
        />
      </div>

      {/* Message */}
      <div
        className={`flex-1 ${config.textColor} text-sm font-medium leading-relaxed pr-2`}
      >
        {message}
      </div>

      {/* Close Button */}
      {showCloseButton && (
        <button
          onClick={handleClose}
          className={`
            flex-shrink-0 w-6 h-6 flex items-center justify-center
            rounded-full ${config.textColor} 
            hover:bg-white/20 active:bg-white/30
            transition-all duration-200
          `}
          aria-label="Close notification"
        >
          <FontAwesomeIcon icon={faTimes} className="text-sm" />
        </button>
      )}

      {/* Progress Bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-xl overflow-hidden">
          <div
            ref={progressRef}
            className={`h-full ${config.progressColor} rounded-b-xl`}
            style={{ width: "100%" }}
          />
        </div>
      )}
    </div>
  );
};

export default Toast;
