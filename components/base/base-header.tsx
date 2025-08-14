interface BaseHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function BaseHeader({
  title,
  subtitle,
  children,
}: BaseHeaderProps) {
  return (
    <>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>{title}</h1>
          <p className='text-sm text-muted-foreground'>{subtitle}</p>
        </div>

        {children}
      </div>
    </>
  );
}
