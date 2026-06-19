import { Injectable } from "@nestjs/common";

@Injectable()
export class HtmlToTextService {
  convert(html: string): string {
    return this.decodeEntities(
      html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/(p|div|h1|h2|h3|li|tr)>/gi, "\n")
        .replace(/<li[^>]*>/gi, "- ")
        .replace(/<[^>]+>/g, "")
        .replace(/\r/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n[ \t]+/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim(),
    );
  }

  private decodeEntities(text: string): string {
    const entities: Record<string, string> = {
      amp: "&",
      lt: "<",
      gt: ">",
      quot: '"',
      "#39": "'",
      nbsp: " ",
      copy: "(c)",
    };

    return text.replace(/&(#\d+|#x[\da-f]+|[a-z]+);/gi, (match, entity) => {
      const normalized = String(entity).toLowerCase();

      if (normalized.startsWith("#x")) {
        return String.fromCodePoint(Number.parseInt(normalized.slice(2), 16));
      }

      if (normalized.startsWith("#")) {
        return String.fromCodePoint(Number.parseInt(normalized.slice(1), 10));
      }

      return entities[normalized] ?? match;
    });
  }
}
