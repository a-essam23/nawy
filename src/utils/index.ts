export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatArea = (area: number) => {
  // return area + " m²";
  return area.toLocaleString("en-US") + " m²"; // 1,000,000 forma
};

export function debounce<F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): (...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), waitFor);
  };
}
