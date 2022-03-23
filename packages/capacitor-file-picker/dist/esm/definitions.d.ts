export declare class FiletTypes {
    static IMAGE: string;
    static PDF: string;
}
export interface FilePickerResult {
    uri: string;
    name: string;
    mimeType: string;
    extension: string;
}
export interface FilePickerPlugin {
    showFilePicker(options?: {
        fileTypes?: string[];
    }): Promise<FilePickerResult>;
}
