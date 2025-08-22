export default function Home({ children }: { children: React.ReactElement }) {
  return <>
    <div className="bg-gray-100">
    {children}
    </div>
  </>;
}
