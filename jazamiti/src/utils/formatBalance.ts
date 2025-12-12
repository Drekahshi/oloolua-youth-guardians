/**
 * Formats a raw balance into a human-readable string with units.
 * 
 * @param balance - The raw balance (in smallest unit, e.g., Planck)
 * @param decimals - Number of decimal places (default: 12)
 * @param unit - Token symbol (default: 'ONE')
 * @returns Formatted string (e.g., "1.500 ONE")
 */
export const formatBalance = (
    balance: string | number | bigint | undefined | null,
    decimals: number = 12,
    unit: string = 'ONE'
): string => {
    if (balance === undefined || balance === null) {
        return '0 ' + unit;
    }

    const balanceBigInt = BigInt(balance);
    const divisor = BigInt(10 ** decimals);

    const integerPart = balanceBigInt / divisor;
    const fractionalPart = balanceBigInt % divisor;

    // Pad fractional part with leading zeros if necessary
    let fractionalStr = fractionalPart.toString().padStart(decimals, '0');

    // Trim trailing zeros from fractional part
    fractionalStr = fractionalStr.replace(/0+$/, '');

    if (fractionalStr.length > 0) {
        return `${integerPart}.${fractionalStr} ${unit}`;
    }

    return `${integerPart} ${unit}`;
};
