import { WebPlugin } from "@capacitor/core";
import { FilePickerPlugin, FilePickerResult } from "./definitions";

export class FilePickerWeb extends WebPlugin implements FilePickerPlugin {
  constructor() {
    super({
      name: "FilePicker",
      platforms: ["web"],
    });
  }

  async showFilePicker(_options?: {
    fileTypes?: string[];
  }): Promise<FilePickerResult> {
    return Promise.reject("No implementation for web yet.");
  }
}
