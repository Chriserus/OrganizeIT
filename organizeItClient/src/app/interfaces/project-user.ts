import {User} from "./user.model";
import {Project} from "./project.model";

export interface ProjectUser {
    project: Project;
    user: User;
    approved: boolean;
    created?: string;
    modified?: string;
}
