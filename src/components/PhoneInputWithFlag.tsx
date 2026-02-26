"use client";

import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";

interface PhoneInputWithFlagProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  required?: boolean;
}

export default function PhoneInputWithFlag({ value, onChange, required }: PhoneInputWithFlagProps) {
  const [countryCode, setCountryCode] = useState<string>("br");

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.country_code) {
          setCountryCode(data.country_code.toLowerCase());
        }
      })
      .catch(() => { }); // silently fail, default stays BR
  }, []);

  const handleChange = (val: string) => {
    const phoneNumber = parsePhoneNumberFromString("+" + val);
    const isValid = phoneNumber ? phoneNumber.isValid() : false;
    onChange(val ? "+" + val : "", isValid);
  };

  return (
    <>
      <style>{`
        .ldc-phone .react-tel-input .form-control {
          width: 100%;
          background: #141414;
          border: 1px solid #2a2a2a;
          color: #f0ece4;
          font-size: 15px;
          height: auto;
          padding: 16px 20px 16px 52px;
          border-radius: 0;
          box-shadow: none;
          font-family: inherit;
        }
        .ldc-phone .react-tel-input .form-control:focus {
          border-color: #d4a843;
          box-shadow: none;
        }
        .ldc-phone .react-tel-input .flag-dropdown {
          background: #141414;
          border: 1px solid #2a2a2a;
          border-right: none;
          border-radius: 0;
        }
        .ldc-phone .react-tel-input .flag-dropdown.open,
        .ldc-phone .react-tel-input .flag-dropdown.open .selected-flag,
        .ldc-phone .react-tel-input .selected-flag:hover,
        .ldc-phone .react-tel-input .selected-flag:focus {
          background: #1e1e1e;
        }
        .ldc-phone .react-tel-input .country-list {
          background: #141414;
          border: 1px solid #2a2a2a;
          color: #f0ece4;
          border-radius: 0;
          margin-top: 0;
        }
        .ldc-phone .react-tel-input .country-list .country:hover,
        .ldc-phone .react-tel-input .country-list .country.highlight {
          background: #2a2a2a;
        }
        .ldc-phone .react-tel-input .country-list .country-name,
        .ldc-phone .react-tel-input .country-list .dial-code {
          color: #f0ece4;
        }
        .ldc-phone .react-tel-input .search {
          background: #141414;
          padding: 8px;
        }
        .ldc-phone .react-tel-input .search-box {
          background: #0a0a0a;
          color: #f0ece4;
          border-color: #2a2a2a;
          border-radius: 0;
          width: 100%;
          margin: 0;
          padding: 8px;
        }
      `}</style>
      <div className="ldc-phone" style={{ width: "100%" }}>
        <PhoneInput
          country={countryCode}
          value={value}
          onChange={handleChange}
          inputProps={{ name: "phone", required }}
          enableSearch
          searchPlaceholder="Buscar país..."
        />
      </div>
    </>
  );
}
