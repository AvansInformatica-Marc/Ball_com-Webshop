import { validate } from "class-validator";

export const validationOptions = {
    transform: true,
    whitelist: true
}

export const MQ_EXCHANGE = process.env["MQ_EXCHANGE"] ?? "ball"

export const MQ_ROUTING_KEY = ""

type ConstructorType<T> = new (...args : any[]) => T;

export const constructFromObjects = <T extends object>(objectClass: ConstructorType<T>, ...sources: any[]): T => {
    const tmp = new objectClass()
    Object.assign(tmp, ...sources)
    validate(tmp, validationOptions)
    return tmp
}
