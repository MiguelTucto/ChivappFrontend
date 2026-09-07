"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button, Card, CardBody, CardHeader, Input, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ApiError } from "@/lib/api";
import { forgotPassword } from "@/lib/auth";
import { UI } from "@/lib/ui-classes";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            const result = await forgotPassword(email.trim());
            setSent(true);
            addToast({ title: result.message, color: "success" });
        } catch (error) {
            addToast({
                title: "No se pudo enviar",
                description:
                    error instanceof ApiError ? error.message : "Intenta de nuevo.",
                color: "danger",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
            <Card className="w-full max-w-lg border border-default-200/70 shadow-soft">
                <CardHeader className="flex flex-col items-start gap-2 px-6 pt-6 pb-0">
                    <div className="flex items-center gap-2">
                        <Icon icon="material-symbols:lock-reset" className="text-2xl text-primary" />
                        <h1 className="text-xl font-semibold">Recuperar contraseña</h1>
                    </div>
                    <p className="text-sm text-default-500">
                        Te enviaremos un enlace para crear una nueva contraseña.
                    </p>
                </CardHeader>
                <CardBody className="px-6 pb-6 pt-4">
                    {sent ? (
                        <div className="flex flex-col gap-4">
                            <p className="text-sm text-default-600">
                                Si el correo existe en ChivApp, recibirás instrucciones en unos
                                minutos. Revisa también spam.
                            </p>
                            <Button as={Link} href="/?auth=login" color="primary" radius="lg">
                                Volver a ingresar
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <Input
                                label="Correo electrónico"
                                type="email"
                                placeholder="tu@email.com"
                                variant="bordered"
                                value={email}
                                onValueChange={setEmail}
                                isRequired
                                autoComplete="email"
                                classNames={UI.authInput}
                            />
                            <Button
                                type="submit"
                                color="primary"
                                radius="lg"
                                isLoading={isSubmitting}
                                className="font-semibold"
                            >
                                Enviar enlace
                            </Button>
                            <Button as={Link} href="/?auth=login" variant="light" radius="lg">
                                Volver a ingresar
                            </Button>
                        </form>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
