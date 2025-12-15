import { useState } from 'react';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';

interface ForgotPasswordScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

export function ForgotPasswordScreen({ onComplete, onBack }: ForgotPasswordScreenProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-12 px-6">
        <button onClick={onBack} className="mb-4 text-white/90 hover:text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-white text-2xl">Reset Password</h1>
        <p className="text-white/80 text-sm mt-1">Step {step} of 3</p>
      </div>

      <div className="flex-1 px-6 -mt-6">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6">
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-gray-900 text-xl">Enter Your Email</h2>
                <p className="text-gray-600 text-sm mt-2">We'll send you a verification code</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="h-14 rounded-2xl border-gray-200 bg-gray-50"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-2xl"
              >
                Send Code
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-gray-900 text-xl">Enter Verification Code</h2>
                <p className="text-gray-600 text-sm mt-2">Code sent to {email}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">5-Digit Code</Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={5} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="h-14 w-12 rounded-xl border-gray-300" />
                      <InputOTPSlot index={1} className="h-14 w-12 rounded-xl border-gray-300" />
                      <InputOTPSlot index={2} className="h-14 w-12 rounded-xl border-gray-300" />
                      <InputOTPSlot index={3} className="h-14 w-12 rounded-xl border-gray-300" />
                      <InputOTPSlot index={4} className="h-14 w-12 rounded-xl border-gray-300" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-2xl"
                disabled={otp.length !== 5}
              >
                Verify Code
              </Button>

              <button type="button" className="w-full text-blue-600 text-sm hover:underline">
                Resend Code
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-gray-900 text-xl">Create New Password</h2>
                <p className="text-gray-600 text-sm mt-2">Must be at least 8 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-700">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-14 rounded-2xl border-gray-200 bg-gray-50"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-2xl"
              >
                Reset Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
