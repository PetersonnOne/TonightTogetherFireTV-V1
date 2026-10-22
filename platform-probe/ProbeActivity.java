package com.tonighttogether.probe;

import android.app.Activity;
import android.os.Bundle;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.content.SharedPreferences;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

/** Temporary platform proof, deliberately separate from the product UI. */
public class ProbeActivity extends Activity {
    private SharedPreferences preferences;
    private TextView status;
    private String page = "home";

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        preferences = getSharedPreferences("platform_probe", MODE_PRIVATE);
        renderHome();
    }

    private LinearLayout screen(String heading) {
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(42, 24, 42, 24);
        layout.setBackgroundColor(Color.rgb(16, 24, 38));
        TextView title = new TextView(this);
        title.setText(heading);
        title.setTextSize(30);
        title.setTextColor(Color.WHITE);
        layout.addView(title);
        setContentView(layout);
        return layout;
    }

    private Button button(LinearLayout parent, String label, Runnable action) {
        Button button = new Button(this);
        button.setText(label);
        button.setTextSize(18);
        button.setFocusable(true);
        button.setOnClickListener(view -> action.run());
        button.setOnFocusChangeListener((view, focused) -> {
            GradientDrawable background = new GradientDrawable();
            background.setColor(focused ? Color.rgb(35, 70, 80) : Color.rgb(30, 40, 55));
            background.setCornerRadius(10);
            background.setStroke(focused ? 4 : 1, focused ? Color.rgb(100, 230, 195) : Color.GRAY);
            button.setBackground(background);
        });
        parent.addView(button, new LinearLayout.LayoutParams(-1, 58));
        return button;
    }

    private void renderHome() {
        page = "home";
        LinearLayout layout = screen("Tonight Together");
        status = new TextView(this);
        status.setTextSize(18);
        status.setTextColor(Color.LTGRAY);
        refreshStatus();
        layout.addView(status);
        Button save = button(layout, "Save a local test choice", () -> {
            boolean saved = preferences.edit().putString("choice", "Platform test choice").commit();
            if (saved) refreshStatus(); else status.setText("Not saved — try again");
        });
        button(layout, "Open saved choice", () -> {
            page = "details";
            LinearLayout detail = screen(preferences.getString("choice", "No saved choice"));
            button(detail, "Back to platform check", this::renderHome).requestFocus();
        });
        button(layout, "Clear test data", () -> {
            boolean cleared = preferences.edit().clear().commit();
            if (cleared) refreshStatus(); else status.setText("Could not clear — try again");
        });
        save.requestFocus();
    }

    private void refreshStatus() {
        status.setText("Platform verification only — product interface pending\nSaved: " + preferences.getString("choice", "None"));
    }

    @Override public void onBackPressed() {
        if (page.equals("details")) renderHome(); else super.onBackPressed();
    }
}
