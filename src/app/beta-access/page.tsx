import PublicLayout from "@/components/layout/PublicLayout";
import Script from "next/script";
import React from "react";

const BetaAccessPage = () => {
  return (
    <PublicLayout>
      <div className="container">
        <Script src="https://tally.so/widgets/embed.js" async />
        <iframe
          data-tally-src="https://tally.so/embed/mR4AvQ?alignLeft=1&transparentBackground=1&dynamicHeight=1"
          loading="lazy"
          width="100%"
          height="2887"
          title="Hiding Elephant Beta Access"
        ></iframe>
      </div>
    </PublicLayout>
  );
};

export default BetaAccessPage;
