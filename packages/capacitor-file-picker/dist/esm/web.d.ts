import { WebPlugin } from "@capacitor/core";
import { FilePickerPlugin, FilePickerResult } from "./definitions";
export declare class FilePickerWeb extends WebPlugin implements FilePickerPlugin {
    constructor();
    showFilePicker(_options?: {
        fileTypes?: string[];
    }): Promise<FilePickerResult>;
}
