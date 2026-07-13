"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  User,
  Building,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandingPanel } from "@/components/auth/branding-panel";

const roles = [
  "Ship Owner",
  "Ship Operator",
  "Ship Manager",
  "Port Authority",
  "Incentive Receiver",
  "Cargo Owner",
  "Other",
];

const countries = [
  "Belgium", "Brazil", "China", "Denmark", "Finland", "France", "Germany",
  "Greece", "India", "Italy", "Japan", "Netherlands", "Norway", "Poland",
  "Portugal", "South Korea", "Spain", "Sweden", "United Kingdom", "United States",
];

const steps = [
  { id: 1, label: "Account" },
  { id: 2, label: "Organization" },
  { id: 3, label: "Address" },
];

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — Account
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2 — Organization
  const [orgName, setOrgName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");

  // Step 3 — Address
  const [country, setCountry] = useState("");
  const [street, setStreet] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [postalSame, setPostalSame] = useState(true);
  const [postalCountry, setPostalCountry] = useState("");
  const [postalStreet, setPostalStreet] = useState("");
  const [postalZip, setPostalZip] = useState("");
  const [postalCity, setPostalCity] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [error, setError] = useState("");

  const validateStep1 = () => {
    if (!email || !fullName || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return false;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!orgName || !phoneNumber || !role) {
      setError("Please fill in all fields");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!country || !street || !zipCode || !city) {
      setError("Please fill in all required address fields");
      return false;
    }
    if (!postalSame && (!postalCountry || !postalStreet || !postalZip || !postalCity)) {
      setError("Please fill in all postal address fields");
      return false;
    }
    if (!termsAccepted) {
      setError("You must accept the Terms of Use & Privacy Policy");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError("");
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (validateStep3()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f3f4f6] p-4">
      <BrandingPanel />

      {/* Right — Sign-up form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center py-10">
        <div className="w-[480px]">
          <div className="lg:hidden flex justify-center mb-8">
            <Image src="/oceanscore-logo.svg" alt="OceanScore" width={160} height={24} />
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-[0_1px_1px_rgba(10,13,18,0.05)]">
            {submitted ? (
              /* Success state */
              <div className="flex flex-col items-center text-center gap-4 py-6">
                <div className="w-14 h-14 rounded-full bg-[#e3f0db] flex items-center justify-center">
                  <Check className="w-7 h-7 text-[#3d7c0f]" />
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-medium text-[#1e2938] tracking-[-0.6px]">
                    Registration submitted
                  </h1>
                  <p className="text-sm text-[#697282] leading-[1.6] mt-1">
                    Thank you for registering. We&apos;ve sent a verification email to{" "}
                    <span className="font-medium text-[#1e2938]">{email}</span>.
                    Please verify your email to activate your account.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="w-full h-11 rounded-lg bg-[#061e3a] text-white text-sm font-medium hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors flex items-center justify-center mt-4"
                >
                  Go to Sign In
                </Link>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex flex-col gap-2 mb-6">
                  <h1 className="text-2xl font-medium text-[#1e2938] leading-[1.2] tracking-[-0.72px]">
                    Create your account
                  </h1>
                  <p className="text-sm text-[#697282] leading-[1.4] tracking-[-0.42px]">
                    Set up your Data Hub account in a few steps
                  </p>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-8">
                  {steps.map((s, idx) => (
                    <div key={s.id} className="flex items-center gap-2 flex-1">
                      <div className="flex items-center gap-2 flex-1">
                        <div
                          className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 transition-colors",
                            step > s.id
                              ? "bg-[#3d7c0f] text-white"
                              : step === s.id
                              ? "bg-[#061e3a] text-white"
                              : "bg-[#f3f4f6] text-[#98a1ae]"
                          )}
                        >
                          {step > s.id ? <Check className="w-3.5 h-3.5" /> : s.id}
                        </div>
                        <span
                          className={cn(
                            "text-xs font-medium whitespace-nowrap",
                            step >= s.id ? "text-[#1e2938]" : "text-[#98a1ae]"
                          )}
                        >
                          {s.label}
                        </span>
                      </div>
                      {idx < steps.length - 1 && (
                        <div
                          className={cn(
                            "h-px flex-1 min-w-[20px]",
                            step > s.id ? "bg-[#3d7c0f]" : "bg-[#e5e7eb]"
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Step 1 — Account */}
                  {step === 1 && (
                    <>
                      <InputField
                        label="Full Name"
                        required
                        icon={<User className="w-5 h-5" />}
                        type="text"
                        value={fullName}
                        onChange={setFullName}
                        placeholder="John Doe"
                        onClearError={() => setError("")}
                      />
                      <InputField
                        label="Email"
                        required
                        icon={<Mail className="w-5 h-5" />}
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="you@company.com"
                        onClearError={() => setError("")}
                      />
                      <div className="flex flex-col gap-1">
                        <label className="text-sm text-[#4a5565] leading-[1.45]">
                          Password <span className="text-[#dc2626]">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#98a1ae]" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(""); }}
                            placeholder="Min. 8 characters"
                            className="w-full h-10 pl-11 pr-11 rounded-lg border border-[#d1d5dc] bg-white text-sm text-[#1e2938] placeholder:text-[#98a1ae] focus:outline-none focus:ring-2 focus:ring-[#5c96e5] focus:border-transparent transition-shadow"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#98a1ae] hover:text-[#697282] transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm text-[#4a5565] leading-[1.45]">
                          Confirm Password <span className="text-[#dc2626]">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#98a1ae]" />
                          <input
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                            placeholder="Re-enter your password"
                            className="w-full h-10 pl-11 pr-11 rounded-lg border border-[#d1d5dc] bg-white text-sm text-[#1e2938] placeholder:text-[#98a1ae] focus:outline-none focus:ring-2 focus:ring-[#5c96e5] focus:border-transparent transition-shadow"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#98a1ae] hover:text-[#697282] transition-colors"
                          >
                            {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 2 — Organization */}
                  {step === 2 && (
                    <>
                      <InputField
                        label="Organization Name"
                        required
                        icon={<Building className="w-5 h-5" />}
                        type="text"
                        value={orgName}
                        onChange={setOrgName}
                        placeholder="Your company name"
                        onClearError={() => setError("")}
                      />
                      <InputField
                        label="Phone Number"
                        required
                        icon={<Phone className="w-5 h-5" />}
                        type="tel"
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        placeholder="+49 123 456 789"
                        onClearError={() => setError("")}
                      />
                      <SelectField
                        label="Role"
                        required
                        value={role}
                        onChange={(v) => { setRole(v); setError(""); }}
                        options={roles}
                        placeholder="Select your role"
                      />
                    </>
                  )}

                  {/* Step 3 — Address */}
                  {step === 3 && (
                    <>
                      <p className="text-xs font-medium text-[#697282] uppercase tracking-wider">
                        Registered Address
                      </p>
                      <SelectField
                        label="Country"
                        required
                        value={country}
                        onChange={(v) => { setCountry(v); setError(""); }}
                        options={countries}
                        placeholder="Select country"
                      />
                      <InputField
                        label="Street Name"
                        required
                        type="text"
                        value={street}
                        onChange={setStreet}
                        placeholder="123 Main Street"
                        onClearError={() => setError("")}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <InputField
                          label="Zip Code"
                          required
                          type="text"
                          value={zipCode}
                          onChange={setZipCode}
                          placeholder="12345"
                          onClearError={() => setError("")}
                        />
                        <InputField
                          label="City"
                          required
                          type="text"
                          value={city}
                          onChange={setCity}
                          placeholder="Hamburg"
                          onClearError={() => setError("")}
                        />
                      </div>

                      {/* Postal address */}
                      <label className="flex items-center gap-2.5 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={postalSame}
                          onChange={(e) => setPostalSame(e.target.checked)}
                          className="w-4 h-4 rounded border-[#d1d5dc] text-[#061e3a] focus:ring-[#5c96e5] cursor-pointer"
                        />
                        <span className="text-sm text-[#4a5565]">
                          Postal address is the same as above
                        </span>
                      </label>

                      {!postalSame && (
                        <>
                          <p className="text-xs font-medium text-[#697282] uppercase tracking-wider mt-2">
                            Postal Address
                          </p>
                          <SelectField
                            label="Country"
                            required
                            value={postalCountry}
                            onChange={(v) => { setPostalCountry(v); setError(""); }}
                            options={countries}
                            placeholder="Select country"
                          />
                          <InputField
                            label="Street Name"
                            required
                            type="text"
                            value={postalStreet}
                            onChange={setPostalStreet}
                            placeholder="123 Main Street"
                            onClearError={() => setError("")}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <InputField
                              label="Zip Code"
                              required
                              type="text"
                              value={postalZip}
                              onChange={setPostalZip}
                              placeholder="12345"
                              onClearError={() => setError("")}
                            />
                            <InputField
                              label="City"
                              required
                              type="text"
                              value={postalCity}
                              onChange={setPostalCity}
                              placeholder="Hamburg"
                              onClearError={() => setError("")}
                            />
                          </div>
                        </>
                      )}

                      {/* Terms */}
                      <label className="flex items-start gap-2.5 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => { setTermsAccepted(e.target.checked); setError(""); }}
                          className="w-4 h-4 rounded border-[#d1d5dc] text-[#061e3a] focus:ring-[#5c96e5] cursor-pointer mt-0.5"
                        />
                        <span className="text-sm text-[#4a5565] leading-[1.5]">
                          I&apos;ve read and accepted the{" "}
                          <Link href="#" className="text-[#1157b2] hover:text-[#0a2e57] transition-colors">
                            Terms of Use
                          </Link>{" "}
                          &amp;{" "}
                          <Link href="#" className="text-[#1157b2] hover:text-[#0a2e57] transition-colors">
                            Privacy Policy
                          </Link>
                        </span>
                      </label>
                    </>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="bg-[#ffe2e1] border border-[#ffcaca] text-[#82181a] text-sm px-3 py-2 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Navigation buttons */}
                  <div className="flex items-center gap-3 mt-4">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={() => { setStep(step - 1); setError(""); }}
                        className="h-10 px-5 rounded-lg border border-[#d1d5dc] text-sm text-[#1e2938] hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                    )}
                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="flex-1 h-10 rounded-lg bg-[#061e3a] text-white text-sm hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors flex items-center justify-center gap-2"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="flex-1 h-10 rounded-lg bg-[#061e3a] text-white text-sm hover:bg-[#0c3c7a] active:bg-[#1157b2] transition-colors"
                      >
                        Create Account
                      </button>
                    )}
                  </div>
                </form>

                {/* Sign in link */}
                <p className="text-sm text-[#697282] text-center mt-8 leading-[1.2] tracking-[-0.42px]">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#0c3c7a] hover:text-[#061e3a] transition-colors">
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Reusable field components ── */

function InputField({
  label,
  required,
  icon,
  type,
  value,
  onChange,
  placeholder,
  onClearError,
}: {
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  onClearError: () => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-[#4a5565] leading-[1.45]">
        {label} {required && <span className="text-[#dc2626]">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98a1ae]">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => { onChange(e.target.value); onClearError(); }}
          placeholder={placeholder}
          className={cn(
            "w-full h-10 pr-4 rounded-lg border border-[#d1d5dc] bg-white text-sm text-[#1e2938] placeholder:text-[#98a1ae] focus:outline-none focus:ring-2 focus:ring-[#5c96e5] focus:border-transparent transition-shadow",
            icon ? "pl-11" : "pl-4"
          )}
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  required,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-[#4a5565] leading-[1.45]">
        {label} {required && <span className="text-[#dc2626]">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full h-10 pl-4 pr-10 rounded-lg border border-[#d1d5dc] bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#5c96e5] focus:border-transparent transition-shadow",
            value ? "text-[#1e2938]" : "text-[#98a1ae]"
          )}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98a1ae] pointer-events-none" />
      </div>
    </div>
  );
}
