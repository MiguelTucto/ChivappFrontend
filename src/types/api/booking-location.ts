export type LiveLocationCoords = {
    lat: number;
    lng: number;
    accuracy?: number | null;
};

export type LiveLocationEventPoint = {
    lat: number | null;
    lng: number | null;
    address: string | null;
    city: string | null;
};

export type LiveLocationParticipantRole =
    | "leader"
    | "member"
    | "contractor"
    | string;

export type LiveLocationParticipantOut = {
    user_id: string;
    role: LiveLocationParticipantRole;
    display_name: string;
    is_me: boolean;
    sharing: boolean;
    lat: number | null;
    lng: number | null;
    accuracy: number | null;
    updated_at: string | null;
    visible: boolean;
    pending_request: boolean;
    requested_by_me: boolean;
};

export type LiveLocationSessionOut = {
    booking_id: string;
    sharing_count: number;
    event: LiveLocationEventPoint;
    me: LiveLocationParticipantOut;
    participants: LiveLocationParticipantOut[];
};

export type LiveLocationPingOut = {
    id: string;
    booking_id: string;
    user_id: string | null;
    party: string;
    action: string;
    lat: number | null;
    lng: number | null;
    accuracy: number | null;
    created_at: string;
};

/** @deprecated kept for older imports */
export type LiveLocationPartyOut = LiveLocationParticipantOut;
