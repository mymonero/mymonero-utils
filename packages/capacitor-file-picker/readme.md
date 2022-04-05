# Capacitor File Picker (forked from https://github.com/epicshaggy/capacitor-file-picker)

## Important

This fork exists as a stopgap to address an issue with the plugin not working correctly with MyMonero's specified versions of various Java packages. A PR will be submitted to the original maintainer, and this package will be removed if/when the original author accepts the PR. We do not suggest relying on this package at any stage.

The original README content is preserved below

## Description

Presents the device's native file picking ui and returns the selected file's uri.

## Installation

### Capacitor 2

Not supported

### Capacitor 3

- `npm i @mymonero/capacitor-file-picker`

## Usage

```ts
import { Plugins } from "@capacitor/core";

const { FilePicker } = Plugins;

FilePicker.showFilePicker({
  fileTypes: ["image/*", "application/pdf"],
}).then(
  (fileResult: FilePickerResult) => {
    const fileUri = fileResult.uri;
    const fileName = fileResult.name;
    const fileMimeType = fileResult.mimeType;
    const fileExtension = fileResult.extension;
  },
  (error) => {
    console.log(error);
  }
);
```

## Methods

| Method                                         | Default | Type                        | Description                                                                       |
| ---------------------------------------------- | ------- | --------------------------- | --------------------------------------------------------------------------------- |
| showFilePicker(options: {fileTypes: string[]}) |         | `Promise<FilePickerResult>` | Presents the device's native file picking ui and returns the selected file's uri. |

## Interfaces

FilePickerResult

| Properties | Default | Type     | Description                               |
| ---------- | ------- | -------- | ----------------------------------------- |
| uri        |         | `string` | Uri string pointing to the selected file. |
| name       |         | `string` | The name of the selected file.            |
| mimeType   |         | `string` | The MIME type of the selected file.       |
| extension  |         | `string` | The extension of the selected file.       |

## Android

Register the plugin by adding it to your MainActivity's onCreate:

```java
import com.epicshaggy.filepicker.FilePicker;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      add(FilePicker.class);
    }});
  }
}
```

## Notes

The file picker only accpets:

- application/pdf
- image/\*

This is because it was developed to meet the need to meet a specific need, but feel free to contribute to the plugin's development. :)
