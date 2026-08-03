import Navbar from "@/components/Navbar";
import ThemeInit from "@/components/radar/ThemeInit";

export default function RadarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div id="blog-root" className="min-h-screen bg-radar-bg pt-[97px] dark:bg-black">
        <ThemeInit />
        {children}
      </div>
    </>
  );
}
