import { sp, idp } from "../../auth/saml/service-provider";
import { App } from "@tinyhttp/app";
import { urlencoded as bodyParser } from "milliparsec";
import { createLogger } from "../../logger";
import { z } from "zod";
import { createOrGetUser } from "../../db/models/user";
import { signUser } from "../../auth/token";

const logger = createLogger("routes.auth.saml");

const samlApp = new App({ settings: { xPoweredBy: false } });

const SamlResponseFormat = z.object({
    audience: z.literal("https://hyperschedule.io/"),
    attributes: z.object({
        eppn: z.string().email(),
        orgName: z.string(),
        displayName: z.string().optional(),
    }),
});
type SamlResponseFormat = z.infer<typeof SamlResponseFormat>;

// this path is hard coded into the metadata sent to TCCS. Do not change
samlApp
    .use("/saml", bodyParser())
    .use("/saml", function (_, response, next) {
        response.setHeader(
            "Cache-Control",
            "no-cache, no-store, must-revalidate, max-age=0",
        );
        next();
    })
    .post("/saml", async function (request, response) {
        try {
            const result = await sp.parseLoginResponse(idp, "post", {
                body: request.body,
            });
            logger.info(result.extract, "SAML request completed");
            const data = SamlResponseFormat.strip().safeParse(result.extract);
            if (!data.success) {
                logger.error(
                    "Cannot parse SAML response from CAS. %o. Error: %o",
                    result.extract,
                    data.error,
                );
                return response
                    .status(400)
                    .send("Cannot interpret response from CAS.");
            }

            const user = await createOrGetUser(
                data.data.attributes.eppn,
                data.data.attributes.orgName,
            );

            const sig = signUser({ uuid: user });
            const expires = new Date();
            expires.setDate(expires.getDate() + 365);

            return response
                .cookie("token", sig, {
                    secure: true,
                    sameSite: "strict", // needed for redirect
                    expires,
                })
                .status(302)
                .location(
                    process.env.NODE_ENV === "development"
                        ? "http://localhost:5000/"
                        : "https://hyperschedule.io/",
                )
                .end();
        } catch (e) {
            logger.error(e);
            return response
                .status(400)
                .setHeader("Content-Type", "text/plain")
                .send(`${e}`);
        }
    })
    .get("/saml", async function (request, response) {
        return response.redirect(
            sp.createLoginRequest(idp, "redirect").context,
        );
    });

export { samlApp };
