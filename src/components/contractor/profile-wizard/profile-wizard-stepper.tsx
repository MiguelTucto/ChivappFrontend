"use client";

import ProfileWizardTimeline from "@/components/profile/profile-wizard-timeline";
import type { ProfileValidationOut } from "@/types/api";
import { CONTRACTOR_WIZARD_STEPS } from "./constants";

type Props = {
    activeStep: number;
    validation: ProfileValidationOut;
    onStepSelect: (index: number) => void;
    rejectionReason?: string | null;
    heading: string;
    subtitle: string;
    badgeLabel?: string;
};

export default function ContractorProfileWizardStepper({
    activeStep,
    validation,
    onStepSelect,
    rejectionReason,
    heading,
    subtitle,
    badgeLabel,
}: Props) {
    return (
        <ProfileWizardTimeline
            steps={CONTRACTOR_WIZARD_STEPS}
            activeStep={activeStep}
            validation={validation}
            onStepSelect={onStepSelect}
            rejectionReason={rejectionReason}
            heading={heading}
            subtitle={subtitle}
            badgeLabel={badgeLabel}
            collapseOnScroll
        />
    );
}

export { CONTRACTOR_WIZARD_STEPS };
