import { getModelForClass, prop } from "@typegoose/typegoose";

class Link {
  @prop()
  public shortUrl!: string;

  @prop()
  public originalUrl!: string;

  @prop()
  public urlVisits!: number;

  @prop()
  public qrVisits!: number;

  constructor(customUrl: string, originalUrl: string) {
    this.shortUrl = customUrl;
    this.originalUrl = originalUrl;
    this.urlVisits = 0;
    this.qrVisits = 0;
  }
}

const LinkModel = getModelForClass(Link);
export { Link, LinkModel };
