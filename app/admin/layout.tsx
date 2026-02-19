import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-white">
            {/* Sidebar */}
            <aside className="hidden xl:block w-64 shrink-0">
                <Sidebar />
            </aside>

            {/* Right side */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* Header */}
                <Header />

                {/* Scrollable content */}
                <main className="flex-1 overflow-y-auto bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
