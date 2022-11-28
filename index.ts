import { Client } from "@notionhq/client";
import * as dotenv from "dotenv";
import fetch from "cross-fetch";
import { isHTTPResponseError } from "@notionhq/client/build/src/errors";

dotenv.config();

const notionKey = process.env.NOTION_KEY;
const notionDB = process.env.NOTION_DATABASE_ID;

const ampUser = process.env.AMPLITUDE_KEY;
const ampKey = process.env.AMPLITUDE_SECRET;

const notion = new Client({ auth: notionKey });

async function getAmplitudeData() {
    try {
        const auth = Buffer.from(`${ampUser}:${ampKey}`).toString("base64");

        const res = await fetch(
            "https://amplitude.com/api/3/chart/pvjy11z/query",
            {
                method: "GET",
                headers: { Authorization: `Basic ${auth}` },
            }
        );

        if (res.status >= 400) {
            throw new Error(`Bad response from server: ${res.status}`);
        }

        if (res.status === 200) {
            const data = await res.json();
            return data.data;
        }
    } catch (err) {
        if (isHTTPResponseError(err)) {
            console.error(err);
        }
    }
}

const db_id = "3206b65977a445a0a01a10840aeff477";

async function addItem(
    company: string,
    generators: number,
    foreignKeys: number
) {
    try {
        const res = await notion.pages.create({
            parent: {
                database_id: db_id,
            },
            properties: {
                Customer: {
                    type: "title",
                    title: [{ type: "text", text: { content: company } }],
                },
                Generators: {
                    type: "number",
                    number: generators,
                },
                "Foreign Keys": {
                    type: "number",
                    number: foreignKeys,
                },
            },
        });
        console.log(res);
    } catch (err) {
        console.error(err);
    }
}

async function updateItem(
    page_id: string,
    generators: number,
    foreignKeys: number
) {
    try {
        const res = await notion.pages.update({
            page_id: page_id,
            properties: {
                Generators: {
                    type: "number",
                    number: generators,
                },
                "Foreign Keys": {
                    type: "number",
                    number: foreignKeys,
                },
            },
        });
    } catch (err) {
        console.error(err);
    }
}

async function queryDB(company: string) {
    try {
        const res = await notion.databases.query({
            database_id: db_id,
            filter: {
                property: "Customer",
                rich_text: {
                    equals: company,
                },
            },
        });
        return res.results[0]?.id;
    } catch (err) {
        console.error(err);
    }
}

async function upsertRow(
    company: string,
    generators: number,
    foreignKeys: number
) {
    const row_id = await queryDB(company);
    if (row_id) {
        updateItem(row_id, generators, foreignKeys);
    } else {
        addItem(company, generators, foreignKeys);
    }
}

(async () => {
    const data = await getAmplitudeData();
    // first item is the aggregate count, which is unneeded here
    const labels = data.labels.slice(1);
    const values = data.values.slice(1);

    labels.forEach(([ company ]: [ company: string ], i: number) => {
        const [generators, foreignKeys] = values[i];
        console.log(company, generators, foreignKeys);
        upsertRow(company, +generators, +foreignKeys);
    });
})();
