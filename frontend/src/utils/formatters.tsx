/**
* Định dạng số theo đơn vị tiền tệ Đồng Việt Nam (VND)
* @param amount - Số tiền cần định dạng
* @returns Chuỗi được định dạng theo đơn vị tiền tệ VND
*/
export const formatVND = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) {
    return "0 ₫";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

/**
* Định dạng số theo đơn vị tiền tệ Đồng Việt Nam (đồng)
* @param money - Số tiền cần định dạng
* @returns Chuỗi được định dạng theo đơn vị tiền tệ VNĐ
*/
export const formatNumber = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) {
    return "0";
  }

  return new Intl.NumberFormat("vi-VN").format(amount);
};
