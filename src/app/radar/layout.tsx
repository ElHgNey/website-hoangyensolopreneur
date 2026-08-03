import { AuthProvider } from "@/lib/AuthProvider";
import RadarHeader from "@/components/radar/RadarHeader";
import ThemeInit from "@/components/radar/ThemeInit";

export default function RadarLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div id="radar-root" className="font-grotesk min-h-screen">
        <ThemeInit />
        <RadarHeader />
        {children}
      </div>
    </AuthProvider>
  );
}
