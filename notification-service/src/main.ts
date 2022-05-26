import { MailService } from "./mail.service"
import { MqService } from "./mq.service"
import amqp, { Channel } from "amqp-connection-manager"
import { MQ_EXCHANGE, MQ_ROUTING_KEY } from "./app.constants"

async function main() {
    const connection = amqp.connect(process.env["MQ_URL"])

    const mailService = new MailService()
    const mqService = new MqService(mailService)

    connection.createChannel({
        json: true,
        setup: async (channel: Channel) => {
            return await Promise.all([
                channel.assertQueue("notifications"),
                channel.bindQueue("notifications", MQ_EXCHANGE, MQ_ROUTING_KEY),
                channel.consume("notifications", async (message) => {
                    if (message) {
                        try {
                            await mqService.onMessage(JSON.parse(message.content.toString()))
                            channel.ack(message)
                        } catch (error) {
                            console.warn(error)
                            channel.nack(message)
                        }
                    }
                })
            ])
        }
    })
}

main()
