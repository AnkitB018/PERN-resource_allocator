import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";

import "dotenv/config";

//init arcjet

export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["ip.src"],
    rules: [
        // shield protects from varios attacks like SQL injection, XSS, CSRF
        shield({mode: "LIVE"}),
        detectBot({
            mode: "LIVE",
            //block all bots except search engines
            allow: [
                "CATEGORY:SEARCH_ENGINE",
                "CATEGORY:BROWSER",
            ],
        }),

        //rate limiting
        tokenBucket({
            mode: "LIVE",
            refillRate: 5,
            interval: 10,
            capacity: 10,
        }),

    ],
});