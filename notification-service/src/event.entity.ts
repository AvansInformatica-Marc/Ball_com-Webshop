import { IsDateString, IsNotEmpty, IsString, IsUUID } from "class-validator"

export class Event {
    @IsUUID()
    eventId: string

    @IsString()
    @IsNotEmpty()
    eventName: string

    @IsDateString()
    eventDate: Date
}
