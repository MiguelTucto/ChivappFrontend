import { Icon } from "@iconify/react";

export default function EmptyMusiciansState() {
    return (
        <div className="col-span-full flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon icon="material-symbols:search-off-rounded" width={26} />
            </span>
            <h3 className="text-lg font-bold text-foreground">
                Aún no hay músicos publicados
            </h3>
            <p className="text-default-500 text-sm max-w-sm text-pretty">
                Estamos sumando artistas verificados. Vuelve pronto o
                regístrate para que te avisemos cuando haya disponibilidad.
            </p>
        </div>
    );
}
