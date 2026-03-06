import { CompanyPayload } from "@/services/company.service";

// ─── Companies Reducer ───────────────────────────────────────────────────────

export interface Company {
  id: number;
  uuid: string;
  name: string;
  location: string;
  logo: string | null;
  jobs: any[];
}

export interface CompaniesResponse {
  success: boolean;
  data: Company[];
  pagination?: { total: number; totalPages: number };
}

export interface CompaniesState {
  search: string;
  currentPage: number;
  isModalOpen: boolean;
  currentCompany: Partial<Company> | null;
  formData: CompanyPayload;
}

export type CompaniesAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_PAGE"; payload: number }
  | { type: "OPEN_MODAL"; payload?: Company }
  | { type: "CLOSE_MODAL" }
  | { type: "SET_FORM_FIELD"; field: keyof CompanyPayload; value: string };

const initialFormData: CompanyPayload = { name: "", location: "", logo: "" };

export const initialCompaniesState: CompaniesState = {
  search: "",
  currentPage: 1,
  isModalOpen: false,
  currentCompany: null,
  formData: initialFormData,
};

export function companiesReducer(
  state: CompaniesState,
  action: CompaniesAction,
): CompaniesState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload, currentPage: 1 };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "OPEN_MODAL":
      return {
        ...state,
        isModalOpen: true,
        currentCompany: action.payload || null,
        formData: action.payload
          ? {
              name: action.payload.name,
              location: action.payload.location,
              logo: action.payload.logo || "",
            }
          : initialFormData,
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        isModalOpen: false,
        currentCompany: null,
        formData: initialFormData,
      };
    case "SET_FORM_FIELD":
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
      };
    default:
      return state;
  }
}
