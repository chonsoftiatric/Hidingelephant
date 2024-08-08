import Button from "@/components/common/button/Button";
import { cn } from "@/lib/utils";
import { useCreditDetails } from "@/services/user.service";
import { useGlobalStore } from "@/store/global";
import { Coins, PlusCircleIcon, PlusIcon } from "lucide-react";

type CreditBoxProps = {
  isClosed: boolean;
  className?: string;
};

const CreditBox = ({ isClosed = true, className }: CreditBoxProps) => {
  const { data: credits } = useCreditDetails();
  const { setActiveModal } = useGlobalStore();
  return (
    <>
      {isClosed ? (
        // collapsed view
        <div
          className={cn(
            "flex items-center my-3 border-[1px] border-primary-default bg-white shadow-md p-1 rounded-xl gap-1 w-max flex-col",
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
            "flex items-center my-3 border-2 border-primary-default bg-white shadow-md p-2 rounded-full gap-2",
            className
          )}
        >
          <Coins color="#FFD700" />
          <p className="font-medium">
            {credits?.remainingCredits.toFixed(2)} credits
          </p>
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

export default CreditBox;
