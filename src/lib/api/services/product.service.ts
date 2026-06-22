// @ts-nocheck
import axios from 'axios';
import { getAccessToken } from '../client';

const BASE_URL = 'https://preview-rls09.congacloud.com/api/data/v1/query';

export const getParentProduct = async (childProduct: unknown) => {
  const accessToken = getAccessToken();
  try {
    const body = {
      Criteria: `ComponentProduct.Name='${(childProduct as any).Name}'`,
      Select: ['Id', 'Name', 'ParentProduct.Name', 'ParentProduct.Id', 'ParentProduct'],
    };
    const response = await axios.post(`${BASE_URL}/ProductOptionComponent`, body, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    });
    if (response.data?.Success && response.data.Data?.length > 0) {
      const temp = response.data.Data;
      return temp.filter((item: any) => item.ParentProduct).map((item: any) => ({
        Id: item.ParentProduct.Id,
        Name: item.ParentProduct.Name,
        ChildProductId: (childProduct as any).Id,
        ChildProductName: (childProduct as any).Name,
        ChildProductCode: (childProduct as any)?.ProductCode,
      }));
    }
    return null;
  } catch (err: any) {
    console.error('GetParentProduct error:', err?.response?.data?.Errors || err);
    return null;
  }
};

export const getProductsByParent = async (parentProductId: unknown) => {
  const accessToken = getAccessToken();
  try {
    const body = {
      Criteria: `Id='${(parentProductId as any).Id}' AND IsActive=true`,
      Select: ['Id', 'Name', 'ProductCode', 'APTS_Discountable_c'],
    };
    const response = await axios.post(`${BASE_URL}/Product`, body, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    });
    const temp = response.data.Data;
    return temp.map((item: any) => ({
      Id: item.Id,
      Name: item.Name,
      ProductCode: item.ProductCode,
      ChildId: (parentProductId as any).ChildProductId,
      ChildName: (parentProductId as any).ChildProductName,
      ChildProductCode: (parentProductId as any)?.ChildProductCode,
      IsDiscountable: item.APTS_Discountable_c,
    }));
  } catch (err) { console.error('getProductsByParent error:', err); return []; }
};
