import { Env, SyshubVersion } from 'syshub-rest-module';

export const environment: Env = {
    variant: "environment.development.ts",
    syshub: {
        host: "http://localhost:8088/",
        version: SyshubVersion.sysHUB_2022,
        basic: {
            enabled: true,
            username: "foo",
            password: "foo!bar",
            provider: "authModule",
        },
        oauth: {
            enabled: false,
            clientId: "authModule",
            clientSecret: "fooooo",
            scope: "public+private"
        },
        throwErrors: false
    }
};
