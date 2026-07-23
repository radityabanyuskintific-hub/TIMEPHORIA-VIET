"use client";

import { useEffect, useMemo, useState } from "react";
import type { SiteView, Store } from "../catalog/types";
import { parseStoreCsv } from "./store-csv";

type StoreStatus = "idle" | "loading" | "error";

export function useStoreDirectory(view: SiteView) {
  const [stores, setStores] = useState<Store[]>([]);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [status, setStatus] = useState<StoreStatus>("idle");

  useEffect(() => {
    if (view !== "stores" || stores.length || status !== "loading") return;

    fetch("/api/stores")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load stores");
        return response.text();
      })
      .then((csv) => {
        setStores(parseStoreCsv(csv));
        setStatus("idle");
      })
      .catch(() => setStatus("error"));
  }, [status, stores.length, view]);

  const regions = useMemo(
    () => [
      "All",
      ...Array.from(new Set(stores.map((store) => store.region))).sort(),
    ],
    [stores],
  );

  const visibleStores = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("id");

    return stores.filter(
      (store) =>
        (region === "All" || store.region === region) &&
        (!normalizedQuery ||
          `${store.name} ${store.region}`
            .toLocaleLowerCase("id")
            .includes(normalizedQuery)),
    );
  }, [query, region, stores]);

  return {
    query,
    region,
    regions,
    setQuery,
    setRegion,
    setStatus,
    status,
    visibleStores,
  };
}
