import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
    title: "Términos y Condiciones",
    description: `Términos y condiciones de uso de ${SITE_NAME}.`,
    path: "/legal/terminos",
});

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="flex flex-col gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                {title}
            </h2>
            <div className="flex flex-col gap-3 text-default-600 leading-relaxed text-sm sm:text-base">
                {children}
            </div>
        </section>
    );
}

export default function TermsPage() {
    return (
        <div className="container mx-auto max-w-content px-4 sm:px-6 py-12 sm:py-16 flex flex-col gap-10">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                    Términos y Condiciones
                </h1>
                <p className="text-default-500 text-sm">
                    Última actualización: 8 de septiembre de 2026
                </p>
            </header>

            <Section title="1. Aceptación de estos términos">
                <p>
                    Al crear una cuenta o usar {SITE_NAME} aceptas estos Términos y
                    Condiciones en su totalidad. Si no estás de acuerdo con alguno de
                    los puntos aquí descritos, no debes usar la plataforma.
                </p>
            </Section>

            <Section title="2. Qué es Chivapp">
                <p>
                    {SITE_NAME} es un mercado en línea que conecta a{" "}
                    <strong className="text-foreground">contratistas</strong>{" "}
                    (personas o negocios que buscan contratar músicos para un evento)
                    con <strong className="text-foreground">músicos</strong>{" "}
                    (artistas o agrupaciones que ofrecen sus servicios). No somos parte
                    del servicio musical contratado: facilitamos el descubrimiento, la
                    reserva, el contrato y el pago entre ambas partes.
                </p>
            </Section>

            <Section title="3. Cuentas, registro y verificación">
                <p>
                    Puedes registrarte utilizando tu dirección de correo electrónico o tu
                    cuenta de Google. Al registrarte con Google, autorizas a {SITE_NAME} a
                    recibir tu información básica de perfil (nombre, correo electrónico verificado
                    y foto de perfil) para crear y vincular tu cuenta de forma segura.
                </p>
                <p>
                    Debes proporcionar información veraz al registrarte. Los perfiles de
                    músicos y contratistas pueden requerir verificación de identidad
                    antes de publicarse o de realizar una reserva. Nos reservamos el
                    derecho de suspender o cerrar cuentas que incumplan estos términos,
                    proporcionen información falsa, o generen reportes de abuso.
                </p>
            </Section>

            <Section title="4. Firma electrónica y contratos de servicio">
                <p>
                    Al confirmar o aceptar una reserva dentro de {SITE_NAME}, tanto el
                    contratista como el músico{" "}
                    <strong className="text-foreground">
                        consienten firmar electrónicamente
                    </strong>{" "}
                    el contrato de servicio generado por la plataforma para esa reserva.
                    Esta firma electrónica (capturada dentro de la app) identifica a
                    quien la realiza y expresa su conformidad con los términos del
                    contrato, y tiene la misma validez legal y probatoria que una firma
                    manuscrita.
                </p>
                <p>
                    El músico registra además una firma digital persistente en su
                    perfil, que se utiliza para generar los contratos de cada reserva
                    que acepte. El documento firmado (con ambas firmas, fecha y hora de
                    aceptación) queda disponible como PDF descargable dentro de la
                    reserva.
                </p>
            </Section>

            <Section title="5. Pagos, comisiones y liquidaciones">
                <p>
                    Los pagos de una reserva se procesan a través de {SITE_NAME} según
                    el flujo vigente en la plataforma (adelanto, saldo, retención y
                    liberación). El comprobante de cada pago es revisado y validado por
                    el equipo de {SITE_NAME} antes de confirmar el avance de la reserva.
                    Las comisiones aplicables, si existen, se muestran de forma visible
                    antes de confirmar cada pago.
                </p>
            </Section>

            <Section title="6. Cancelaciones y disputas">
                <p>
                    Las condiciones de cancelación de una reserva se muestran en el
                    contrato específico de esa reserva antes de confirmarla. Ante un
                    desacuerdo entre contratista y músico (por ejemplo, sobre la calidad
                    del servicio o el cumplimiento de lo acordado), cualquiera de las
                    partes puede abrir una queja dentro de la reserva; el equipo de{" "}
                    {SITE_NAME} revisará la evidencia disponible y podrá determinar
                    ajustes al pago retenido conforme a lo que corresponda.
                </p>
            </Section>

            <Section title="7. Uso aceptable">
                <p>
                    No está permitido: suplantar identidades, publicar contenido falso u
                    ofensivo, usar la plataforma para actividades ilegales, contactar a
                    otros usuarios fuera de la app con fines de evadir comisiones antes
                    de cerrar una reserva, o intentar vulnerar la seguridad del sistema.
                </p>
            </Section>

            <Section title="8. Suspensión de cuentas">
                <p>
                    Podemos suspender o desactivar una cuenta, de forma temporal o
                    permanente, cuando detectemos incumplimiento de estos términos,
                    fraude, o riesgo para otros usuarios. Cuando sea razonablemente
                    posible, notificaremos el motivo.
                </p>
            </Section>

            <Section title="9. Cambios a estos términos">
                <p>
                    Podemos actualizar estos Términos y Condiciones para reflejar
                    cambios en la plataforma o requisitos legales. Publicaremos la
                    fecha de la última actualización en la parte superior de esta
                    página; el uso continuado de {SITE_NAME} después de un cambio
                    implica su aceptación.
                </p>
            </Section>

            <Section title="10. Contacto">
                <p>
                    Si tienes dudas sobre estos términos, puedes escribirnos desde el
                    botón de{" "}
                    <span className="text-foreground font-semibold">
                        ayuda y comentarios
                    </span>{" "}
                    disponible en cualquier página de la app, o revisar nuestra{" "}
                    <Link
                        href="/legal/privacidad"
                        className="text-primary underline underline-offset-2"
                    >
                        Política de Privacidad
                    </Link>
                    .
                </p>
            </Section>
        </div>
    );
}
