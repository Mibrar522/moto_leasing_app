package com.motoleasing.agent.ui.screens

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.net.Uri
import android.provider.OpenableColumns
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Assignment
import androidx.compose.material.icons.outlined.Inventory2
import androidx.compose.material.icons.outlined.ReceiptLong
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.core.content.ContextCompat
import coil.compose.AsyncImage
import com.motoleasing.agent.data.api.AdDto
import com.motoleasing.agent.data.api.CustomerDto
import com.motoleasing.agent.data.api.InventoryVehicleDto
import com.motoleasing.agent.data.api.SaleTransactionDto
import com.motoleasing.agent.ui.SaleFormState
import com.motoleasing.agent.ui.SaleUploadField
import java.io.ByteArrayOutputStream

@Composable
fun SaleFormScreen(
    state: SaleFormState,
    backendUrl: String,
    loading: Boolean,
    ads: List<AdDto>,
    customers: List<CustomerDto>,
    vehicles: List<InventoryVehicleDto>,
    sales: List<SaleTransactionDto>,
    onChange: (SaleFormState.() -> SaleFormState) -> Unit,
    onSubmit: () -> Unit,
    onUploadAsset: (SaleUploadField, String, String, ByteArray) -> Unit,
    buildAssetUrl: (String?) -> String
) {
    val context = LocalContext.current
    val uploadSaleAsset = rememberSaleDocumentPicker(context, onUploadAsset)
    val captureSaleAsset = rememberSaleCameraCapture(context, onUploadAsset)
    val assetBuilder = remember(backendUrl) {
        { assetUrl: String ->
            val raw = assetUrl.trim()
            if (raw.isBlank()) {
                ""
            } else if (raw.startsWith("http://") || raw.startsWith("https://")) {
                raw
            } else {
                val origin = backendUrl.removeSuffix("/").replace(Regex("/api/v1/?$"), "")
                val normalizedPath = if (raw.startsWith("/")) raw else "/$raw"
                "$origin$normalizedPath"
            }
        }
    }
    val selectedCustomer = customers.firstOrNull { it.id == state.customerId }
    val selectedVehicle = vehicles.firstOrNull { it.id == state.vehicleId }
    val selectedCustomerSales = remember(state.customerId, sales, selectedCustomer) {
        sales.filter { sale ->
            when {
                !sale.customerId.isNullOrBlank() -> sale.customerId == state.customerId
                selectedCustomer != null -> sale.customerName.equals(selectedCustomer.fullName, ignoreCase = true)
                else -> false
            }
        }
    }
    var showCreateSale by remember { mutableStateOf(false) }
    var showSalesRecords by remember { mutableStateOf(false) }
    var showInventory by remember { mutableStateOf(false) }
    var selectedInventoryVehicle by remember { mutableStateOf<InventoryVehicleDto?>(null) }

    LazyColumn(
        contentPadding = PaddingValues(18.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Text("Sales", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        }
        item {
            Text(
                "This mobile sales workspace now follows the web pattern: choose customer, choose available vehicle, review records, and submit from focused pop-up pages.",
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        item {
            ActionCard(
                title = "Create Sale",
                subtitle = "Open the full mobile sales form with dropdown customer and vehicle selection.",
                icon = Icons.Outlined.Assignment,
                accent = listOf(Color(0xFF7C2D12), Color(0xFFF97316)),
                onClick = { showCreateSale = true }
            )
        }
        item {
            ActionCard(
                title = "My Sales",
                subtitle = "${sales.size} sales records available in this profile view. Tap to inspect transactions.",
                icon = Icons.Outlined.ReceiptLong,
                accent = listOf(Color(0xFF0F4C81), Color(0xFF38BDF8)),
                onClick = { showSalesRecords = true }
            )
        }
        item {
            ActionCard(
                title = "Available Inventory",
                subtitle = "${vehicles.size} available vehicles synced from the web inventory. Tap to browse model and stock.",
                icon = Icons.Outlined.Inventory2,
                accent = listOf(Color(0xFF14532D), Color(0xFF22C55E)),
                onClick = { showInventory = true }
            )
        }
        if (ads.isNotEmpty()) {
            item {
                ApplicationOffersSection(
                    ads = ads,
                    buildAssetUrl = buildAssetUrl
                )
            }
        }
    }

    if (showCreateSale) {
        FullScreenPopup(
            title = "Sales Agreement Form",
            onDismiss = { showCreateSale = false }
        ) {
            LazyColumn(
                contentPadding = PaddingValues(18.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                item { SectionTitle("Customer Selection") }
                item {
                    SaleDropdown(
                        label = "Customer",
                        selectedId = state.customerId,
                        options = customers.map { it.id to "${it.fullName} / ${it.cnicPassportNumber}" },
                        onSelected = { onChange { copy(customerId = it) } },
                        enabled = true
                    )
                }
                if (selectedCustomer != null) {
                    item { CustomerSummaryCard(selectedCustomer) }
                }
                if (selectedCustomerSales.isNotEmpty()) {
                    item { SectionTitle("Customer Transactions") }
                    items(selectedCustomerSales, key = { it.id }) { sale ->
                        SaleRecordCard(sale = sale, compact = true)
                    }
                }
                item { SectionTitle("Vehicle Selection") }
                item {
                    SaleDropdown(
                        label = "Available Vehicle",
                        selectedId = state.vehicleId,
                        options = vehicles.map { vehicle ->
                            vehicle.id to listOfNotNull(
                                vehicle.brand,
                                vehicle.model,
                                vehicle.registrationNumber,
                                vehicle.vehicleType
                            ).joinToString(" / ")
                        },
                        onSelected = { selectedId ->
                            val vehicle = vehicles.firstOrNull { it.id == selectedId }
                            val priceText = vehicle?.purchasePrice?.let { formatAmount(it) }.orEmpty()
                            onChange {
                                val withVehicle = copy(vehicleId = selectedId, vehiclePrice = priceText)
                                computeDerivedAmounts(withVehicle)
                            }
                        },
                        enabled = true
                    )
                }
                if (selectedVehicle != null) {
                    item {
                        VehicleSummaryCard(
                            vehicle = selectedVehicle,
                            onOpen = { selectedInventoryVehicle = selectedVehicle }
                        )
                    }
                }
                item { SectionTitle("Agreement Details") }
                item {
                    SaleDropdown(
                        label = "Sale Mode",
                        selectedId = state.saleMode,
                        options = listOf("INSTALLMENT" to "Installment", "CASH" to "Cash"),
                        onSelected = { onChange { copy(saleMode = it) } },
                        enabled = true
                    )
                }
                item { SaleField("Agreement Number", state.agreementNumber) { onChange { copy(agreementNumber = it) } } }
                item { SaleField("Agreement Date", state.agreementDate) { onChange { copy(agreementDate = it) } } }
                item { SaleField("Purchase Date", state.purchaseDate) { onChange { copy(purchaseDate = it) } } }
                item { SaleField("Vehicle Price", state.vehiclePrice, readOnly = true) { } }
                item {
                    SaleDropdown(
                        label = "Down Payment Mode",
                        selectedId = state.downPaymentMode,
                        options = listOf("AMOUNT" to "Amount", "PERCENT" to "Percent"),
                        onSelected = { mode ->
                            onChange {
                                val updated = copy(downPaymentMode = mode)
                                computeDerivedAmounts(updated)
                            }
                        },
                        enabled = true
                    )
                }
                if (state.downPaymentMode == "PERCENT") {
                    item {
                        SaleField("Down Payment Percent", state.downPaymentPercent) { percent ->
                            onChange {
                                val updated = copy(downPaymentPercent = percent)
                                computeDerivedAmounts(updated)
                            }
                        }
                    }
                    item { SaleField("Down Payment", state.downPayment, readOnly = true) { } }
                } else {
                    item {
                        SaleField("Down Payment", state.downPayment) { value ->
                            onChange {
                                val updated = copy(downPayment = value)
                                computeDerivedAmounts(updated)
                            }
                        }
                    }
                }
                item { SaleField("Financed Amount", state.financedAmount, readOnly = true) { } }
                item { SaleField("Monthly Installment", state.monthlyInstallment) { onChange { copy(monthlyInstallment = it) } } }
                item { SaleField("Installment Months", state.installmentMonths) { onChange { copy(installmentMonths = it) } } }
                item { SaleField("First Due Date", state.firstDueDate) { onChange { copy(firstDueDate = it) } } }
                item { SectionTitle("Witnesses") }
                item { SaleField("Witness Name", state.witnessName) { onChange { copy(witnessName = it) } } }
                item { SaleField("Witness CNIC", state.witnessCnic) { onChange { copy(witnessCnic = it) } } }
                item { SaleField("Witness 2 Name", state.witnessTwoName) { onChange { copy(witnessTwoName = it) } } }
                item { SaleField("Witness 2 CNIC", state.witnessTwoCnic) { onChange { copy(witnessTwoCnic = it) } } }
                item { SaleField("Remarks", state.remarks, singleLine = false) { onChange { copy(remarks = it) } } }
                item { SectionTitle("Attachments") }
                item {
                    UploadAction("Agreement PDF", state.agreementPdfUrl, assetBuilder, showCamera = false, onUpload = {
                        uploadSaleAsset(SaleUploadField.AGREEMENT, "application/pdf")
                    }, onCapture = {})
                }
                item {
                    UploadAction("Dealer Signature", state.dealerSignatureUrl, assetBuilder, onUpload = {
                        uploadSaleAsset(SaleUploadField.DEALER_SIGNATURE, "image/*")
                    }, onCapture = { captureSaleAsset(SaleUploadField.DEALER_SIGNATURE) })
                }
                item {
                    UploadAction("Authorized Signature", state.authorizedSignatureUrl, assetBuilder, onUpload = {
                        uploadSaleAsset(SaleUploadField.AUTHORIZED_SIGNATURE, "image/*")
                    }, onCapture = { captureSaleAsset(SaleUploadField.AUTHORIZED_SIGNATURE) })
                }
                item {
                    UploadAction("Customer CNIC Front", state.customerCnicFrontUrl, assetBuilder, onUpload = {
                        uploadSaleAsset(SaleUploadField.CUSTOMER_CNIC_FRONT, "image/*")
                    }, onCapture = { captureSaleAsset(SaleUploadField.CUSTOMER_CNIC_FRONT) })
                }
                item {
                    UploadAction("Customer CNIC Back", state.customerCnicBackUrl, assetBuilder, onUpload = {
                        uploadSaleAsset(SaleUploadField.CUSTOMER_CNIC_BACK, "image/*")
                    }, onCapture = { captureSaleAsset(SaleUploadField.CUSTOMER_CNIC_BACK) })
                }
                item {
                    UploadAction("Bank Check", state.bankCheckUrl, assetBuilder, showCamera = false, onUpload = {
                        uploadSaleAsset(SaleUploadField.BANK_CHECK, "*/*")
                    }, onCapture = {})
                }
                item {
                    UploadAction("Misc Document", state.miscDocumentUrl, assetBuilder, showCamera = false, onUpload = {
                        uploadSaleAsset(SaleUploadField.MISC_DOCUMENT, "*/*")
                    }, onCapture = {})
                }
                item {
                    Button(
                        onClick = {
                            onSubmit()
                            if (!loading) {
                                showCreateSale = false
                            }
                        },
                        enabled = !loading && state.customerId.isNotBlank() && state.vehicleId.isNotBlank(),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(if (loading) "Submitting..." else "Submit Sales Request")
                    }
                }
            }
        }
    }

    if (showSalesRecords) {
        FullScreenPopup(
            title = "My Sales",
            onDismiss = { showSalesRecords = false }
        ) {
            LazyColumn(
                contentPadding = PaddingValues(18.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                if (sales.isEmpty()) {
                    item {
                        EmptyStateCard("No sales transactions are visible for this profile yet.")
                    }
                } else {
                    items(sales, key = { it.id }) { sale ->
                        SaleRecordCard(sale = sale, compact = false)
                    }
                }
            }
        }
    }

    if (showInventory) {
        FullScreenPopup(
            title = "Available Inventory",
            onDismiss = { showInventory = false }
        ) {
            LazyColumn(
                contentPadding = PaddingValues(18.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                if (vehicles.isEmpty()) {
                    item {
                        EmptyStateCard("No available vehicles are synced right now.")
                    }
                } else {
                    items(vehicles, key = { it.id }) { vehicle ->
                        InventoryRecordCard(
                            vehicle = vehicle,
                            onOpen = { selectedInventoryVehicle = vehicle }
                        )
                    }
                }
            }
        }
    }

    selectedInventoryVehicle?.let { vehicle ->
        Dialog(onDismissRequest = { selectedInventoryVehicle = null }) {
            Surface(shape = MaterialTheme.shapes.large) {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text(
                        listOfNotNull(vehicle.brand, vehicle.model).joinToString(" ").ifBlank { "Vehicle" },
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    Text("Model: ${vehicle.model ?: "Not set"}")
                    Text("Brand: ${vehicle.brand ?: "Not set"}")
                    Text("Type: ${vehicle.vehicleType ?: "Not set"}")
                    Text("Registration: ${vehicle.registrationNumber ?: "Not set"}")
                    Text("Status: ${vehicle.status ?: "AVAILABLE"}")
                    Text("Purchase Price: ${formatAmount(vehicle.purchasePrice ?: 0.0)}")
                    TextButton(
                        onClick = {
                            onChange {
                                val withVehicle = copy(
                                    vehicleId = vehicle.id,
                                    vehiclePrice = formatAmount(vehicle.purchasePrice ?: 0.0)
                                )
                                computeDerivedAmounts(withVehicle)
                            }
                            showCreateSale = true
                            selectedInventoryVehicle = null
                        },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Use This Vehicle")
                    }
                    TextButton(onClick = { selectedInventoryVehicle = null }, modifier = Modifier.fillMaxWidth()) {
                        Text("Close")
                    }
                }
            }
        }
    }
}

@Composable
private fun CustomerSummaryCard(customer: CustomerDto) {
    Card {
        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text("Selected Customer", fontWeight = FontWeight.SemiBold)
            Text(customer.fullName, fontWeight = FontWeight.Bold)
            Text("CNIC: ${customer.cnicPassportNumber}")
            if (!customer.contactPhone.isNullOrBlank()) {
                Text("Phone: ${customer.contactPhone}")
            }
            if (!customer.dealerName.isNullOrBlank()) {
                Text("Dealer: ${customer.dealerName}")
            }
        }
    }
}

@Composable
private fun VehicleSummaryCard(
    vehicle: InventoryVehicleDto,
    onOpen: () -> Unit
) {
    Card(modifier = Modifier.fillMaxWidth().clickable { onOpen() }) {
        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text("Selected Vehicle", fontWeight = FontWeight.SemiBold)
            Text(
                listOfNotNull(vehicle.brand, vehicle.model).joinToString(" ").ifBlank { "Vehicle" },
                fontWeight = FontWeight.Bold
            )
            Text("Type: ${vehicle.vehicleType.orEmpty()}")
            Text("Registration: ${vehicle.registrationNumber.orEmpty()}")
            Text("Synced price: ${formatAmount(vehicle.purchasePrice ?: 0.0)}")
            Text("Tap to open full vehicle details", color = MaterialTheme.colorScheme.primary)
        }
    }
}

@Composable
private fun SaleRecordCard(
    sale: SaleTransactionDto,
    compact: Boolean
) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(sale.customerName ?: "Customer", fontWeight = FontWeight.Bold)
            Text(
                listOfNotNull(sale.brand, sale.model).joinToString(" ").ifBlank { "Vehicle not set" },
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Text("Agreement: ${sale.agreementNumber ?: "Pending"}")
            Text("Mode: ${sale.saleMode ?: "Not set"}")
            Text("Status: ${sale.status ?: sale.approvalStatus ?: "Pending"}")
            if (!compact) {
                Text("Registration: ${sale.registrationNumber ?: "Not set"}")
                Text("Vehicle Type: ${sale.vehicleType ?: "Not set"}")
                Text("Value: ${formatAmount(sale.vehiclePrice ?: 0.0)}")
            }
        }
    }
}

@Composable
private fun InventoryRecordCard(
    vehicle: InventoryVehicleDto,
    onOpen: () -> Unit
) {
    Card(modifier = Modifier.fillMaxWidth().clickable { onOpen() }) {
        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(
                listOfNotNull(vehicle.brand, vehicle.model).joinToString(" ").ifBlank { "Vehicle" },
                fontWeight = FontWeight.Bold
            )
            Text("Registration: ${vehicle.registrationNumber ?: "Not set"}")
            Text("Type: ${vehicle.vehicleType ?: "Not set"}")
            Text("Price: ${formatAmount(vehicle.purchasePrice ?: 0.0)}")
            Text("Tap to view vehicle details", color = MaterialTheme.colorScheme.primary)
        }
    }
}

@Composable
private fun ApplicationOffersSection(
    ads: List<AdDto>,
    buildAssetUrl: (String?) -> String
) {
    Card {
        Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text("Live Offers", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Text(
                "Promotions published from the web ad studio appear here and flow into the mobile sales journey.",
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                items(
                    items = ads.take(5),
                    key = { ad -> ad.id }
                ) { ad ->
                    ApplicationOfferCard(
                        ad = ad,
                        buildAssetUrl = buildAssetUrl
                    )
                }
            }
        }
    }
}

@Composable
private fun ApplicationOfferCard(
    ad: AdDto,
    buildAssetUrl: (String?) -> String
) {
    val context = LocalContext.current
    val imageUrl = buildAssetUrl(ad.imageUrl)
    val targetUrl = ad.ctaUrl?.takeIf { it.isNotBlank() } ?: imageUrl

    Card(modifier = Modifier.width(280.dp)) {
        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Text("Web-managed offer", color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.SemiBold)
            if (imageUrl.isNotBlank()) {
                AsyncImage(
                    model = imageUrl,
                    contentDescription = ad.title ?: "Offer image",
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(140.dp),
                    contentScale = ContentScale.Crop
                )
            }
            Text(ad.title ?: "Lease Offer", fontWeight = FontWeight.Bold)
            Text(
                ad.subtitle ?: "Create and schedule this offer from web so it appears during sales intake.",
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            if (targetUrl.isNotBlank()) {
                Button(
                    onClick = { openExternalUrl(context, targetUrl) },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(ad.ctaLabel?.takeIf { it.isNotBlank() } ?: "Open Offer")
                }
            }
        }
    }
}

@Composable
private fun SaleField(
    label: String,
    value: String,
    singleLine: Boolean = true,
    readOnly: Boolean = false,
    onValueChange: (String) -> Unit
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        modifier = Modifier.fillMaxWidth(),
        singleLine = singleLine,
        readOnly = readOnly
    )
}

