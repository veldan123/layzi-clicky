import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for Layzi Clicky.",
};

const LAST_UPDATED = "28 June 2025";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-20">
      <div className="mb-12 border-b border-[--color-border] pb-10">
        <p className="text-xs font-bold tracking-[0.25em] text-[--color-primary] uppercase mb-3">Legal</p>
        <h1
          className="text-4xl md:text-5xl font-black text-[--color-foreground] leading-none mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-[--color-muted-foreground]">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="prose prose-sm max-w-none space-y-10 text-[#374151] leading-relaxed">

        <section>
          <h2 className="text-lg font-black text-[#111111] mb-3">1. Agreement to Terms</h2>
          <p>
            By placing an order with Layzi Clicky ("we", "us", "our"), you agree to these Terms &amp; Conditions in full. If you do not agree, please do not use our website or purchase our products. These terms apply to all visitors, users, and customers of <strong>layziclicky.com</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-[#111111] mb-3">2. Products</h2>
          <p>
            All Layzi Clicky products are handcrafted and 3D printed to order in Singapore. Because each item is made fresh upon purchase:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-2">
            <li>Minor variations in colour and finish may occur between orders — this is a natural characteristic of 3D printing.</li>
            <li>Product images are representative. Exact appearance may vary slightly due to screen calibration and print batch.</li>
            <li>We reserve the right to discontinue or modify any product at any time without notice.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-black text-[#111111] mb-3">3. Pricing &amp; Payment</h2>
          <p>
            All prices are listed in <strong>Singapore Dollars (SGD)</strong> and include GST where applicable. We accept payment by credit and debit card via Stripe, a secure third-party payment processor. By submitting your payment, you confirm you are authorised to use the card provided.
          </p>
          <p className="mt-3">
            We reserve the right to change prices at any time. Orders placed before a price change are honoured at the price shown at checkout.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-[#111111] mb-3">4. Order Processing</h2>
          <p>
            Orders are confirmed once payment is successfully received. You will receive a confirmation email with your order details. As every item is printed on demand, production typically begins within 1–2 business days of your order being confirmed.
          </p>
          <p className="mt-3">
            We reserve the right to cancel or refuse any order at our discretion, including in cases of suspected fraud or error in pricing. In such cases, a full refund will be issued.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-[#111111] mb-3">5. Shipping &amp; Delivery</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>We ship via <strong>Singpost</strong> within Singapore.</li>
            <li>Estimated delivery is 3–7 business days after dispatch. Delays caused by Singpost or external factors are outside our control.</li>
            <li>Free shipping is available on qualifying orders as shown at checkout.</li>
            <li>We are not responsible for packages lost or delayed due to incorrect addresses provided at checkout. Please double-check your address before submitting your order.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-black text-[#111111] mb-3">6. Returns &amp; Refunds</h2>
          <p>
            Because all products are made to order, we do not accept returns or exchanges for change of mind.
          </p>
          <p className="mt-3">
            However, if your item arrives <strong>damaged, defective, or incorrect</strong>, please contact us at <a href="mailto:hello@layziclicky.com" className="text-[#FF3D00] hover:underline font-medium">hello@layziclicky.com</a> within <strong>7 days of delivery</strong> with a photo of the issue. We will replace or refund the item at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-[#111111] mb-3">7. Intellectual Property</h2>
          <p>
            All content on this website — including product designs, images, text, and branding — is the property of Layzi Clicky and may not be reproduced, distributed, or used without written permission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-[#111111] mb-3">8. Privacy &amp; Data</h2>
          <p>
            When you place an order, we collect your name, email address, phone number, and shipping address solely to fulfil your order and communicate order updates. We do not sell or share your personal data with third parties, except as required to process payment (Stripe) or deliver your order (Singpost).
          </p>
          <p className="mt-3">
            Payment information is processed securely by Stripe and is never stored on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-[#111111] mb-3">9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Layzi Clicky shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability in any case shall not exceed the amount paid for the order in question.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-[#111111] mb-3">10. Governing Law</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of <strong>Singapore</strong>. Any disputes shall be subject to the exclusive jurisdiction of the Singapore courts.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-[#111111] mb-3">11. Contact</h2>
          <p>
            For any questions about these terms, please reach out to us at{" "}
            <a href="mailto:hello@layziclicky.com" className="text-[#FF3D00] hover:underline font-medium">
              hello@layziclicky.com
            </a>.
          </p>
        </section>

      </div>
    </div>
  );
}
