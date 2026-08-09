import { Client } from "@notionhq/client";

const notion = new Client({
    auth: process.env.NOTION_ESPER_TOKEN || "",
});

export async function getTrades() {
    const pages = [];
    let cursor: string | null = null;

    do {
        const response = await notion.dataSources.query({
            data_source_id: process.env.NOTION_DATA_SOURCE_ID!,
            start_cursor: cursor,
            page_size: 100,
        });

        pages.push(...response.results);
        cursor = response.next_cursor;
    } while (cursor);

    return pages;
}
