package com.epicshaggy.filepicker;

import android.app.Activity;
import android.content.Intent;
import android.database.Cursor;
import android.provider.OpenableColumns;
import android.util.Log;
import android.webkit.MimeTypeMap;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONException;

import java.util.ArrayList;

@CapacitorPlugin()
public class FilePicker extends Plugin {

    private class FileTypes {
        static final String PDF = "pdf";
        static final String IMAGE = "image";
    }

    private String[] getAllowedFileTypes(JSArray fileTypes) {
        ArrayList<String> typeList = new ArrayList<>();

        for (int i = 0; i < fileTypes.length(); i++) {

            try {
                String val = fileTypes.getString(i);
                switch (val) {
                    case FileTypes.PDF:
                        typeList.add("application/pdf");
                        break;
                    case FileTypes.IMAGE:
                        typeList.add("image/*");
                        break;
                    default:
                        typeList.add(val);
                        break;
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }

        }

        if (typeList.size() > 0) {
            String[] accept = typeList.toArray(new String[0]);
            return accept;
        }
        return null;
    }

    @PluginMethod()
    public void showFilePicker(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);

        intent.setType("*/*");

        if (call.getData().has("fileTypes")) {
            String[] types = getAllowedFileTypes(call.getArray("fileTypes"));
            if (types != null) {
                intent.putExtra(Intent.EXTRA_MIME_TYPES, types);
            }
        }
        startActivityForResult(call, intent, "newFilePickerResult");
    }

    @ActivityCallback
    private void newFilePickerResult(PluginCall call, ActivityResult result) {
        Integer resultCode = result.getResultCode();
        switch (result.getResultCode()) {

            case Activity.RESULT_OK:
                Intent data = result.getData();

                String mimeType = getContext().getContentResolver().getType(data.getData());
                String extension = MimeTypeMap.getSingleton().getExtensionFromMimeType(mimeType);

                Cursor c = getContext().getContentResolver().query(data.getData(), null, null, null, null);
                c.moveToFirst();
                String name = c.getString(c.getColumnIndex(OpenableColumns.DISPLAY_NAME));

                JSObject ret = new JSObject();
                ret.put("uri", data.getDataString());
                ret.put("name", name);
                ret.put("mimeType", mimeType);
                ret.put("extension", extension);
                call.resolve(ret);
                break;
            case Activity.RESULT_CANCELED:
                call.reject("File picking was cancelled.");
                break;
            default:
                call.reject("An unknown error occurred.");
                break;
        }
    }
}