import Image from "next/image";

type Props = {
    /** Alto del logo en px (el ancho se ajusta según el aspect ratio real). */
    height?: number;
    className?: string;
    priority?: boolean;
};

const LOGO_ASPECT_RATIO = 900 / 287;

export default function AppLogo({ height = 28, className, priority }: Props) {
    return (
        <Image
            src="/logo-chivapp.png"
            alt="Chivapp"
            width={Math.round(height * LOGO_ASPECT_RATIO)}
            height={height}
            priority={priority}
            className={className}
        />
    );
}
