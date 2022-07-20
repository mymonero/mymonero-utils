import { registerPlugin } from "@capacitor/core";
const FilePicker = registerPlugin("FilePicker", {
    web: () => import("./web").then((m) => new m.FilePickerWeb()),
});
export * from "./definitions";
export { FilePicker };
//# sourceMappingURL=index.js.map