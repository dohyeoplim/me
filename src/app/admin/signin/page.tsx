import { redirect } from "next/navigation";
import { auth } from "@/auth";
import TextField from "@/app/components/DDS/TextField";
import { isAdminAuthConfigured } from "@/app/lib/admin-auth";
import SubmitButton from "./_components/SubmitButton";
import { signInWithTotp } from "./actions";
import styles from "./signin.module.css";

type SignInPageProps = {
    searchParams: Promise<{ error?: string | string[] }>;
};

const errorMessages: Record<string, string> = {
    invalid: "The password or verification code is incorrect. Try again.",
    "rate-limited": "Too many attempts. Wait a moment and try again.",
    unavailable: "Admin authentication is temporarily unavailable.",
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
    const session = await auth();
    if (session?.user?.admin === true) redirect("/admin");
    const { error } = await searchParams;
    const errorCode = Array.isArray(error) ? error[0] : error;
    const errorMessage = errorCode ? errorMessages[errorCode] ?? errorMessages.invalid : undefined;
    const configured = isAdminAuthConfigured();

    return (
        <main id="main-content" className={styles.signIn}>
            <header className={styles.header}>
                <h1 className="font-section-title">Admin sign in</h1>
                <p className="font-support text-muted">
                    {configured
                        ? "Enter your admin password and the current verification code from Enpass."
                        : "Admin authentication needs to be configured."}
                </p>
            </header>

            {configured ? (
                <form action={signInWithTotp} className={styles.form}>
                    <div className={styles.fields}>
                        <TextField
                            id="admin-password"
                            name="password"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            maxLength={200}
                            required
                            autoFocus
                            invalid={Boolean(errorMessage)}
                            aria-describedby={errorMessage ? "admin-signin-status" : undefined}
                        />
                        <TextField
                            id="admin-code"
                            name="code"
                            label="Verification code"
                            hint="Enter the 6-digit code from Enpass. A recovery code also works."
                            type="text"
                            autoComplete="one-time-code"
                            autoCapitalize="off"
                            autoCorrect="off"
                            spellCheck={false}
                            maxLength={80}
                            required
                            invalid={Boolean(errorMessage)}
                            aria-describedby={errorMessage ? "admin-signin-status" : undefined}
                        />
                    </div>
                    {errorMessage && (
                        <p id="admin-signin-status" className="font-support" role="alert">
                            {errorMessage}
                        </p>
                    )}
                    <div className={styles.actions}>
                        <SubmitButton />
                    </div>
                </form>
            ) : (
                <p className="font-support text-muted">Run the local authentication setup before signing in.</p>
            )}
        </main>
    );
}
