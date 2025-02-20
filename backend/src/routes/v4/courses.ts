import * as APIv4 from "hyperschedule-shared/api/v4";
import { computeOfferingHistory, getAllSections } from "../../db/models/course";
import { App } from "@tinyhttp/app";
import { courseAreaDescriptions } from "../../hmc-api/course-area-descriptions";
import { CURRENT_TERM } from "hyperschedule-shared/api/current-term";

const courseApp = new App({ settings: { xPoweredBy: false } });

courseApp.get("/sections", async function (request, reply) {
    const sections = await getAllSections();
    return reply
        .header("Content-Type", "application/json")
        .header(
            "Cache-Control",
            "public,s-max-age=15,max-age=60,proxy-revalidate,stale-while-revalidate=30",
        )
        .send(JSON.stringify(sections));
});

courseApp.get("/sections/:term", async (request, response) => {
    const parsed = APIv4.TermIdentifierString.safeParse(request.params.term);
    if (!parsed.success) return response.status(404).end();
    const term = APIv4.parseTermIdentifier(parsed.data);
    // TODO: use a better term comparison
    if (APIv4.termIsBefore(term, CURRENT_TERM)) {
        response.header(
            "Cache-Control",
            `public,immutable,max-age=${7 * 24 * 3600}`,
        );
    } else {
        response.header(
            "Cache-Control",
            "public,s-max-age=15,max-age=60,proxy-revalidate,stale-while-revalidate=30",
        );
    }
    const sections = await getAllSections(term);

    return response
        .header("Content-Type", "application/json")
        .send(JSON.stringify(sections));
});

courseApp.get("/course-areas", async function (request, reply) {
    // this is only a temporary measure. ideally we will serve out content from the live data stream

    return reply
        .header("Content-Type", "application/json")
        .header(
            "Cache-Control",
            "public,s-max-age=86400,max-age=86400,proxy-revalidate,stale-while-revalidate=3600",
        )
        .send(JSON.stringify(courseAreaDescriptions));
});

courseApp.get("/offering-history/:term", async (request, response) => {
    const parsed = APIv4.TermIdentifierString.safeParse(request.params.term);
    if (!parsed.success) return response.status(404).end();
    const term = APIv4.parseTermIdentifier(parsed.data);
    const lastOffered = await computeOfferingHistory(term);
    return response
        .header("Content-Type", "application/json")
        .header(
            "Cache-Control",
            "public,s-max-age=86400,max-age=86400,proxy-revalidate,stale-while-revalidate=3600",
        )
        .send(lastOffered);
});

export { courseApp };
