import { Icon } from "@iconify/react";
import JoinAsMusicianButton from "@/components/home/join-as-musician-button";

const benefits = [
    "Perfil público con fotos, videos y repertorio",
    "Recibe solicitudes de contratistas verificados",
    "Contrato firmado digitalmente y pago protegido por evento",
];

export default function MusicianCtaSection() {
    return (
        <section className="py-14 sm:py-20 md:py-24">
            <div className="max-w-content mx-auto px-4 sm:px-6 md:px-8">
                <div className="relative overflow-hidden rounded-4xl border border-primary/20 bg-gradient-to-br from-primary/15 via-content1 to-secondary/10 px-6 py-10 sm:px-12 sm:py-14 text-center">
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-primary/15 blur-3xl"
                    />

                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-content1 border border-default-200/70 text-primary text-[11px] sm:text-xs font-semibold uppercase tracking-wide mb-4 sm:mb-5">
                        Para músicos y bandas
                    </span>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight text-balance px-1">
                        ¿Eres músico? Consigue más eventos.
                    </h2>

                    <p className="text-default-600 max-w-xl mx-auto mb-7 sm:mb-9 text-sm sm:text-base text-pretty px-1">
                        Publica tu perfil, muestra tu estilo y deja que los
                        contratistas te encuentren y te contraten directamente.
                    </p>

                    <ul className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-6 mb-8 sm:mb-10 px-1">
                        {benefits.map((benefit) => (
                            <li
                                key={benefit}
                                className="flex items-center gap-2 text-sm text-foreground/90 font-medium"
                            >
                                <Icon
                                    icon="material-symbols:check-circle"
                                    width={18}
                                    className="text-primary shrink-0"
                                />
                                {benefit}
                            </li>
                        ))}
                    </ul>

                    <div className="flex justify-center">
                        <JoinAsMusicianButton />
                    </div>
                </div>
            </div>
        </section>
    );
}
