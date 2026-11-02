// Printdoors Open API Service for KIUIXSHOP
// Official Documentation: https://doc.printdoors.com/web/#/637765744/264741693

export interface PrintdoorsConfig {
  appKey: string;
  appSecret: string;
  storeId?: string;
  logisticsPlatformId?: string;
  autoFulfill: boolean;
  connected: boolean;
  lastSync?: string;
}

export interface PrintdoorsProduct {
  id: number;
  code: string;
  en_name: string;
  basic_product_id: number;
  status: number;
  show_master_image: string;
  colors?: { id: number; en_name: string; tone: string }[];
  sizes?: { id: number; en_name: string }[];
}

const STORAGE_KEY = 'kiuix_printdoors_config';
const BASE_URL = 'https://openapi.printdoors.com';

export const getPrintdoorsConfig = (): PrintdoorsConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to read Printdoors config from storage', e);
  }
  return {
    appKey: '',
    appSecret: '',
    storeId: '',
    logisticsPlatformId: '774',
    autoFulfill: true,
    connected: false,
  };
};

export const savePrintdoorsConfig = (config: PrintdoorsConfig) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

/**
 * Authenticate with Printdoors Open API using app_key and app_secret
 * Endpoint: POST /open/v1/accessToken
 */
export const authenticatePrintdoors = async (appKey: string, appSecret: string): Promise<{ success: boolean; token?: string; error?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/open/v1/accessToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        app_key: appKey.trim(),
        app_secret: appSecret.trim(),
      }),
    });

    const resJson = await response.json();
    if (resJson.status_code === 200 && resJson.data?.token) {
      return { success: true, token: resJson.data.token };
    }
    return { success: false, error: resJson.msg || 'Invalid app_key or app_secret.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error connecting to Printdoors API' };
  }
};

/**
 * Fetch products list from Printdoors
 * Endpoint: GET /open/v1/product
 */
export const fetchPrintdoorsProducts = async (token: string): Promise<{ success: boolean; products?: PrintdoorsProduct[]; error?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/open/v1/product?page=1&per_page=50`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resJson = await response.json();
    if (resJson.status_code === 200 && resJson.data?.data) {
      return { success: true, products: resJson.data.data };
    }
    return { success: false, error: resJson.msg || 'Failed to fetch products' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to reach Printdoors API' };
  }
};

/**
 * Send an order to Printdoors for automatic print on demand & delivery
 * Endpoint: POST /open/v1/order
 */
export const sendOrderToPrintdoors = async (
  token: string,
  orderData: {
    thirdOrderId: string;
    storeId: number;
    logisticsPlatformId: number;
    customer: {
      firstName: string;
      lastName?: string;
      country: string;
      province: string;
      city: string;
      postcode: string;
      mobilePhone: string;
      address: string;
    };
    items: {
      productId: number;
      num: number;
      sizeId?: number;
      colorId?: number;
      imageUrl?: string;
    }[];
  }
) => {
  try {
    const payload = {
      third_order_id: orderData.thirdOrderId,
      platform: 99, // 99: Other / Custom Store
      store_id: orderData.storeId,
      logistics_platform_id: orderData.logisticsPlatformId,
      address: {
        firstname: orderData.customer.firstName,
        lastname: orderData.customer.lastName || '',
        country: orderData.customer.country || 'US',
        province: orderData.customer.province || 'CA',
        city: orderData.customer.city || 'Los Angeles',
        postcode: orderData.customer.postcode || '90001',
        mobile_phone: orderData.customer.mobilePhone || '+1000000000',
        address: orderData.customer.address || 'Street address',
      },
      items: orderData.items.map((it) => ({
        third_product_id: String(it.productId),
        third_product_image_url: it.imageUrl || '',
        product_id: it.productId,
        num: it.num,
        size_id: it.sizeId || 0,
        color_id: it.colorId || 0,
      })),
    };

    const response = await fetch(`${BASE_URL}/open/v1/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const resJson = await response.json();
    return resJson;
  } catch (err: any) {
    return { status_code: 500, msg: err.message };
  }
};
