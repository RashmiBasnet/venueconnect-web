import { handleGetAllUsers } from "@/lib/actions/admin/user-actions";
import UsersTable from "./_components/UsersTable";

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const query = await searchParams;
    const page = query.page ? parseInt(query.page as string, 10) : 1;
    const size = query.size ? parseInt(query.size as string, 10) : 10;
    const search = query.search ? (query.search as string) : "";
    console.log("Search params:", { page, size, search });
    // call api
    const result = await handleGetAllUsers({ page, size, search });
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 bg-white">
            <UsersTable users={result.users || []} pagination={result.pagination} search={search} />
        </div>
    );
}