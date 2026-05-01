package com.motoleasing.agent.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.DirectionsBike
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.ReceiptLong
import androidx.compose.material.icons.outlined.Storefront
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.TextButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.motoleasing.agent.data.api.AdDto
import com.motoleasing.agent.data.api.SaleTransactionDto
import com.motoleasing.agent.data.api.InventoryVehicleDto
import com.motoleasing.agent.data.api.WorkflowTaskDto
import com.motoleasing.agent.ui.DashboardCardState
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import java.text.NumberFormat
import java.util.Locale

@Composable
fun DashboardScreen(
    dashboard: DashboardCardState,
    userName: String,
    dealerName: String,
    ads: List<AdDto>,
    inventory: List<InventoryVehicleDto>,
    sales: List<SaleTransactionDto>,
    tasks: List<WorkflowTaskDto>,
    onRefresh: () -> Unit,
    showSalesCards: Boolean,
    showCommissionCard: Boolean,
    showPendingTasksCard: Boolean,
    showTransactionsButton: Boolean,
    onOpenTransactions: () -> Unit,
    buildAssetUrl: (String?) -> String
) {
    val currency = NumberFormat.getCurrencyInstance(Locale("en", "PK"))
    val gradient = Brush.verticalGradient(
        colors = listOf(Color(0xFF0A2B45), Color(0xFF0F3857), Color(0xFF1B4D6B))
    )
    val glassColor = Color.White.copy(alpha = 0.12f)
    val featuredBikes = remember(inventory) { inventory.filter { it.status.equals("AVAILABLE", true) } }
    val adSlides = remember(ads) {
        if (ads.isEmpty()) {
            listOf(
                AdDto(
                    id = "fallback",
                    title = "Create new promotions",
                    subtitle = "Add ads from the web dashboard to reach every agent."
                )
            )
        } else {
            ads
        }
    }
    val pagerState = rememberPagerState(pageCount = { adSlides.size })
    var selectedBike: InventoryVehicleDto? = androidx.compose.runtime.remember { null }

    LaunchedEffect(adSlides.size) {
        if (adSlides.size <= 1) return@LaunchedEffect
        while (isActive) {
            delay(3200)
            val next = (pagerState.currentPage + 1) % adSlides.size
            pagerState.animateScrollToPage(next)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(gradient)
    ) {
        LazyColumn(
            contentPadding = PaddingValues(18.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            item {
                UserHeaderCard(
                    userId = dashboard.userId,
                    userName = userName.ifBlank { dashboard.employeeName },
                    dealerName = dealerName.ifBlank { dashboard.dealerName },
                    onRefresh = onRefresh,
                    showTransactionsButton = showTransactionsButton,
                    onOpenTransactions = onOpenTransactions
                )
            }
            item {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Highlights", fontWeight = FontWeight.SemiBold, color = Color.White)
                        Text("Auto slide", color = Color.White.copy(alpha = 0.7f))
                    }
                    HorizontalPager(
                        state = pagerState,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(160.dp)
                    ) { page ->
                        val ad = adSlides[page]
                        AdSlideCard(
                            ad = ad,
                            containerColor = glassColor,
                            index = page,
                            buildAssetUrl = buildAssetUrl
                        )
                    }
                }
            }
            if (showSalesCards || showCommissionCard || showPendingTasksCard) {
                val cards = buildList {
                    if (showSalesCards) {
                        add(MetricCardModel("Vehicle Sales", dashboard.totalVehicleSales.toString()))
                        add(MetricCardModel("Sales Value", currency.format(dashboard.totalVehicleSalesValue)))
                    }
                    if (showCommissionCard) {
                        add(MetricCardModel("Commission", currency.format(dashboard.totalCommission)))
                    }
                    if (showPendingTasksCard) {
                        add(MetricCardModel("Pending Tasks", dashboard.pendingTasks.toString()))
                    }
                }
                item {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("Quick Stats", fontWeight = FontWeight.SemiBold, color = Color.White)
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            items(cards) { card ->
                                CircleMetricCard(
                                    title = card.title,
                                    value = card.value,
                                    containerColor = glassColor
                                )
                            }
                        }
                    }
                }
            }
            if (featuredBikes.isNotEmpty()) {
                item {
                    Text(
                        "Featured Bikes",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = Color.White
                    )
                }
                items(featuredBikes.take(3)) { bike ->
                    GlassCard(containerColor = glassColor) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            Text(
                                listOfNotNull(bike.brand, bike.model).joinToString(" ").ifBlank { "Vehicle" },
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Text(
                                bike.registrationNumber ?: bike.vehicleType ?: "Onboarding required",
                                color = Color.White.copy(alpha = 0.8f)
                            )
                            Text("Tap to view details", color = Color.White.copy(alpha = 0.6f))
                        }
                    }
                }
            }
            item {
                Text(
                    "Recent Sales",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = Color.White
                )
            }
            items(sales.take(5)) { sale ->
                GlassCard(containerColor = glassColor) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(sale.customerName ?: "Customer", fontWeight = FontWeight.Bold, color = Color.White)
                        Text(
                            listOfNotNull(sale.brand, sale.model).joinToString(" ").ifBlank { "Vehicle not set" },
                            color = Color.White.copy(alpha = 0.8f)
                        )
                        Text("Mode: ${sale.saleMode ?: "Not set"}", color = Color.White.copy(alpha = 0.8f))
                        Text("Value: ${currency.format(sale.vehiclePrice ?: 0.0)}", color = Color.White.copy(alpha = 0.9f))
                    }
                }
            }
            item {
                Text(
                    "Workflow Queue",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = Color.White
                )
            }
            items(tasks.take(5)) { task ->
                GlassCard(containerColor = glassColor) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(task.customerName ?: "Customer request", fontWeight = FontWeight.Bold, color = Color.White)
                        Text(task.vehicleName ?: task.definitionName ?: "Sales request", color = Color.White.copy(alpha = 0.8f))
                        Text("Status: ${task.taskStatus ?: "Pending"}", color = Color.White.copy(alpha = 0.85f))
                    }
                }
            }
        }
    }

    selectedBike?.let { bike ->
        AlertDialog(
            onDismissRequest = { selectedBike = null },
            title = { Text(listOfNotNull(bike.brand, bike.model).joinToString(" ").ifBlank { "Vehicle" }) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Type: ${bike.vehicleType ?: "Not set"}")
                    Text("Registration: ${bike.registrationNumber ?: "Not set"}")
                    Text("Chassis: ${bike.chassisNumber ?: "Not set"}")
                    Text("Engine: ${bike.engineNumber ?: "Not set"}")
                    Text("Purchase Price: ${currency.format(bike.purchasePrice ?: 0.0)}")
                    Text("Monthly Rate: ${currency.format(bike.monthlyRate ?: 0.0)}")
                }
            },
            confirmButton = {
                TextButton(onClick = { selectedBike = null }) { Text("Close") }
            }
        )
    }
}

