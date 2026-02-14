export default function DetailRow({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-black/10 bg-white px-4 py-3">
            <div className="flex items-start gap-3">
                <div className="mt-0.5">{icon}</div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-black/45">{label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-[#233041] wrap-break-word">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}