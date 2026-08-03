import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/AuthProvider";
import RadarHeader from "@/components/radar/RadarHeader";
import ThemeInit from "@/components/radar/ThemeInit";

export default function RadarLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <div id="radar-root" className="font-grotesk min-h-screen pt-[97px]">
        <ThemeInit />
        <RadarHeader />
        {children}
      </div>
    </AuthProvider>
  );
}
