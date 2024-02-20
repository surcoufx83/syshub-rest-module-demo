import { OAuthRestSettings } from "syshub-rest-module";

export type MyEnvironment = {
    syshub: OAuthRestSettings
}

export const environment: MyEnvironment = {
    syshub: {
        host: "/",
        oauth: {
            enabled: true,
            clientId: "<oauth client id>",
            clientSecret: "<oauth client secret>",
            scope: "public"
        },
        throwErrors: false
    }
};
