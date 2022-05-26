import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsNotEmpty, IsString, IsUUID } from "class-validator"
import { Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm"

export class Event {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    @ApiProperty()
    eventId: string

    @Column()
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    eventName: string

    @CreateDateColumn({
        type: 'timestamp',
        precision: 3
    })
    @IsDateString()
    @ApiProperty()
    eventDate: Date
}
