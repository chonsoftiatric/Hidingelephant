import { models } from "@/data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type ISectionCard = {
  title: string;
  text: string;
  children: React.ReactNode;
  className?: string;
};
const SectionCard = ({ title, text, children, className }: ISectionCard) => {
  return (
    <div
      className={cn(
        "p-8 pb-14 card mt-10 w-full max-w-[1000px] mx-auto",
        className
      )}
    >
      <h4 className="font-medium text-xl">{title}</h4>
      <p className="text-gray-800 max-w-[45ch]">{text}</p>
      <div className="max-w-[500px] mx-auto h-full">{children}</div>
    </div>
  );
};

const SimpleAndIntuitive = () => {
  return (
    <section className="section flex flex-col justify-center items-center">
      <h3 className="title text-center">Simple and intuitive ✨</h3>
      <p className="text-center max-w-[60ch]">
        Leverage multimodal prompts (text and images) to generate design assets
        from anywhere on the web
      </p>
      <SectionCard
        title="Create and download multiple formats"
        text="Allows creators to upload their ideas in many different file formats
          (svg, png, jpg,...)"
      >
        <div className="flex mt-4 gap-5 flex-wrap">
          {models.map((model) => (
            <div key={model.icon} className="card p-4 rounded-lg">
              <Image
                className="h-10"
                src={model.icon}
                height={50}
                width={50}
                alt=""
              />
            </div>
          ))}
        </div>
      </SectionCard>
      <div className="flex gap-10 flex-wrap mt-10 max-w-[1000px] mx-auto">
        <SectionCard
          title="Design with AI magic"
          text="Unlock your creativity and bring ideas to life with AI-powered design utilities."
          className="w-full lg:max-w-[48%] lg:min-w-[400px] mt-0"
        >
          <div className="flex justify-center items-center h-full p-2">
            <Image
              src="/icons/ai-magic-stars.svg"
              height={160}
              width={160}
              alt="image placeholder icon"
            />
          </div>
        </SectionCard>
        <SectionCard
          title="Transforming Ideas into Striking Identities"
          text="Revolutionize your visual presence with intelligent logo creation and unmatched design precision"
          className="w-full lg:max-w-[48%] lg:min-w-[400px] mt-0"
        >
          <div className="flex justify-center items-center h-full p-2">
            <Image
              src="/icons/image-placeholder.svg"
              height={160}
              width={160}
              alt="image placeholder icon"
            />
          </div>
        </SectionCard>
      </div>
    </section>
  );
};

export default SimpleAndIntuitive;
