"use client";

import Image from "next/image";
import { Modal, ModalBody, ModalContent } from "@heroui/react";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    src: string | null;
    alt?: string;
};

export default function ImageLightboxModal({
    isOpen,
    onOpenChange,
    src,
    alt = "Imagen ampliada",
}: Props) {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="5xl"
            backdrop="blur"
            placement="center"
            scrollBehavior="inside"
            classNames={{
                base: "bg-transparent shadow-none",
                closeButton:
                    "z-20 text-white bg-black/50 hover:bg-black/70 top-2 right-2",
                body: "p-0 overflow-hidden",
            }}
        >
            <ModalContent>
                {() => (
                    <ModalBody>
                        <div className="relative w-full max-h-[85vh] min-h-[40vh] flex items-center justify-center bg-black/90 rounded-2xl overflow-hidden">
                            {isOpen && src ? (
                                <Image
                                    src={src}
                                    alt={alt}
                                    width={1600}
                                    height={1200}
                                    className="max-h-[85vh] w-auto h-auto object-contain"
                                    sizes="100vw"
                                    priority
                                />
                            ) : null}
                        </div>
                    </ModalBody>
                )}
            </ModalContent>
        </Modal>
    );
}
