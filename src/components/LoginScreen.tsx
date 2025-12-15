import { useState } from 'react';
import { Mail, Lock, Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LoginScreenProps {
  onLogin: () => void;
  onSignUp: () => void;
  onForgotPassword: () => void;
}

export function LoginScreen({ onLogin, onSignUp, onForgotPassword }: LoginScreenProps) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-12 pb-16 px-8 rounded-b-[3rem]">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white rounded-2xl p-3">
            <Trophy className="w-8 h-8 text-blue-600" strokeWidth={2.5} />
          </div>
          <h1 className="text-white text-3xl">SportsPlus</h1>
        </div>
        <p className="text-white/90 mt-2">Welcome back! Sign in to continue</p>
      </div>

      <div className="flex-1 px-6 -mt-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="emailOrUsername" className="text-gray-700">Email or Username</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="emailOrUsername"
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="email@example.com or username"
                  className="pl-12 h-14 rounded-2xl border-gray-200 bg-gray-50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-12 h-14 rounded-2xl border-gray-200 bg-gray-50"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              onClick={onForgotPassword}
              className="text-blue-600 text-sm hover:underline"
            >
              Forgot Password?
            </button>

            <Button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-2xl shadow-lg shadow-blue-500/30"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onSignUp}
                className="text-blue-600 hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
