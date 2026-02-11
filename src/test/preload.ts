
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    url: "http://localhost",
});

// @ts-ignore
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.navigator = dom.window.navigator;
// @ts-ignore
globalThis.HTMLElement = dom.window.HTMLElement;
// @ts-ignore
globalThis.Node = dom.window.Node;
// @ts-ignore
globalThis.File = dom.window.File;
// @ts-ignore
globalThis.FormData = dom.window.FormData;

// Add missing browser globals if needed
if (!globalThis.localStorage) {
    const store: Record<string, string> = {};
    const storage: any = {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { for (const key in store) delete store[key]; },
        length: 0,
        key: (_index: number) => null,
    };
    globalThis.localStorage = storage;
}

import "@testing-library/jest-dom";
