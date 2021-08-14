import {Role} from "./role";
import {ShirtSize} from "./shirt-size";
import {ShirtType} from "./shirt-type.enum";
import {City} from "./city.enum";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roles: Role[];
    shirtSize: ShirtSize;
    shirtType: ShirtType;
    city: City;
    polishSpeaker: boolean;
    enabled: boolean;
    deleted: boolean;
    foodPreferences?: string;
}
