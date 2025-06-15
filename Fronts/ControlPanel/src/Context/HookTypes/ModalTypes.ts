export interface BusinessModal{
    opened: boolean;
    formType: "create" | "edit";
    businessId?: string;
}

export interface BusinessFormData{
    business_name: string;
    business_description?: string;
    business_address1: string;
    business_address2?: string;
    business_country: string;
    business_city: string;
    business_state: string;
    business_phone: string;
    business_email: string;
}