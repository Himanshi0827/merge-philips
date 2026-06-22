export interface ValidateCartData {
    CountryCode?: string;
    Errors: string[];
    Warnings: string[];
    IsException?: boolean;
    IsPricePending?: boolean;
    QuoteName?: string;
    IsSVOPConfig?: boolean;
  }
  
  export interface ValidateCartResponse {
    Success: boolean;
    Data: ValidateCartData;
    StatusCode: number;
    Errors: string[];
  }