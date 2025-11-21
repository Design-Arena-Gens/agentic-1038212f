import Image from "next/image";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
        <div className="absolute left-1/2 top-16 h-72 w-[38rem] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute bottom-8 left-16 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
      </div>
      <div className="w-full max-w-md px-6 py-12">
        <div className="glass-card px-8 py-10">
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <Image
              src="/logo.svg"
              alt="حلو ومالح"
              width={128}
              height={128}
              className="h-16 w-auto"
              priority
            />
            <p className="text-sm text-slate-300">
              استمتع بأشهى الأطباق والحلويات من مطعم حلو ومالح
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
