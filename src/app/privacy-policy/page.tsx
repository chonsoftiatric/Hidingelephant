import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import Script from "next/script";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <PublicLayout>
      <section className="section">
        <div className="container">
          <div className="section-titlewrap mx-auto max-w-[600px]">
            <h3 className="section-title mb-6 mt-10 text-center text-[38px] font-semibold leading-[48px]">
              Privacy Policy
            </h3>
            <div title="Privacy Policy">
              <iframe
                className="h-[3200px] max-h-[3500px] w-full sm:h-96 md:h-[2300px]"
                width="100%"
                frameBorder="0"
                allowFullScreen
                scrolling="no"
                src="https://www.iubenda.com/privacy-policy/22004092"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default PrivacyPolicy;
