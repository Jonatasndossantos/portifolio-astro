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
        // Fallback to 'en'
        if ("en" in content) {
            return content["en"];
        }
        // Return the first available key if no 'en'
        const firstKey = Object.keys(content)[0];
        return content[firstKey];
    }

    return content;
}
