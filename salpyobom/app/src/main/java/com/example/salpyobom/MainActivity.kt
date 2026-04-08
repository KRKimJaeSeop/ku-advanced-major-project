package com.example.salpyobom

import android.os.Bundle
import android.view.ViewGroup
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import com.example.salpyobom.ui.theme.SalpyobomTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SalpyobomTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    // 아래에 만든 웹뷰 함수를 호출합니다.
                    WebScreen(modifier = Modifier.padding(innerPadding))
                }
            }
        }
    }
}

@Composable
fun WebScreen(modifier: Modifier = Modifier) {
    AndroidView(
        modifier = modifier.fillMaxSize(),
        factory = { context ->
            WebView(context).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
                // 1. 자바스크립트 허용
                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true

                // 2. 앱 안에서 페이지 이동이 되도록 설정
                webViewClient = WebViewClient()

                // 3. 아까 만든 assets/www 폴더의 파일 로드
                loadUrl("file:///android_asset/www/index.html")
            }
        }
    )
}