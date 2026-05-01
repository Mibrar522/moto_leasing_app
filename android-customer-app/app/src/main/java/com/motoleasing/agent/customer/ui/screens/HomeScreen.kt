package com.motoleasing.agent.customer.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.motoleasing.agent.customer.data.AdDto
import com.motoleasing.agent.customer.data.VehicleDto
import com.motoleasing.agent.customer.ui.CustomerViewModel
import kotlinx.coroutines.delay

@Composable
fun HomeScreen(
    viewModel: CustomerViewModel,
    onOpenProducts: (mode: String) -> Unit,
    onOpenOrders: () -> Unit,
    onOpenDealers: () -> Unit
) {
    val name = viewModel.profile?.fullName ?: "Customer"
    val phone = viewModel.profile?.phoneE164 ?: ""
    val context = LocalContext.current
    val baseUrl = remember(viewModel.backendUrl) { viewModel.backendUrl.trimEnd('/') }

    LaunchedEffect(Unit) {
        viewModel.loadHome(viewModel.profile?.preferredDealerId)
        viewModel.refreshOrders()
    }

    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Welcome $name", style = MaterialTheme.typography.headlineSmall)
        if (phone.isNotBlank()) Text(phone, style = MaterialTheme.typography.bodyMedium)

        AutoSlidingAdCarousel(
            ads = viewModel.ads,
            imageUrl = { ad -> baseUrl + (ad.imageUrl ?: "") },
            onOpenUrl = { url ->
                val safe = url?.trim().orEmpty()
                if (safe.isBlank()) return@AutoSlidingAdCarousel
                try {
                    context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(safe)))
                } catch (_: Exception) { }
            }
        )

        AutoSlidingVehicleCarousel(
            vehicles = viewModel.vehicles,
            imageUrl = { vehicle -> baseUrl + (vehicle.imageUrl ?: "") }
        )

        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Button(
                onClick = onOpenOrders,
                modifier = Modifier.weight(1f)
            ) { Text("Order Card") }
            Button(
                onClick = onOpenDealers,
                modifier = Modifier.weight(1f)
            ) { Text("Dealer Card") }
        }

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("Purchase", style = MaterialTheme.typography.titleMedium)
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Button(onClick = { onOpenProducts("CASH") }, modifier = Modifier.weight(1f)) {
                        Text("Cash")
                    }
                    Button(onClick = { onOpenProducts("INSTALLMENT") }, modifier = Modifier.weight(1f)) {
                        Text("Installment")
                    }
                }
            }
        }
    }
}

@Composable
private fun AutoSlidingAdCarousel(
    ads: List<AdDto>,
    imageUrl: (AdDto) -> String,
    onOpenUrl: (String?) -> Unit
) {
    if (ads.isEmpty()) return

    val pagerState = rememberPagerState(pageCount = { ads.size })

    LaunchedEffect(ads.size) {
        if (ads.size <= 1) return@LaunchedEffect
        while (true) {
            delay(3500)
            val next = (pagerState.currentPage + 1) % ads.size
            pagerState.animateScrollToPage(next)
        }
    }

    HorizontalPager(state = pagerState, modifier = Modifier.fillMaxWidth()) { index ->
        val ad = ads[index]
        Card(
            modifier = Modifier
                .padding(end = 12.dp)
                .height(180.dp)
                .clickable { onOpenUrl(ad.ctaUrl) }
        ) {
            AsyncImage(
                model = imageUrl(ad),
                contentDescription = ad.title ?: "Ad",
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}

@Composable
private fun AutoSlidingVehicleCarousel(
    vehicles: List<VehicleDto>,
    imageUrl: (VehicleDto) -> String
) {
    if (vehicles.isEmpty()) return

    val top = vehicles.take(8)
    val pagerState = rememberPagerState(pageCount = { top.size })

    LaunchedEffect(top.size) {
        if (top.size <= 1) return@LaunchedEffect
        while (true) {
            delay(3200)
            val next = (pagerState.currentPage + 1) % top.size
            pagerState.animateScrollToPage(next)
        }
    }

    HorizontalPager(state = pagerState, modifier = Modifier.fillMaxWidth()) { index ->
        val v = top[index]
        val title = "${v.brand} ${v.model}"
        Card(
            modifier = Modifier
                .padding(end = 12.dp)
                .height(200.dp)
        ) {
            Column(modifier = Modifier.padding(10.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                if (!v.imageUrl.isNullOrBlank()) {
                    AsyncImage(
                        model = imageUrl(v),
                        contentDescription = title,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(120.dp)
                    )
                }
                Text(title, style = MaterialTheme.typography.titleMedium)
                Text("Cash: ${v.cashTotalPrice} | Installment: ${v.installmentTotalPrice}", style = MaterialTheme.typography.bodyMedium)
            }
        }
    }
}
