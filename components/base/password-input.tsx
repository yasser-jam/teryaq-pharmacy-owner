'use client'
import { Eye, EyeClosed, Lock } from 'iconoir-react'
import { useState } from 'react'
import { Input } from '../ui/input'

type PropsInterface = React.ComponentProps<typeof Input>

export default function BasePasswordInput(props: PropsInterface) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <Input
        id="password"
        type={showPassword ? 'text' : 'password'}
        prefix={<Lock />}
        suffix={
          !showPassword ? (
            <Eye
              className="cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          ) : (
            <EyeClosed
              className="cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          )
        }
        {...props}
      />
    </>
  )
}
