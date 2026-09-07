import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

type Props = {
    label: string;
    value: string | number;
    icon?: string;
    hint?: string;
    tone?: "default" | "warning" | "success" | "danger" | "primary";
};

const TONE: Record<NonNullable<Props["tone"]>, string> = {
    default: "text-foreground",
    warning: "text-warning",
    success: "text-success",
    danger: "text-danger",
    primary: "text-primary",
};

export default function AdminStatCard({
    label,
    value,
    icon,
    hint,
    tone = "default",
}: Props) {
    return (
        <Card className="border border-default-200/70 shadow-soft">
            <CardBody className="p-5 gap-2">
                <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-default-500">{label}</p>
                    {icon ? (
                        <Icon icon={icon} width={20} className="text-default-400 shrink-0" />
                    ) : null}
                </div>
                <p className={`text-3xl font-bold tracking-tight ${TONE[tone]}`}>
                    {value}
                </p>
                {hint ? <p className="text-xs text-default-400">{hint}</p> : null}
            </CardBody>
        </Card>
    );
}
