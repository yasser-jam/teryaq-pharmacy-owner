import Image from 'next/image';
import LoginForm from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className='min-h-screen lg:grid lg:grid-cols-2'>
      {/* Left Section - Hero Image */}
      <div className='hidden lg:block relative'>
        <Image
          src='/images/auth/login.webp'
          alt='Login background'
          fill
          priority
        />
        <div className='absolute inset-0 bg-black/20' />
      </div>

      {/* Right Section - Login Form */}
      <div className='flex items-center justify-center p-8 lg:p-12'>
        <div className='w-full max-w-md space-y-8'>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
