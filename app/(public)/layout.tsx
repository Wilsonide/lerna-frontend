import Container from "@/components/shared/container";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <Container>{children}</Container>
      </main>

      <Footer />
    </div>
  );
}
