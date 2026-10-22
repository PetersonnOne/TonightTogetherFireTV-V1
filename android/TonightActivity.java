package com.tonighttogether.milestone2;

import android.app.Activity;
import android.app.AlertDialog;
import android.os.Bundle;
import android.util.AtomicFile;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.JavascriptInterface;
import android.view.KeyEvent;
import android.widget.EditText;
import android.text.InputType;
import android.text.InputFilter;
import android.content.pm.ApplicationInfo;
import java.io.File;
import java.io.FileOutputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import org.json.JSONObject;

/** Bundled UI host with allowlisted loopback room/provider HTTP connections. */
public class TonightActivity extends Activity {
    private WebView web;
    private AtomicFile stateFile;
    @Override public void onCreate(Bundle saved) {
        super.onCreate(saved);
        stateFile = new AtomicFile(new File(getFilesDir(), "household-v1.json"));
        web = new WebView(this);
        if ((getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0) WebView.setWebContentsDebuggingEnabled(true);
        web.setBackgroundColor(0xff101b20);
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setMixedContentMode(android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        web.getSettings().setAllowFileAccess(false);
        web.getSettings().setAllowContentAccess(false);
        web.getSettings().setDomStorageEnabled(false);
        web.getSettings().setMediaPlaybackRequiresUserGesture(true);
        web.addJavascriptInterface(new LocalStorage(), "TonightStorage");
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) { return true; }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                String path = request.getUrl().getPath();
                if ("127.0.0.1".equals(request.getUrl().getHost()) && "http".equals(request.getUrl().getScheme()) && (request.getUrl().getPort()==4182 || request.getUrl().getPort()==4183)) return null;
                if (!"tonight.local".equals(request.getUrl().getHost()) || !"https".equals(request.getUrl().getScheme()) || path == null || path.contains("..")) return blocked();
                try {
                    String name = path.equals("/") ? "index.html" : path.substring(1);
                    String mime = name.endsWith(".js") ? "application/javascript" : name.endsWith(".css") ? "text/css" : name.endsWith(".svg") ? "image/svg+xml" : "text/html";
                    WebResourceResponse response = new WebResourceResponse(mime,"UTF-8",getAssets().open(name));
                    response.setResponseHeaders(Collections.singletonMap("Cache-Control","no-store"));
                    return response;
                } catch (IOException error) { return blocked(); }
            }
        });
        setContentView(web);
        web.loadUrl("https://tonight.local/index.html");
    }
    private WebResourceResponse blocked() { return new WebResourceResponse("text/plain","UTF-8",404,"Not Found",Collections.emptyMap(),new ByteArrayInputStream(new byte[0])); }
    public class LocalStorage {
        @JavascriptInterface public void openProvider(String ticket) {
            runOnUiThread(() -> {
                if(ticket == null || !ticket.matches("[A-Za-z0-9_-]{10,600}\\.[a-f0-9]{64}")) { web.evaluateJavascript("window.onProviderResult('invalid')",null); return; }
                android.content.Intent intent = new android.content.Intent();
                intent.setComponent(new android.content.ComponentName("com.tonighttogether.testprovider","com.tonighttogether.testprovider.ProviderActivity"));
                intent.putExtra("ticket",ticket);
                try { startActivity(intent); } catch(android.content.ActivityNotFoundException missing) { web.evaluateJavascript("window.onProviderResult('missing')",null); }
            });
        }
        @JavascriptInterface public synchronized String read() {
            try { return new String(stateFile.readFully(),StandardCharsets.UTF_8); }
            catch (java.io.FileNotFoundException missing) { return ""; }
            catch (IOException error) { return "UNREADABLE_SAVED_DATA"; }
        }
        @JavascriptInterface public synchronized boolean write(String data) {
            FileOutputStream output = null;
            try {
                if (data == null || data.length() > 2000000 || new JSONObject(data).getInt("version") != 1) return false;
                output = stateFile.startWrite();
                output.write(data.getBytes(StandardCharsets.UTF_8));
                stateFile.finishWrite(output);
                return true;
            } catch (Exception error) { if (output != null) stateFile.failWrite(output); return false; }
        }
        @JavascriptInterface public void editText(String elementId, String current, boolean multiline) {
            runOnUiThread(() -> {
                EditText input = new EditText(TonightActivity.this);
                int limit = elementId.equals("alias") ? 32 : multiline ? 500 : 100;
                input.setFilters(new InputFilter[]{new InputFilter.LengthFilter(limit)});
                input.setText(current);
                input.setInputType(elementId.equals("new-runtime") ? InputType.TYPE_CLASS_NUMBER : InputType.TYPE_CLASS_TEXT | (multiline ? InputType.TYPE_TEXT_FLAG_MULTI_LINE : 0));
                input.setSelection(input.getText().length());
                String title = elementId.equals("alias") ? "Viewer name" : elementId.startsWith("note-") ? "Your viewing note" : elementId.equals("new-title") ? "Programme title" : elementId.equals("new-runtime") ? "Runtime in minutes" : elementId.equals("history-search") ? "Search your evenings" : "Enter your text";
                new AlertDialog.Builder(TonightActivity.this).setTitle(title).setView(input)
                    .setPositiveButton("Use this",(dialog, which) -> web.evaluateJavascript("window.acceptNativeText(" + JSONObject.quote(elementId) + "," + JSONObject.quote(input.getText().toString()) + ")", null))
                    .setNegativeButton("Cancel",null).show();
            });
        }
    }
    @Override public boolean dispatchKeyEvent(KeyEvent event) {
        int code = event.getKeyCode();
        String key = code == KeyEvent.KEYCODE_DPAD_UP ? "ArrowUp" : code == KeyEvent.KEYCODE_DPAD_DOWN ? "ArrowDown" : code == KeyEvent.KEYCODE_DPAD_LEFT ? "ArrowLeft" : code == KeyEvent.KEYCODE_DPAD_RIGHT ? "ArrowRight" : (code == KeyEvent.KEYCODE_DPAD_CENTER || code == KeyEvent.KEYCODE_ENTER) ? "Enter" : null;
        if (key != null) {
            if (event.getAction() == KeyEvent.ACTION_DOWN) web.evaluateJavascript("window.tonightKey && window.tonightKey(" + JSONObject.quote(key) + ")", null);
            return true;
        }
        return super.dispatchKeyEvent(event);
    }
    @Override public void onBackPressed() {
        web.evaluateJavascript("window.tonightBack ? window.tonightBack() : false", result -> { if (!"true".equals(result)) TonightActivity.super.onBackPressed(); });
    }
    @Override protected void onDestroy() { web.removeJavascriptInterface("TonightStorage"); web.destroy(); super.onDestroy(); }
}

