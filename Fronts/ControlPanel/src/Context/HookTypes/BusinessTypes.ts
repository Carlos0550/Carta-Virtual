import type React from "react";
import type { BusinessModal } from "./ModalTypes";
import type { SetStateAction } from "react";

export interface BusinessFormData {
  business_name: string;
  business_description: string;
  business_address1: string;
  countryCode: string;
  regionCode: string;
  city: string;
  business_phone: string;
  business_email: string;
}

interface BusinessGeodata{
  address1: string,
  country: {
    code : string;
    label: string;
  },
  region: {
    code: string;
    label: string;
  },
  city:{
    name: string;
    label: string;
  }
}

export interface BusinessData{
  business_id: string;
  business_name: string;
  business_description: string;
  business_geodata: BusinessGeodata;
  business_phone: string;
  business_email: string;
  business_banner: string
}

export interface HandleEditBInfo{
  businessData: BusinessData,
  setBusinessModal: React.Dispatch<SetStateAction<BusinessModal | null>>,
  CloseBusinessModal: () => void
}