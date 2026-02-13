import ResetPasswordForm from "../_components/reset-form";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const token = query.token as string | undefined;

  if (!token) {
    throw new Error("Invalid or missing token");
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[#F4F1EE]" />
        <div className="absolute inset-x-0 top-0 h-72 bg-linear-to-b from-[#C4B6AB]/80 to-transparent" />

        {/* Optional decorative waves (subtle, homepage vibe) */}
        <div className="pointer-events-none absolute -bottom-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-[#233041]/5 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg">
                <ResetPasswordForm token={token} />
            </div>
        </div>
    </div>
  );
}
