import { Env } from "syshub-rest-module";

export const environment: Env = {
    variant: "environment.ts",
    syshub: {
        host: "http://localhost:8088/",
        basic: {
            enabled: false,
            username: "foo",
            password: "foo!bar",
            provider: "authModule",
        },
        oauth: {
            enabled: true,
            clientId: "authModule",
            clientSecret: "fooooo",
            scope: "private+public"
        },
        throwErrors: false
    }
};
