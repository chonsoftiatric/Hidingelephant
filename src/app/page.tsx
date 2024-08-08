import Hero from "@/components/common/sections/Hero";
import LogoMakerDemoVideo from "@/components/common/sections/LogoMakerDemoVideo";
import ContentSection from "@/components/common/elements/ContentSection";
import React from "react";
import ImageSection from "@/components/common/sections/ImageSection";
import WaitingList from "@/components/common/sections/WaitingList";
import JoinWaitingListButton from "@/components/common/elements/JoinWaitingListButton";
import Button from "@/components/common/button/Button";
import PublicLayout from "@/components/layout/PublicLayout";
import ReferralCookie from "@/components/view/Pages/Landing/ReferralCookie";
// import { fetchLatestGeneratedImages } from "@/actions/global";
// import LiveFeed from "@/components/view/home/LiveFeed";

type ILogoMaker = {
  searchParams: {
    referral_code?: string | undefined;
  };
};

const LogoMaker = async (params: ILogoMaker) => {
  const referralCode = params.searchParams.referral_code;
  // const liveFeed = await fetchLatestGeneratedImages({
  //   limit: 3,
  //   offset: 0,
  // });

  return (
    <PublicLayout>
      <div className="container">
        <Hero
          title="Design AI Logos in Seconds"
          subTitle="The first Ai design tool by professional designers, for professionals designers."
        >
          <div className="flex mt-3 gap-y-2 sm:gap-4 flex-wrap">
            <JoinWaitingListButton />
            <Button variant="outline">
              <a href="#watch-demo">Watch Demo</a>
            </Button>
          </div>
        </Hero>
        <ImageSection
          image="/images/logo-maker-prompt-preview.png"
          alt="hiding elephant ai logo maker preview"
        />
        <LogoMakerDemoVideo />

        {/* Live Feed */}
        {/* <LiveFeed data={liveFeed} /> */}

        <ContentSection
          title="For Professionals ✨"
          subTitle={
            <>
              <p className="max-sm:text-center">
                Not just another design tool. We’re building the best
                coolabrative AI design tool for profesional designers. Type a
                prompt, generate multiple ideas, iterate and fine-tune to
                perfection.
              </p>
              <p className="mt-3 max-sm:text-center">
                We don’t mix and match icons with text. Our advanced AI models
                generate custom designs, every single time.
              </p>
            </>
          }
          imageSrc="/images/craft-ai-logos.jpg"
          imageAlt="hiding elephant ai logo maker"
        >
          <div className="mt-8 flex gap-4 justify-center sm:justify-start">
            <JoinWaitingListButton />
          </div>
        </ContentSection>
        <Hero
          title="Pixel to Vector ✨"
          subTitle="Transform your AI generations into vector format with a single click. "
        >
          <div className="mt-6 flex gap-4 flex-wrap">
            <JoinWaitingListButton />
          </div>
        </Hero>
        <ImageSection
          image="/images/ai-pixel-to-vector-converter.png"
          alt="ai pixel to vector convertor"
        />
        <Hero
          title={
            <span>
              Single Generation, <br /> Multiple Variations
            </span>
          }
          subTitle="Explore the creativity with our unique technology to create multiple variations with a single generation"
        >
          <JoinWaitingListButton className="mt-3" />
        </Hero>
        <ImageSection
          image="/images/logo-maker-preview.png"
          alt="hiding elephant logo maker preview"
        />

        <Hero
          className="mb-32"
          title={"Experience the magic"}
          subTitle="Our waiting list is buzzing with excitment.
          Singup to be among the first to experience the magic."
        >
          <WaitingList />
        </Hero>
      </div>
      <ReferralCookie referralCode={referralCode} />
    </PublicLayout>
  );
};

export default LogoMaker;
