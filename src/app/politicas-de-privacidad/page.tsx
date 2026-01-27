import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 font-forgen text-black">
      <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-6">
        <h2 className="mb-3 text-2xl font-semibold">1. Introduction</h2>
        <p>
          Welcome to Apidame Boulder. We respect your privacy and are committed
          to protecting your personal data.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-2xl font-semibold">
          2. Information We Collect
        </h2>
        <p>
          We may collect, use, store and transfer different kinds of personal
          data about you, including:
        </p>
        <ul className="ml-4 list-inside list-disc">
          <li>Identity Data</li>
          <li>Contact Data</li>
          <li>Technical Data</li>
          <li>Usage Data</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-2xl font-semibold">
          3. How We Use Your Information
        </h2>
        <p>We use your personal data for various purposes, including:</p>
        <ul className="ml-4 list-inside list-disc">
          <li>To provide and maintain our service</li>
          <li>To notify you about changes to our service</li>
          <li>
            To allow you to participate in interactive features of our service
          </li>
          <li>To provide customer support</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-2xl font-semibold">4. Data Security</h2>
        <p>
          We have implemented appropriate security measures to prevent your
          personal data from being accidentally lost, used, or accessed in an
          unauthorized way.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-2xl font-semibold">5. Your Rights</h2>
        <p>
          Under certain circumstances, you have rights under data protection
          laws in relation to your personal data, including the right to access,
          correct, or erase your personal data.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-2xl font-semibold">6. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at:
        </p>
        <p>Email: privacy@apidameboulder.com</p>
      </section>

      <Link href="/" className="text-blue-600 hover:text-blue-800">
        Back to Home
      </Link>
    </div>
  );
}
