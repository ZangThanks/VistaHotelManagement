import React, { useState, useRef, useEffect } from 'react';

interface DropdownOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface DropdownProps {
    options: DropdownOption[];
    value?: string | null;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select option',
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Tìm label của option được chọn
    const selectedOption = options.find((opt) => opt.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node | null;
            if (
                dropdownRef.current &&
                target &&
                !dropdownRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: DropdownOption) => {
        if (option?.value != null) {
            onChange(option.value);
        }
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <div
            className={`relative ${className}`}
            ref={dropdownRef}
            onKeyDown={handleKeyDown}
        >
            {/* Dropdown Button */}
            <button
                type="button"
                onClick={() => setIsOpen((s) => !s)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                className="w-full bg-white rounded-2xl px-5 py-2 flex items-center justify-between shadow-sm transition-all duration-200 border border-gray-100 hover:border-blue-200 group"
            >
                <span className="text-gray-700 font-medium group-hover:text-[#b48a41] transition-colors">
                    {displayText}
                </span>
                <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#b48a41]' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    role="listbox"
                    tabIndex={-1}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                >
                    {options.map((option, index) => (
                        <button
                            key={option.value ?? index}
                            type="button"
                            onClick={() => handleSelect(option)}
                            className={`w-full px-5 py-2 flex items-center gap-3 transition-all duration-150 ${
                                value === option.value
                                    ? 'bg-blue-50 text-[#b48a41] font-semibold'
                                    : 'text-gray-700 hover:bg-gray-50'
                            } ${
                                index !== options.length - 1
                                    ? 'border-b border-gray-100'
                                    : ''
                            }`}
                        >
                            {option.icon && (
                                <span className="text-xl">{option.icon}</span>
                            )}
                            <span className="flex-1 text-left">
                                {option.label}
                            </span>
                            {value === option.value && (
                                <svg
                                    className="w-5 h-5 text-[#b48a41]"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    aria-hidden
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
