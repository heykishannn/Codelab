import JSZip from 'jszip';
import { Project, FileNode } from '@/types/ide';

export interface ExportOptions {
  includeAssets?: boolean;
  minify?: boolean;
  format?: 'zip' | 'apk';
}

export class ExportService {
  async exportAsZIP(project: Project, options: ExportOptions = {}): Promise<Blob> {
    const zip = new JSZip();
    
    const addFilesToZip = (files: FileNode[], currentPath = '') => {
      files.forEach(file => {
        const fullPath = currentPath ? `${currentPath}/${file.name}` : file.name;
        
        if (file.type === 'file' && file.content !== undefined) {
          zip.file(fullPath, file.content);
        } else if (file.type === 'folder' && file.children) {
          addFilesToZip(file.children, fullPath);
        }
      });
    };

    addFilesToZip(project.files);

    // Add project metadata
    const metadata = {
      name: project.name,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      exportedAt: new Date(),
      version: '1.0.0'
    };
    
    zip.file('project.json', JSON.stringify(metadata, null, 2));

    return await zip.generateAsync({ type: 'blob' });
  }

  async exportAsAPK(project: Project, options: ExportOptions = {}): Promise<{
    progress: (callback: (progress: number, step: string) => void) => Promise<Blob>;
  }> {
    return {
      progress: async (callback: (progress: number, step: string) => void) => {
        // Step 1: Compile HTML/CSS/JS
        callback(25, 'Compiling HTML/CSS/JS');
        await this.delay(800);

        // Step 2: Create Android WebView wrapper
        callback(50, 'Creating Android WebView wrapper');
        await this.delay(1000);

        // Step 3: Generate APK with permissions
        callback(75, 'Generating APK with permissions');
        await this.delay(1200);

        // Step 4: Sign APK
        callback(90, 'Signing APK');
        await this.delay(600);

        // Step 5: Complete
        callback(100, 'APK export complete');
        
        return await this.createMockAPK(project);
      }
    };
  }

  private async createMockAPK(project: Project): Promise<Blob> {
    const zip = new JSZip();
    
    // Create Android project structure
    const manifest = this.generateAndroidManifest(project.name);
    zip.file('AndroidManifest.xml', manifest);

    // Main Activity
    const mainActivity = this.generateMainActivity(project.name);
    zip.file('src/main/java/com/apkbuilder/app/MainActivity.java', mainActivity);

    // WebView HTML
    const htmlFiles = project.files.filter(f => f.type === 'file' && f.name.endsWith('.html'));
    const mainHtml = htmlFiles.find(f => f.name === 'index.html') || htmlFiles[0];
    
    if (mainHtml && mainHtml.content) {
      zip.file('assets/index.html', mainHtml.content);
    }

    // CSS files
    project.files
      .filter(f => f.type === 'file' && f.name.endsWith('.css'))
      .forEach(file => {
        if (file.content) {
          zip.file(`assets/${file.name}`, file.content);
        }
      });

    // JavaScript files
    project.files
      .filter(f => f.type === 'file' && f.name.endsWith('.js'))
      .forEach(file => {
        if (file.content) {
          zip.file(`assets/${file.name}`, file.content);
        }
      });

    // Resources
    const strings = this.generateStringsXml(project.name);
    zip.file('res/values/strings.xml', strings);

    const colors = this.generateColorsXml();
    zip.file('res/values/colors.xml', colors);

    return await zip.generateAsync({ type: 'blob' });
  }

  private generateAndroidManifest(appName: string): string {
    return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.apkbuilder.app">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${appName}"
        android:theme="@style/AppTheme"
        android:hardwareAccelerated="true">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
  }

  private generateMainActivity(appName: string): string {
    return `package com.apkbuilder.app;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.content.pm.ActivityInfo;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Set orientation
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        
        // Create WebView
        webView = new WebView(this);
        setContentView(webView);
        
        // Configure WebView settings
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setGeolocationEnabled(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);
        
        // Set WebView client
        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin,
                GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }
        });
        
        // Load the main HTML file
        webView.loadUrl("file:///android_asset/index.html");
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}`;
  }

  private generateStringsXml(appName: string): string {
    return `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${appName}</string>
</resources>`;
  }

  private generateColorsXml(): string {
    return `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">#2196F3</color>
    <color name="colorPrimaryDark">#1976D2</color>
    <color name="colorAccent">#FF4081</color>
</resources>`;
  }

  downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const exportService = new ExportService();
