import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Script from "next/script";
import GlobalModal from "@/components/common/modals/GlobalModal";
import Providers from "@/providers/Providers";
import VectorizeDialog from "@/modules/project/elements/VectorizeDialog";
import EditImageModal from "@/modules/project/elements/EditImageDialog";
import GenerateSimilarDialog from "@/modules/project/components/Dialogs/GenerateSimilarDialog";
import SketchImageDialog from "@/modules/project/components/Dialogs/SketchImageDialog";
import { GoogleTagManager } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://hidingelephant.com"),
  title: "HidingElephant - AI Logo Design for Professionals",
  description:
    "The best collaborative AI logo design tool for professional designers. Custom, unique logos from simple prompts. The future of logo design is here.",
  twitter: {
    description:
      "We're building the best AI Logo Design tool for professional designers. Get custom, unique logos, every single time hidingelephant.com #ai #logo",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script src="https://getlaunchlist.com/js/widget-diy.js" defer />
      <html lang="en">
        <body className={cn(inter.className, "overflow-x-hidden")}>
          <Providers>
            <div>
              <GlobalModal />
              <VectorizeDialog />
              <EditImageModal />
              <GenerateSimilarDialog />
              <SketchImageDialog />
              {children}
            </div>
          </Providers>
        </body>
        <GoogleTagManager gtmId="GTM-TW8LNVJ7" />
      </html>
    </>
  );
}
