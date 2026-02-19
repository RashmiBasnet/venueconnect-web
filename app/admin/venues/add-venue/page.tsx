import AddVenueForm from "../_components/AddVenueForm";

export default function Page() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-black">Add Venue</h1>
                <p className="text-sm text-gray-500">
                    Create a new venue with images and details.
                </p>
            </div>

            {/* Form */}
            <AddVenueForm />
        </div>
    );
}
