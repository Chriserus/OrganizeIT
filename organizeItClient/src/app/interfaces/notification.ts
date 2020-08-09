import {User} from "./user.model";

export interface Notification {
    id: number;
    title: string;
    body: string;
    recipient?: User;
    created?: string;
}