@Composable
private fun SaleDropdown(
    label: String,
    selectedId: String,
    options: List<Pair<String, String>>,
    onSelected: (String) -> Unit,
    enabled: Boolean
) {
    var expanded by remember { mutableStateOf(false) }
    val selectedLabel = options.firstOrNull { it.first == selectedId }?.second.orEmpty()

    Box(modifier = Modifier.fillMaxWidth()) {
        OutlinedTextField(
            value = selectedLabel,
            onValueChange = {},
            readOnly = true,
            label = { Text(label) },
            modifier = Modifier
                .fillMaxWidth()
                .clickable(enabled = enabled) { expanded = true },
            enabled = enabled
        )
        DropdownMenu(
            expanded = expanded && enabled,
            onDismissRequest = { expanded = false },
            modifier = Modifier.fillMaxWidth()
        ) {
            options.forEach { (id, text) ->
                DropdownMenuItem(
                    text = { Text(text) },
                    onClick = {
                        onSelected(id)
                        expanded = false
                    }
                )
            }
        }
    }
}

@Composable
private fun rememberSaleDocumentPicker(
    context: Context,
    onUploadAsset: (SaleUploadField, String, String, ByteArray) -> Unit
): (SaleUploadField, String) -> Unit {
    val pendingTarget = androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf(SaleUploadField.AGREEMENT) }
    val launcher = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
        val currentUri = uri ?: return@rememberLauncherForActivityResult
        val bytes = context.contentResolver.openInputStream(currentUri)?.use { it.readBytes() } ?: return@rememberLauncherForActivityResult
        val mimeType = context.contentResolver.getType(currentUri) ?: "application/octet-stream"
        onUploadAsset(
            pendingTarget.value,
            readDocumentName(context, currentUri),
            mimeType,
            bytes
        )
    }

    return { target, mimeType ->
        pendingTarget.value = target
        launcher.launch(mimeType)
    }
}

