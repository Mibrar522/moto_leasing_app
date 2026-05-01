package com.motoleasing.agent.customer.ui.screens

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
import com.motoleasing.agent.customer.data.DealerDto
import com.motoleasing.agent.customer.ui.CustomerViewModel

@Composable
fun DealersScreen(viewModel: CustomerViewModel) {
    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("Dealers", style = MaterialTheme.typography.titleLarge)
        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(viewModel.dealers) { dealer ->
                DealerCard(dealer)
            }
        }
    }
}

@Composable
private fun DealerCard(dealer: DealerDto) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(dealer.dealerName, style = MaterialTheme.typography.titleMedium)
            if (!dealer.dealerAddress.isNullOrBlank()) Text(dealer.dealerAddress ?: "")
            val phone = listOfNotNull(dealer.mobileCountryCode, dealer.mobileNumber).joinToString(" ")
            if (phone.isNotBlank()) Text(phone)
        }
    }
}

