export type AvailabilityCreate = {
    day_of_week: number;
    start_time: string;
    end_time: string;
};

export type AvailabilityUpdate = Partial<AvailabilityCreate>;

export type AvailabilityOut = AvailabilityCreate & {
    id: string;
    musician_id: string;
    created_at: string;
};
