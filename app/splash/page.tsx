import type { Metadata } from "next";
import { SplashScreen } from "@/components/splash/SplashScreen";

export const metadata: Metadata = {
  title: "NexWork",
  description:
    "Conectando talentos a oportunidades — Organize seu trabalho. Evolua seu negócio.",
};

export default function SplashPage() {
  return <SplashScreen />;
}
