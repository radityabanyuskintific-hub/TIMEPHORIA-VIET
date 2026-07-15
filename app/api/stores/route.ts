const STORE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1Ok6dmcoSRSI7AELCZB3q5MrKHh9NZfFpXiuDWkazeZA/gviz/tq?tqx=out:csv&gid=332492267";

export async function GET() {
  const response = await fetch(STORE_SHEET_URL, { cache: "no-store" });

  if (!response.ok) {
    return Response.json(
      { error: "Store directory is temporarily unavailable." },
      { status: 502 },
    );
  }

  return new Response(await response.text(), {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}
