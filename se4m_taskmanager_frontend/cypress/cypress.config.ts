/* eslint-disable spaced-comment */
/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "cypress";

export default defineConfig({
    // setupNodeEvents can be defined in either
    // the e2e or component configuration
    e2e: {
        //@ts-ignore
        setupNodeEvents(on, config) {
            require("@cypress/code-coverage/task")(on, config);
            // include any other plugin code...

            // It's IMPORTANT to return the config object
            // with any changed environment variables
            return config;
        },
    },
});
