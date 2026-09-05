import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Surface from "@/app/components/DDS/Surface";
import { isAdminAuthConfigured } from "@/app/lib/admin-auth";
import SubmitButton from "./_components/SubmitButton";
import { signInWithTotp } from "./actions";
import styles from "./signin.module.css";

type SignInPageProps = {
    searchParams: Promise<{ error?: string | string[] }>;
};

const errorMessages: Record<string, string> = {
    invalid: "The credentials were not accepted. Check them and try again.",
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
        <main className={styles.signIn}>
            <Surface className={styles.panel} padding="comfortable">
                <header className={styles.header}>
                    <h1 className="font-head01-medium">Admin sign in</h1>
                    <p className="font-body03-regular">
                        {configured
                            ? "Use the access key and current code saved in Enpass."
                            : "Admin authentication needs to be configured."}
                    </p>
                </header>

                {configured ? <form action={signInWithTotp} className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="admin-access-key" className="font-caption01-light">
                            Access key
                        </label>
                        <input
                            id="admin-access-key"
                            name="accessKey"
                            type="password"
                            autoComplete="current-password"
                            required
                            autoFocus
                            aria-invalid={errorMessage ? true : undefined}
                            aria-describedby={errorMessage ? "admin-signin-status" : undefined}
                            className={`${styles.input} font-body03-regular`}
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="admin-code" className="font-caption01-light">
                            One-time code or recovery code
                        </label>
                        <input
                            id="admin-code"
                            name="code"
                            type="text"
                            autoComplete="one-time-code"
                            autoCapitalize="off"
                            autoCorrect="off"
                            spellCheck={false}
                            required
                            aria-invalid={errorMessage ? true : undefined}
                            aria-describedby={errorMessage ? "admin-code-help admin-signin-status" : "admin-code-help"}
                            className={`${styles.input} font-body03-regular`}
                        />
                        <p id="admin-code-help" className={`${styles.help} font-caption03-regular`}>
                            Use a 6-digit code or a saved recovery code.
                        </p>
                        {errorMessage && (
                            <p
                                id="admin-signin-status"
                                className={`${styles.status} font-caption01-light`}
                                role="alert"
                            >
                                {errorMessage}
                            </p>
                        )}
                    </div>

                    <SubmitButton className={styles.submit} />
                </form> : (
                    <p className={`${styles.help} font-caption01-light`}>
                        Run the local authentication setup before signing in.
                    </p>
                )}
            </Surface>
        </main>
    );
}
