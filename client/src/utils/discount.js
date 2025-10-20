
export function calculateItemDiscount(price, discount1 = 0, discount2 = 0, discount3 = 0, discount4 = 0) {
    if (price === undefined) {
        return 0;
    }

    // Apply first discount
    let discountedPrice = price - (price * (discount1/100));
    // Apply second discount on the already discounted price
    discountedPrice = discountedPrice - (discountedPrice * (discount2/100));
    // Apply second discount on the already discounted price
    discountedPrice = discountedPrice - (discountedPrice * (discount3/100));
    // Apply second discount on the already discounted price
    discountedPrice = discountedPrice - (discountedPrice * (discount4/100));


    return discountedPrice;
}

export default calculateItemDiscount;