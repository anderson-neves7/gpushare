import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "GPUShare",
  description: "GPU scheduling dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <div className="flex min-h-screen">

          {/* Sidebar */}
          <aside className="w-64 bg-white shadow-md p-6 space-y-6">
            <h1 className="text-2xl font-bold">GPUShare</h1>

            <nav className="flex flex-col space-y-3">
              <Link href="/" className="hover:underline">Dashboard</Link>
              <Link href="/gpus" className="hover:underline">GPUs</Link>
              <Link href="/jobs" className="hover:underline">Jobs</Link>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-10">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}
