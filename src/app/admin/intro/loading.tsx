export default function IntroLoading() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <div className="h-3 w-16 animate-pulse rounded bg-grey-100" />
                <div className="h-9 w-1/2 animate-pulse rounded bg-grey-100" />
            </div>

            <div className="flex flex-col gap-5">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                        <div className="h-3 w-20 animate-pulse rounded bg-grey-100" />
                        <div className="h-10 w-full animate-pulse rounded bg-grey-100" />
                    </div>
                ))}
            </div>

            <div className="h-40 w-full animate-pulse rounded-lg bg-grey-100" />
        </div>
    );
}
