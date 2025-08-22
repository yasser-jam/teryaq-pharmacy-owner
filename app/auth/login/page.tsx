'use client'
import Image from 'next/image';
import LoginForm from '@/components/auth/login-form';
import { setCookie } from '@/lib/utils';

import Cookies from 'js-cookie';

export default function LoginPage() {

  // delete the cookie in that page
  Cookies.remove('tp.access-token');

  return (
    <div className='min-h-screen lg:grid lg:grid-cols-2'>
      {/* Left Section - Hero Image */}
      <div className='hidden lg:block ms-auto relative w-[500px]'>
        <Image
          src='/images/auth/login.svg'
          alt='Login background'
          fill
          priority
        />
        <div className='absolute inset-0' />
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
