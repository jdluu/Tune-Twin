import { describe, expect, it } from "bun:test";
import { parsePlaylistId } from "./youtube-helpers";

describe("youtube-helpers > parsePlaylistId", () => {
    it("should extract ID from standard music.youtube.com URL", () => {
        const url = "https://music.youtube.com/playlist?list=PLuvp7EshY-N_e2d_67kS56QGf_kUX9I-I";
        expect(parsePlaylistId(url)).toBe("PLuvp7EshY-N_e2d_67kS56QGf_kUX9I-I");
    });

    it("should extract ID from standard youtube.com URL", () => {
        const url = "https://www.youtube.com/playlist?list=PLuvp7EshY-N_e2d_67kS56QGf_kUX9I-I";
        expect(parsePlaylistId(url)).toBe("PLuvp7EshY-N_e2d_67kS56QGf_kUX9I-I");
    });

    it("should extract ID from mobile youtube.com URL", () => {
        const url = "https://m.youtube.com/playlist?list=PLuvp7EshY-N_e2d_67kS56QGf_kUX9I-I";
        expect(parsePlaylistId(url)).toBe("PLuvp7EshY-N_e2d_67kS56QGf_kUX9I-I");
    });

    it("should accept raw playlist ID", () => {
        const id = "PLuvp7EshY-N_e2d_67kS56QGf_kUX9I-I";
        expect(parsePlaylistId(id)).toBe(id);
    });

    it("should accept raw Album ID (starts with OLAK)", () => {
        const id = "OLAK5ey_NIs5X6S7D9G0-mX8U2v1lP3qR4s5T6u7";
        expect(parsePlaylistId(id)).toBe(id);
    });

    it("should return null for invalid URL without list param", () => {
        const url = "https://music.youtube.com/watch?v=dQw4w9WgXcQ";
        expect(parsePlaylistId(url)).toBeNull();
    });

    it("should return null for short/invalid strings", () => {
        expect(parsePlaylistId("too_short")).toBeNull();
        expect(parsePlaylistId("")).toBeNull();
        expect(parsePlaylistId("!!!invalid!!!")).toBeNull();
    });
});
