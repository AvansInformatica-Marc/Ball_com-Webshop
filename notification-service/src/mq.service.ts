import { constructFromObjects } from "./app.constants"
import { Event } from "./event.entity"
import { CustomerEvent } from "./customer-event.entity"
import { MailService } from "./mail.service"

export class MqService {
    constructor(
        private mailService: MailService
    ) {}

    async onMessage(message: { event: Event, [key: string]: any }) {
        switch (message.event.eventName) {
            case "CustomerCreated": {
                await this.onCustomerCreated(this.createCustomerEventFromMessage(message))
                break
            }
        }
    }

    private createCustomerEventFromMessage(message: { [key: string]: any }): CustomerEvent {
        return constructFromObjects(CustomerEvent, message)
    }

    async onCustomerCreated(customerEvent: CustomerEvent) {
        await this.mailService.sendMail(
            "noreply@ball.com",
            customerEvent.email!,
            "Welkom bij Ball.com!",
            `<div><h3>${customerEvent.name}, welkom bij Ball.com!</h3><hr><p>Jouw Ball.com account is geactiveerd!</p></div>`
        )
    }
}
