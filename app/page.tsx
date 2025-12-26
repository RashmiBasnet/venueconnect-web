import Link from "next/link";

export default function Home() {
  return (
    <div className="p-10 flex justify-between">
      <label>Home</label>
      <Link href={'/login'}>Login</Link>
    </div>
  );
}