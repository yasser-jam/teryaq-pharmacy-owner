'use client';

import type React from 'react';

import { useState } from 'react';
import { AtSign, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { successToast } from '@/lib/toast';
import { setCookie, debugCookies } from '@/lib/utils';

import BasePasswordInput from '@/components/base/base-password-input';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const t = useTranslations('Auth');
  const router = useRouter();

  const submitMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: () =>
      api('/pharmacy/login', {
        method: 'POST',
        body: {
          email,
          password,
        },
      }),
    onSuccess(response) {
      successToast(t('loginSuccess'));
      
      // Debug cookie setting
      // debugCookies();
      
      setCookie('tp.access-token', response.token);
      
      // Verify cookie was set
      // setTimeout(() => {
      //   console.log('Cookie after setting:', document.cookie);
      //   debugCookies();
      // }, 100);

      // complete register (if not) or redirect to home page
      if (response?.isActive) router.push('/');
      else router.push('/auth/complete-registration')
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate();
  };

  return (
    <div className='space-y-8 bg-white p-8 rounded-sm'>
      {/* Logo and Title Section */}
      <div className='text-center space-y-4'>
        <div className='flex items-center justify-center'>
          <div className='w-16 h-16 bg-primary rounded-xl flex items-center justify-center'>
            <span className='text-2xl font-bold text-primary-foreground'>
              TQ
            </span>
          </div>
        </div>

        <div className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>{t('welcomeBack')}</h1>
          <p className='text-muted-foreground'>
            {t('signInToContinue')}
          </p>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Email Field */}
        <div className='space-y-2'>
          <Label htmlFor='email' className='text-sm font-medium'>
            {t('emailLabel')}
          </Label>

          <Input
            id='email'
            prefix={<AtSign />}
            placeholder={t('emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(String(e))}
            required
          />
        </div>

        {/* Password Field */}
        <div className='space-y-2'>
          <Label htmlFor='password' className='text-sm font-medium'>
            {t('passwordLabel')}
          </Label>

          <BasePasswordInput
            id='password'
            value={password}
            onChange={(e) => setPassword(String(e))}
            placeholder={t('passwordPlaceholder')}
          />
        </div>

        {/* Forgot Password */}
        {/* <div className='flex justify-end'>
          <Button
            type='button'
            variant='link'
            className='px-0 text-sm text-primary hover:underline'
          >
            {t('forgotPassword')}
          </Button>
        </div> */}

        {/* Login Button */}
        <Button
          type='submit'
          loading={submitMutation.isPending}
          className='w-full'
          size='lg'
        >
          {t('loginButton')}
        </Button>
      </form>

      {/* Additional Options */}
      <div className='text-center text-sm text-muted-foreground'>
        {t('noAccount') + ' '}
        <Link href={'mailto:yasserjamalaldeen@gmail.com'}>
          <Button variant='link' className='px-0 text-primary hover:underline'>
            {t('contactUs')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
