import * as motion from "motion/react-client";

export default function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="w-full max-w-4xl mx-auto px-6 pb-30 select-none pointer-events-none"
        >
            <hr className="h-px text-grey-200 mb-6" />
            <small className="font-body04-light text-grey-500">
                &copy; 2026 Dohyeop Lim
            </small>
        </motion.footer>
    );
}
