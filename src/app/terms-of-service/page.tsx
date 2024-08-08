import React from "react";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";

const TermsOfService = () => {
  return (
    <PublicLayout>
      <div className="prose py-20 max-w-3xl mx-auto space-y-4">
        <h1 className="font-bold text-xl lg:text-2xl">
          Terms of Service for HidingElephant.com
        </h1>
        <p>
          <strong>Effective Date: July 17th, 2024</strong>
        </p>

        <h2 className="font-bold text-lg">1. Introduction</h2>
        <p>
          Welcome to Hiding Elephant. These Terms of Service {`("Terms")`}{" "}
          govern your access to and use of Hiding {`Elephant's`} services,
          including our AI logo generator tool and any other products and
          services that we offer {`(collectively, the "Service")`}. By accessing
          or using our Service, you agree to be bound by these Terms. If you do
          not agree with any part of these Terms, you must not use our Service.
        </p>

        <h2 className="font-bold text-lg">2. Account Registration</h2>
        <p>
          To use our Service, you must create an account. You can register by
          using your Google account. By registering, you agree to provide
          accurate, current, and complete information about yourself and to
          update this information to keep it accurate, current, and complete.
          You are responsible for safeguarding your account information and for
          any activity that occurs under your account. You must notify us
          immediately of any unauthorized use of your account.
        </p>

        <h2 className="font-bold text-lg">3. Subscription Plans</h2>
        <p>
          Hiding Elephant offers both free and paid subscription plans. Free
          plans come with certain limitations, while paid plans provide enhanced
          features and benefits. Subscription fees are billed on a recurring
          basis as specified at the time of purchase. You may cancel your
          subscription at any time, but no refunds will be issued for any unused
          portion of the subscription period.
        </p>

        <h2 className="font-bold text-lg">4. Use of Service</h2>
        <p>
          You agree to use the Service only for lawful purposes and in
          compliance with all applicable laws and regulations. You must not:
        </p>
        <ul className="list-disc list-inside">
          <li>
            Use the Service in any way that could damage, disable, overburden,
            or impair our servers or networks.
          </li>
          <li>
            Attempt to gain unauthorized access to any part of the Service or
            any other accounts, computer systems, or networks connected to the
            Service.
          </li>
          <li>
            Use any robot, spider, scraper, or other automated means to access
            the Service for any purpose without our express written permission.
          </li>
          <li>
            Engage in any conduct that restricts or inhibits any other user from
            using or enjoying the Service.
          </li>
        </ul>

        <h2 className="font-bold text-lg">5. User Content</h2>
        <p>
          By using our Service, you may create or upload content, including
          logos and designs {`("User Content")`}. You retain all rights to your
          User Content. However, you grant Hiding Elephant a non-exclusive,
          worldwide, royalty-free, transferable license to use, store, display,
          reproduce, and distribute your User Content solely for the purpose of
          providing the Service.
        </p>

        <h2 className="font-bold text-lg">6. Intellectual Property</h2>
        <p>
          All intellectual property rights in the Service, including but not
          limited to the software, design, graphics, and text, are owned by
          Hiding Elephant or our licensors. You may not copy, modify,
          distribute, sell, or lease any part of our Service or included
          software, nor may you reverse engineer or attempt to extract the
          source code of that software, unless laws prohibit those restrictions
          or you have our written permission.
        </p>

        <h2 className="font-bold text-lg">7. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to the
          Service at any time, without notice or liability, for any reason,
          including if we believe you have violated these Terms. Upon
          termination, your right to use the Service will immediately cease.
        </p>

        <h2 className="font-bold text-lg">8. Disclaimer of Warranties</h2>
        <p>
          The Service is provided on an {`"as is" and "as available"`} basis.
          Hiding Elephant makes no representations or warranties of any kind,
          express or implied, regarding the Service, including but not limited
          to warranties of merchantability, fitness for a particular purpose,
          non-infringement, and that the Service will be uninterrupted,
          error-free, or secure.
        </p>

        <h2 className="font-bold text-lg">9. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Hiding Elephant shall not be
          liable for any indirect, incidental, special, consequential, or
          punitive damages, or any loss of profits or revenues, whether incurred
          directly or indirectly, or any loss of data, use, goodwill, or other
          intangible losses, resulting from:
        </p>
        <ul className="list-disc list-inside">
          <li>Your use of or inability to use the Service.</li>
          <li>
            Any unauthorized access to or use of our servers and/or any personal
            information stored therein.
          </li>
          <li>
            Any interruption or cessation of transmission to or from the
            Service.
          </li>
        </ul>

        <h2 className="font-bold text-lg">10. Changes to Terms</h2>
        <p>
          We may modify these Terms at any time. If we do, we will provide
          notice of such changes by posting the updated Terms on our website and
          updating the {`"Effective Date"`} at the top of these Terms. Your
          continued use of the Service after any such changes constitutes your
          acceptance of the new Terms.
        </p>

        <h2 className="font-bold text-lg">11. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of Florida, USA, without regard to its conflict of law
          principles. You agree to submit to the personal jurisdiction of the
          courts located in Florida, USA for the purpose of litigating all such
          claims or disputes.
        </p>

        <h2 className="font-bold text-lg">12. Privacy and Cookie Policies</h2>
        <p>
          Your use of the Service is also governed by our{" "}
          <Link
            href="https://www.hidingelephant.com/privacy-policy"
            target="_blank"
          >
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link
            href="https://www.hidingelephant.com/cookie-policy"
            target="_blank"
          >
            Cookie Policy
          </Link>
          . By using the Service, you agree to the terms outlined in these
          policies.
        </p>

        <h2 className="font-bold text-lg">13. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at
          info@hidingelephant.com.
        </p>

        <p>
          By using our Service, you acknowledge that you have read, understood,
          and agree to be bound by these Terms of Service.
        </p>
      </div>
    </PublicLayout>
  );
};

export default TermsOfService;
