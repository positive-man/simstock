/**
 * @author wookjae.jo
 */

export const numberWithCommas = (n: number) => {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}