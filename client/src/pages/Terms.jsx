import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-teal-600">Terms &amp; Conditions</h1>
      <p className="text-slate-700">
        By using RentLoop you agree to the following terms. All rentals are
        subject to the conditions outlined below. Please read them carefully.
      </p>
      <h2 className="text-2xl font-semibold text-teal-500 mt-4">
        1. Rental Responsibility
      </h2>
      <p className="text-slate-600">
        The renter is fully responsible for any damage, loss, or theft of the
        item during the rental period. In case of any incident the renter shall
        compensate the owner for repair costs or the market value of the item.
      </p>
      <h2 className="text-2xl font-semibold text-teal-500 mt-4">
        2. Payment &amp; Refunds
      </h2>
      <p className="text-slate-600">
        Payments are collected in advance. Refunds are only issued if the owner
        cancels the rental or the item is not delivered as described. No refunds
        for early return or user‑initiated cancellations.
      </p>
      <h2 className="text-2xl font-semibold text-teal-500 mt-4">
        3. Liability
      </h2>
      <p className="text-slate-600">
        RentLoop acts only as a marketplace facilitator and is not liable for
        any disputes between renters and owners. All disputes must be resolved
        directly between the parties.
      </p>
      <h2 className="text-2xl font-semibold text-teal-500 mt-4">
        4. Compliance
      </h2>
      <p className="text-slate-600">
        Users must comply with all local laws regarding rental activities.
        Illegal items are strictly prohibited.
      </p>
      <div className="mt-8 flex justify-center">
        <Link to="/" className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
