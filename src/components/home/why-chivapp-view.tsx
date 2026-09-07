import { Icon } from "@iconify/react";

const features = [
    {
        icon: "material-symbols:verified-user-outline",
        title: "Perfiles verificados",
        description:
            "Cada músico muestra fotos, videos y repertorio real antes de que reserves.",
    },
    {
        icon: "material-symbols:contract-edit-outline",
        title: "Contrato firmado digital",
        description:
            "Los términos del evento quedan por escrito y firmados antes de la fecha.",
    },
    {
        icon: "material-symbols:encrypted-outline",
        title: "Pago protegido",
        description:
            "Tu dinero queda retenido en la plataforma y se libera al músico al terminar el show.",
    },
    {
        icon: "material-symbols:location-on-outline",
        title: "Ubicación en vivo",
        description:
            "El día del evento puedes seguir la ubicación del músico camino al lugar.",
    },
    {
        icon: "material-symbols:notifications-active-outline",
        title: "Seguimiento en tiempo real",
        description:
            "Notificaciones en cada paso: aceptación, contrato, pago y confirmación.",
    },
    {
        icon: "material-symbols:reviews-outline",
        title: "Reseñas después del evento",
        description:
            "Contratistas y músicos se califican al finalizar, para que la próxima elección sea más fácil.",
    },
];

export default function WhyChivAppSection() {
    return (
        <section
            id="why-chivapp"
            className="scroll-mt-24 py-14 sm:py-20 md:py-24"
        >
            <div className="max-w-content mx-auto px-4 sm:px-6 md:px-8 text-center">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-[11px] sm:text-xs font-semibold uppercase tracking-wide mb-4 sm:mb-5">
                    Por qué ChivApp
                </span>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight text-balance px-1">
                    Contratar música, sin sorpresas
                </h2>

                <p className="text-default-600 max-w-xl mx-auto mb-10 sm:mb-14 text-sm sm:text-base text-pretty px-1">
                    Todo lo que necesitas para reservar con confianza, de principio a fin.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="flex flex-col items-center text-center gap-3 p-6 sm:p-7 rounded-3xl sm:rounded-4xl border border-default-200/70 bg-content1 shadow-soft hover:-translate-y-1 hover:shadow-elevated hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="flex size-11 sm:size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                                <Icon icon={feature.icon} width={24} height={24} />
                            </div>
                            <h3 className="text-foreground font-bold text-base sm:text-lg">
                                {feature.title}
                            </h3>
                            <p className="text-default-600 text-sm leading-relaxed text-pretty">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
