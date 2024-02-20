import { BasicRestSettings } from "syshub-rest-module";

export type MyEnvironment = {
    syshub: BasicRestSettings
}

export const environment: MyEnvironment = {
    syshub: {
        host: "/",
        basic: {
            enabled: true,
            username: "<basic username>",
            password: "<basic password>",
            provider: "<basic api provider>",
        },
        throwErrors: false
    }
};