"use client";

import { useCallback, useEffect, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    Chip,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Textarea,
    addToast,
    useDisclosure,
} from "@heroui/react";
import AdminPageHeader from "@/components/admin/admin-page-header";
import {
    approveMusicianProfile,
    getAdminMusicians,
    getMusicianAdminDetail,
    moderateMusicianProfile,
    rejectMusicianProfile,
} from "@/lib/admin";
import { formatRelativeTime } from "@/lib/format-time";
import { resolveUploadUrl } from "@/lib/uploads";
import type { MusicianProfileAdminOut, ProfileStatus } from "@/types/api";

const STATUS_OPTIONS = [
    { key: "all", label: "Todos" },
    { key: "pending_review", label: "Pendientes" },
    { key: "published", label: "Publicados" },
    { key: "rejected", label: "Rechazados" },
    { key: "draft", label: "Borradores" },
];

const STATUS_COLOR: Record<
    string,
    "default" | "warning" | "success" | "danger" | "primary"
> = {
    draft: "default",
    pending_review: "warning",
    published: "success",
    rejected: "danger",
};

export default function AdminMusiciansPage() {
    const [profiles, setProfiles] = useState<MusicianProfileAdminOut[]>([]);
    const [selected, setSelected] = useState<MusicianProfileAdminOut | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [status, setStatus] = useState("pending_review");
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(true);
    const rejectModal = useDisclosure();

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAdminMusicians({
                status: status === "all" ? undefined : (status as ProfileStatus),
                q: q.trim() || undefined,
                limit: 100,
            });
            setProfiles(data);
        } catch {
            setProfiles([]);
        } finally {
            setLoading(false);
        }
    }, [q, status]);

    useEffect(() => {
        const t = window.setTimeout(() => {
            void load();
        }, 250);
        return () => window.clearTimeout(t);
    }, [load]);

    async function handleApprove(id: string) {
        await approveMusicianProfile(id);
        addToast({ title: "Perfil aprobado", color: "success" });
        setSelected(null);
        await load();
    }

    async function handleReject() {
        if (!selected) return;
        await rejectMusicianProfile(selected.id, {
            rejection_reason: rejectionReason,
        });
        addToast({ title: "Perfil rechazado", color: "warning" });
        rejectModal.onClose();
        setRejectionReason("");
        setSelected(null);
        await load();
    }

    async function handleModerate(
        id: string,
        action: "unpublish" | "request_resubmit",
    ) {
        await moderateMusicianProfile(id, {
            action,
            reason: rejectionReason || null,
        });
        addToast({
            title: action === "unpublish" ? "Perfil despublicado" : "Reenvío solicitado",
            color: "warning",
        });
        setSelected(null);
        setRejectionReason("");
        await load();
    }

    async function openDetail(id: string) {
        setSelected(await getMusicianAdminDetail(id));
    }

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                title="Moderación de músicos"
                description="Aprueba, rechaza, despublica o solicita correcciones sobre cualquier perfil."
                actions={
                    <Chip color="primary" variant="flat">
                        {profiles.length} resultados
                    </Chip>
                }
            />

            <div className="flex flex-col sm:flex-row gap-3">
                <Input
                    label="Buscar"
                    placeholder="Nombre artístico, email…"
                    value={q}
                    onValueChange={setQ}
                    variant="bordered"
                    className="flex-1"
                />
                <Select
                    label="Estado"
                    selectedKeys={new Set([status])}
                    onSelectionChange={(keys) => {
                        if (keys === "all") return;
                        setStatus(Array.from(keys)[0]?.toString() ?? "all");
                    }}
                    variant="bordered"
                    className="sm:w-56"
                >
                    {STATUS_OPTIONS.map((item) => (
                        <SelectItem key={item.key}>{item.label}</SelectItem>
                    ))}
                </Select>
                <Button color="primary" radius="lg" className="sm:self-end" onPress={load}>
                    Actualizar
                </Button>
            </div>

            {loading ? (
                <div className="h-40 rounded-3xl border border-default-200 animate-pulse" />
            ) : profiles.length === 0 ? (
                <Card className="border border-default-200/70 shadow-soft">
                    <CardBody className="p-8 text-center text-default-500">
                        No hay perfiles con este filtro.
                    </CardBody>
                </Card>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {profiles.map((profile) => (
                        <Card
                            key={profile.id}
                            className="border border-default-200/70 shadow-soft"
                        >
                            <CardBody className="p-6 gap-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="text-xl font-semibold text-foreground truncate">
                                            {profile.stage_name}
                                        </h3>
                                        <p className="text-sm text-default-500 truncate">
                                            {profile.user_fullname} · {profile.user_email}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            color={STATUS_COLOR[profile.status] ?? "default"}
                                        >
                                            {profile.status}
                                        </Chip>
                                        {profile.submitted_at ? (
                                            <span className="text-xs text-default-400">
                                                Enviado {formatRelativeTime(profile.submitted_at)}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                                <p className="text-sm text-default-600 line-clamp-3">
                                    {profile.bio}
                                </p>
                                {profile.status === "rejected" && profile.rejection_reason ? (
                                    <p className="text-sm text-danger">
                                        Motivo del rechazo: {profile.rejection_reason}
                                    </p>
                                ) : null}
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        size="sm"
                                        variant="flat"
                                        onPress={() => openDetail(profile.id)}
                                    >
                                        Ver detalle
                                    </Button>
                                    {profile.status === "pending_review" ||
                                    profile.status === "rejected" ? (
                                        <Button
                                            size="sm"
                                            color="success"
                                            onPress={() => handleApprove(profile.id)}
                                        >
                                            Aprobar
                                        </Button>
                                    ) : null}
                                    {profile.status === "pending_review" ||
                                    profile.status === "published" ? (
                                        <Button
                                            size="sm"
                                            color="danger"
                                            variant="flat"
                                            onPress={() => {
                                                setSelected(profile);
                                                rejectModal.onOpen();
                                            }}
                                        >
                                            Rechazar
                                        </Button>
                                    ) : null}
                                    {profile.status === "published" ? (
                                        <Button
                                            size="sm"
                                            color="warning"
                                            variant="flat"
                                            onPress={() =>
                                                handleModerate(profile.id, "unpublish")
                                            }
                                        >
                                            Despublicar
                                        </Button>
                                    ) : null}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            {selected && !rejectModal.isOpen ? (
                <Card className="border border-default-200/70 shadow-soft">
                    <CardBody className="p-6 gap-4">
                        <div className="flex items-start justify-between gap-3">
                            <h3 className="text-2xl font-semibold text-foreground min-w-0 truncate">
                                {selected.stage_name}
                            </h3>
                            <Button
                                size="sm"
                                variant="light"
                                className="shrink-0"
                                onPress={() => setSelected(null)}
                            >
                                Cerrar
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-default-600">
                            <p>
                                <strong className="text-foreground">Ciudad:</strong>{" "}
                                {selected.location_city}
                            </p>
                            <p>
                                <strong className="text-foreground">Zona:</strong>{" "}
                                {selected.location_zone}
                            </p>
                            <p>
                                <strong className="text-foreground">Géneros:</strong>{" "}
                                {selected.genres.join(", ")}
                            </p>
                            <p>
                                <strong className="text-foreground">Instrumentos:</strong>{" "}
                                {selected.instruments.join(", ")}
                            </p>
                        </div>
                        {selected.id_document_url ? (
                            <a
                                href={resolveUploadUrl(selected.id_document_url) ?? "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary underline text-sm"
                            >
                                Ver documento de identidad
                            </a>
                        ) : null}
                        {selected.contract_pdf_url ? (
                            <a
                                href={resolveUploadUrl(selected.contract_pdf_url) ?? "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary underline text-sm"
                            >
                                Ver contrato PDF
                            </a>
                        ) : null}
                        {selected.status === "published" ? (
                            <div className="flex flex-wrap gap-2 pt-2">
                                <Button
                                    size="sm"
                                    color="warning"
                                    variant="flat"
                                    onPress={() =>
                                        handleModerate(selected.id, "unpublish")
                                    }
                                >
                                    Despublicar
                                </Button>
                                <Button
                                    size="sm"
                                    color="secondary"
                                    variant="flat"
                                    onPress={() =>
                                        handleModerate(selected.id, "request_resubmit")
                                    }
                                >
                                    Pedir reenvío
                                </Button>
                            </div>
                        ) : null}
                    </CardBody>
                </Card>
            ) : null}

            <Modal isOpen={rejectModal.isOpen} onOpenChange={rejectModal.onOpenChange}>
                <ModalContent>
                    <ModalHeader>Rechazar perfil</ModalHeader>
                    <ModalBody>
                        <Textarea
                            label="Motivo del rechazo"
                            value={rejectionReason}
                            onValueChange={setRejectionReason}
                            variant="bordered"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={rejectModal.onClose}>
                            Cancelar
                        </Button>
                        <Button color="danger" onPress={handleReject}>
                            Rechazar perfil
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
