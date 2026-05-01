package com.motoleasing.agent.customer.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Search
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.motoleasing.agent.customer.data.AdDto
import com.motoleasing.agent.customer.data.VehicleDto
import com.motoleasing.agent.customer.ui.components.PagerDots
import com.motoleasing.agent.customer.ui.components.PriceChip
import com.motoleasing.agent.customer.ui.CustomerViewModel
import kotlinx.coroutines.delay

@Composable
fun HomeShowroomScreen(
    viewModel: CustomerViewModel,
    onOpenCash: () -> Unit,
    onOpenInstallment: () -> Unit,
    onOpenVehicle: (mode: String, vehicleId: String) -> Unit
) {
    val context = LocalContext.current
    val baseUrl = remember(viewModel.backendUrl) { viewModel.apiOrigin.trimEnd('/') }
    var query by remember { mutableStateOf("") }

    val featured = remember(viewModel.vehicles) {
        viewModel.vehicles
            .filter { (it.status ?: "AVAILABLE").uppercase() == "AVAILABLE" }
            .take(8)
    }
    val filtered = remember(query, featured) {
        val q = query.trim().lowercase()
        if (q.isBlank()) featured else featured.filter {
            listOf(it.brand, it.model, it.vehicleType, it.color, it.serialNumber, it.registrationNumber)
                .filterNotNull()
                .any { v -> v.lowercase().contains(q) }
        }
    }

    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(
                text = "Showroom",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.SemiBold
            )
            Text(text = "Only available vehicles are shown", style = MaterialTheme.typography.bodyMedium)
        }

        OutlinedTextField(
            value = query,
            onValueChange = { query = it },
            label = { Text("Search model, brand, serial...") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            leadingIcon = { Icon(Icons.Outlined.Search, contentDescription = "Search") }
        )

        AutoSlidingAds(
            ads = viewModel.ads,
            imageUrl = { ad -> viewModel.buildAssetUrl(ad.imageUrl) ?: "" },
            onOpenUrl = { url ->
                val safe = url?.trim().orEmpty()
                if (safe.isBlank()) return@AutoSlidingAds
                try {
                    context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(safe)))
                } catch (_: Exception) {}
            }
        )

        Card(shape = RoundedCornerShape(18.dp), modifier = Modifier.fillMaxWidth()) {
            Row(
                modifier = Modifier.padding(12.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(onClick = onOpenCash, modifier = Modifier.weight(1f)) { Text("Cash") }
                Button(onClick = onOpenInstallment, modifier = Modifier.weight(1f)) { Text("Installment") }
            }
        }

        Text("Featured stock", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)

        if (filtered.isEmpty()) {
            Text("No vehicles match the search.")
        } else {
            AutoSlidingVehicles(
                vehicles = filtered,
                imageUrl = { vehicle -> viewModel.buildAssetUrl(vehicle.imageUrl) ?: "" },
                onOpenVehicle = onOpenVehicle
            )
        }

        Spacer(Modifier.height(4.dp))
    }
}

@Composable
private fun AutoSlidingAds(
    ads: List<AdDto>,
    imageUrl: (AdDto) -> String,
    onOpenUrl: (String?) -> Unit
) {
    if (ads.isEmpty()) return
    val pagerState = rememberPagerState(pageCount = { ads.size })

    LaunchedEffect(ads.size) {
        if (ads.size <= 1) return@LaunchedEffect
        while (true) {
            delay(3800)
            pagerState.animateScrollToPage((pagerState.currentPage + 1) % ads.size)
        }
    }

    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        HorizontalPager(state = pagerState, modifier = Modifier.fillMaxWidth()) { index ->
            val ad = ads[index]
            Card(
                shape = RoundedCornerShape(22.dp),
                modifier = Modifier
                    .padding(end = 12.dp)
                    .height(190.dp)
                    .fillMaxWidth()
                    .clickable { onOpenUrl(ad.ctaUrl) }
            ) {
                Box {
                    AsyncImage(
                        model = imageUrl(ad),
                        contentDescription = ad.title ?: "Ad",
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        }
        PagerDots(count = ads.size, index = pagerState.currentPage)
    }
}

@Composable
private fun AutoSlidingVehicles(
    vehicles: List<VehicleDto>,
    imageUrl: (VehicleDto) -> String,
    onOpenVehicle: (mode: String, vehicleId: String) -> Unit
) {
    val pagerState = rememberPagerState(pageCount = { vehicles.size })

    LaunchedEffect(vehicles.size) {
        if (vehicles.size <= 1) return@LaunchedEffect
        while (true) {
            delay(3200)
            pagerState.animateScrollToPage((pagerState.currentPage + 1) % vehicles.size)
        }
    }

    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        HorizontalPager(state = pagerState, modifier = Modifier.fillMaxWidth()) { index ->
            val v = vehicles[index]
            val title = "${v.brand} ${v.model}"
            Card(
                shape = RoundedCornerShape(22.dp),
                modifier = Modifier
                    .padding(end = 12.dp)
                    .height(240.dp)
                    .fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    if (!v.imageUrl.isNullOrBlank()) {
                        AsyncImage(
                            model = imageUrl(v),
                            contentDescription = title,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(135.dp)
                        )
                    }
                    Text(title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.SemiBold)
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        PriceChip(label = "Cash", value = v.cashTotalPrice, modifier = Modifier.clickable { onOpenVehicle("CASH", v.id) })
                        PriceChip(label = "Installment", value = v.installmentTotalPrice, modifier = Modifier.clickable { onOpenVehicle("INSTALLMENT", v.id) })
                    }
                }
            }
        }
        PagerDots(count = vehicles.size, index = pagerState.currentPage)
    }
}
