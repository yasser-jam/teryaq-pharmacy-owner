interface ComingSoonProps {
  message?: string
}

export default function ComingSoon({
  message = 'Coming Soon!'
}: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground text-center">
      <svg
        width="64"
        height="64"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="mb-4 text-gray-400 dark:text-gray-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h2 className="text-2xl font-semibold">{message}</h2>
      <p className="mt-2 text-gray-400 dark:text-gray-500">
        This feature is under development.
      </p>
    </div>
  )
}
