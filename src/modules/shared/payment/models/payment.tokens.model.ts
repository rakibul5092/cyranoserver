export interface PaymentTokensModel {
    owner?: {firstName: string,lastName: string}
    cardNumber: string
    expiry: { month: string, year: string}
    cvc: string
    type?: string
    default?: boolean
}
