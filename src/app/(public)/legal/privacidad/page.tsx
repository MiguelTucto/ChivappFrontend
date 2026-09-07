import type { Metadata } from "next";
import { SITE_NAME, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
    title: "Privacidad y Cookies",
    description: `Política de privacidad y cookies de ${SITE_NAME}.`,
    path: "/legal/privacidad",
});

function Section({
    id,
    title,
    children,
}: {
    id?: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="flex flex-col gap-3 scroll-mt-28">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                {title}
            </h2>
            <div className="flex flex-col gap-3 text-default-600 leading-relaxed text-sm sm:text-base">
                {children}
            </div>
        </section>
    );
}

export default function PrivacyPage() {
    return (
        <div className="container mx-auto max-w-content px-4 sm:px-6 py-12 sm:py-16 flex flex-col gap-10">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                    Privacidad y Cookies
                </h1>
                <p className="text-default-500 text-sm">
                    Última actualización: 24 de agosto de 2026
                </p>
            </header>

            <Section title="1. Qué datos recolectamos">
                <p>Para operar {SITE_NAME} recolectamos:</p>
                <ul className="list-disc pl-5 flex flex-col gap-1.5">
                    <li>
                        <strong className="text-foreground">Datos de cuenta:</strong>{" "}
                        nombre, correo, teléfono y contraseña (almacenada de forma
                        cifrada, nunca en texto plano).
                    </li>
                    <li>
                        <strong className="text-foreground">Datos de perfil:</strong>{" "}
                        biografía, géneros, instrumentos, precios, ubicación, fotos y
                        videos de portafolio, y (para músicos) una firma digital usada
                        para generar contratos.
                    </li>
                    <li>
                        <strong className="text-foreground">Datos de reservas:</strong>{" "}
                        detalles del evento, mensajes entre contratista y músico,
                        contratos firmados, comprobantes de pago y su estado de
                        validación.
                    </li>
                    <li>
                        <strong className="text-foreground">
                            Comentarios de ayuda:
                        </strong>{" "}
                        el contenido de los mensajes que envías desde el módulo de ayuda,
                        junto con metadata técnica de esa consulta (dirección IP,
                        navegador y página desde la que se envió) — esto aplica tanto si
                        tienes sesión iniciada como si escribes como visitante.
                    </li>
                </ul>
            </Section>

            <Section title="2. Cómo usamos tus datos">
                <p>
                    Usamos tus datos para operar la plataforma: mostrar perfiles,
                    procesar reservas y pagos, generar y validar contratos, enviarte
                    notificaciones sobre tu actividad, y responder tus consultas de
                    ayuda. No vendemos tus datos a terceros.
                </p>
            </Section>

            <Section id="cookies" title="3. Cookies">
                <p>
                    {SITE_NAME} usa una única cookie esencial,{" "}
                    <code className="px-1.5 py-0.5 rounded bg-default-100 text-foreground text-xs">
                        access_token
                    </code>
                    , necesaria para mantener tu sesión iniciada de forma segura.
                    Actualmente no usamos cookies de analítica ni de publicidad. Si esto
                    cambia en el futuro, actualizaremos esta sección y, de ser
                    necesario, pediremos tu consentimiento adicional.
                </p>
            </Section>

            <Section title="4. Con quién compartimos información">
                <p>
                    Compartimos la información estrictamente necesaria entre las partes
                    de una reserva (por ejemplo, el contratista ve el perfil y el
                    contrato del músico que reservó, y viceversa). No compartimos tus
                    datos personales con terceros para fines de marketing.
                </p>
            </Section>

            <Section title="5. Cuánto tiempo conservamos tus datos">
                <p>
                    Conservamos los datos de cuenta y de reservas mientras tu cuenta
                    esté activa y por el tiempo adicional necesario para cumplir
                    obligaciones legales o resolver disputas. Puedes solicitar la
                    eliminación de tu cuenta desde el módulo de ayuda.
                </p>
            </Section>

            <Section title="6. Tus derechos">
                <p>
                    Puedes solicitar acceso, corrección o eliminación de tus datos
                    personales en cualquier momento escribiéndonos desde el botón de
                    ayuda y comentarios disponible en toda la app.
                </p>
            </Section>

            <Section title="7. Contacto">
                <p>
                    Para cualquier consulta sobre privacidad, usa el módulo de{" "}
                    <span className="text-foreground font-semibold">
                        ayuda y comentarios
                    </span>{" "}
                    disponible en cualquier página de {SITE_NAME}.
                </p>
            </Section>
        </div>
    );
}
