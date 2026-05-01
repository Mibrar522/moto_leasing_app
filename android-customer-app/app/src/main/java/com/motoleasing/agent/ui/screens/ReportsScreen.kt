package com.motoleasing.agent.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.clickable
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Inventory2
import androidx.compose.material.icons.outlined.Payments
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Card
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.TextButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.motoleasing.agent.ui.ReportMetricState
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue

@Composable
fun ReportsScreen(
    metrics: List<ReportMetricState>
) {
    val commissionMetric = metrics.firstOrNull { it.title.contains("Commission", ignoreCase = true) }
    val stockMetric = metrics.firstOrNull { it.title.contains("Available Vehicles", ignoreCase = true) }
    var showCommissionDialog by remember { mutableStateOf(false) }
    var showStockDialog by remember { mutableStateOf(false) }

    LazyColumn(
        contentPadding = PaddingValues(18.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Text("Reports", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        }
        item {
            Text(
                "This mobile report area uses the same dashboard data as the web app, so staff can quickly review sales, workflow, vehicles, and commissions.",
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        if (commissionMetric != null || stockMetric != null) {
            item {
                Text("Quick Insights", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
            }
            item {
                LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    commissionMetric?.let { metric ->
                        item {
                            InsightCard(
                                title = "My Commission",
                                value = metric.value,
                                icon = Icons.Outlined.Payments,
                                onClick = { showCommissionDialog = true }
                            )
                        }
                    }
                    stockMetric?.let { metric ->
                        item {
                            InsightCard(
                                title = "Available Stock",
                                value = metric.value,
                                icon = Icons.Outlined.Inventory2,
                                onClick = { showStockDialog = true }
                            )
                        }
                    }
                }
            }
        }
        items(metrics) { metric ->
            ReportMetricCard(metric = metric, modifier = Modifier.fillMaxWidth())
        }
    }

    if (showCommissionDialog && commissionMetric != null) {
        InsightDialog(
            title = "My Commission",
            value = commissionMetric.value,
            caption = commissionMetric.caption,
            icon = Icons.Outlined.Payments,
            onDismiss = { showCommissionDialog = false }
        )
    }
    if (showStockDialog && stockMetric != null) {
        InsightDialog(
            title = "Available Stock",
            value = stockMetric.value,
            caption = stockMetric.caption,
            icon = Icons.Outlined.Inventory2,
            onDismiss = { showStockDialog = false }
        )
    }
}

@Composable
private fun ReportMetricCard(
    metric: ReportMetricState,
    modifier: Modifier = Modifier
) {
    Card(modifier = modifier) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(metric.title, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(metric.value, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Text(metric.caption, style = MaterialTheme.typography.bodySmall)
        }
    }
}

@Composable
private fun InsightCard(
    title: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    onClick: () -> Unit
) {
    Card(modifier = Modifier.padding(vertical = 2.dp)) {
        Column(
            modifier = Modifier
                .padding(16.dp)
                .clickable { onClick() },
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
            Text(title, fontWeight = FontWeight.SemiBold)
            Text(value, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
private fun InsightDialog(
    title: String,
    value: String,
    caption: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(title) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                    Column {
                        Text(value, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                        Text(caption, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) { Text("Close") }
        }
    )
}
