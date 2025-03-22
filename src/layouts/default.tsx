import { Link } from "@heroui/link";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://www.facebook.com/SENAHuila/videos/territoriosena-en-el-sena-pitalito-sede-yamboró-pusimos-en-funcionamiento-la-est/297924495592704/"
          title="superetehomepage"
        >
          <span className="text-default-600">Creado para: </span>
          <p className="text-primary">Superete</p>
        </Link>
      </footer>
    </div>
  );
}
