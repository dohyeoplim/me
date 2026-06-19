export default function EditEntryLoading() {
    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="h-3 w-20 animate-pulse rounded bg-grey-100" />
                    <div className="h-3 w-40 animate-pulse rounded bg-grey-100" />
                </div>
                <div className="h-9 w-2/3 animate-pulse rounded bg-grey-100" />
            </div>

            <div className="flex flex-col gap-6">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="flex flex-col gap-3 rounded-lg border border-grey-100 p-4"
                    >
                        <div className="h-3 w-24 animate-pulse rounded bg-grey-100" />
                        <div className="h-4 w-full animate-pulse rounded bg-grey-100" />
                        <div className="h-4 w-4/5 animate-pulse rounded bg-grey-100" />
                    </div>
                ))}
            </div>
        </div>
    );
}
