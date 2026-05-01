package com.motoleasing.agent.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val SandstoneColors = lightColorScheme(
    primary = DeepTeal,
    secondary = Ocean,
    tertiary = Accent,
    background = Sand,
    surface = Mist,
    onPrimary = Mist,
    onSecondary = Mist,
    onBackground = Ink,
    onSurface = Ink
)

private val CrimsonNavyColors = lightColorScheme(
    primary = Accent,
    secondary = DeepTeal,
    tertiary = Ocean,
    background = androidx.compose.ui.graphics.Color(0xFFF9F1EE),
    surface = androidx.compose.ui.graphics.Color(0xFFF5E5DF),
    onPrimary = Mist,
    onSecondary = Mist,
    onBackground = Ink,
    onSurface = Ink
)

private val EmeraldLedgerColors = lightColorScheme(
    primary = androidx.compose.ui.graphics.Color(0xFF156A52),
    secondary = androidx.compose.ui.graphics.Color(0xFF6B8A3A),
    tertiary = Accent,
    background = androidx.compose.ui.graphics.Color(0xFFF3F6EC),
    surface = androidx.compose.ui.graphics.Color(0xFFE3EED8),
    onPrimary = Mist,
    onSecondary = Mist,
    onBackground = Ink,
    onSurface = Ink
)

@Composable
fun MotoLeasingAgentTheme(
    themeKey: String = "sandstone",
    content: @Composable () -> Unit
) {
    val colors = when (themeKey.lowercase()) {
        "crimson-navy" -> CrimsonNavyColors
        "emerald-ledger" -> EmeraldLedgerColors
        else -> SandstoneColors
    }

    MaterialTheme(
        colorScheme = colors,
        typography = Typography,
        shapes = Shapes,
        content = content
    )
}
