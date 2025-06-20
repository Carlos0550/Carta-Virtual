import type { BusinessData } from "./BusinessTypes";

export interface BusinessModal{
    opened: boolean;
    formType?: "create" | "edit";
    editBusinessData?: BusinessData
}


