"use client";
import { useGlobalStore } from "@/store/global";
import React from "react";
import UpgradePlan from "./UpgradePlanModalBody";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { modal_title } from "@/data/modal";
import SubscribeModalBody from "./SubscribeModalBody";
import BuyMoreCreditCheckout from "@/components/view/Payment/BuyMoreCreditCheckout";
import { useBuyMoreCreditIntent } from "@/services/credits.service";
import { BuyMoreCreditPaymentIntentResponse } from "@/types/payment.types";
import BuyMoreCredit from "@/components/payment/BuyMoreCredit";
import CreditsThankYou from "@/components/view/Payment/CreditThankYou";

const GlobalModal = () => {
  const {
    activeModal,
    setActiveModal,
    creditsToBuy,
    setCreditsToBuy,
    creditsThankYou,
    setCreditsThankYou,
  } = useGlobalStore();

  const isOpen = activeModal !== undefined;
  const title = activeModal ? modal_title[activeModal] : null;
  const upgradingSubscription = activeModal === "upgrade-subscription";
  const buyingCredits = typeof creditsToBuy === "number";
  const [data, setData] = React.useState<BuyMoreCreditPaymentIntentResponse>();
  const { mutateAsync, isPending } = useBuyMoreCreditIntent();

  const closeModal = () => {
    setActiveModal(undefined);
    setCreditsToBuy(undefined);
    setCreditsThankYou(false);
  };

  const content = React.useMemo(() => {
    if (data && buyingCredits && creditsThankYou) {
      return <CreditsThankYou data={data} closeModal={closeModal} />;
    }
    if (data && buyingCredits && !creditsThankYou) {
      return <BuyMoreCreditCheckout data={data} />;
    }
    if (activeModal === "buy-more-credit") {
      return <BuyMoreCredit loading={isPending} />;
    }
    if (upgradingSubscription) {
      return <UpgradePlan loading={isPending} />;
    }
    if (activeModal === "subscribe") {
      return <SubscribeModalBody />;
    }
  }, [activeModal, data, isPending, creditsThankYou]);

  React.useEffect(() => {
    if (buyingCredits) {
      mutateAsync(creditsToBuy).then((intentData) => {
        setData(intentData);
      });
    }
  }, [buyingCredits]);

  React.useEffect(() => {
    setCreditsToBuy(undefined);
    setCreditsThankYou(false);
  }, []);

  const largeDialog =
    upgradingSubscription || (data && buyingCredits && !creditsThankYou);
  return (
    <div>
      {content && isOpen ? (
        <Dialog open={isOpen} onOpenChange={closeModal}>
          <DialogContent
            className={largeDialog ? "max-w-4xl min-h-[300px]" : undefined}
          >
            <DialogHeader>
              {title && !upgradingSubscription && !creditsThankYou ? (
                <DialogTitle>{title}</DialogTitle>
              ) : null}
            </DialogHeader>
            {content}
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
};

export default GlobalModal;
