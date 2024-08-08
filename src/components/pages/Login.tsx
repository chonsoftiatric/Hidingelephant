"use client";

import React from "react";
import {
  ClientSafeProvider,
  LiteralUnion,
  getProviders,
  signIn,
  useSession,
} from "next-auth/react";
import { ArrowLeft } from "lucide-react";
import { BuiltInProviderType } from "next-auth/providers/index";
import TextLogo from "@/components/common/elements/TextLogo";
import GoogleIcon from "@/components/icons/GoogleIcon";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createStripeSession } from "@/services/stripe.service";
import { PLANS } from "@/data/plans";
import { deleteCookie, getCookie } from "cookies-next";
import {
  DEFAULT_SUB_PROJECT_ID_COOKIE,
  IS_NEW_USER_COOKIE,
} from "@/utils/CONSTANTS";
import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "@/components/layout/PublicLayout";

const Login = () => {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl");
  const plan = params.get("plan");
  const plan_duration = params.get("plan_duration");
  const isNewUser = getCookie(IS_NEW_USER_COOKIE);
  const defaultSubProjectId = getCookie(DEFAULT_SUB_PROJECT_ID_COOKIE);
  const { mutate } = useMutation({
    mutationFn: createStripeSession,
    onSuccess: (data) => {
      window.location.href = data.url ?? "/dashboard/billing";
    },
  });
  const session = useSession();
  const user = session.data?.user;
  const { replace } = useRouter();

  const [providers, setProviders] = React.useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);
  const handleProviders = async () => {
    const auth_providers = await getProviders();
    setProviders(auth_providers);
  };
  React.useEffect(() => {
    handleProviders();
  }, []);
  const removeNewUserCookie = () => {
    setTimeout(() => {
      deleteCookie(IS_NEW_USER_COOKIE);
      window.location.href = "/onBoarding/page1";
    }, 3000);
  };

  const removeDefaultSubProjectCookie = () => {
    setTimeout(() => {
      deleteCookie(DEFAULT_SUB_PROJECT_ID_COOKIE);
    }, 3000);
  };
  // handle redirection after login
  React.useEffect(() => {
    if (session.status === "authenticated") {
      if (plan === "Free") {
        window.location.href = "/dashboard/billing";
      } else if (plan && plan_duration) {
        // check if valid plan and duration
        const plan_config = PLANS.find((p) => p.name === plan);
        if (!plan_config) {
          // @temp - changed the path from /pricing to /p
          window.location.href = "/p/playground";
          return;
        }
        if (plan_duration !== "month" && plan_duration !== "year") {
          window.location.href = "/p/playground";
          return;
        }
        const payload: ICreateStripeSessionPayload = {
          plan_name: plan_config.name,
          plan_duration,
        };
        // trigger the subscription checkout session
        mutate(payload);
      } else if (isNewUser) {
        removeNewUserCookie();
      } else if (callbackUrl) {
        window.location.href = callbackUrl;
      } else if (defaultSubProjectId) {
        window.location.href = `/p/${defaultSubProjectId}`;
        removeDefaultSubProjectCookie();
      } else {
        window.location.href = "/p/playground";
      }
    }
  }, [session]);

  return (
    <PublicLayout>
      <div className="h-[100vh] w-full flex justify-center items-center">
        <Card>
          <CardContent className="max-w-md">
            <div className="p-6 flex flex-col justify-center items-center gap-3">
              <TextLogo />
              <h5 className="text-2xl md:text-3xl font-bold mt-6 text-center">
                Sign in to continue to Hiding Elephant
              </h5>

              {providers?.google ? (
                <button
                  disabled={session.status === "authenticated"}
                  className="p-2 rounded-lg border-[1px] border-light-gray flex justify-center items-center gap-3 w-full mt-6 disabled:bg-gray-50"
                  onClick={() =>
                    signIn(providers.google.id, {
                      redirect: false,
                    })
                  }
                >
                  <GoogleIcon className="h-5 w-5" />
                  <span className="font-semibold">Sign in with Google</span>
                </button>
              ) : null}
              <p className="text-sm text-gray-500 mt-4 text-center">
                By continuing, you accept our{" "}
                <Link
                  className="underline font-medium"
                  href="/terms-of-service"
                  target="_blank"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  className="underline font-medium"
                  href="/privacy-policy"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
                .
              </p>
              <Link href="/" className="flex gap-2 items-center mt-8">
                <ArrowLeft className="stroke-medium-gray" size={20} />
                <span className="text-medium-gray">Back</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default Login;
