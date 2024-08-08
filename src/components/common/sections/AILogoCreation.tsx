import Button from "@/components/common/button/Button";
import Image from "next/image";
import React from "react";

const AILogoCreation = () => {
  return (
    <section className="relative min-h-[600px] bg-black">
      <Image
        src="/images/star-sky.jpg"
        layout="fill"
        className="object-cover bg-blend-darken opacity-25"
        alt="night sky with stars"
      />
      <div className="z-10 flex flex-col justify-center items-center gap-10 relative h-full container section">
        <div className="flex justify-center items-center flex-col gap-2">
          <h3 className="title text-white text-center">
            AI Creation Example ✨{" "}
          </h3>
          <p className="text-white text-center max-w-[60ch]">
            Leverage multimodal prompts (text and images) to generate design
            assets from anywhere on the web
          </p>
          <Button className="mt-4">Access our AI logo studio</Button>
        </div>
        <Image
          src="/images/ai-creation-example.png"
          height={700}
          width={700}
          alt="hiding-elephant ai creation logo"
          className="mt-8"
        />
      </div>
    </section>
  );
};

export default AILogoCreation;
