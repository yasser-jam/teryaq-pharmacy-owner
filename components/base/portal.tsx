'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type PortalProps = {
  children: React.ReactNode
  selector: string
}

export default function Portal({ children, selector }: PortalProps) {
  const [mounted, setMounted] = useState(false)
  const [portalElement, setPortalElement] = useState<Element | null>(null)

  useEffect(() => {
    // Find the portal root element
    const element = document.querySelector(selector)
    setPortalElement(element)
    setMounted(true)

    // No cleanup needed for the element reference
  }, [selector])

  // Only render the portal if we're mounted and have a valid DOM element
  if (mounted && portalElement) {
    return createPortal(children, portalElement)
  }

  return null
}
