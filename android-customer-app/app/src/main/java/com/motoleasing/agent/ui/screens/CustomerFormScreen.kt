package com.motoleasing.agent.ui.screens

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.net.Uri
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Badge
import androidx.compose.material.icons.outlined.EditNote
import androidx.compose.material.icons.outlined.PersonAddAlt1
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
import androidx.compose.runtime.LaunchedEffect
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
import com.motoleasing.agent.data.api.CustomerDto
import com.motoleasing.agent.ui.CustomerFormState
import com.motoleasing.agent.ui.CustomerUploadField
import java.io.ByteArrayOutputStream

@Composable
fun CustomerFormScreen(
    state: CustomerFormState,
    customers: List<CustomerDto>,
    editingCustomerId: String?,
    backendUrl: String,
    loading: Boolean,
    onChange: (CustomerFormState.() -> CustomerFormState) -> Unit,
    onSelectCustomer: (String) -> Unit,
    onStartNewCustomer: () -> Unit,
    onSubmit: () -> Unit,
    onUploadAsset: (CustomerUploadField, String, String, ByteArray) -> Unit
) {
    val context = LocalContext.current
    val captureCustomerAsset = rememberCameraCapture(context, onUploadAsset)
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
    var showOnboarding by remember { mutableStateOf(false) }
    var showRecords by remember { mutableStateOf(false) }

    LaunchedEffect(editingCustomerId) {
        if (!editingCustomerId.isNullOrBlank()) {
            showOnboarding = true
        }
    }

    LazyColumn(
        contentPadding = PaddingValues(18.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Text("Customer", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        }
        item {
            Text(
                "Use the mobile app like a compact web workspace: open onboarding, review your customers, and edit mistakes safely.",
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        item {
            ActionCard(
                title = if (editingCustomerId.isNullOrBlank()) "Customer Onboarding" else "Continue Editing Customer",
                subtitle = if (editingCustomerId.isNullOrBlank()) {
                    "Open the full onboarding form in a focused mobile page."
                } else {
                    "Resume the selected customer form and correct the record."
                },
                icon = Icons.Outlined.PersonAddAlt1,
                accent = listOf(Color(0xFF0F4C81), Color(0xFF1C7ED6)),
                onClick = {
                    if (editingCustomerId.isNullOrBlank()) {
                        onStartNewCustomer()
                    }
                    showOnboarding = true
                }
            )
        }
        item {
            ActionCard(
                title = "My Customers",
                subtitle = "${customers.size} customer records created by this employee. Tap to review and edit.",
                icon = Icons.Outlined.EditNote,
                accent = listOf(Color(0xFF0F766E), Color(0xFF14B8A6)),
                onClick = { showRecords = true }
            )
        }
    }

    if (showOnboarding) {
        FullScreenPopup(
            title = if (editingCustomerId.isNullOrBlank()) "Customer Onboarding" else "Edit Customer",
            onDismiss = { showOnboarding = false }
        ) {
            LazyColumn(
                contentPadding = PaddingValues(18.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                item {
                    CustomerSelector(
                        customers = customers,
                        selectedCustomerId = editingCustomerId,
                        onSelectCustomer = onSelectCustomer,
                        onStartNewCustomer = onStartNewCustomer
                    )
                }
                item { SectionTitle("Identity") }
                item { AgentField("Customer Name", state.fullName) { onChange { copy(fullName = it) } } }
                item { AgentField("Father Name", state.fatherName) { onChange { copy(fatherName = it) } } }
                item { AgentField("CNIC / Passport", state.cnicPassportNumber) { onChange { copy(cnicPassportNumber = it) } } }
                item { GenderDropdown(selected = state.gender, onSelected = { onChange { copy(gender = it) } }) }
                item { AgentField("Date of Birth", state.dateOfBirth) { onChange { copy(dateOfBirth = it) } } }
                item { SectionTitle("Contact") }
                item { AgentField("Phone", state.contactPhone) { onChange { copy(contactPhone = it) } } }
                item { AgentField("Email", state.contactEmail) { onChange { copy(contactEmail = it) } } }
                item { AgentField("Country", state.country) { onChange { copy(country = it) } } }
                item { AgentField("Address", state.address, singleLine = false) { onChange { copy(address = it) } } }
                item { SectionTitle("Documents") }
                item {
                    UploadAction(
                        label = "CNIC Front",
                        currentValue = state.identityDocUrl,
                        buildAssetUrl = assetBuilder,
                        onCapture = { captureCustomerAsset(CustomerUploadField.CNIC_FRONT) }
                    )
                }
                item {
                    UploadAction(
                        label = "CNIC Back",
                        currentValue = state.identityDocBackUrl,
                        buildAssetUrl = assetBuilder,
                        onCapture = { captureCustomerAsset(CustomerUploadField.CNIC_BACK) }
                    )
                }
                item {
                    Button(
                        onClick = {
                            onSubmit()
                            if (!loading) {
                                showOnboarding = false
                            }
                        },
                        enabled = !loading && state.fullName.isNotBlank() && state.cnicPassportNumber.isNotBlank(),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            if (loading) {
                                if (editingCustomerId.isNullOrBlank()) "Submitting..." else "Updating..."
                            } else {
                                if (editingCustomerId.isNullOrBlank()) "Save Customer" else "Update Customer"
                            }
                        )
                    }
                }
            }
        }
    }

    if (showRecords) {
        FullScreenPopup(
            title = "My Customers",
            onDismiss = { showRecords = false }
        ) {
            LazyColumn(
                contentPadding = PaddingValues(18.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                if (customers.isEmpty()) {
                    item {
                        EmptyStateCard("No customer records yet. Start from Customer Onboarding to create the first one.")
                    }
                } else {
                    items(customers, key = { it.id }) { customer ->
                        CustomerRecordCard(
                            customer = customer,
                            onEdit = {
                                onSelectCustomer(customer.id)
                                showRecords = false
                                showOnboarding = true
                            }
                        )
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

@Composable
private fun CustomerRecordCard(
    customer: CustomerDto,
    onEdit: () -> Unit
) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Icon(Icons.Outlined.Badge, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                Column {
                    Text(customer.fullName, fontWeight = FontWeight.Bold)
                    Text(customer.cnicPassportNumber, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
            if (!customer.contactPhone.isNullOrBlank()) {
                Text("Phone: ${customer.contactPhone}")
            }
            if (!customer.dealerName.isNullOrBlank()) {
                Text("Dealer: ${customer.dealerName}")
            }
            TextButton(onClick = onEdit, modifier = Modifier.fillMaxWidth()) {
                Text("Open and Edit")
            }
        }
    }
}

@Composable
private fun AgentField(
    label: String,
    value: String,
    singleLine: Boolean = true,
    onValueChange: (String) -> Unit
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        modifier = Modifier.fillMaxWidth(),
        singleLine = singleLine
    )
}

@Composable
private fun GenderDropdown(
    selected: String,
    onSelected: (String) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    val options = listOf("Male", "Female", "Other")
    Box(modifier = Modifier.fillMaxWidth()) {
        OutlinedTextField(
            value = selected,
            onValueChange = {},
            readOnly = true,
            label = { Text("Gender") },
            modifier = Modifier
                .fillMaxWidth()
                .clickable { expanded = true }
        )
        DropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false },
            modifier = Modifier.fillMaxWidth()
        ) {
            options.forEach { option ->
                DropdownMenuItem(
                    text = { Text(option) },
                    onClick = {
                        onSelected(option)
                        expanded = false
                    }
                )
            }
        }
    }
}

@Composable
private fun CustomerSelector(
    customers: List<CustomerDto>,
    selectedCustomerId: String?,
    onSelectCustomer: (String) -> Unit,
    onStartNewCustomer: () -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    val selectedLabel = customers.firstOrNull { it.id == selectedCustomerId }?.let {
        "${it.fullName} / ${it.cnicPassportNumber}"
    }.orEmpty()

    Box(modifier = Modifier.fillMaxWidth()) {
        OutlinedTextField(
            value = selectedLabel,
            onValueChange = {},
            readOnly = true,
            label = { Text("Existing Customer Record") },
            placeholder = { Text("Choose customer to edit") },
            modifier = Modifier
                .fillMaxWidth()
                .clickable { expanded = true }
        )
        DropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false },
            modifier = Modifier.fillMaxWidth()
        ) {
            DropdownMenuItem(
                text = { Text("Create New Customer") },
                onClick = {
                    onStartNewCustomer()
                    expanded = false
                }
            )
            customers.forEach { customer ->
                DropdownMenuItem(
                    text = { Text("${customer.fullName} / ${customer.cnicPassportNumber}") },
                    onClick = {
                        onSelectCustomer(customer.id)
                        expanded = false
                    }
                )
            }
        }
    }
}

@Composable
private fun UploadAction(
    label: String,
    currentValue: String,
    buildAssetUrl: (String) -> String,
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
                Text("No document scanned yet.", color = MaterialTheme.colorScheme.onSurfaceVariant)
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
            Button(onClick = onCapture, modifier = Modifier.fillMaxWidth()) {
                Text("Scan with Camera")
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

private fun isImageAsset(value: String): Boolean = value.matches(Regex("(?i).+\\.(png|jpe?g|gif|webp|bmp|svg)$"))

@Composable
private fun rememberCameraCapture(
    context: Context,
    onUploadAsset: (CustomerUploadField, String, String, ByteArray) -> Unit
): (CustomerUploadField) -> Unit {
    val pendingTarget = androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf(CustomerUploadField.CNIC_FRONT) }
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

private fun openExternalUrl(context: android.content.Context, url: String) {
    if (url.isBlank()) return
    val intent = android.content.Intent(android.content.Intent.ACTION_VIEW, Uri.parse(url))
        .addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
    context.startActivity(intent)
}
