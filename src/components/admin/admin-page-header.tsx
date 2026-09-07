type Props = {
    title: string;
    description: string;
    actions?: React.ReactNode;
};

export default function AdminPageHeader({ title, description, actions }: Props) {
    return (
        <div className="rounded-4xl border border-default-200/70 bg-gradient-to-br from-primary/15 via-content1 to-content1 px-4 py-5 sm:px-6 sm:py-6 shadow-soft overflow-hidden relative">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="min-w-0">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                        {title}
                    </h2>
                    <p className="text-default-500 mt-2 max-w-2xl text-sm sm:text-base">
                        {description}
                    </p>
                </div>
                {actions ? <div className="shrink-0">{actions}</div> : null}
            </div>
        </div>
    );
}
