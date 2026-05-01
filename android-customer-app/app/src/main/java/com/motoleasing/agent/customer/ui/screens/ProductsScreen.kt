package com.motoleasing.agent.customer.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.motoleasing.agent.customer.data.VehicleDto
import com.motoleasing.agent.customer.ui.CustomerViewModel

@Composable
fun ProductsScreen(
    viewModel: CustomerViewModel,
    mode: String,
    onOpenProduct: (vehicleId: String) -> Unit
) {
    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text(
            if (mode == "INSTALLMENT") "Installment Vehicles" else "Cash Vehicles",
            style = MaterialTheme.typography.titleLarge
        )
        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(viewModel.vehicles) { vehicle ->
                VehicleCard(viewModel, vehicle, mode, onOpenProduct)
            }
        }
    }
}

@Composable
private fun VehicleCard(
    viewModel: CustomerViewModel,
    vehicle: VehicleDto,
    mode: String,
    onOpenProduct: (String) -> Unit
) {
    val price = if (mode == "INSTALLMENT") vehicle.installmentTotalPrice else vehicle.cashTotalPrice

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onOpenProduct(vehicle.id) }
    ) {
        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            if (!vehicle.imageUrl.isNullOrBlank()) {
                AsyncImage(
                    model = viewModel.backendUrl.trimEnd('/') + vehicle.imageUrl,
                    contentDescription = "${vehicle.brand} ${vehicle.model}",
                    modifier = Modifier.fillMaxWidth()
                )
            }
            Text("${vehicle.brand} ${vehicle.model}", style = MaterialTheme.typography.titleMedium)
            Text("Total: $price", style = MaterialTheme.typography.bodyMedium)
        }
    }
}
