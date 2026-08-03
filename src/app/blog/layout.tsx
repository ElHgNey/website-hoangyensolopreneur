import Navbar from "@/components/Navbar";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div id="blog-root" className="min-h-screen bg-radar-bg pt-[97px]">
        {children}
      </div>
    </>
  );
}
