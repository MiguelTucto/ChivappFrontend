"use client";

import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@heroui/react";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import type { UserRole } from "@/types/api";

export type AuthModalMode = "login" | "register";

type Props = {
    isOpen: boolean;
    mode: AuthModalMode;
    redirect?: string | null;
    oauthError?: string | null;
    defaultRole?: UserRole;
    onOpenChange: (open: boolean) => void;
    onSwitchMode: (mode: AuthModalMode) => void;
    onAuthenticated: (destination: string) => void;
};

export default function AuthModal({
    isOpen,
    mode,
    redirect,
    oauthError,
    defaultRole,
    onOpenChange,
    onSwitchMode,
    onAuthenticated,
}: Props) {
    const isLogin = mode === "login";

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="md"
            backdrop="blur"
            scrollBehavior="inside"
            placement="center"
            classNames={{
                base: "mx-2 sm:mx-auto max-w-[calc(100vw-1rem)] sm:max-w-lg rounded-3xl border border-default-200/60 shadow-2xl bg-content1 max-h-[92vh]",
                wrapper: "items-end sm:items-center",
                body: "px-4 sm:px-6 pb-6 pt-1",
                header: "px-4 sm:px-6 pt-6 pb-2",
            }}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col items-start gap-1 pb-2">
                            <span className="text-xl font-bold tracking-tight">
                                {isLogin ? "Iniciar sesión" : "Crear cuenta"}
                            </span>
                            <span className="text-sm font-normal text-default-500">
                                {isLogin
                                    ? "Accede a tu cuenta de Chivapp"
                                    : "Únete a Chivapp para contratar o ofrecer tus servicios"}
                            </span>
                        </ModalHeader>
                        <ModalBody className="pb-6">
                            {isLogin ? (
                                <LoginForm
                                    key="login"
                                    redirect={redirect}
                                    oauthError={oauthError}
                                    onSwitchToRegister={() => onSwitchMode("register")}
                                    onSuccess={onAuthenticated}
                                />
                            ) : (
                                <RegisterForm
                                    key={`register-${defaultRole ?? "none"}`}
                                    redirect={redirect}
                                    oauthError={oauthError}
                                    defaultRole={defaultRole}
                                    onSwitchToLogin={() => onSwitchMode("login")}
                                    onSuccess={onAuthenticated}
                                />
                            )}
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
