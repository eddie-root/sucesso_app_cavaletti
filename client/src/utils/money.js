
export function formatCurrency(priceCents){
    if (priceCents === undefined) {
        return (0).toFixed(2)
    } else {
        // return (priceCents).toFixed(2)       
        return (priceCents/100).toFixed(2)       
    }
}

export default formatCurrency;
