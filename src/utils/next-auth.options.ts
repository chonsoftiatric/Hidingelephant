import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";
import { fetchKvStore } from "@/lib/vercel-kv";
import { createUser } from "@/controllers/user.controller";

export const getAuthOptions = (referralCode?: string): NextAuthOptions => {
  return {
    session: {
      strategy: "jwt",
    },
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID as string,
        clientSecret: process.env.GOOGLE_SECRET as string,
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET as string,
    pages: {
      signIn: "/login",
      signOut: "/login",
      newUser: "/onBoarding/page1",
    },
    callbacks: {
      async signIn({ user, account, profile }) {
        if (account?.provider === "google") {
          // fetch stripe plan config - restrict login if not available
          const stripe_config_data = await fetchKvStore(
            "stripe-plans-settings"
          );
          if (stripe_config_data?.key !== "stripe-plans-settings") return false;

          // USER LOGIN RESTRICTION //
          const users_data = await fetchKvStore("application-users");
          if (users_data?.key !== "application-users") return false;
          // if not an application user - return false
          if (!users_data.value.find((rUser) => rUser === user.email)) {
            return false;
          }
          const config_data = await fetchKvStore("application-access");
          if (config_data?.key === "application-access") {
            const userConfig = config_data.value.find(
              (item) => item.user.trim() === user.email
            );
            if (!userConfig) return false;
            // if does not have APP access - return false
            if (!userConfig.access.includes("APP")) return false;
          }
          // USER LOGIN RESTRICTION ENDS //

          const dbUser = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, user.email || ""),
          });

          if (dbUser) {
            // LOGIN
            user.dbUser = dbUser;
            return true;
          } else if (user.email) {
            // SIGNUP
            try {
              //@ts-ignore
              user.firstName = profile?.given_name;
              //@ts-ignore
              user.lastName = profile?.family_name;

              const dbUser = await createUser({
                user,
                referralCode,
              });
              user.dbUser = dbUser;
              return true;
            } catch (err) {
              console.log({ err });
              return false;
            }
          }
        }
        return false;
      },
      async jwt({ token, user }) {
        if (user?.dbUser) {
          token.id = user.dbUser.id;
        } else if (user) {
          for (const [key, value] of Object.entries(user)) {
            token[key] = value;
          }
        }

        return token;
      },
      async session({ session, token }) {
        if (token.id) {
          session.user.id = token.id as number;
        }
        return session;
      },
    },
  };
};

export const authOptions = getAuthOptions();
