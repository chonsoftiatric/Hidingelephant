import Button from "@/components/common/button/Button";
import CrownIcon from "@/components/icons/CrownIcon";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store/global";
import React from "react";

type IUpgradeCard = {
  className?: string;
  iconOnly?: boolean;
};
const UpgradeCard = ({ className, iconOnly }: IUpgradeCard) => {
  const { activeModal, setActiveModal } = useGlobalStore();

  const handleUpgrade = () => {
    setActiveModal("upgrade-subscription");
  };
  if (iconOnly) {
    return (
      <button onClick={handleUpgrade}>
        <CrownIcon className="stroke-primary-default stroke-2" />
      </button>
    );
  }
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center w-full rounded-lg p-4 gap-2 bg-primary-default text-white",
        className
      )}
    >
      <p className="text-lg font-bold">Upgrade To Pro</p>
      <p className="text-center">
        Unlock powerful features with our Pro upgrade today
      </p>
      <button onClick={handleUpgrade}>
        <Button className="bg-white text-black mx-auto rounded-lg mt-2 hover:bg-white">
          <div className="flex justify-between gap-2 items-center">
            <CrownIcon className="stroke-primary-default stroke-2" />
            <span className="font-semibold text-primary-default">Upgrade</span>
          </div>
        </Button>
      </button>
    </div>
  );
};

export default UpgradeCard;
