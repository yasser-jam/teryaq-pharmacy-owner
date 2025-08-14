
import { CheckSquare, X } from 'lucide-react'
import { toast } from 'sonner'
import { createElement } from 'react'

export function successToast(message: string) {
    toast(message, {
      icon: createElement(CheckSquare),
      cancel: true,
      closeButton: true
    })
  }
  
  export function errorToast(message: string) {
    toast(message, {
      icon: createElement(X),
      cancel: true,
      closeButton: true
    })
  }