@Composable
private fun UploadAction(
    label: String,
    currentValue: String,
    buildAssetUrl: (String) -> String,
    showCamera: Boolean = true,
    onUpload: () -> Unit,
    onCapture: () -> Unit
) {
    val previewUrl = buildAssetUrl(currentValue)
    val context = LocalContext.current
    var showPreview by remember { mutableStateOf(false) }
    val isImage = previewUrl.isNotBlank() && isImageAsset(currentValue)
    Card {
        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(label, fontWeight = FontWeight.SemiBold)
            if (currentValue.isBlank()) {
                Text("No file uploaded yet.", color = MaterialTheme.colorScheme.onSurfaceVariant)
            } else {
                val labelText = if (isImage) "Tap to preview" else "Open document"
                Text(
                    labelText,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.clickable {
                        if (isImage) {
                            showPreview = true
                        } else {
                            openExternalUrl(context, previewUrl)
                        }
                    }
                )
            }
            if (showCamera) {
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                    Button(onClick = onUpload) { Text("Upload") }
                    Button(onClick = onCapture) { Text("Camera") }
                }
            } else {
                Button(onClick = onUpload, modifier = Modifier.fillMaxWidth()) { Text("Upload") }
            }
        }
    }

    if (showPreview && isImage) {
        Dialog(onDismissRequest = { showPreview = false }) {
            Surface(shape = MaterialTheme.shapes.large) {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text(label, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                    AsyncImage(
                        model = previewUrl,
                        contentDescription = label,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(260.dp),
                        contentScale = ContentScale.Crop
                    )
                    TextButton(onClick = { showPreview = false }, modifier = Modifier.fillMaxWidth()) {
                        Text("Close Preview")
                    }
                }
            }
        }
    }
}

