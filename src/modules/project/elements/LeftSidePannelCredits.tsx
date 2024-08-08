import Button from "@/components/common/button/Button";
import { cn } from "@/lib/utils";
import { useCreditDetails } from "@/services/user.service";
import { useGlobalStore } from "@/store/global";
import { Coins, PlusCircleIcon } from "lucide-react";

type ILeftSidePannelCredits = {
  isClosed: boolean;
  className?: string;
};

const LeftSidePannelCredits = ({
  isClosed = true,
  className,
}: ILeftSidePannelCredits) => {
  const { setActiveModal } = useGlobalStore();
  const { data: credits } = useCreditDetails();

  return (
    <>
      {isClosed ? (
        // collapsed view
        <div
          className={cn(
            "flex items-center my-3 border-[1px] border-primary-default shadow-md p-1 rounded-xl gap-1 w-max flex-col",
            className
          )}
        >
          <p className="text-xm">
            {Math.round(credits?.remainingCredits || 0)}
          </p>
          <Coins color="#FFD700" />
        </div>
      ) : (
        // expanded view
        <div
          className={cn(
            "flex flex-col items-center my-3 border-2 border-primary-default shadow-md p-2 rounded-2xl gap-3",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <Coins color="#FFD700" />
            <p className="font-medium text-gray-500">
              {credits?.remainingCredits.toFixed(2)} credits
            </p>
          </div>
          <Button
            onClick={() => setActiveModal("buy-more-credit")}
            className="text-xs"
            leftIcon={<PlusCircleIcon size={18} />}
          >
            Buy More
          </Button>
        </div>
      )}
    </>
  );
};

export default LeftSidePannelCredits;
