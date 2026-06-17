import { signIn } from "@/auth";

export default function SignIn() {
    return (
        <div className="flex flex-col items-center gap-6 py-20">
            <h1 className="font-head01-medium text-grey-900">Admin</h1>
            <form
                action={async () => {
                    "use server";
                    await signIn("github", { redirectTo: "/admin" });
                }}
            >
                <button
                    type="submit"
                    className="rounded-md bg-grey-900 px-5 py-2.5 text-grey-50 font-body03-regular"
                >
                    Sign in with GitHub
                </button>
            </form>
        </div>
    );
}
