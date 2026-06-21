export default function AdminDashboardLoading() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-grey-200 pb-3">
                <div className="h-4 w-16 animate-pulse rounded bg-grey-100" />
                <div className="h-3 w-8 animate-pulse rounded bg-grey-100" />
            </div>

            <div className="h-6 w-24 animate-pulse rounded bg-grey-100" />

            <ul className="flex flex-col divide-y divide-grey-200">
                {[0, 1, 2].map((i) => (
                    <li
                        key={i}
                        className="flex items-center justify-between py-3"
                    >
                        <div className="h-4 w-48 animate-pulse rounded bg-grey-100" />
                        <div className="h-3 w-12 animate-pulse rounded bg-grey-100" />
                    </li>
                ))}
            </ul>

            <div className="mt-4 h-6 w-28 animate-pulse rounded bg-grey-100" />

            <ul className="flex flex-col divide-y divide-grey-200">
                {[0, 1, 2, 3].map((i) => (
                    <li
                        key={i}
                        className="flex items-center justify-between py-3"
                    >
                        <div className="h-4 w-56 animate-pulse rounded bg-grey-100" />
                        <div className="h-3 w-14 animate-pulse rounded bg-grey-100" />
                    </li>
                ))}
            </ul>
        </div>
    );
}
