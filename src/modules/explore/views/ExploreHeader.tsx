import { Input } from "@/components/ui/input";

type Props = {
  withoutSearch?: boolean;
};
export const ExploreHeader = ({ withoutSearch = false }: Props) => {
  return (
    <div className="w-full text-center">
      <div className="bg-gradient-to-br from-[rgba(244,184,255,0.2)] to-[rgba(46,157,254,0.2)] py-12 px-4">
        <p className="font-semibold text-2xl md:text-3xl">Explore</p>
        <p className="text-sm md:text-base mt-4">
          Elevate Your Brand Aesthetics with our AI-Powered Logo Creator
        </p>
      </div>
      {!withoutSearch ? (
        <div className="relative bottom-5 px-8 sm:px-18 md:px-24">
          <Input
            disabled
            placeholder="Search for logos (coming soon)"
            className="w-full md:w-[600px] mx-auto shadow-md !opacity-100"
          />
        </div>
      ) : null}
    </div>
  );
};
