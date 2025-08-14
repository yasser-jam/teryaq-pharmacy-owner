interface PropsInterface {
  isLoading: boolean
}

export default function BaseScreenLoader({ isLoading }: PropsInterface) {
  return (
    <>
      <div
        // Todo: check if we really need to silence the hydration on loader
        suppressHydrationWarning
        className={`relative h-screen flex items-center justify-center ${
          isLoading ? 'opacity-100 visible' : 'opacity-0 invisible'
        } transition-opacity duration-500`}
      >
        <div className="w-40 h-40 border-primary border-8 border-t-primary-container rounded-full animate-spin" />
        <div className="absolute top-1/2 left-1/2 -translate-1/2 text-text-secondary text-xl font-semibold">
          Loading
        </div>
      </div>
    </>
  )
}
