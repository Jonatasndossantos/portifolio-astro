export const locales = ["en", "pt", "fr", "es", "zh", "ja", "en-GB"] as const;
export type Locale = (typeof locales)[number];

export function getTrans(content: any, locale: string): any {
    if (typeof content !== "object" || content === null) {
        return content;
    }

    // Check if the content is a translation object (has keys that match our locales)
    const hasLocaleKeys = Object.keys(content).some(key => locales.includes(key as any));

    if (hasLocaleKeys) {
        // Try to find the exact locale match
        if (locale in content) {
            return content[locale];
        }
        // Fallback to English if exact match not found
        if ("en" in content) {
            return content["en"];
        }
        // Fallback to the first available translation
        return Object.values(content)[0];
    }

    // If it's not a translation object, recursively process its properties
    const result: any = {};
    for (const key in content) {
        result[key] = getTrans(content[key], locale);
    }
    return result;
}
