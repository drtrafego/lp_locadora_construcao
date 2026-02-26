"use client";

import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString, getExampleNumber } from "libphonenumber-js";

interface PhoneInputWithFlagProps {
    value: string;
    onChange: (value: string, isValid: boolean) => void;
    required?: boolean;
}

export default function PhoneInputWithFlag({ value, onChange, required }: PhoneInputWithFlagProps) {
    const [countryCode, setCountryCode] = useState<string>("br"); // Default to Brazil

    useEffect(() => {
        // Detect user country via IP
        fetch("https://ipapi.co/json/")
            .then((res) => res.json())
            .then((data) => {
                if (data && data.country_code) {
                    const code = data.country_code.toLowerCase();
                    setCountryCode(code);
                }
            })
            .catch((err) => console.error("Erro ao buscar país:", err));
    }, []);

    const handleChange = (val: string, countryData: any) => {
        // Use libphonenumber-js to validate
        const phoneNumber = parsePhoneNumberFromString("+" + val);
        const isValid = phoneNumber ? phoneNumber.isValid() : false;

        // Pass the full formatted number back to parent
        onChange(val ? "+" + val : "", isValid);
    };

    return (
        <div className="phone-input-container w-full">
            <PhoneInput
                country={countryCode}
                value={value}
                onChange={handleChange}
                inputProps={{
                    name: "phone",
                    required: required,
                    className: "form-input w-full bg-[#141414] border border-[#2a2a2a] text-[#f0ece4] text-[15px] p-[16px] pl-[48px] font-inherit outline-none transition-colors focus:border-[#d4a843]",
                }}
                buttonClass="!bg-transparent !border-0 hover:!bg-transparent focus:!bg-transparent"
                buttonStyle={{
                    paddingLeft: '10px'
                }}
                containerClass="w-full relative"
            />
            <style jsx global>{`
        .phone-input-container .react-tel-input .form-control {
          width: 100%;
          background: #141414;
          border: 1px solid #2a2a2a;
          color: #f0ece4;
          font-size: 15px;
          height: auto;
          line-height: inherit;
          padding: 16px 20px;
          padding-left: 48px;
          border-radius: 0;
        }
        .phone-input-container .react-tel-input .form-control:focus {
          border-color: #d4a843;
          box-shadow: none;
        }
        .phone-input-container .react-tel-input .flag-dropdown {
          background: transparent;
          border: none;
          border-radius: 0;
        }
        .phone-input-container .react-tel-input .flag-dropdown.open .selected-flag {
          background: transparent;
        }
        .phone-input-container .react-tel-input .selected-flag:hover, 
        .phone-input-container .react-tel-input .selected-flag:focus {
          background: transparent;
        }
        .phone-input-container .react-tel-input .country-list {
          background: #141414;
          border: 1px solid #2a2a2a;
          color: #f0ece4;
          border-radius: 0;
        }
        .phone-input-container .react-tel-input .country-list .country:hover, 
        .phone-input-container .react-tel-input .country-list .country.highlight {
          background: #2a2a2a;
        }
        .phone-input-container .react-tel-input .country-list .search {
          background: #141414;
        }
        .phone-input-container .react-tel-input .country-list .search-box {
          background: #0a0a0a;
          color: #f0ece4;
          border-color: #2a2a2a;
        }
      `}</style>
        </div>
    );
}
