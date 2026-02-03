import Header from "./_components/Header";

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <div className="w-full bg-white">
            <Header />
            {children}
        </div>
    );
}