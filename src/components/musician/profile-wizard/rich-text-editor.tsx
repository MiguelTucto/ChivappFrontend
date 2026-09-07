"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { Extension, Mark, mergeAttributes } from "@tiptap/core";
import { Button, Select, SelectItem, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { ContractPlaceholder } from "@/lib/contract-templates";

/** Imagen/logo con ancho ajustable (no viene por defecto en la extensión base). */
const ContractImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: "220px",
                parseHTML: (element: HTMLElement) => element.style.width || element.getAttribute("width"),
                renderHTML: (attributes: { width?: string | null }) => {
                    if (!attributes.width) return {};
                    return { style: `width: ${attributes.width}; max-width: 100%; height: auto;` };
                },
            },
        };
    },
});

const IMAGE_SIZE_OPTIONS = [
    { key: "140px", label: "Pequeño" },
    { key: "220px", label: "Mediano" },
    { key: "360px", label: "Grande" },
    { key: "100%", label: "Ancho completo" },
];

/** Habilita `fontSize` como atributo del mark `textStyle` (no viene por defecto). */
const FontSize = Extension.create({
    name: "fontSize",
    addOptions() {
        return { types: ["textStyle"] };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: (element: HTMLElement) => element.style.fontSize || null,
                        renderHTML: (attributes: { fontSize?: string | null }) => {
                            if (!attributes.fontSize) return {};
                            return { style: `font-size: ${attributes.fontSize}` };
                        },
                    },
                },
            },
        ];
    },
});

/** Marca en línea usada para resaltar variables `{{clave}}` dentro del documento. */
const ContractVariable = Mark.create({
    name: "contractVariable",
    inclusive: false,
    parseHTML() {
        return [{ tag: "span[data-contract-variable]" }];
    },
    renderHTML({ HTMLAttributes }) {
        return [
            "span",
            mergeAttributes(HTMLAttributes, {
                "data-contract-variable": "true",
                class: "contract-variable",
            }),
            0,
        ];
    },
});

const HEADING_OPTIONS = [
    { key: "paragraph", label: "Párrafo" },
    { key: "h1", label: "Título 1" },
    { key: "h2", label: "Título 2" },
    { key: "h3", label: "Subtítulo" },
];

const FONT_SIZE_OPTIONS = [
    { key: "10pt", label: "Pequeño" },
    { key: "", label: "Normal" },
    { key: "13pt", label: "Mediano" },
    { key: "16pt", label: "Grande" },
    { key: "20pt", label: "Muy grande" },
];

const FONT_FAMILY_OPTIONS = [
    { key: "", label: "Predeterminada" },
    { key: "Helvetica, Arial, sans-serif", label: "Sans serif" },
    { key: "'Times New Roman', Times, serif", label: "Serif" },
    { key: "'Courier New', Courier, monospace", label: "Monoespaciada" },
];

const TEXT_COLORS = [
    { value: "", label: "Por defecto", swatch: "#374151" },
    { value: "#111827", label: "Negro", swatch: "#111827" },
    { value: "#b91c1c", label: "Rojo", swatch: "#b91c1c" },
    { value: "#1d4ed8", label: "Azul", swatch: "#1d4ed8" },
    { value: "#047857", label: "Verde", swatch: "#047857" },
    { value: "#a16207", label: "Ámbar", swatch: "#a16207" },
];

type ToolbarButtonProps = {
    icon: string;
    label: string;
    isActive?: boolean;
    isDisabled?: boolean;
    onPress: () => void;
};

function ToolbarButton({ icon, label, isActive, isDisabled, onPress }: ToolbarButtonProps) {
    return (
        <Button
            type="button"
            isIconOnly
            size="sm"
            variant={isActive ? "solid" : "light"}
            color={isActive ? "primary" : "default"}
            isDisabled={isDisabled}
            onPress={onPress}
            title={label}
            aria-label={label}
        >
            <Icon icon={icon} width={18} />
        </Button>
    );
}

