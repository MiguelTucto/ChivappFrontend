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
                    Última actualización: 8 de septiembre de 2026
                </p>
            </header>

            <Section title="1. Qué datos recolectamos">
                <p>Para operar {SITE_NAME} recolectamos:</p>
                <ul className="list-disc pl-5 flex flex-col gap-1.5">
                    <li>
                        <strong className="text-foreground">Datos de cuenta y autenticación:</strong>{" "}
                        nombre, correo electrónico, teléfono y contraseña (almacenada de forma
                        cifrada, nunca en texto plano). Si decides registrarte o iniciar sesión a través
                        de un servicio de terceros (como el inicio de sesión con Google), recolectamos tu
                        nombre completo, correo electrónico verificado y fotografía de perfil proporcionados
                        por Google bajo tu autorización expresa.
                    </li>
                    <li>
                        <strong className="text-foreground">Datos de perfil:</strong>{" "}
                        biografía, géneros, instrumentos, precios, ubicación, fotos y
                        videos de portafolio, datos bancarios/de cobro confidenciales para desembolsos,
                        y (para músicos) una firma digital usada para generar contratos.
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

            <Section title="2. Cómo usamos tus datos y Política de Datos de Google">
                <p>
                    Usamos tus datos exclusivamente para operar la plataforma: mostrar perfiles,
                    procesar reservas y pagos, generar y validar contratos de servicio, enviarte
                    notificaciones operativas sobre tu actividad, y responder tus consultas de
                    soporte. No vendemos ni alquilamos tus datos a terceros.
                </p>
                <p>
                    En relación con el inicio de sesión con Google, el uso que hace {SITE_NAME} de la
                    información recibida a través de las APIs de Google se adhiere a la{" "}
                    <strong className="text-foreground">Política de Datos de Usuario de los Servicios de las APIs de Google (Google API Services User Data Policy)</strong>,
                    incluyendo los requisitos de Uso Limitado (Limited Use). No utilizamos los datos obtenidos de Google
                    para servir anuncios publicitarios ni para entrenar modelos generales de inteligencia artificial.
                </p>
            </Section>

            <Section id="cookies" title="3. Cookies y almacenamiento de sesión">
                <p>
                    {SITE_NAME} utiliza únicamente cookies esenciales HTTP-only y de seguridad,
                    necesarias para mantener tu sesión activa y proteger las transacciones:
                </p>
                <ul className="list-disc pl-5 flex flex-col gap-1.5">
                    <li>
                        <code className="px-1.5 py-0.5 rounded bg-default-100 text-foreground text-xs">
                            access_token
                        </code>{" "}
                        y{" "}
                        <code className="px-1.5 py-0.5 rounded bg-default-100 text-foreground text-xs">
                            refresh_token
                        </code>
                        : gestionan la autenticación segura y el ciclo de vida de tu sesión.
                    </li>
                    <li>
                        <code className="px-1.5 py-0.5 rounded bg-default-100 text-foreground text-xs">
                            oauth_pending
                        </code>
                        : cookie temporal y cifrada que se utiliza exclusivamente durante el flujo de registro con Google para vincular tu elección de rol (músico o contratista).
                    </li>
                </ul>
                <p>
                    Actualmente no usamos cookies de analítica invasiva ni redes de publicidad de terceros.
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
