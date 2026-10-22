package com.tonighttogether.testprovider;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.*;
import android.view.KeyEvent;
import android.content.pm.ApplicationInfo;
import java.io.ByteArrayInputStream;
import java.util.Collections;
public class ProviderActivity extends Activity {
 private WebView web;
 @Override public void onCreate(Bundle state){super.onCreate(state);
  String ticket=getIntent().getStringExtra("ticket");
  if(ticket==null||!ticket.matches("[A-Za-z0-9_-]{10,600}\\.[a-f0-9]{64}")){finish();return;}
  web=new WebView(this);web.setBackgroundColor(0xff101b20);web.getSettings().setJavaScriptEnabled(true);web.getSettings().setAllowFileAccess(false);web.getSettings().setAllowContentAccess(false);web.getSettings().setMediaPlaybackRequiresUserGesture(false);
  if((getApplicationInfo().flags&ApplicationInfo.FLAG_DEBUGGABLE)!=0)WebView.setWebContentsDebuggingEnabled(true);
  web.addJavascriptInterface(new Host(),"ProviderHost");web.setWebChromeClient(new WebChromeClient());
  web.setWebViewClient(new WebViewClient(){
   @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){return true;}
   @Override public WebResourceResponse shouldInterceptRequest(WebView v,WebResourceRequest r){if("127.0.0.1".equals(r.getUrl().getHost())&&r.getUrl().getPort()==4183&&"http".equals(r.getUrl().getScheme()))return null;return new WebResourceResponse("text/plain","UTF-8",403,"Forbidden",Collections.emptyMap(),new ByteArrayInputStream(new byte[0]));}
   @Override public void onReceivedError(WebView v,WebResourceRequest r,WebResourceError error){if(r.isForMainFrame())v.loadData("<body bgcolor='#101b20' text='white'><h1>Test provider service unavailable</h1><p>Return to Tonight Together with Back. Your saved choice is safe.</p></body>","text/html","UTF-8");}
  });setContentView(web);web.loadUrl("http://127.0.0.1:4183/watch?ticket="+ticket);
 }
 public class Host{@JavascriptInterface public void close(){runOnUiThread(()->finish());}}
 @Override public boolean dispatchKeyEvent(KeyEvent e){int code=e.getKeyCode();String key=code==19?"ArrowUp":code==20?"ArrowDown":code==21?"ArrowLeft":code==22?"ArrowRight":code==23||code==66?"Enter":null;if(key!=null&&web!=null){if(e.getAction()==KeyEvent.ACTION_DOWN)web.evaluateJavascript("window.providerKey && window.providerKey('"+key+"')",null);return true;}return super.dispatchKeyEvent(e);}
 @Override protected void onPause(){if(web!=null){web.evaluateJavascript("document.querySelector('video') && document.querySelector('video').pause()",null);web.onPause();}super.onPause();}
 @Override protected void onResume(){super.onResume();if(web!=null)web.onResume();}
 @Override protected void onDestroy(){if(web!=null){web.removeJavascriptInterface("ProviderHost");web.destroy();}super.onDestroy();}
}

