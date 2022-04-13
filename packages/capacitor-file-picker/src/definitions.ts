export class FiletTypes {
  static IMAGE = "image"; // For any type of image file
  static PDF = "pdf"; // For .pdf files
}

export interface FilePickerResult {
  uri: string;
  name: string;
  mimeType: string;
  extension: string;
}

export interface FilePickerPlugin {
  showFilePicker(options?: { fileTypes?: string[] }): Promise<FilePickerResult>;
}