type Props = {
    value: string;
    onChange: (html: string) => void;
    placeholders: ContractPlaceholder[];
    placeholderHint?: string;
    /** Incrementa este valor para forzar que el editor recargue `value` (p. ej. al aplicar una plantilla). */
    syncKey?: number;
};

export default function RichTextEditor({
    value,
    onChange,
    placeholders,
    placeholderHint,
    syncKey,
}: Props) {
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            TextStyle,
            Color,
            FontFamily,
            FontSize,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            ContractImage.configure({ inline: true }),
            Placeholder.configure({
                placeholder: "Escribe el contenido de tu contrato…",
            }),
            ContractVariable,
        ],
        content: value,
        onUpdate: ({ editor: instance }) => {
            onChange(instance.getHTML());
        },
        editorProps: {
            attributes: {
                class: "contract-doc contract-doc-editor",
            },
        },
    });

    const isFirstSync = useRef(true);
    useEffect(() => {
        if (isFirstSync.current) {
            isFirstSync.current = false;
            return;
        }
        if (editor && !editor.isDestroyed) {
            editor.commands.setContent(value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [syncKey]);

    function insertPlaceholder(key: string) {
        if (!editor) return;
        editor
            .chain()
            .focus()
            .insertContent({
                type: "text",
                marks: [{ type: "contractVariable" }],
                text: key,
            })
            .insertContent(" ")
            .run();
    }

    function handleInsertImageClick() {
        imageInputRef.current?.click();
    }

    async function handleImageFileSelected(file: File | null) {
        if (!file || !editor) return;
        setIsUploadingImage(true);
        try {
            const { uploadFile, resolveUploadUrl } = await import("@/lib/uploads");
            const url = await uploadFile(file);
            editor
                .chain()
                .focus()
                .setImage({ src: resolveUploadUrl(url) ?? url })
                .run();
        } catch {
            addToast({
                title: "Error al subir imagen",
                description: "No se pudo cargar la imagen o el logo.",
                color: "danger",
            });
        } finally {
            setIsUploadingImage(false);
        }
    }

    if (!editor) {
        return (
            <div className="h-80 rounded-2xl border border-default-200 bg-default-100 animate-pulse" />
        );
    }

    const activeHeading = editor.isActive("heading", { level: 1 })
        ? "h1"
        : editor.isActive("heading", { level: 2 })
          ? "h2"
          : editor.isActive("heading", { level: 3 })
            ? "h3"
            : "paragraph";

    return (
        <div className="flex flex-col gap-3">
            <div className="rounded-2xl border border-default-200 bg-content1 overflow-hidden">
                <div className="flex flex-wrap items-center gap-1.5 bg-default-50 p-2">
                    <Select
                        aria-label="Estilo de texto"
                        size="sm"
                        className="w-[130px]"
                        selectedKeys={[activeHeading]}
                        onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0]?.toString();
                            if (!selected) return;
                            const chain = editor.chain().focus();
                            if (selected === "paragraph") {
                                chain.setParagraph().run();
                            } else {
                                const level = Number(selected.replace("h", "")) as 1 | 2 | 3;
                                chain.setHeading({ level }).run();
                            }
                        }}
                    >
                        {HEADING_OPTIONS.map((option) => (
                            <SelectItem key={option.key}>{option.label}</SelectItem>
                        ))}
                    </Select>

                    <div className="w-px self-stretch bg-default-200 mx-1" />

                    <ToolbarButton
                        icon="material-symbols:format-bold"
                        label="Negrita"
                        isActive={editor.isActive("bold")}
                        onPress={() => editor.chain().focus().toggleBold().run()}
                    />
                    <ToolbarButton
                        icon="material-symbols:format-italic"
                        label="Cursiva"
                        isActive={editor.isActive("italic")}
                        onPress={() => editor.chain().focus().toggleItalic().run()}
                    />
                    <ToolbarButton
                        icon="material-symbols:format-underlined"
                        label="Subrayado"
                        isActive={editor.isActive("underline")}
                        onPress={() => editor.chain().focus().toggleUnderline().run()}
                    />
                    <ToolbarButton
                        icon="material-symbols:strikethrough-s"
                        label="Tachado"
                        isActive={editor.isActive("strike")}
                        onPress={() => editor.chain().focus().toggleStrike().run()}
                    />

                    <div className="w-px self-stretch bg-default-200 mx-1" />

                    <ToolbarButton
                        icon="material-symbols:format-align-left"
                        label="Alinear izquierda"
                        isActive={editor.isActive({ textAlign: "left" })}
                        onPress={() => editor.chain().focus().setTextAlign("left").run()}
                    />
                    <ToolbarButton
                        icon="material-symbols:format-align-center"
                        label="Centrar"
                        isActive={editor.isActive({ textAlign: "center" })}
                        onPress={() => editor.chain().focus().setTextAlign("center").run()}
                    />
                    <ToolbarButton
                        icon="material-symbols:format-align-right"
                        label="Alinear derecha"
                        isActive={editor.isActive({ textAlign: "right" })}
                        onPress={() => editor.chain().focus().setTextAlign("right").run()}
                    />
                    <ToolbarButton
                        icon="material-symbols:format-align-justify"
                        label="Justificar"
                        isActive={editor.isActive({ textAlign: "justify" })}
                        onPress={() => editor.chain().focus().setTextAlign("justify").run()}
                    />

                    <div className="w-px self-stretch bg-default-200 mx-1" />

                    <ToolbarButton
                        icon="material-symbols:format-list-bulleted"
                        label="Lista con viñetas"
                        isActive={editor.isActive("bulletList")}
                        onPress={() => editor.chain().focus().toggleBulletList().run()}
                    />
                    <ToolbarButton
                        icon="material-symbols:format-list-numbered"
                        label="Lista numerada"
                        isActive={editor.isActive("orderedList")}
                        onPress={() => editor.chain().focus().toggleOrderedList().run()}
                    />
                    <ToolbarButton
                        icon="material-symbols:format-quote"
                        label="Cita"
                        isActive={editor.isActive("blockquote")}
                        onPress={() => editor.chain().focus().toggleBlockquote().run()}
                    />
                    <ToolbarButton
                        icon="material-symbols:horizontal-rule"
                        label="Línea divisoria"
                        onPress={() => editor.chain().focus().setHorizontalRule().run()}
                    />

                    <div className="w-px self-stretch bg-default-200 mx-1" />

                    <ToolbarButton
                        icon="material-symbols:add-photo-alternate-outline"
                        label="Insertar logo o imagen"
                        isDisabled={isUploadingImage}
                        onPress={handleInsertImageClick}
                    />
                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/svg+xml"
                        className="hidden"
                        onChange={(event) => {
                            const file = event.target.files?.[0] ?? null;
                            void handleImageFileSelected(file);
                            event.target.value = "";
                        }}
                    />
                    {editor.isActive("image") ? (
                        <Select
                            aria-label="Tamaño de la imagen"
                            size="sm"
                            className="w-[150px]"
                            placeholder="Tamaño de imagen"
                            selectedKeys={
                                editor.getAttributes("image").width
                                    ? [editor.getAttributes("image").width]
                                    : []
                            }
                            onSelectionChange={(keys) => {
                                const selected = Array.from(keys)[0]?.toString();
                                if (!selected) return;
                                editor
                                    .chain()
                                    .focus()
                                    .updateAttributes("image", { width: selected })
                                    .run();
                            }}
                        >
                            {IMAGE_SIZE_OPTIONS.map((option) => (
                                <SelectItem key={option.key}>{option.label}</SelectItem>
                            ))}
                        </Select>
                    ) : null}

                    <div className="w-px self-stretch bg-default-200 mx-1" />

                    <Select
                        aria-label="Tamaño de fuente"
                        size="sm"
                        className="w-[120px]"
                        placeholder="Tamaño"
                        onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0]?.toString();
                            if (selected === undefined) return;
                            const chain = editor.chain().focus();
                            if (selected) {
                                chain.setMark("textStyle", { fontSize: selected }).run();
                            } else {
                                chain.setMark("textStyle", { fontSize: null }).run();
                            }
                        }}
                    >
                        {FONT_SIZE_OPTIONS.map((option) => (
                            <SelectItem key={option.key}>{option.label}</SelectItem>
                        ))}
                    </Select>

                    <Select
                        aria-label="Tipo de letra"
                        size="sm"
                        className="w-[150px]"
                        placeholder="Fuente"
                        onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0]?.toString();
                            if (selected === undefined) return;
                            const chain = editor.chain().focus();
                            if (selected) {
                                chain.setFontFamily(selected).run();
                            } else {
                                chain.unsetFontFamily().run();
                            }
                        }}
                    >
                        {FONT_FAMILY_OPTIONS.map((option) => (
                            <SelectItem key={option.key}>{option.label}</SelectItem>
                        ))}
                    </Select>

                    <div className="w-px self-stretch bg-default-200 mx-1" />

                    <div className="flex items-center gap-1">
                        {TEXT_COLORS.map((color) => (
                            <button
                                key={color.label}
                                type="button"
                                title={color.label}
                                aria-label={color.label}
                                onClick={() => {
                                    const chain = editor.chain().focus();
                                    if (color.value) {
                                        chain.setColor(color.value).run();
                                    } else {
                                        chain.unsetColor().run();
                                    }
                                }}
                                className="size-6 rounded-full border border-default-300 shrink-0"
                                style={{ backgroundColor: color.swatch }}
                            />
                        ))}
                    </div>

                    <div className="w-px self-stretch bg-default-200 mx-1" />

                    <ToolbarButton
                        icon="material-symbols:format-clear"
                        label="Limpiar formato"
                        onPress={() =>
                            editor.chain().focus().unsetAllMarks().clearNodes().run()
                        }
                    />

                    <div className="flex-1" />

                    <ToolbarButton
                        icon="material-symbols:undo"
                        label="Deshacer"
                        isDisabled={!editor.can().undo()}
                        onPress={() => editor.chain().focus().undo().run()}
                    />
                    <ToolbarButton
                        icon="material-symbols:redo"
                        label="Rehacer"
                        isDisabled={!editor.can().redo()}
                        onPress={() => editor.chain().focus().redo().run()}
                    />
                </div>

            </div>

            <p className="text-xs text-default-500 -mt-1">
                Esta hoja es exactamente como se verá tu contrato: edita el título, el texto, los
                colores y agrega tu logo directamente aquí.
            </p>

            <div className="rounded-3xl border border-default-200/70 bg-default-100 p-2 sm:p-4 md:p-6 overflow-x-auto">
                <div className="contract-doc-page mx-auto w-full max-w-[720px] min-w-[280px] min-h-[640px] sm:min-h-[880px] rounded-xl shadow-lg px-5 py-8 sm:px-10 sm:py-12 md:px-14 md:py-16">
                    <EditorContent editor={editor} />
                </div>
            </div>

            <div>
                <p className="text-sm font-medium mb-2">Campos dinámicos</p>
                {placeholderHint ? (
                    <p className="text-xs text-default-500 mb-3">{placeholderHint}</p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                    {placeholders.map((placeholder) => (
                        <Button
                            key={placeholder.key}
                            type="button"
                            size="sm"
                            variant="bordered"
                            className="text-xs"
                            onPress={() => insertPlaceholder(placeholder.key)}
                        >
                            {placeholder.label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
