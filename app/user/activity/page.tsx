import ActivityClient from "./_components/ActivityClient";

export default function Page() {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Activity</h1>
                <p className="text-sm text-gray-600">
                    Track your pending, upcoming, and past bookings.
                </p>
            </div>

            <ActivityClient />
        </div>
    );
}