import { redirect } from "next/navigation";

/** Legacy path: egresos unificados en Operaciones. */
export default function ContractorExpensesRedirectPage() {
    redirect("/contractor/operations");
}