@Composable
private fun ActionCard(
    title: String,
    subtitle: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    accent: List<Color>,
    onClick: () -> Unit
) {
    Card(modifier = Modifier.fillMaxWidth().clickable { onClick() }) {
        Column(
            modifier = Modifier
                .background(Brush.linearGradient(accent))
                .padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Icon(icon, contentDescription = null, tint = Color.White)
            Text(title, color = Color.White, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Text(subtitle, color = Color.White.copy(alpha = 0.86f))
        }
    }
}

@Composable
private fun FullScreenPopup(
    title: String,
    onDismiss: () -> Unit,
    content: @Composable () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = MaterialTheme.colorScheme.background
        ) {
            Column(modifier = Modifier.fillMaxSize()) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(18.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(title, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                    TextButton(onClick = onDismiss) { Text("Close") }
                }
                Box(modifier = Modifier.fillMaxSize()) {
                    content()
                }
            }
        }
    }
}

@Composable
private fun SectionTitle(title: String) {
    Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
}

@Composable
private fun EmptyStateCard(message: String) {
    Card {
        Text(
            text = message,
            modifier = Modifier.padding(18.dp),
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

private fun isImageAsset(value: String): Boolean = value.matches(Regex("(?i).+\\.(png|jpe?g|gif|webp|bmp|svg)$"))

@Composable
private fun rememberSaleCameraCapture(
    context: Context,
    onUploadAsset: (SaleUploadField, String, String, ByteArray) -> Unit
): (SaleUploadField) -> Unit {
    val pendingTarget = androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf(SaleUploadField.DEALER_SIGNATURE) }
    val cameraLauncher = rememberLauncherForActivityResult(ActivityResultContracts.TakePicturePreview()) { bitmap: Bitmap? ->
        val currentBitmap = bitmap ?: return@rememberLauncherForActivityResult
        onUploadAsset(
            pendingTarget.value,
            "capture-${pendingTarget.value.name.lowercase()}.jpg",
            "image/jpeg",
            bitmapToJpegBytes(currentBitmap)
        )
    }
    val permissionLauncher = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        if (granted) {
            cameraLauncher.launch(null)
        } else {
            Toast.makeText(context, "Camera permission denied.", Toast.LENGTH_SHORT).show()
        }
    }

    return { target ->
        pendingTarget.value = target
        val granted = ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED
        if (granted) {
            cameraLauncher.launch(null)
        } else {
            permissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }
}

private fun bitmapToJpegBytes(bitmap: Bitmap): ByteArray {
    val stream = ByteArrayOutputStream()
    bitmap.compress(Bitmap.CompressFormat.JPEG, 92, stream)
    return stream.toByteArray()
}

private fun readDocumentName(context: Context, uri: Uri): String {
    return context.contentResolver.query(uri, null, null, null, null)?.use { cursor ->
        val nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
        if (cursor.moveToFirst() && nameIndex >= 0) {
            cursor.getString(nameIndex)
        } else {
            null
        }
    } ?: "document"
}

private fun openExternalUrl(context: Context, url: String) {
    if (url.isBlank()) return
    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    context.startActivity(intent)
}

private fun formatAmount(value: Double): String {
    return if (value == 0.0) {
        ""
    } else {
        java.text.DecimalFormat("0.##").format(value)
    }
}

private fun computeDerivedAmounts(state: SaleFormState): SaleFormState {
    val vehiclePrice = state.vehiclePrice.toDoubleOrNull() ?: 0.0
    if (vehiclePrice <= 0.0) return state.copy(financedAmount = "")

    return if (state.downPaymentMode == "PERCENT") {
        val percent = state.downPaymentPercent.toDoubleOrNull()?.coerceIn(0.0, 100.0) ?: 0.0
        val downPayment = (vehiclePrice * percent) / 100.0
        val financedAmount = (vehiclePrice - downPayment).coerceAtLeast(0.0)
        state.copy(
            downPayment = formatAmount(downPayment),
            financedAmount = formatAmount(financedAmount)
        )
    } else {
        val downPayment = state.downPayment.toDoubleOrNull()?.coerceAtLeast(0.0) ?: 0.0
        val financedAmount = (vehiclePrice - downPayment).coerceAtLeast(0.0)
        state.copy(financedAmount = formatAmount(financedAmount))
    }
}
