package com.motoleasing.agent.customer.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.motoleasing.agent.customer.data.VehicleDto
import com.motoleasing.agent.customer.ui.components.ModeSelector
import com.motoleasing.agent.customer.ui.components.PriceChip
import com.motoleasing.agent.customer.ui.components.ScreenHeader
import com.motoleasing.agent.customer.ui.CustomerViewModel

@Composable
fun ShopScreen(
    viewModel: CustomerViewModel,
    initialMode: String,
    onOpenVehicle: (mode: String, vehicleId: String) -> Unit
) {
    var mode by remember { mutableStateOf(if (initialMode == "INSTALLMENT") "INSTALLMENT" else "CASH") }
    var query by remember { mutableStateOf("") }

    val vehicles = remember(query, viewModel.vehicles) {
        val available = viewModel.vehicles.filter { (it.status ?: "AVAILABLE").uppercase() == "AVAILABLE" }
        val q = query.trim().lowercase()
        if (q.isBlank()) available else available.filter {
            listOf(it.brand, it.model, it.vehicleType, it.color, it.serialNumber, it.registrationNumber)
                .filterNotNull()
                .any { v -> v.lowercase().contains(q) }
        }
    }

    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        ScreenHeader(
            title = "Shop",
            subtitle = "Prices are synced from web and update automatically."
        )

        ModeSelector(selected = mode, onSelect = { mode = it })

        OutlinedTextField(
            value = query,
            onValueChange = { query = it },
            label = { Text("Search available vehicles") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(vehicles, key = { it.id }) { vehicle ->
                VehicleGridCard(
                    imageUrl = viewModel.buildAssetUrl(vehicle.imageUrl),
                    vehicle = vehicle,
                    mode = mode,
                    onOpen = { onOpenVehicle(mode, vehicle.id) }
                )
            }
        }
    }
}

@Composable
private fun VehicleGridCard(
    imageUrl: String?,
    vehicle: VehicleDto,
    mode: String,
    onOpen: () -> Unit
) {
    val title = "${vehicle.brand} ${vehicle.model}"
    val price = if (mode == "INSTALLMENT") vehicle.installmentTotalPrice else vehicle.cashTotalPrice

    Card(
        shape = RoundedCornerShape(18.dp),
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onOpen() }
    ) {
        Column(modifier = Modifier.padding(10.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            if (!imageUrl.isNullOrBlank()) {
                AsyncImage(
                    model = imageUrl,
                    contentDescription = title,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 2.dp)
                )
            }
            Text(title, style = MaterialTheme.typography.bodyLarge, fontWeight = FontWeight.SemiBold)
            PriceChip(label = if (mode == "INSTALLMENT") "Installment" else "Cash", value = price)
            if (mode == "INSTALLMENT") {
                Text("${vehicle.installmentMonths} months", style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}
