import { Transmit } from '@adonisjs/transmit-client'

class TransmitStore {
    declare instance: Transmit
    private baseUrl: string

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    public createInstance(baseUrl?: string) {
        if (baseUrl) {
            this.baseUrl = baseUrl
        }

        this.instance = new Transmit({ baseUrl: this.baseUrl })
    }
}

export const transmit = new TransmitStore('')
