import { AppFooter } from "@/components/AppFooter";
import { LandingHeader } from "@/components/LandingHeader";

export function PublicDocumentLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="container flex-1 py-10">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">{title}</h1>
        <div className="mt-8 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