private data class MetricCardModel(
    val title: String,
    val value: String
)

@Composable
private fun BikeSlideCard(
    title: String,
    subtitle: String,
    containerColor: Color,
    onClick: (() -> Unit)? = null
) {
    val modifier = Modifier
        .fillMaxWidth()
        .clickable(enabled = onClick != null) { onClick?.invoke() }
    Card(
        colors = CardDefaults.cardColors(containerColor = containerColor),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Icon(
                imageVector = Icons.Outlined.DirectionsBike,
                contentDescription = "Bike",
                tint = Color.White
            )
            Text(title, color = Color.White, fontWeight = FontWeight.Bold)
            Text(subtitle, color = Color.White.copy(alpha = 0.75f))
            Text("Tap to view details", color = Color.White.copy(alpha = 0.6f))
        }
    }
}

@Composable
private fun CircleMetricCard(
    title: String,
    value: String,
    containerColor: Color
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = containerColor),
        modifier = Modifier.size(130.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalArrangement = Arrangement.Center
        ) {
            Text(title, color = Color.White.copy(alpha = 0.7f), maxLines = 2, overflow = TextOverflow.Ellipsis)
            Spacer(modifier = Modifier.height(6.dp))
            Text(value, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = Color.White)
        }
    }
}

@Composable
private fun GlassCard(
    containerColor: Color,
    content: @Composable () -> Unit
) {
    Card(colors = CardDefaults.cardColors(containerColor = containerColor)) {
        content()
    }
}

@Composable
private fun UserHeaderCard(
    userId: String,
    userName: String,
    dealerName: String,
    onRefresh: () -> Unit,
    showTransactionsButton: Boolean,
    onOpenTransactions: () -> Unit
) {
    GlassCard(containerColor = Color.White.copy(alpha = 0.12f)) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(imageVector = Icons.Outlined.Person, contentDescription = null, tint = Color.White)
                        Text(userName.ifBlank { "Field Agent" }, fontWeight = FontWeight.Bold, color = Color.White)
                    }
                    Text("User ID: ${userId.ifBlank { "N/A" }}", color = Color.White.copy(alpha = 0.7f))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(imageVector = Icons.Outlined.Storefront, contentDescription = null, tint = Color.White)
                        Text(dealerName.ifBlank { "Dealer Profile" }, color = Color.White.copy(alpha = 0.7f))
                    }
                }
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    if (showTransactionsButton) {
                        IconButton(onClick = onOpenTransactions) {
                            Icon(
                                imageVector = Icons.Outlined.ReceiptLong,
                                contentDescription = "Transactions",
                                tint = Color.White
                            )
                        }
                    }
                    Button(onClick = onRefresh) { Text("Refresh") }
                }
            }
        }
    }
}

@Composable
private fun AdSlideCard(
    ad: AdDto,
    containerColor: Color,
    index: Int,
    buildAssetUrl: (String?) -> String
) {
    val gradientSets = listOf(
        listOf(Color(0xFF7C3AED), Color(0xFFEC4899)),
        listOf(Color(0xFF22C55E), Color(0xFF16A34A)),
        listOf(Color(0xFFF97316), Color(0xFFFACC15)),
        listOf(Color(0xFF38BDF8), Color(0xFF0EA5E9))
    )
    val gradient = Brush.linearGradient(colors = gradientSets[index % gradientSets.size])

    val imageUrl = buildAssetUrl(ad.imageUrl)

    Card(
        colors = CardDefaults.cardColors(containerColor = containerColor),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .background(gradient)
                .padding(18.dp)
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text(
                    "Featured Vehicle",
                    color = Color.White.copy(alpha = 0.72f),
                    style = MaterialTheme.typography.labelMedium
                )
                Text(
                    ad.title ?: "Vehicle Campaign",
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    style = MaterialTheme.typography.headlineSmall,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
                if (!ad.subtitle.isNullOrBlank()) {
                    Text(
                        ad.subtitle,
                        color = Color.White.copy(alpha = 0.88f),
                        maxLines = 3,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                Text(
                    ad.ctaLabel?.takeIf { it.isNotBlank() } ?: "View details",
                    color = Color.White,
                    fontWeight = FontWeight.SemiBold
                )
            }

            if (imageUrl.isNotBlank()) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.16f)),
                    modifier = Modifier
                        .width(118.dp)
                        .height(118.dp)
                ) {
                    AsyncImage(
                        model = imageUrl,
                        contentDescription = ad.title ?: "Ad image",
                        modifier = Modifier.fillMaxSize()
                    )
                }
            }
        }
    }
}
