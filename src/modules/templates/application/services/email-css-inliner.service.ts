import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailCssInlinerService {
  inline(html: string): string {
    return [
      (current: string) =>
        this.addStyleToTag(
          current,
          "body",
          "margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f9; color: #333;",
        ),
      (current: string) =>
        this.addStyleToClass(
          current,
          "div",
          "email-container",
          "max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);",
        ),
      (current: string) =>
        this.addStyleToClass(
          current,
          "div",
          "header",
          "background-color: #001f3f; padding: 30px; text-align: center;",
        ),
      (current: string) =>
        this.addStyleToImageAlt(
          current,
          "Suprema Algoritmos",
          "max-width: 220px; height: auto;",
        ),
      (current: string) =>
        this.addStyleToClass(
          current,
          "div",
          "content",
          "padding: 40px 30px; line-height: 1.6;",
        ),
      (current: string) =>
        this.addStyleToTag(
          current,
          "h1",
          "color: #001f3f; font-size: 22px; margin-bottom: 20px;",
        ),
      (current: string) =>
        this.addStyleToClass(
          current,
          "p",
          "intro",
          "font-size: 16px; color: #555; margin-bottom: 25px;",
        ),
      (current: string) =>
        this.addStyleToClass(
          current,
          "div",
          "feature-box",
          "background: #f9fbfc; border-left: 4px solid #0056b3; padding: 15px 20px; margin-bottom: 20px; border-radius: 0 4px 4px 0;",
        ),
      (current: string) =>
        this.addStyleToClass(
          current,
          "span",
          "feature-title",
          "font-weight: bold; color: #0056b3; display: block; margin-bottom: 5px;",
        ),
      (current: string) =>
        this.addStyleToClass(
          current,
          "div",
          "pricing-table",
          "width: 100%; background: #001f3f; color: #fff; padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center;",
        ),
      (current: string) =>
        this.addStyleToClass(
          current,
          "div",
          "pricing-title",
          "font-size: 18px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;",
        ),
      (current: string) =>
        this.addStyleToClass(
          current,
          "div",
          "price-item",
          "font-size: 24px; font-weight: bold; margin: 10px 0;",
        ),
      (current: string) =>
        this.addStyleToClass(
          current,
          "span",
          "price-sub",
          "font-size: 14px; opacity: 0.8; font-weight: normal;",
        ),
      (current: string) =>
        this.addStyleToClass(
          current,
          "div",
          "price-sub",
          "font-size: 14px; opacity: 0.8; font-weight: normal;",
        ),
      (current: string) =>
        this.addStyleToClass(
          current,
          "a",
          "cta-button",
          "display: inline-block; padding: 15px 30px; background-color: #007bff; color: #ffffff !important; text-decoration: none; border-radius: 50px; font-weight: bold; margin-top: 20px;",
        ),
      (current: string) =>
        this.addStyleToClass(
          current,
          "div",
          "footer",
          "background: #f4f7f9; padding: 30px; text-align: center; font-size: 14px; color: #777; border-top: 1px solid #eee;",
        ),
      (current: string) =>
        this.addStyleToClass(
          current,
          "span",
          "highlight",
          "color: #0056b3; font-weight: bold;",
        ),
    ].reduce((current, inlineRule) => inlineRule(current), html);
  }

  private addStyleToTag(html: string, tag: string, style: string): string {
    return html.replace(
      new RegExp(`<${tag}(\\s[^>]*)?>`, "g"),
      (openTag: string) => this.mergeStyle(openTag, style),
    );
  }

  private addStyleToClass(
    html: string,
    tag: string,
    className: string,
    style: string,
  ): string {
    return html.replace(
      new RegExp(`<${tag}([^>]*\\bclass="${className}"[^>]*)>`, "g"),
      (openTag: string) => this.mergeStyle(openTag, style),
    );
  }

  private addStyleToImageAlt(
    html: string,
    alt: string,
    style: string,
  ): string {
    return html.replace(
      new RegExp(`<img([^>]*\\balt="${alt}"[^>]*)>`, "g"),
      (openTag: string) => this.mergeStyle(openTag, style),
    );
  }

  private mergeStyle(openTag: string, style: string): string {
    if (openTag.includes(" style=")) {
      return openTag.replace(
        / style="([^"]*)"/,
        (_match, existingStyle: string) =>
          ` style="${this.normalizeStyle(`${existingStyle}; ${style}`)}"`,
      );
    }

    return openTag.replace(/>$/, ` style="${style}">`);
  }

  private normalizeStyle(style: string): string {
    return style
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .join("; ")
      .concat(";");
  }
}
