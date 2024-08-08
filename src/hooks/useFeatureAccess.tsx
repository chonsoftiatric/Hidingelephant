import { useFeatureAccessConfig } from "@/services/features.service";
import { usePlanDetails } from "@/services/stripe.service";
import { useUserDetails } from "@/services/user.service";
import { useGlobalStore } from "@/store/global";
import { IAccess } from "@/types/feature.types";

const useFeatureAccess = () => {
  const { data: user } = useUserDetails();
  const { setActiveModal } = useGlobalStore();
  const { data: features_config } = useFeatureAccessConfig();
  const { data: subscription } = usePlanDetails();

  const checkAccess = (feature_name: string) => {
    if (!features_config) return false;
    if (!subscription) return false;

    // @temp access for all users
    if (2 > 1) return true;

    if (subscription?.isSubscribed === false) {
      setActiveModal("subscribe");
      return false;
    }
    if (!subscription.name) return false;
    const feature_access = features_config.find(
      (feature) => (feature.name as string) === feature_name
    );

    if (!feature_access) {
      // @todo - what to do if feature does not exist?
      setActiveModal("upgrade-subscription");
      return false;
    }
    // check for beta tester
    if (
      user?.role === "BETA_TESTER" &&
      feature_access.access.includes("Beta Tester")
    ) {
      return true;
    }

    const has_access = feature_access.access.includes(
      subscription.name as IAccess
    );

    if (!has_access) {
      setActiveModal("upgrade-subscription");
    }
    return has_access;
  };

  const hasFeatureAccess = (feature_name: string) => {
    const access = checkAccess(feature_name);
    return access;
  };
  return {
    hasFeatureAccess,
  };
};

export default useFeatureAccess;
