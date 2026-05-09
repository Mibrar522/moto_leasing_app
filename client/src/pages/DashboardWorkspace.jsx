import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import AccessControl from './AccessControl';
import Applications from './Applications';
import CompanyProfile from './CompanyProfile';
import Dealers from './Dealers';
import Installments from './Installments';
import Employees from './Employees';
import Customers from './Customers';
import Products from './Products';
import Stock from './Stock';
import UserTasks from './UserTasks';
import Transactions from './Transactions';
import Sales from './Sales';
import Workflow from './Workflow';
import DealerEmployeesReport from './reports/DealerEmployeesReport';
import DealerInformationReport from './reports/DealerInformationReport';
import SalaryReport from './reports/SalaryReport';
import EmployeesReport from './reports/EmployeesReport';
import InvoiceViewReport from './reports/InvoiceViewReport';
import BusinessTransactionsReport from './reports/BusinessTransactionsReport';
import CustomerTransactionsReport from './reports/CustomerTransactionsReport';
import CustomersReport from './reports/CustomersReport';
import StockReceivedReport from './reports/StockReceivedReport';
import DailySalesReport from './reports/DailySalesReport';
import StockInventoryReport from './reports/StockInventoryReport';
import Reports from './reports/Reports';
import './Dashboard.css';
import './AdsManager.css';

const API_ORIGIN = String(API.defaults.baseURL || '').replace(/\/api\/v1\/?$/, '');
const BIOMETRIC_BRIDGE_ORIGIN = String(import.meta.env.VITE_BIOMETRIC_BRIDGE_URL || 'http://127.0.0.1:3210').replace(/\/$/, '');

const statusClassMap = {
    ACTIVE: 'pill-active',
    APPROVED: 'pill-active',
    AVAILABLE: 'pill-active',
    LEASED: 'pill-active',
    ENROLLED: 'pill-active',
    READY: 'pill-active',
    RECEIVED: 'pill-active',
    PENDING: 'pill-warning',
    SUBMITTED: 'pill-warning',
    UNDER_REVIEW: 'pill-warning',
    PROCESSING: 'pill-warning',
    PARTIAL: 'pill-warning',
    NOT_CAPTURED: 'pill-neutral',
    DRAFT: 'pill-neutral',
    SOLD: 'pill-neutral',
    INSTALLMENT: 'pill-neutral',
    SERVICE: 'pill-neutral',
};

const emptyCustomerForm = {
    id: '',
    dealer_id: '',
    created_by_agent: '',
    full_name: '',
    father_name: '',
    gender: '',
    cnic_passport_number: '',
    document_type: 'CNIC',
    contact_email: '',
    contact_phone: '',
    country: '',
    address: '',
    date_of_birth: '',
    identity_doc_url: '',
    identity_doc_back_url: '',
    raw_ocr_text: '',
    extracted_name: '',
    biometric_hash: '',
    fingerprint_seed: '',
    fingerprint_status: 'NOT_CAPTURED',
    fingerprint_quality: '',
    fingerprint_device: '',
    fingerprint_thumb_url: '',
    signature_image_url: '',
};

const emptyEmployeeForm = {
    id: '',
    user_id: '',
    password: '',
    dealer_id: '',
    dealer_name: '',
    dealer_code: '',
    employee_code: '',
    full_name: '',
    email: '',
    phone: '',
    cnic_number: '',
    cnic_doc_url: '',
    cnic_front_url: '',
    cnic_back_url: '',
    department: '',
    job_title: '',
    commission_percentage: '',
    commission_value: '',
    base_salary: '',
    role_id: '',
    is_active: true,
    hired_at: '',
    notes: '',
    created_by: '',
    created_by_name: '',
    created_by_email: '',
    feature_ids: [],
    denied_feature_ids: [],
};

const emptyProductForm = {
    id: '',
    brand: '',
    model: '',
    vehicle_type: '',
    color: '',
    description: '',
    image_url: '',
    monthly_rate: '',
    purchase_price: '',
    cash_markup_percent: '',
    cash_markup_value: '',
    installment_markup_percent: '35',
    installment_months: '12',
    status: 'AVAILABLE',
};

const emptyWorkflowDefinitionForm = {
    id: '',
    definition_name: '',
    workflow_type: 'SALE_APPROVAL',
    dealer_id: '',
    requester_role_name: 'AGENT',
    first_approver_role_name: 'MANAGER',
    second_approver_role_name: '',
    is_active: true,
};

const emptySaleForm = {
    id: '',
    customer_id: '',
    vehicle_id: '',
    sale_mode: 'CASH',
    agreement_number: '',
    agreement_date: new Date().toISOString().slice(0, 10),
    purchase_date: new Date().toISOString().slice(0, 10),
    agreement_pdf_url: '',
    dealer_signature_url: '',
    authorized_signature_url: '',
    customer_cnic_front_url: '',
    customer_cnic_back_url: '',
    bank_check_url: '',
    misc_document_url: '',
    vehicle_price: '',
    down_payment: '',
    financed_amount: '',
    monthly_installment: '',
    installment_months: '',
    first_due_date: '',
    witness_name: '',
    witness_cnic: '',
    witness_two_name: '',
    witness_two_cnic: '',
    remarks: '',
};

const emptyStockOrderForm = {
    company_profile_id: '',
    company_name: '',
    company_email: '',
    product_id: '',
    vehicle_type: '',
    brand: '',
    model: '',
    color: '',
    product_description: '',
    unit_price: '',
    total_amount: '',
    expected_delivery_date: '',
    bank_slip_url: '',
    notes: '',
    order_status: 'PROCESSING',
};

const createEmptyReceiveItem = (defaultColor = '') => ({
    registration_number: '',
    chassis_number: '',
    engine_number: '',
    color: defaultColor || '',
});

const emptyCompanyForm = {
    id: '',
    company_name: '',
    company_email: '',
    contact_person: '',
    phone: '',
    address: '',
    notes: '',
};

const emptyDealerForm = {
    id: '',
    dealer_name: '',
    theme_key: 'sandstone',
    dealer_logo_url: '',
    dealer_signature_url: '',
    dealer_address: '',
    dealer_cnic: '',
    mobile_country: 'QATAR',
    mobile_country_code: '+974',
    mobile_number: '',
    currency_code: 'QAR',
    contact_email: '',
    admin_full_name: '',
    admin_email: '',
    admin_password: '',
    admin_role_id: '4',
    backup_directory: '',
    notes: '',
    is_active: true,
};

const emptyProfileForm = {
    full_name: '',
    email: '',
    brand_name: '',
    brand_logo_url: '',
    brand_address: '',
    password: '',
};

const emptyAdForm = {
    id: '',
    title: '',
    subtitle: '',
    image_url: '',
    cta_label: '',
    cta_url: '',
    display_order: 0,
    is_active: true,
    start_at: '',
    end_at: '',
    dealer_id: '',
};

const ACCESS_PAGE_GROUPS = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        description: 'Main dashboard access and overview widgets.',
        featureKeys: [
            'FEAT_DASHBOARD_ACCESS_PROFILE',
            'FEAT_DASHBOARD_CARD_ACTIVE_LEASES',
            'FEAT_DASHBOARD_CARD_PENDING_LEASES',
            'FEAT_DASHBOARD_CARD_PENDING_TASKS',
            'FEAT_DASHBOARD_CARD_TOTAL_REVENUE',
            'FEAT_DASHBOARD_CARD_EMPLOYEE_COMMISSIONS',
            'FEAT_DASHBOARD_CARD_TOTAL_VEHICLES',
            'FEAT_DASHBOARD_CARD_TOTAL_CUSTOMERS',
            'FEAT_DASHBOARD_CARD_TOTAL_EMPLOYEES',
            'FEAT_DASHBOARD_CARD_ACTIVE_EMPLOYEES',
            'FEAT_DASHBOARD_CARD_TOTAL_DEALERS',
            'FEAT_DASHBOARD_CARD_ACTIVE_DEALERS',
            'FEAT_DASHBOARD_CARD_SCANNED_DOCUMENTS',
            'FEAT_DASHBOARD_CARD_ENROLLED_BIOMETRICS',
            'FEAT_DASHBOARD_CARD_TOTAL_APPLICATIONS',
            'FEAT_DASHBOARD_CARD_CASH_TRANSACTIONS',
            'FEAT_DASHBOARD_CARD_INSTALLMENT_TRANSACTIONS',
            'FEAT_DASHBOARD_CARD_RECEIVED_INSTALLMENTS',
            'FEAT_DASHBOARD_SALES_PERFORMANCE',
            'FEAT_DASHBOARD_PROFIT_TRANSACTIONS',
            'FEAT_DASHBOARD_COMPANY_PROFITABILITY',
            'FEAT_DASHBOARD_RECENT_APPLICATIONS',
            'FEAT_DASHBOARD_RECENT_EMPLOYEES',
        ],
    },
    {
        key: 'applications',
        label: 'Applications',
        description: 'Lease application viewing and related workflow access.',
        featureKeys: ['FEAT_APPLICATIONS_LIST'],
    },
    {
        key: 'workflow',
        label: 'Workflow',
        description: 'Approval definition setup and workflow trigger configuration.',
        featureKeys: ['FEAT_WORKFLOW_VIEW', 'FEAT_WORKFLOW_CONFIG'],
    },
    {
        key: 'profile-switch',
        label: 'Profile Switch',
        description: 'Allow controlled working-profile switching from the header.',
        featureKeys: ['FEAT_PROFILE_SWITCH'],
    },
    {
        key: 'user-tasks',
        label: 'User Tasks',
        description: 'Approval queue where managers and application admins review customer, vehicle, and attachment details.',
        featureKeys: ['FEAT_WORKFLOW_VIEW', 'FEAT_WORKFLOW_TASKS'],
    },
    {
        key: 'customers',
        label: 'Customers',
        description: 'Customer records, OCR, and biometric functions.',
        featureKeys: [
            'FEAT_CUSTOMER_FORM',
            'FEAT_CUSTOMER_FINGERPRINT',
            'FEAT_CUSTOMER_REGISTER',
            'FEAT_CUSTOMER_RECORD_VIEW',
            'FEAT_CUSTOMER_RECORD_EDIT',
            'FEAT_CUSTOMER_RECORD_DELETE',
            'FEAT_CUSTOMER_OWNERSHIP_UNLOCK',
        ],
    },
    {
        key: 'products',
        label: 'Products',
        description: 'Product master and fleet product setup.',
        featureKeys: ['FEAT_PRODUCT_MGMT', 'FEAT_FLEET_MGMT', 'FEAT_PRODUCT_FORM', 'FEAT_PRODUCT_TYPE_MGMT', 'FEAT_PRODUCT_REGISTER'],
    },
    {
        key: 'stock',
        label: 'Stock',
        description: 'Stock ordering, receiving, and company stock operations.',
        featureKeys: ['FEAT_STOCK_MGMT', 'FEAT_FLEET_MGMT', 'FEAT_STOCK_ORDER_FORM', 'FEAT_STOCK_RECEIVED_VIEW', 'FEAT_STOCK_REGISTER'],
    },
    {
        key: 'sales',
        label: 'Sales',
        description: 'Sale creation, sales register, and transaction register access.',
        featureKeys: ['FEAT_SALES_CREATE', 'FEAT_SALES_MGMT', 'FEAT_SALES_AGREEMENT_FORM', 'FEAT_SALES_AGREEMENT_SUMMARY', 'FEAT_SALES_INSTALLMENT_PREVIEW', 'FEAT_SALES_REGISTER', 'FEAT_SALES_UPDATE', 'FEAT_TRANSACTION_REGISTER'],
    },
    {
        key: 'installments',
        label: 'Installments',
        description: 'Installment collection and installment commission.',
        featureKeys: ['FEAT_INSTALLMENT_MGMT', 'FEAT_SALES_MGMT', 'FEAT_INSTALLMENT_OVERVIEW', 'FEAT_INSTALLMENT_COLLECTION'],
    },
    {
        key: 'employees',
        label: 'Employees',
        description: 'Employees, payroll, and user management.',
        featureKeys: [
            'FEAT_USER_MGMT',
            'FEAT_EMPLOYEE_FORM',
            'FEAT_EMPLOYEE_EDIT',
            'FEAT_EMPLOYEE_SECURITY_UNLOCK',
            'FEAT_EMPLOYEE_ROLE_FEATURES_DISPLAY',
            'FEAT_EMPLOYEE_EXTRA_FEATURES',
            'FEAT_EMPLOYEE_ADVANCE_CASH',
            'FEAT_EMPLOYEE_SALARY_GENERATION',
            'FEAT_EMPLOYEE_DIRECTORY',
            'FEAT_EMPLOYEE_COMMISSION_LEDGER',
            'FEAT_EMPLOYEE_SALARY_RECORD',
            'FEAT_EMPLOYEE_ADVANCE_HISTORY',
            'FEAT_EMPLOYEE_GENERATED_SALARIES',
        ],
    },
    {
        key: 'dealers',
        label: 'Dealers',
        description: 'Dealer application and dealer setup access.',
        featureKeys: ['FEAT_DEALER_FORM', 'FEAT_DEALER_SUMMARY', 'FEAT_DEALER_DIRECTORY'],
    },
    {
        key: 'reports',
        label: 'Reports',
        description: 'All report pages available inside the reports tab.',
        featureKeys: [
            'FEAT_REPORT_STOCK_INVENTORY',
            'FEAT_REPORT_DAILY_SALES',
            'FEAT_REPORT_STOCK_RECEIVED',
            'FEAT_REPORT_CUSTOMERS',
            'FEAT_REPORT_CUSTOMER_TRANSACTIONS',
            'FEAT_REPORT_BUSINESS_TRANSACTIONS',
            'FEAT_REPORT_INVOICE_VIEW',
            'FEAT_REPORT_EMPLOYEES',
            'FEAT_REPORT_SALARY',
            'FEAT_REPORT_DEALER_INFORMATION',
            'FEAT_REPORT_DEALER_EMPLOYEES',
        ],
    },
    {
        key: 'access',
        label: 'Access Control',
        description: 'Role permissions and access-control administration.',
        featureKeys: ['FEAT_ACCESS_CONTROL'],
    },
];

const dealerCountryOptions = [
    { value: 'AFGHANISTAN', label: 'Afghanistan', dialCode: '+93' },
    { value: 'ALBANIA', label: 'Albania', dialCode: '+355' },
    { value: 'ALGERIA', label: 'Algeria', dialCode: '+213' },
    { value: 'ARGENTINA', label: 'Argentina', dialCode: '+54' },
    { value: 'ARMENIA', label: 'Armenia', dialCode: '+374' },
    { value: 'AUSTRALIA', label: 'Australia', dialCode: '+61' },
    { value: 'AUSTRIA', label: 'Austria', dialCode: '+43' },
    { value: 'AZERBAIJAN', label: 'Azerbaijan', dialCode: '+994' },
    { value: 'BAHRAIN', label: 'Bahrain', dialCode: '+973' },
    { value: 'BANGLADESH', label: 'Bangladesh', dialCode: '+880' },
    { value: 'BELARUS', label: 'Belarus', dialCode: '+375' },
    { value: 'BELGIUM', label: 'Belgium', dialCode: '+32' },
    { value: 'BHUTAN', label: 'Bhutan', dialCode: '+975' },
    { value: 'BOLIVIA', label: 'Bolivia', dialCode: '+591' },
    { value: 'BOSNIA_AND_HERZEGOVINA', label: 'Bosnia and Herzegovina', dialCode: '+387' },
    { value: 'BOTSWANA', label: 'Botswana', dialCode: '+267' },
    { value: 'BRAZIL', label: 'Brazil', dialCode: '+55' },
    { value: 'BRUNEI', label: 'Brunei', dialCode: '+673' },
    { value: 'BULGARIA', label: 'Bulgaria', dialCode: '+359' },
    { value: 'CAMBODIA', label: 'Cambodia', dialCode: '+855' },
    { value: 'CAMEROON', label: 'Cameroon', dialCode: '+237' },
    { value: 'CANADA', label: 'Canada', dialCode: '+1' },
    { value: 'CHILE', label: 'Chile', dialCode: '+56' },
    { value: 'CHINA', label: 'China', dialCode: '+86' },
    { value: 'COLOMBIA', label: 'Colombia', dialCode: '+57' },
    { value: 'COSTA_RICA', label: 'Costa Rica', dialCode: '+506' },
    { value: 'CROATIA', label: 'Croatia', dialCode: '+385' },
    { value: 'CYPRUS', label: 'Cyprus', dialCode: '+357' },
    { value: 'CZECH_REPUBLIC', label: 'Czech Republic', dialCode: '+420' },
    { value: 'DENMARK', label: 'Denmark', dialCode: '+45' },
    { value: 'DOMINICAN_REPUBLIC', label: 'Dominican Republic', dialCode: '+1-809' },
    { value: 'ECUADOR', label: 'Ecuador', dialCode: '+593' },
    { value: 'EGYPT', label: 'Egypt', dialCode: '+20' },
    { value: 'EL_SALVADOR', label: 'El Salvador', dialCode: '+503' },
    { value: 'ESTONIA', label: 'Estonia', dialCode: '+372' },
    { value: 'ETHIOPIA', label: 'Ethiopia', dialCode: '+251' },
    { value: 'FINLAND', label: 'Finland', dialCode: '+358' },
    { value: 'FRANCE', label: 'France', dialCode: '+33' },
    { value: 'GEORGIA', label: 'Georgia', dialCode: '+995' },
    { value: 'GERMANY', label: 'Germany', dialCode: '+49' },
    { value: 'GHANA', label: 'Ghana', dialCode: '+233' },
    { value: 'GREECE', label: 'Greece', dialCode: '+30' },
    { value: 'GUATEMALA', label: 'Guatemala', dialCode: '+502' },
    { value: 'HONDURAS', label: 'Honduras', dialCode: '+504' },
    { value: 'HONG_KONG', label: 'Hong Kong', dialCode: '+852' },
    { value: 'HUNGARY', label: 'Hungary', dialCode: '+36' },
    { value: 'ICELAND', label: 'Iceland', dialCode: '+354' },
    { value: 'INDIA', label: 'India', dialCode: '+91' },
    { value: 'INDONESIA', label: 'Indonesia', dialCode: '+62' },
    { value: 'IRAN', label: 'Iran', dialCode: '+98' },
    { value: 'IRAQ', label: 'Iraq', dialCode: '+964' },
    { value: 'IRELAND', label: 'Ireland', dialCode: '+353' },
    { value: 'ISRAEL', label: 'Israel', dialCode: '+972' },
    { value: 'ITALY', label: 'Italy', dialCode: '+39' },
    { value: 'JAMAICA', label: 'Jamaica', dialCode: '+1-876' },
    { value: 'JAPAN', label: 'Japan', dialCode: '+81' },
    { value: 'JORDAN', label: 'Jordan', dialCode: '+962' },
    { value: 'KAZAKHSTAN', label: 'Kazakhstan', dialCode: '+7' },
    { value: 'KENYA', label: 'Kenya', dialCode: '+254' },
    { value: 'KUWAIT', label: 'Kuwait', dialCode: '+965' },
    { value: 'KYRGYZSTAN', label: 'Kyrgyzstan', dialCode: '+996' },
    { value: 'LAOS', label: 'Laos', dialCode: '+856' },
    { value: 'LATVIA', label: 'Latvia', dialCode: '+371' },
    { value: 'LEBANON', label: 'Lebanon', dialCode: '+961' },
    { value: 'LIBYA', label: 'Libya', dialCode: '+218' },
    { value: 'LITHUANIA', label: 'Lithuania', dialCode: '+370' },
    { value: 'LUXEMBOURG', label: 'Luxembourg', dialCode: '+352' },
    { value: 'MACAU', label: 'Macau', dialCode: '+853' },
    { value: 'MALAYSIA', label: 'Malaysia', dialCode: '+60' },
    { value: 'MALDIVES', label: 'Maldives', dialCode: '+960' },
    { value: 'MALTA', label: 'Malta', dialCode: '+356' },
    { value: 'MEXICO', label: 'Mexico', dialCode: '+52' },
    { value: 'MOLDOVA', label: 'Moldova', dialCode: '+373' },
    { value: 'MONGOLIA', label: 'Mongolia', dialCode: '+976' },
    { value: 'MONTENEGRO', label: 'Montenegro', dialCode: '+382' },
    { value: 'MOROCCO', label: 'Morocco', dialCode: '+212' },
    { value: 'MYANMAR', label: 'Myanmar', dialCode: '+95' },
    { value: 'NAMIBIA', label: 'Namibia', dialCode: '+264' },
    { value: 'NEPAL', label: 'Nepal', dialCode: '+977' },
    { value: 'NETHERLANDS', label: 'Netherlands', dialCode: '+31' },
    { value: 'NEW_ZEALAND', label: 'New Zealand', dialCode: '+64' },
    { value: 'NICARAGUA', label: 'Nicaragua', dialCode: '+505' },
    { value: 'NIGERIA', label: 'Nigeria', dialCode: '+234' },
    { value: 'NORTH_MACEDONIA', label: 'North Macedonia', dialCode: '+389' },
    { value: 'NORWAY', label: 'Norway', dialCode: '+47' },
    { value: 'OMAN', label: 'Oman', dialCode: '+968' },
    { value: 'PAKISTAN', label: 'Pakistan', dialCode: '+92' },
    { value: 'PALESTINE', label: 'Palestine', dialCode: '+970' },
    { value: 'PANAMA', label: 'Panama', dialCode: '+507' },
    { value: 'PARAGUAY', label: 'Paraguay', dialCode: '+595' },
    { value: 'PERU', label: 'Peru', dialCode: '+51' },
    { value: 'PHILIPPINES', label: 'Philippines', dialCode: '+63' },
    { value: 'POLAND', label: 'Poland', dialCode: '+48' },
    { value: 'PORTUGAL', label: 'Portugal', dialCode: '+351' },
    { value: 'QATAR', label: 'Qatar', dialCode: '+974' },
    { value: 'ROMANIA', label: 'Romania', dialCode: '+40' },
    { value: 'RUSSIA', label: 'Russia', dialCode: '+7' },
    { value: 'SAUDI_ARABIA', label: 'Saudi Arabia', dialCode: '+966' },
    { value: 'SERBIA', label: 'Serbia', dialCode: '+381' },
    { value: 'SINGAPORE', label: 'Singapore', dialCode: '+65' },
    { value: 'SLOVAKIA', label: 'Slovakia', dialCode: '+421' },
    { value: 'SLOVENIA', label: 'Slovenia', dialCode: '+386' },
    { value: 'SOMALIA', label: 'Somalia', dialCode: '+252' },
    { value: 'SOUTH_AFRICA', label: 'South Africa', dialCode: '+27' },
    { value: 'SOUTH_KOREA', label: 'South Korea', dialCode: '+82' },
    { value: 'SPAIN', label: 'Spain', dialCode: '+34' },
    { value: 'SRI_LANKA', label: 'Sri Lanka', dialCode: '+94' },
    { value: 'SUDAN', label: 'Sudan', dialCode: '+249' },
    { value: 'SWEDEN', label: 'Sweden', dialCode: '+46' },
    { value: 'SWITZERLAND', label: 'Switzerland', dialCode: '+41' },
    { value: 'SYRIA', label: 'Syria', dialCode: '+963' },
    { value: 'TAIWAN', label: 'Taiwan', dialCode: '+886' },
    { value: 'TAJIKISTAN', label: 'Tajikistan', dialCode: '+992' },
    { value: 'TANZANIA', label: 'Tanzania', dialCode: '+255' },
    { value: 'THAILAND', label: 'Thailand', dialCode: '+66' },
    { value: 'TUNISIA', label: 'Tunisia', dialCode: '+216' },
    { value: 'TURKEY', label: 'Turkey', dialCode: '+90' },
    { value: 'TURKMENISTAN', label: 'Turkmenistan', dialCode: '+993' },
    { value: 'UGANDA', label: 'Uganda', dialCode: '+256' },
    { value: 'UKRAINE', label: 'Ukraine', dialCode: '+380' },
    { value: 'UNITED_ARAB_EMIRATES', label: 'United Arab Emirates', dialCode: '+971' },
    { value: 'UNITED_KINGDOM', label: 'United Kingdom', dialCode: '+44' },
    { value: 'UNITED_STATES', label: 'United States', dialCode: '+1' },
    { value: 'URUGUAY', label: 'Uruguay', dialCode: '+598' },
    { value: 'UZBEKISTAN', label: 'Uzbekistan', dialCode: '+998' },
    { value: 'VENEZUELA', label: 'Venezuela', dialCode: '+58' },
    { value: 'VIETNAM', label: 'Vietnam', dialCode: '+84' },
    { value: 'YEMEN', label: 'Yemen', dialCode: '+967' },
    { value: 'ZAMBIA', label: 'Zambia', dialCode: '+260' },
    { value: 'ZIMBABWE', label: 'Zimbabwe', dialCode: '+263' },
];

const dealerCountryCodeMap = dealerCountryOptions.reduce((acc, country) => {
    acc[country.value] = country.dialCode;
    return acc;
}, {});

const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 2,
    }).format(Number(amount || 0));

const formatCompactCurrency = (amount) => {
    const value = Number(amount || 0);

    if (Math.abs(value) < 100000) {
        return formatCurrency(value);
    }

    const compactValue = new Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);

    return `Rs ${compactValue}`;
};

const getStatusClass = (status) => statusClassMap[String(status || '').toUpperCase()] || 'pill-neutral';

const metricIcons = {
    leases: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 18h16M6 18V9l6-4 6 4v9M9 18v-5h6v5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    tasks: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 7h10M9 12h10M9 17h10M5 7h.01M5 12h.01M5 17h.01" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    revenue: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 15l4-4 3 3 5-6M18 8h-3M18 8v3M5 19h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    vehicles: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 15l1.5-4h11L19 15M7 15h10M8 18a1.5 1.5 0 1 0 0-.01M16 18a1.5 1.5 0 1 0 0-.01M6 11l2-3h8l2 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    customers: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M18 8a2.5 2.5 0 1 1 0 5M20 19v-1a3 3 0 0 0-2-2.82" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    employees: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM5 20v-1a7 7 0 0 1 14 0v1M19 8h2M20 7v2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    dealers: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 20h16M6 20V9l3-2 3 2v11M15 20V5l3-1 2 1v15M9 12h.01M9 15h.01M15 9h.01M15 12h.01" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    documents: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 3h6l4 4v14H8zM14 3v5h4M10 12h6M10 16h6M10 8h3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    biometrics: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4a4 4 0 0 1 4 4v2M8 10V8a4 4 0 0 1 8 0M6 12c0-3.31 2.69-6 6-6M18 12c0 3.31-2.69 6-6 6M9 14c.6 1.2 1.6 2 3 2s2.4-.8 3-2M9 18c.8 1.2 1.8 2 3 2s2.2-.8 3-2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    applications: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 4h8l3 3v13H8zM16 4v4h4M10 12h7M10 16h7M10 8h3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    workflow: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 6.5h7M5 12h10M5 17.5h6M15.5 5.5l1.5 1.5 3-3M15.5 11l1.5 1.5 3-3M15.5 16.5l1.5 1.5 3-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
};

const tableActionIcons = {
    installments: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 4.5h10M8 2.5v4M16 2.5v4M5 9h14M6.5 20.5h11A1.5 1.5 0 0 0 19 19V7a1.5 1.5 0 0 0-1.5-1.5h-11A1.5 1.5 0 0 0 5 7v12A1.5 1.5 0 0 0 6.5 20.5ZM9 13h2.5M9 16h6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    view: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    ),
    edit: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m4 20 4.5-1 9-9a2.1 2.1 0 1 0-3-3l-9 9L4 20Zm10-11 3 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
};
const sidebarTabIcons = {
    dashboard: metricIcons.leases,
    customers: metricIcons.customers,
    employees: metricIcons.employees,
    dealers: metricIcons.dealers,
    applications: metricIcons.applications,
    workflow: metricIcons.workflow,
    'user-tasks': metricIcons.tasks,
    reports: metricIcons.revenue,
    access: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3 5.5 6v5.2c0 4 2.5 7.6 6.5 9.8 4-2.2 6.5-5.8 6.5-9.8V6L12 3Zm0 6.2a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 0 1 0-4.6Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    sales: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 7.5h14M7.5 7.5V6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v1.5M6 7.5l1 11h10l1-11M10 11.5v3.5M14 11.5v3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    transactions: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 7h11v11M17 7h1a2 2 0 0 1 2 2v1M17 17h-1a2 2 0 0 1-2-2v-1M7 17H6a2 2 0 0 1-2-2v-1M7 7H6a2 2 0 0 0-2 2v1M9.5 10.5h5M9.5 14h3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    installments: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 4.5h10M8 2.5v4M16 2.5v4M5 9h14M6.5 20.5h11A1.5 1.5 0 0 0 19 19V7a1.5 1.5 0 0 0-1.5-1.5h-11A1.5 1.5 0 0 0 5 7v12A1.5 1.5 0 0 0 6.5 20.5ZM9 13h2.5M9 16h6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    companies: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 20h16M6.5 20V6.5A1.5 1.5 0 0 1 8 5h4a1.5 1.5 0 0 1 1.5 1.5V20M13.5 20v-8.5A1.5 1.5 0 0 1 15 10h2.5a1.5 1.5 0 0 1 1.5 1.5V20M9 9.5h.01M9 13h.01" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    stock: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m4 8.5 8-4.5 8 4.5-8 4.5-8-4.5Zm0 4.8 8 4.5 8-4.5M4 13.3V8.5M20 13.3V8.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    inventory: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 7.5h14v11H5zM9 4.5h6M8.5 11h7M8.5 14.5h4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
};
const isSuperAdminUser = (user) =>
    Number(user?.real_role_id || user?.role_id) === 1 ||
    (user?.real_role_name || user?.role_name) === 'SUPER_ADMIN';
const hasFeature = (user, featureKey) =>
    isSuperAdminUser(user) ||
    (Array.isArray(user?.feature_keys) && user.feature_keys.includes(featureKey)) ||
    (Array.isArray(user?.real_feature_keys) && user.real_feature_keys.includes(featureKey)) ||
    (user?.features || []).some((feature) => feature.key === featureKey);
const hasAnyFeature = (user, featureKeys = []) =>
    isSuperAdminUser(user) || featureKeys.some((featureKey) => hasFeature(user, featureKey));
const roundCurrencyValue = (value) => Math.round(Number(value || 0) * 100) / 100;
const normalizeTextValue = (value) => String(value || '').trim().toUpperCase();
const formatDateKeyPart = (value) => String(value || '').padStart(2, '0');
const toLocalDateKey = (value) => {
    const rawValue = String(value || '').trim();
    if (!rawValue) {
        return '';
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
        return rawValue;
    }

    const parsedDate = new Date(rawValue);
    if (Number.isNaN(parsedDate.getTime())) {
        return rawValue.slice(0, 10);
    }

    return [
        parsedDate.getFullYear(),
        formatDateKeyPart(parsedDate.getMonth() + 1),
        formatDateKeyPart(parsedDate.getDate()),
    ].join('-');
};
const shiftDateKey = (dateKey, days) => {
    const normalizedKey = String(dateKey || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedKey)) {
        return '';
    }

    const [year, month, day] = normalizedKey.split('-').map(Number);
    const shiftedDate = new Date(year, month - 1, day);
    shiftedDate.setDate(shiftedDate.getDate() + Number(days || 0));

    return [
        shiftedDate.getFullYear(),
        formatDateKeyPart(shiftedDate.getMonth() + 1),
        formatDateKeyPart(shiftedDate.getDate()),
    ].join('-');
};
const toDisplayTitle = (value) =>
    String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
const buildVehicleIdentityKey = (brand, model, chassisNumber, engineNumber) =>
    [
        normalizeTextValue(brand),
        normalizeTextValue(model),
        normalizeTextValue(chassisNumber),
        normalizeTextValue(engineNumber),
    ].join('::');
const sanitizeSerialSegment = (value) =>
    String(value || '')
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '');
const buildGeneratedVehicleSerial = ({ brand, color, model, chassis_number, engine_number }) => {
    const generatedSerial = [
        'STK',
        sanitizeSerialSegment(brand),
        sanitizeSerialSegment(color),
        sanitizeSerialSegment(model),
        sanitizeSerialSegment(chassis_number),
        sanitizeSerialSegment(engine_number),
    ].join('');

    return generatedSerial === 'STK' ? '' : generatedSerial;
};
const DASHBOARD_THEME_STORAGE_KEY = 'dashboard_theme';
const dashboardThemes = [
    { key: 'sandstone', label: 'Sandstone Pro' },
    { key: 'crimson-navy', label: 'Crimson Navy' },
    { key: 'emerald-ledger', label: 'Emerald Ledger' },
    { key: 'navin-blue', label: 'Navin Blue' },
];
const buildAssetUrl = (filePath) => {
    if (!filePath) return '';
    if (/^https?:\/\//i.test(filePath)) return filePath;
    return `${API_ORIGIN}${filePath.startsWith('/') ? filePath : `/${filePath}`}`;
};
const DASHBOARD_PAGE_TOKENS = {
    dashboard: 'a1f9',
    applications: 'b2k4',
    workflow: 'c3m7',
    'user-tasks': 'd4p2',
    access: 'e1a0',
    customers: 'e5r8',
    products: 'f6t1',
    stock: 'g7v3',
    sales: 'h8x5',
    installments: 'j9z6',
    employees: 'k1q7',
    dealers: 'm2w8',
    reports: 'n3y9',
    transactions: 'p4s6',
    companies: 'r5d7',
    'report-stock-inventory': 's6h1',
    'report-daily-sales': 't7j2',
    'report-stock-received': 'u8k3',
    'report-customers': 'v9l4',
    'report-customer-transactions': 'w1n5',
    'report-business-transactions': 'x2p6',
    'report-invoice-view': 'y3r7',
    'report-employees': 'z4t8',
    'report-salary': 'aa59',
    'report-dealer-information': 'ab61',
    'report-dealer-employees': 'ac72',
};
const DASHBOARD_TOKEN_PAGES = Object.fromEntries(
    Object.entries(DASHBOARD_PAGE_TOKENS).map(([page, token]) => [token, page])
);
const getDashboardPageFromSearch = (search) => {
    const params = new URLSearchParams(search || '');
    const token = String(params.get('v') || '').trim().toLowerCase();
    const legacyPage = String(params.get('page') || '').trim().toLowerCase();

    if (token && DASHBOARD_TOKEN_PAGES[token]) {
        return DASHBOARD_TOKEN_PAGES[token];
    }

    return legacyPage;
};
const getDashboardTokenForPage = (page) => DASHBOARD_PAGE_TOKENS[page] || DASHBOARD_PAGE_TOKENS.dashboard;
const DASHBOARD_PAGE_PATHS = {
    dashboard: '/dashboard',
    applications: '/dashboard/applications',
    workflow: '/dashboard/workflow',
    'user-tasks': '/dashboard/user-tasks',
    access: '/dashboard/access',
    customers: '/dashboard/customers',
    products: '/dashboard/products',
    stock: '/dashboard/stock',
    sales: '/dashboard/sales',
    installments: '/dashboard/installments',
    employees: '/dashboard/employees',
    dealers: '/dashboard/dealers',
    reports: '/dashboard/reports',
    transactions: '/dashboard/transactions',
    companies: '/dashboard/companies',
    'report-stock-inventory': '/dashboard/report-stock-inventory',
    'report-daily-sales': '/dashboard/report-daily-sales',
    'report-stock-received': '/dashboard/report-stock-received',
    'report-customers': '/dashboard/report-customers',
    'report-customer-transactions': '/dashboard/report-customer-transactions',
    'report-business-transactions': '/dashboard/report-business-transactions',
    'report-invoice-view': '/dashboard/report-invoice-view',
    'report-employees': '/dashboard/report-employees',
    'report-salary': '/dashboard/report-salary',
    'report-dealer-information': '/dashboard/report-dealer-information',
    'report-dealer-employees': '/dashboard/report-dealer-employees',
};
const getDashboardPageFromPathname = (pathname) => {
    const normalizedPath = String(pathname || '').replace(/\/+$/, '') || '/dashboard';
    const match = Object.entries(DASHBOARD_PAGE_PATHS)
        .find(([, path]) => path === normalizedPath);

    return match?.[0] || '';
};
const getDashboardPathForPage = (page) => DASHBOARD_PAGE_PATHS[page] || DASHBOARD_PAGE_PATHS.dashboard;
const normalizeIdentityNumber = (value) => String(value || '').replace(/\D/g, '');
const normalizePreviewAssetPath = (value) => {
    const trimmed = String(value || '').trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith('/uploads/')) return trimmed;
    if (trimmed.startsWith('uploads/')) return `/${trimmed}`;
    if (trimmed.startsWith('/')) return trimmed.includes('.', 1) || trimmed.includes('/', 1) ? trimmed : '';
    return trimmed.includes('/') ? `/${trimmed}` : '';
};
const getCustomerPreviewAssetScore = (customer) => {
    const ocrDetails = customer?.ocr_details || {};
    const fingerprint = ocrDetails?.fingerprint || {};
    return [
        normalizePreviewAssetPath(customer?.identity_doc_url),
        normalizePreviewAssetPath(ocrDetails?.identity_doc_front_url),
        normalizePreviewAssetPath(customer?.signature_image_url),
        normalizePreviewAssetPath(ocrDetails?.signature_image_url),
        normalizePreviewAssetPath(customer?.fingerprint_thumb_url),
        normalizePreviewAssetPath(fingerprint?.thumb_image_url),
    ].filter(Boolean).length;
};

const getEmployeeEffectiveFeatureCount = (employee) => {
    const roleCount = employee?.role_features?.length || 0;
    const assignedCount = employee?.assigned_features?.length || 0;
    const deniedCount = employee?.denied_features?.length || 0;
    return Math.max(roleCount + assignedCount - deniedCount, 0);
};

const getUniqueFeatures = (features = []) => {
    const featureMap = new Map();

    features.forEach((feature) => {
        if (!feature) {
            return;
        }

        const featureKey = feature.id || feature.feature_key || feature.key || feature.display_name;
        if (!featureMap.has(featureKey)) {
            featureMap.set(featureKey, feature);
        }
    });

    return Array.from(featureMap.values());
};

const FEATURE_ACCESS_LABELS = {
    FEAT_APPLICATIONS_LIST: 'Applications List',
    FEAT_WORKFLOW_VIEW: 'Workflow Access',
    FEAT_WORKFLOW_TASKS: 'User Tasks',
    FEAT_WORKFLOW_CONFIG: 'Approval Flow Setup',
    FEAT_PROFILE_SWITCH: 'Profile Switch',
    FEAT_CUSTOMER_FORM: 'New Customer Intake',
    FEAT_CUSTOMER_FINGERPRINT: 'Fingerprint Intake',
    FEAT_CUSTOMER_REGISTER: 'Customer Registry',
    FEAT_CUSTOMER_RECORD_VIEW: 'View Customer Record',
    FEAT_CUSTOMER_RECORD_EDIT: 'Edit Customer Record',
    FEAT_CUSTOMER_RECORD_DELETE: 'Delete Customer Record',
    FEAT_CUSTOMER_OWNERSHIP_UNLOCK: 'Unlock Assigned Dealer and Created By',
    FEAT_PRODUCT_FORM: 'New Product Master',
    FEAT_PRODUCT_TYPE_MGMT: 'Vehicle Type Master',
    FEAT_PRODUCT_REGISTER: 'Product Master Register',
    FEAT_COMPANY_FORM: 'New Company Profile',
    FEAT_COMPANY_DIRECTORY: 'Company Directory',
    FEAT_SALES_AGREEMENT_FORM: 'Vehicle Agreement Creation',
    FEAT_SALES_AGREEMENT_SUMMARY: 'Agreement Summary',
    FEAT_SALES_INSTALLMENT_PREVIEW: 'Installment Page',
    FEAT_SALES_REGISTER: 'Sales Transaction Register',
    FEAT_SALES_UPDATE: 'Sales Register Update Button',
    FEAT_TRANSACTION_REGISTER: 'Transaction Register',
    FEAT_STOCK_ORDER_FORM: 'Order Stock',
    FEAT_STOCK_RECEIVED_VIEW: 'Stock Received From Company',
    FEAT_STOCK_REGISTER: 'Stock Ordering Register',
    FEAT_INSTALLMENT_OVERVIEW: 'Installment Page',
    FEAT_INSTALLMENT_COLLECTION: 'Monthly Installment Collection',
    FEAT_EMPLOYEE_FORM: 'New Employee',
    FEAT_EMPLOYEE_EDIT: 'Update Employee',
    FEAT_EMPLOYEE_SECURITY_UNLOCK: 'Unlock Dealer, Role, and Status',
    FEAT_EMPLOYEE_ROLE_FEATURES_DISPLAY: 'Employee Feature Access',
    FEAT_EMPLOYEE_EXTRA_FEATURES: 'Extra Feature Access',
    FEAT_EMPLOYEE_ADVANCE_CASH: 'Advance Cash',
    FEAT_EMPLOYEE_SALARY_GENERATION: 'Monthly Salary Generation',
    FEAT_EMPLOYEE_DIRECTORY: 'Employee Directory',
    FEAT_EMPLOYEE_COMMISSION_LEDGER: 'Current Month Commission Ledger',
    FEAT_EMPLOYEE_SALARY_RECORD: 'Current Month Salary Record',
    FEAT_EMPLOYEE_ADVANCE_HISTORY: 'Current Month Advance History',
    FEAT_EMPLOYEE_GENERATED_SALARIES: 'Current Month Generated Salaries',
    FEAT_DEALER_FORM: 'New Dealer',
    FEAT_DEALER_SUMMARY: 'Fresh Start Summary',
    FEAT_DEALER_DIRECTORY: 'Dealer Directory',
    FEAT_REPORT_STOCK_INVENTORY: 'Stock Inventory Report',
    FEAT_REPORT_DAILY_SALES: 'Daily Transactions Sale Report',
    FEAT_REPORT_STOCK_RECEIVED: 'Daily Stock Received Report',
    FEAT_REPORT_CUSTOMERS: 'Customer Report',
    FEAT_REPORT_CUSTOMER_TRANSACTIONS: 'Customer Transaction Report',
    FEAT_REPORT_BUSINESS_TRANSACTIONS: 'Business Transaction Report',
    FEAT_REPORT_INVOICE_VIEW: 'Invoice View Report',
    FEAT_REPORT_EMPLOYEES: 'Employees Report',
    FEAT_REPORT_SALARY: 'Salary Report',
    FEAT_REPORT_DEALER_INFORMATION: 'Dealer Information Report',
    FEAT_REPORT_DEALER_EMPLOYEES: 'Dealer Wise Employee Report',
};

const getAccessFeatureLabel = (feature) => {
    const featureKey = feature?.feature_key || feature?.key || '';
    return FEATURE_ACCESS_LABELS[featureKey] || feature?.display_name || featureKey;
};

const isPreviewableImage = (value) => /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(String(value || ''));
const isPreviewablePdf = (value) => /\.pdf$/i.test(String(value || ''));
const renderAssetPreview = (assetUrl, emptyMessage, label) => {
    const normalizedAssetPath = normalizePreviewAssetPath(assetUrl);

    if (!normalizedAssetPath) {
        return <div className="employee-document-empty">{emptyMessage}</div>;
    }

    if (isPreviewableImage(normalizedAssetPath)) {
        return (
            <img
                src={buildAssetUrl(normalizedAssetPath)}
                alt={label}
                className="employee-document-image"
            />
        );
    }

    if (isPreviewablePdf(normalizedAssetPath)) {
        return (
            <iframe
                src={buildAssetUrl(normalizedAssetPath)}
                title={`${label} PDF`}
                className="employee-document-frame"
            />
        );
    }

    return (
        <iframe
            src={buildAssetUrl(normalizedAssetPath)}
            title={label}
            className="employee-document-frame"
        />
    );
};
const getDocumentDisplayName = (assetUrl, fallbackLabel) => {
    const normalizedAssetPath = normalizePreviewAssetPath(assetUrl);
    if (!normalizedAssetPath) return fallbackLabel;

    const lastSegment = normalizedAssetPath.split('/').filter(Boolean).pop() || '';
    return decodeURIComponent(lastSegment) || fallbackLabel;
};
const installmentServiceChargeNote = 'سرورس چارجز سے بچنے کے لیے قسط ہر ماہ کی 5 تاریخ تک لازمی ادا کریں۔ 5 تاریخ کے بعد 500 سرورس چارجز وصول کیے جائیں گے۔';
const escapeHtml = (value) =>
    String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
const renderPrintAssetMarkup = (assetPath, emptyMessage, label, frameClass = 'print-asset-frame') => {
    if (!assetPath) {
        return `<div class="empty">${escapeHtml(emptyMessage)}</div>`;
    }

    const assetUrl = buildAssetUrl(assetPath);

    if (isPreviewableImage(assetPath)) {
        return `<img src="${escapeHtml(assetUrl)}" alt="${escapeHtml(label)}" />`;
    }

    if (isPreviewablePdf(assetPath)) {
        return `<iframe src="${escapeHtml(assetUrl)}" title="${escapeHtml(label)}" class="${escapeHtml(frameClass)}"></iframe>`;
    }

    return `<iframe src="${escapeHtml(assetUrl)}" title="${escapeHtml(label)}" class="${escapeHtml(frameClass)}"></iframe>`;
};

const getInitials = (name) =>
    name
        ? (() => {
            const parts = name.split(' ').filter(Boolean);
            if (parts.length === 1) {
                return parts[0].slice(0, 2).toUpperCase();
            }
            return `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase();
        })()
        : 'ML';

const resolveVehicleIdFromSale = (sale, inventory = []) => {
    if (sale?.vehicle_id) {
        return sale.vehicle_id;
    }

    const byIdentity = inventory.find((vehicle) =>
        vehicle.chassis_number &&
        sale?.chassis_number &&
        vehicle.engine_number &&
        sale?.engine_number &&
        String(vehicle.chassis_number) === String(sale.chassis_number) &&
        String(vehicle.engine_number) === String(sale.engine_number)
    );

    if (byIdentity?.id) {
        return byIdentity.id;
    }

    const byRegistration = inventory.find((vehicle) =>
        vehicle.registration_number &&
        sale?.registration_number &&
        String(vehicle.registration_number) === String(sale.registration_number)
    );

    if (byRegistration?.id) {
        return byRegistration.id;
    }

    const byModel = inventory.find((vehicle) =>
        String(vehicle.brand || '').toLowerCase() === String(sale?.brand || '').toLowerCase() &&
        String(vehicle.model || '').toLowerCase() === String(sale?.model || '').toLowerCase()
    );

    return byModel?.id || '';
};

const extractOcrFields = (rawText, currentDocumentType, assetType = '') => {
    const normalizeOcrLine = (line) => String(line || '')
        .replace(/[|]/g, 'I')
        .replace(/[–—−_]+/g, ' ')
        .replace(/[^\S\r\n]+/g, ' ')
        .trim();
    const lines = rawText
        .split(/\r?\n/)
        .map((line) => normalizeOcrLine(line))
        .filter(Boolean);

    const text = lines.join(' ');
    const normalizedText = rawText.replace(/\r/g, '\n');
    const blockedNamePhrases = [
        'pakistan national identity card',
        'national identity card',
        'islamic republic of pakistan',
        'country of stay',
        'identity number',
        'date of birth',
        'date of issue',
        'date of expiry',
        'holder signature',
        'registrar general of pakistan',
    ];
    const cleanCandidate = (value) => {
        const normalized = String(value || '')
            .replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9.\-/\s]+$/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        if (!normalized) return '';
        const lower = normalized.toLowerCase();
        if (blockedNamePhrases.some((phrase) => lower.includes(phrase))) return '';
        if (/^\d[\d-\s/]*$/.test(normalized)) return '';
        return normalized;
    };
    const isLikelyPersonName = (value) => {
        const cleaned = cleanCandidate(value);
        if (!cleaned) return '';
        const parts = cleaned
            .split(/\s+/)
            .map((part) => part.replace(/[^A-Za-z]/g, ''))
            .filter(Boolean);
        if (parts.length < 2) return '';
        if (parts.some((part) => part.length < 2)) return '';
        if (!parts.every((part) => /^[A-Za-z]+$/.test(part))) return '';
        return parts.join(' ');
    };
    const matchesAnyPattern = (value, patterns) => patterns.some((pattern) => pattern.test(value));
    const replaceFirstPattern = (value, patterns) => {
        for (const pattern of patterns) {
            if (pattern.test(value)) {
                return value.replace(pattern, '');
            }
        }
        return value;
    };
    const valueNearLabel = (labelPatterns, valueCleaner = cleanCandidate) => {
        for (let index = 0; index < lines.length; index += 1) {
            const line = lines[index];
            if (!matchesAnyPattern(line, labelPatterns)) continue;

            const sameLineValue = valueCleaner(replaceFirstPattern(line, labelPatterns));
            if (sameLineValue) return sameLineValue;

            for (let cursor = index + 1; cursor < Math.min(lines.length, index + 4); cursor += 1) {
                const nextLineValue = valueCleaner(lines[cursor] || '');
                if (nextLineValue) return nextLineValue;
            }
        }

        return '';
    };
    const multilineValueNearLabel = (labelPatterns, stopPatterns = []) => {
        for (let index = 0; index < lines.length; index += 1) {
            const line = lines[index];
            if (!matchesAnyPattern(line, labelPatterns)) continue;

            const sameLineValue = cleanCandidate(replaceFirstPattern(line, labelPatterns));
            if (sameLineValue) return sameLineValue;

            const collected = [];
            for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
                const candidate = lines[cursor];
                if (!candidate) continue;
                if (stopPatterns.some((pattern) => pattern.test(candidate))) break;

                const cleaned = cleanCandidate(candidate);
                if (!cleaned) continue;
                collected.push(cleaned);
            }

            if (collected.length > 0) {
                return collected.join(', ');
            }
        }

        return '';
    };
    const regexValue = (pattern) => {
        const match = normalizedText.match(pattern);
        return cleanCandidate(match?.[1] || '');
    };
    const containsUrdu = (value) => /[\u0600-\u06FF]/.test(String(value || ''));
    const normalizedUrduKey = (value) => String(value || '')
        .replace(/[^\u0600-\u06FF\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    const extractQrAlignedUrduAddress = () => {
        const urduCandidates = lines
            .map((line, index) => ({ index, line: String(line || '').trim() }))
            .filter(({ line }) => containsUrdu(line))
            .filter(({ line }) => !/\d/.test(line))
            .filter(({ line }) => line.length >= 12)
            .filter(({ line }) => !/رجسٹرار|شناختی|کارڈ/i.test(line))
            .filter(({ line }) => !/پرنٹ|والدین/i.test(line));

        if (urduCandidates.length === 0) return '';

        const rankedByPosition = [...urduCandidates].sort((a, b) => a.index - b.index);
        if (rankedByPosition.length >= 2) {
            return rankedByPosition[1].line;
        }

        const topWindow = rankedByPosition.filter(({ index }) => index <= 3);
        if (topWindow.length > 0) {
            return topWindow[topWindow.length - 1].line;
        }

        const grouped = new Map();
        urduCandidates.forEach(({ index, line }) => {
            const key = normalizedUrduKey(line);
            if (!key) return;

            const current = grouped.get(key) || { count: 0, firstIndex: index, line };
            current.count += 1;
            current.firstIndex = Math.min(current.firstIndex, index);
            if (!current.line || line.length > current.line.length) current.line = line;
            grouped.set(key, current);
        });

        const ranked = Array.from(grouped.values()).sort((a, b) => {
            if (b.count !== a.count) return b.count - a.count;
            return a.firstIndex - b.firstIndex;
        });

        return ranked[0]?.line || urduCandidates[0].line || '';
    };
    const labelWindowValue = (labelPatterns, valueCleaner = cleanCandidate) => {
        for (let index = 0; index < lines.length; index += 1) {
            const line = lines[index];
            if (!matchesAnyPattern(line, labelPatterns)) continue;

            const windowLines = lines.slice(index, Math.min(lines.length, index + 5));
            const joined = windowLines.join('\n');
            const stripped = valueCleaner(replaceFirstPattern(joined, labelPatterns));
            if (stripped) return stripped;
        }

        return '';
    };
    const cnicMatch = text.match(/\b\d{5}-\d{7}-\d\b|\b\d{13}\b/);
    const passportMatch = text.match(/\b[A-Z]{1,2}\d{6,8}\b/i);
    const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    const phoneCandidates = text.match(/(\+?\d[\d\s-]{7,}\d)/g) || [];
    const phoneMatch = phoneCandidates.find((candidate) => {
        const digits = String(candidate).replace(/\D/g, '');
        if (digits.length < 8 || digits.length > 15) return false;
        return candidate !== cnicMatch?.[0];
    });
    const extractCountryValue = () => {
        const regexCountry = normalizedText.match(/country\s+of\s+stay[^\n]*\n+([A-Za-z\s]+)/i);
        const regexCountryValue = cleanCandidate(regexCountry?.[1] || '');
        if (regexCountryValue) {
            const parts = regexCountryValue.split(/\s+/).filter(Boolean);
            return parts[parts.length - 1] || regexCountryValue;
        }

        for (let index = 0; index < lines.length; index += 1) {
            const line = lines[index];
            if (!/\bcountry\s+of\s+stay\b/i.test(line)) continue;

            for (let cursor = index + 1; cursor < Math.min(lines.length, index + 4); cursor += 1) {
                const candidate = cleanCandidate(lines[cursor] || '');
                if (!candidate) continue;
                if (/^[MF]\s+[A-Za-z]/i.test(candidate)) {
                    return candidate.replace(/^[MF]\s+/i, '').trim();
                }
                const countryOnly = candidate.match(/\bPakistan\b/i);
                if (countryOnly) return countryOnly[0];
                return candidate;
            }
        }

        return /\bpakistan\b/i.test(text) ? 'Pakistan' : '';
    };
    const extractGenderValue = () => {
        const regexGender = normalizedText.match(/gender[^\n]*\n+([MF])/i);
        if (regexGender?.[1]) {
            return regexGender[1].toUpperCase() === 'M' ? 'Male' : 'Female';
        }

        for (let index = 0; index < lines.length; index += 1) {
            const line = lines[index];
            if (!/\bgender\b/i.test(line)) continue;

            for (let cursor = index + 1; cursor < Math.min(lines.length, index + 3); cursor += 1) {
                const candidate = String(lines[cursor] || '').trim().toUpperCase();
                if (candidate === 'M' || candidate === 'F') {
                    return candidate === 'M' ? 'Male' : 'Female';
                }
                const embedded = candidate.match(/\b(M|F)\b/);
                if (embedded?.[1]) {
                    return embedded[1] === 'M' ? 'Male' : 'Female';
                }
            }
        }

        return '';
    };
    const extractedName = regexValue(/(?:^|\n)[^\n]*\bName\b[^\n]*\n+([A-Za-z][A-Za-z\s]{2,})/i)
        || valueNearLabel([/^name[:\s-]*$/i, /\bname\b/i], isLikelyPersonName)
        || '';
    const fatherName = regexValue(/(?:^|\n)[^\n]*\bFather\s+Name\b[^\n]*\n+([A-Za-z][A-Za-z\s]{2,})/i)
        || regexValue(/(?:^|\n)[^\n]*\bFather\s+N(?:ame)?\b[^\n]*\n+([A-Za-z][A-Za-z\s]{2,})/i)
        || valueNearLabel([/^father\s+name[:\s-]*$/i, /\bfather\s+name\b/i, /\bfather\s+n(?:ame)?\b/i], isLikelyPersonName);
    const country = extractCountryValue();
    const gender = extractGenderValue();
    const address = multilineValueNearLabel([/\baddress\b/i], [
        /^registrar/i,
        /^identity/i,
        /^date/i,
        /^country/i,
        /^gender/i,
    ]);
    const dateOfBirth = regexValue(/date\s+of\s+birth[:\s-]*([0-9]{2}[./-][0-9]{2}[./-][0-9]{4})/i)
        || valueNearLabel([/\bdate\s+of\s+birth\b/i], (value) => {
            const cleaned = cleanCandidate(value);
            return /^[0-9]{2}[./-][0-9]{2}[./-][0-9]{4}$/.test(cleaned) ? cleaned : '';
        });
    const fallbackName = extractedName
        || labelWindowValue([/\bname\b/i], isLikelyPersonName)
        || '';
    const fallbackFatherName = fatherName
        || labelWindowValue([/\bfather\s+name\b/i, /\bfather\s+n(?:ame)?\b/i], isLikelyPersonName)
        || '';
    const fallbackAddress = address
        || (assetType === 'CNIC_BACK' && containsUrdu(rawText) ? extractQrAlignedUrduAddress() : '');

    const inferredDocumentType = cnicMatch
        ? 'CNIC'
        : passportMatch
            ? 'PASSPORT'
            : currentDocumentType;

    return {
        document_type: inferredDocumentType,
        cnic_passport_number: cnicMatch?.[0] || passportMatch?.[0] || '',
        contact_email: emailMatch?.[0] || '',
        contact_phone: phoneMatch || '',
        gender,
        country,
        address: fallbackAddress,
        date_of_birth: dateOfBirth,
        extracted_name: fallbackName,
        father_name: fallbackFatherName,
    };
};

const hashFingerprintSeed = async (seed) => {
    const buffer = await window.crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(seed)
    );

    return Array.from(new Uint8Array(buffer))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
};
const dataUrlToFile = async (dataUrl, fileName, fallbackType = 'image/png') => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type || fallbackType });
};
const normalizeFingerprintBridgePayload = (payload = {}) => {
    const template = String(
        payload.template
        || payload.templateData
        || payload.isoTemplate
        || payload.seed
        || payload.raw
        || payload.deviceData
        || ''
    ).trim();
    const quality = String(payload.quality || payload.captureQuality || payload.score || 'HIGH').trim();
    const device = String(payload.device || payload.deviceName || payload.scanner || payload.vendor || '').trim();
    const imageDataUrl = String(
        payload.imageDataUrl
        || payload.thumbDataUrl
        || payload.imageBase64
        || payload.thumbBase64
        || payload.thumb_image_base64
        || ''
    ).trim();
    const imageUrl = String(payload.imageUrl || payload.thumbUrl || payload.thumb_image_url || '').trim();

    return {
        template,
        quality: quality || 'HIGH',
        device,
        imageDataUrl: imageDataUrl && !imageDataUrl.startsWith('data:')
            ? `data:image/png;base64,${imageDataUrl}`
            : imageDataUrl,
        imageUrl,
    };
};
const captureFingerprintFromBridge = async () => {
    let response;

    try {
        response = await fetch(`${BIOMETRIC_BRIDGE_ORIGIN}/fingerprint/capture`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ format: 'json' }),
        });
    } catch (error) {
        throw new Error('Thumb device service is not operational. Start the biometric device service or use manual/upload fallback.');
    }

    if (!response.ok) {
        throw new Error(`Biometric bridge returned ${response.status}. Make sure the thumb device service is running.`);
    }

    const payload = normalizeFingerprintBridgePayload(await response.json());
    if (!payload.template && !payload.imageDataUrl && !payload.imageUrl) {
        throw new Error('The thumb device did not return a fingerprint template or preview image.');
    }

    return payload;
};

const mapCustomerFromApi = (customer) => {
    const ocrDetails = customer.ocr_details || {};
    const fingerprint = ocrDetails.fingerprint || {};

    return {
        id: customer.id,
        dealer_id: customer.dealer_id || '',
        created_by_agent: customer.created_by_agent || '',
        dealer_name: customer.dealer_name || '',
        dealer_code: customer.dealer_code || '',
        full_name: customer.full_name || '',
        father_name: ocrDetails.father_name || '',
        cnic_passport_number: customer.cnic_passport_number || '',
        document_type: customer.document_type || ocrDetails.document_type || 'CNIC',
        contact_email: customer.contact_email || ocrDetails.contact_email || '',
        contact_phone: customer.contact_phone || ocrDetails.contact_phone || '',
        country: ocrDetails.country || '',
        gender: ocrDetails.gender || '',
        address: ocrDetails.address || '',
        date_of_birth: ocrDetails.date_of_birth || '',
        identity_doc_url: customer.identity_doc_url || '',
        identity_doc_back_url: ocrDetails.identity_doc_back_url || '',
        raw_ocr_text: customer.raw_ocr_text || ocrDetails.raw_ocr_text || '',
        extracted_name: customer.extracted_name || ocrDetails.extracted_name || '',
        biometric_hash: customer.biometric_hash || '',
        fingerprint_seed: '',
        fingerprint_status: customer.fingerprint_status || fingerprint.status || (customer.biometric_hash ? 'ENROLLED' : 'NOT_CAPTURED'),
        fingerprint_quality: customer.fingerprint_quality || fingerprint.quality || '',
        fingerprint_device: customer.fingerprint_device || fingerprint.device || '',
        fingerprint_thumb_url: fingerprint.thumb_image_url || '',
        signature_image_url: ocrDetails.signature_image_url || '',
        created_by_name: customer.created_by_name || '',
        created_by_email: customer.created_by_email || '',
    };
};

const mapEmployeeFromApi = (employee) => ({
    id: employee.id,
    user_id: employee.user_id || '',
    password: '',
    dealer_id: employee.dealer_id || '',
    dealer_name: employee.dealer_name || '',
    dealer_code: employee.dealer_code || '',
    employee_code: employee.employee_code || '',
    full_name: employee.full_name || '',
    email: employee.email || '',
    phone: employee.phone || '',
    cnic_number: employee.cnic_number || '',
    cnic_doc_url: employee.cnic_doc_url || '',
    cnic_front_url: employee.cnic_front_url || employee.cnic_doc_url || '',
    cnic_back_url: employee.cnic_back_url || '',
    department: employee.department || '',
    job_title: employee.job_title || '',
    commission_percentage: employee.commission_percentage != null ? String(employee.commission_percentage) : '',
    commission_value: employee.commission_value != null ? String(employee.commission_value) : '',
    base_salary: employee.base_salary != null ? String(employee.base_salary) : '',
    role_id: employee.role_id ? String(employee.role_id) : '',
    is_active: employee.is_active ?? true,
    hired_at: employee.hired_at ? String(employee.hired_at).slice(0, 10) : '',
    notes: employee.notes || '',
    created_by: employee.created_by || '',
    created_by_name: employee.created_by_name || '',
    created_by_email: employee.created_by_email || '',
    feature_ids: (employee.assigned_features || []).map((feature) => Number(feature.id)),
    denied_feature_ids: (employee.denied_features || []).map((feature) => Number(feature.id)),
});

const Dashboard = ({ pageKey, PageComponent }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const getCurrentRoutePage = () => (
        pageKey ||
        getDashboardPageFromSearch(location.search) ||
        getDashboardPageFromPathname(location.pathname) ||
        'dashboard'
    );
    const [activePage, setActivePage] = useState(() => getCurrentRoutePage());
    const [searchTerm, setSearchTerm] = useState('');
    const [dashboardData, setDashboardData] = useState({
        user: null,
        metrics: {
            activeLeases: 0,
            pendingTasks: 0,
            totalRevenue: 0,
            totalVehicles: 0,
            availableVehicles: 0,
            totalApplications: 0,
            totalCustomers: 0,
            scannedDocuments: 0,
            enrolledBiometrics: 0,
            totalEmployees: 0,
            activeEmployees: 0,
            totalDealers: 0,
            activeDealers: 0,
        },
        applications: [],
        ads: [],
        products: [],
        companies: [],
        inventory: [],
        customers: [],
        employees: [],
        dealerStaff: [],
        dealers: [],
        roles: [],
        features: [],
        vehicleTypes: [],
        workflowDefinitions: [],
        workflowTasks: [],
        salesTransactions: [],
        stockOrders: [],
        employeeCommissions: [],
        employeeAdvances: [],
        employeePayrolls: [],
        employeeSales: {
            receivedCount: 0,
            pendingCount: 0,
            receivedValue: 0,
            pendingValue: 0,
            overdueFollowups: 0,
            scope: 'all',
        },
    });
    const [customerForm, setCustomerForm] = useState(emptyCustomerForm);
    const [employeeForm, setEmployeeForm] = useState(emptyEmployeeForm);
    const [productForm, setProductForm] = useState(emptyProductForm);
    const [companyForm, setCompanyForm] = useState(emptyCompanyForm);
    const [saleForm, setSaleForm] = useState(emptySaleForm);
    const [stockOrderForm, setStockOrderForm] = useState(emptyStockOrderForm);
    const [dealerForm, setDealerForm] = useState(emptyDealerForm);
    const [workflowDefinitionForm, setWorkflowDefinitionForm] = useState(emptyWorkflowDefinitionForm);
    const [profileForm, setProfileForm] = useState(emptyProfileForm);
    const [dashboardTheme, setDashboardTheme] = useState(() => localStorage.getItem(DASHBOARD_THEME_STORAGE_KEY) || 'sandstone');
    const [pendingDashboardTheme, setPendingDashboardTheme] = useState(() => localStorage.getItem(DASHBOARD_THEME_STORAGE_KEY) || 'sandstone');
    const [hasThemePreference, setHasThemePreference] = useState(() => Boolean(localStorage.getItem(DASHBOARD_THEME_STORAGE_KEY)));
    const [roleAssignments, setRoleAssignments] = useState({});
    const [newVehicleType, setNewVehicleType] = useState('');
    const [editingSaleVehicle, setEditingSaleVehicle] = useState(null);
    const [saleFormReadOnly, setSaleFormReadOnly] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [selectedInstallmentSaleId, setSelectedInstallmentSaleId] = useState('');
    const [selectedTransactionSaleId, setSelectedTransactionSaleId] = useState('');
    const [selectedWorkflowTaskId, setSelectedWorkflowTaskId] = useState('');
    const [transactionActionState, setTransactionActionState] = useState({ saleId: '', action: '' });
    const [expandedTables, setExpandedTables] = useState({});
    const [advanceForm, setAdvanceForm] = useState({ amount: '', reason: '', advance_date: new Date().toISOString().slice(0, 10) });
    const [payrollMonth, setPayrollMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    const [salaryGenerationEmployeeId, setSalaryGenerationEmployeeId] = useState('');
    const [reportsMenuOpen, setReportsMenuOpen] = useState(false);
    const [reportDateFrom, setReportDateFrom] = useState(() => new Date().toISOString().slice(0, 10));
    const [reportDateTo, setReportDateTo] = useState(() => new Date().toISOString().slice(0, 10));
    const [reportBranchName, setReportBranchName] = useState('ALL');
    const [reportAgentName, setReportAgentName] = useState('ALL');
    const [reportSaleMode, setReportSaleMode] = useState('ALL');
    const [reportStatus, setReportStatus] = useState('ALL');
    const [reportKeyword, setReportKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [savingCustomer, setSavingCustomer] = useState(false);
    const [savingEmployee, setSavingEmployee] = useState(false);
    const [savingAdvance, setSavingAdvance] = useState(false);
    const [savingPayroll, setSavingPayroll] = useState(false);
    const [savingAccess, setSavingAccess] = useState(false);
    const [savingProduct, setSavingProduct] = useState(false);
    const [savingCompany, setSavingCompany] = useState(false);
    const [savingSale, setSavingSale] = useState(false);
    const [savingStock, setSavingStock] = useState(false);
    const [savingDealer, setSavingDealer] = useState(false);
    const [savingWorkflowDefinition, setSavingWorkflowDefinition] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [switchingProfile, setSwitchingProfile] = useState(false);
    const [savingVehicleType, setSavingVehicleType] = useState(false);
    const [processingWorkflowTaskId, setProcessingWorkflowTaskId] = useState('');
    const [receivingInstallmentId, setReceivingInstallmentId] = useState('');
    const [installmentReceiptInputs, setInstallmentReceiptInputs] = useState({});
    const [receivingStockOrder, setReceivingStockOrder] = useState(null);
    const [stockReceiveItems, setStockReceiveItems] = useState([createEmptyReceiveItem()]);
    const [activeAccessPopup, setActiveAccessPopup] = useState(null);
    const [employeeAccessPopupOpen, setEmployeeAccessPopupOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profilePanelOpen, setProfilePanelOpen] = useState(false);
    const [salesVehicleDropdownOpen, setSalesVehicleDropdownOpen] = useState(false);
    const [readNotificationKeys, setReadNotificationKeys] = useState([]);
    const [uploadingAgreement, setUploadingAgreement] = useState(false);
    const [uploadingBankSlip, setUploadingBankSlip] = useState(false);
    const [uploadingSaleBankCheck, setUploadingSaleBankCheck] = useState(false);
    const [uploadingSaleMiscDocument, setUploadingSaleMiscDocument] = useState(false);
    const [uploadingSaleAuthorizedSignature, setUploadingSaleAuthorizedSignature] = useState(false);
    const [uploadingCustomerAsset, setUploadingCustomerAsset] = useState(false);
    const [uploadingEmployeeDocument, setUploadingEmployeeDocument] = useState(false);
    const [error, setError] = useState('');
    const [customerMessage, setCustomerMessage] = useState('');
    const [employeeMessage, setEmployeeMessage] = useState('');
    const [accessMessage, setAccessMessage] = useState('');
    const [productMessage, setProductMessage] = useState('');
    const [companyMessage, setCompanyMessage] = useState('');
    const [saleMessage, setSaleMessage] = useState('');
    const [stockMessage, setStockMessage] = useState('');
    const [dealerMessage, setDealerMessage] = useState('');
    const [workflowMessage, setWorkflowMessage] = useState('');
    const [profileMessage, setProfileMessage] = useState('');
    const [vehicleTypeMessage, setVehicleTypeMessage] = useState('');
    const [adForm, setAdForm] = useState(emptyAdForm);
    const [adMessage, setAdMessage] = useState('');
    const [savingAd, setSavingAd] = useState(false);
    const workflowTasksTableRef = useRef(null);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const requestedDashboardPage = getCurrentRoutePage() || activePage || 'dashboard';
            const { data } = await API.get('/admin/dashboard', {
                params: { page: requestedDashboardPage },
            });
            setDashboardData(data);
            localStorage.setItem('user', JSON.stringify(data.user));
            setReadNotificationKeys(data.notificationReadKeys || []);
            const assignments = (data.roles || []).reduce((acc, role) => {
                acc[role.id] = (data.rolePermissions || [])
                    .filter((permission) => Number(permission.role_id) === Number(role.id))
                    .map((permission) => Number(permission.feature_id));
                return acc;
            }, {});
            setRoleAssignments(assignments);
            setSelectedCustomerId((current) => (
                current && (data.customers || []).some((customer) => customer.id === current)
                    ? current
                    : ''
            ));
            setSelectedEmployeeId((current) => (
                current && (data.employees || []).some((employee) => employee.id === current)
                    ? current
                    : ''
            ));
            setSelectedInstallmentSaleId((current) => {
                const installmentSales = (data.salesTransactions || []).filter((sale) => sale.sale_mode === 'INSTALLMENT');
                if (current && installmentSales.some((sale) => sale.id === current)) {
                    return current;
                }
                return installmentSales[0]?.id || '';
            });
            setSelectedTransactionSaleId((current) => {
                const salesTransactions = data.salesTransactions || [];
                if (current && salesTransactions.some((sale) => sale.id === current)) {
                    return current;
                }
                return salesTransactions[0]?.id || '';
            });
            setSelectedWorkflowTaskId((current) => {
                const workflowTasks = data.workflowTasks || [];
                if (current && workflowTasks.some((task) => task.id === current)) {
                    return current;
                }
                return '';
            });
            setProductForm((current) => ({
                ...current,
                vehicle_type: current.vehicle_type || data.vehicleTypes?.[0]?.type_key || '',
            }));
            setStockOrderForm((current) => ({
                ...current,
                company_profile_id: current.company_profile_id || data.companies?.[0]?.id || '',
                product_id: current.product_id || data.products?.[0]?.id || '',
                vehicle_type: current.vehicle_type || data.vehicleTypes?.[0]?.type_key || '',
            }));
            setError('');
        } catch (err) {
            const message = err.response?.status === 401
                ? 'Your session has expired. Please sign in again.'
                : err.response?.status === 403
                    ? (err.response?.data?.message || 'Access denied. Your account is missing dealer scope or required features.')
                : 'Unable to load live dashboard data from PostgreSQL.';

            setError(message);

            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        loadDashboard();
    }, [navigate, pageKey, location.pathname, location.search]);

    const goToPage = (nextPage, options = {}) => {
        if (!nextPage) {
            return;
        }

        setActivePage(nextPage);
        navigate(getDashboardPathForPage(nextPage), { replace: Boolean(options.replace) });
    };

    const resetAdForm = () => {
        setAdForm(emptyAdForm);
        setAdMessage('');
    };

    const user = dashboardData.user || JSON.parse(localStorage.getItem('user') || 'null');
    const currentSalesDealerSignatureUrl = user?.dealer_signature_url || '';
    const isSuperAdmin = Number(user?.role_id) === 1 || user?.role_name === 'SUPER_ADMIN';
    const realIsSuperAdmin = Number(user?.real_role_id || user?.role_id) === 1 || (user?.real_role_name || user?.role_name) === 'SUPER_ADMIN';
    const effectiveIsApplicationAdmin = user?.role_name === 'APPLICATION_ADMIN';
    const canUseProfileSwitch = realIsSuperAdmin && (
        (user?.real_feature_keys || []).includes('FEAT_PROFILE_SWITCH') ||
        hasAnyFeature(user, ['FEAT_PROFILE_SWITCH'])
    );
    const currentProfileDealerId = String(user?.effective_dealer_id || user?.dealer_id || '');
    const isDealerProfileSwitchActive = Boolean(realIsSuperAdmin && user?.profile_mode === 'DEALER_SWITCH' && currentProfileDealerId);
    const isDealerScopedDashboard = Boolean(currentProfileDealerId) && !realIsSuperAdmin
        ? true
        : Boolean(isDealerProfileSwitchActive);
    const customerDealerOptions = useMemo(() => {
        if (isSuperAdmin) {
            return dashboardData.dealers || [];
        }

        return (dashboardData.dealers || []).filter((dealer) => String(dealer.id || '') === String(currentProfileDealerId || user?.dealer_id || ''));
    }, [currentProfileDealerId, dashboardData.dealers, isSuperAdmin, user?.dealer_id]);
    const canEditCustomerDealerDropdown = isSuperAdmin || effectiveIsApplicationAdmin;
    const displayUserName = String(user?.full_name || 'MotorLease User').trim() || 'MotorLease User';
    const dealerBrandLogo = buildAssetUrl(isSuperAdmin ? (user?.dealer_logo_url || user?.brand_logo_url || '') : (user?.dealer_logo_url || ''));
    const appBrandName = isSuperAdmin ? (user?.dealer_name || user?.brand_name || 'MotorLease') : (user?.dealer_name || 'MotorLease');
    const appBrandAddress = isSuperAdmin ? (user?.dealer_address || user?.brand_address || 'Head office address not set') : (user?.dealer_address || 'Head office address not set');
    const appBrandContact = [user?.mobile_country_code, user?.mobile_number].filter(Boolean).join(' ') || user?.contact_email || 'Contact details not set';
    const getCustomerCreatedByLabel = (customer = {}) => {
        const isCurrentUserCreator =
            customer.created_by_agent &&
            user?.id &&
            String(customer.created_by_agent) === String(user.id);
        const isCurrentUserApplicationAdmin = String(user?.role_name || '').toUpperCase() === 'APPLICATION_ADMIN';

        if (isCurrentUserCreator && isCurrentUserApplicationAdmin) {
            return user?.dealer_name || customer.dealer_name || user?.full_name || customer.created_by_name || user?.email || customer.created_by_email || 'Not set';
        }

        if (isCurrentUserCreator) {
            return user?.full_name || customer.created_by_name || user?.email || customer.created_by_email || 'Not set';
        }

        return customer.created_by_name || customer.dealer_name || customer.created_by_email || 'Not set';
    };
    const canViewDashboard = hasAnyFeature(user, ['FEAT_DASHBOARD_VIEW']) || Boolean(user);
    const canViewApplications = hasAnyFeature(user, ['FEAT_APPLICATIONS_VIEW']);
    const canViewWorkflow = hasAnyFeature(user, ['FEAT_WORKFLOW_VIEW']);
    const canUseOcr = hasAnyFeature(user, ['FEAT_OCR_SCAN']);
    const canUseBiometric = hasAnyFeature(user, ['FEAT_BIOMETRIC']);
    const canCreateCustomerBiometric = hasAnyFeature(user, ['FEAT_CUSTOMER_BIOMETRIC', 'FEAT_BIOMETRIC']);
    const canManageCustomers = hasAnyFeature(user, ['FEAT_CUSTOMER_MGMT']);
    const canManageProducts = hasAnyFeature(user, ['FEAT_PRODUCT_MGMT', 'FEAT_FLEET_MGMT']);
    const canManageStock = hasAnyFeature(user, ['FEAT_STOCK_MGMT', 'FEAT_FLEET_MGMT']);
    const canCreateSales = hasAnyFeature(user, ['FEAT_SALES_CREATE', 'FEAT_SALES_MGMT']);
    const canManageSales = hasAnyFeature(user, ['FEAT_SALES_MGMT']);
    const canManageInstallments = hasAnyFeature(user, ['FEAT_INSTALLMENT_MGMT', 'FEAT_SALES_MGMT']);
    const canManageDealers = hasAnyFeature(user, ['FEAT_DEALER_MGMT']) && realIsSuperAdmin;
    const canManageUsers = hasAnyFeature(user, ['FEAT_USER_MGMT']);
    const canManageAds = realIsSuperAdmin || hasAnyFeature(user, ['FEAT_ADS_MGMT']);
    const canManageAccessControl = hasAnyFeature(user, ['FEAT_ACCESS_CONTROL', 'FEAT_USER_MGMT']);
    const canManageEmployees = (isSuperAdmin || effectiveIsApplicationAdmin) && canManageUsers;
    const canManageAccess = realIsSuperAdmin && canManageAccessControl;
    const canManageThemes = hasAnyFeature(user, ['FEAT_THEME_MGMT']);
    const adPreviewUrl = useMemo(() => buildAssetUrl(adForm.image_url), [adForm.image_url]);

    const handleAdChange = (event) => {
        const { name, value, type, checked } = event.target;
        setAdForm((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleAdEdit = (ad) => {
        setAdForm({
            id: ad.id || '',
            title: ad.title || '',
            subtitle: ad.subtitle || '',
            image_url: ad.image_url || '',
            cta_label: ad.cta_label || '',
            cta_url: ad.cta_url || '',
            display_order: ad.display_order ?? 0,
            is_active: Boolean(ad.is_active),
            start_at: ad.start_at ? ad.start_at.slice(0, 10) : '',
            end_at: ad.end_at ? ad.end_at.slice(0, 10) : '',
            dealer_id: ad.dealer_id || '',
        });
        setAdMessage(`Editing ${ad.title || 'campaign'}.`);
    };

    const handleAdDelete = async (adId) => {
        if (!window.confirm('Delete this advertisement?')) return;
        setSavingAd(true);
        try {
            await API.delete(`/admin/ads/${adId}`);
            setAdMessage('Campaign deleted.');
            if (adForm.id === adId) {
                setAdForm(emptyAdForm);
            }
            await loadDashboard();
        } catch (err) {
            setAdMessage(err.response?.data?.message || 'Failed to delete campaign.');
        } finally {
            setSavingAd(false);
        }
    };

    const handleAdSubmit = async (event) => {
        event.preventDefault();
        if (!String(adForm.title || '').trim()) {
            setAdMessage('Ad title is required.');
            return;
        }

        if (!String(adForm.image_url || '').trim()) {
            setAdMessage('Ad image is required. Upload an image first.');
            return;
        }

        setSavingAd(true);
        try {
            const payload = {
                title: adForm.title,
                subtitle: adForm.subtitle,
                image_url: adForm.image_url,
                cta_label: adForm.cta_label,
                cta_url: adForm.cta_url,
                display_order: Number(adForm.display_order || 0),
                is_active: Boolean(adForm.is_active),
                start_at: adForm.start_at || null,
                end_at: adForm.end_at || null,
                dealer_id: adForm.dealer_id || null,
            };

            if (adForm.id) {
                await API.put(`/admin/ads/${adForm.id}`, payload);
                setAdMessage('Campaign updated.');
            } else {
                await API.post('/admin/ads', payload);
                setAdMessage('Campaign created.');
            }

            setAdForm(emptyAdForm);
            await loadDashboard();
        } catch (err) {
            const status = err.response?.status;
            const serverMessage = err.response?.data?.message;
            setAdMessage(
                serverMessage
                    ? (status ? `HTTP ${status}: ${serverMessage}` : serverMessage)
                    : 'Failed to save campaign.'
            );
        } finally {
            setSavingAd(false);
        }
    };

    const handleAdUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('adImage', file);
        setSavingAd(true);

        try {
            const { data } = await API.post('/admin/ads/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setAdForm((current) => ({ ...current, image_url: data.url || '' }));
            setAdMessage('Campaign image uploaded.');
        } catch (err) {
            setAdMessage(err.response?.data?.message || 'Failed to upload campaign image.');
        } finally {
            setSavingAd(false);
            event.target.value = '';
        }
    };

    useEffect(() => {
        setWorkflowDefinitionForm((current) => {
            if (current.id) {
                return current;
            }

            return {
                ...current,
                dealer_id: isSuperAdmin ? current.dealer_id : (user?.dealer_id || ''),
            };
        });
    }, [isSuperAdmin, user?.dealer_id]);
    useEffect(() => {
        setEmployeeForm((current) => {
            if (current.id) {
                return current;
            }

            return {
                ...current,
                dealer_id: isSuperAdmin ? current.dealer_id : (user?.dealer_id || ''),
            };
        });
    }, [isSuperAdmin, user?.dealer_id]);
    const canOpenCustomers = hasAnyFeature(user, [
        'FEAT_CUSTOMER_MGMT',
        'FEAT_CUSTOMER_FORM',
        'FEAT_CUSTOMER_REGISTER',
        'FEAT_CUSTOMER_RECORD_VIEW',
        'FEAT_CUSTOMER_RECORD_EDIT',
        'FEAT_CUSTOMER_RECORD_DELETE',
        'FEAT_CUSTOMER_FINGERPRINT',
        'FEAT_CUSTOMER_BIOMETRIC',
        'FEAT_OCR_SCAN',
        'FEAT_BIOMETRIC',
    ]) || canManageEmployees;
    const canViewDashboardAccessProfile = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_ACCESS_PROFILE']);
    const canViewDashboardSalesPerformance = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_SALES_PERFORMANCE']);
    const canViewDashboardProfitTransactions = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_PROFIT_TRANSACTIONS']);
    const canViewDashboardCompanyProfitability = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_COMPANY_PROFITABILITY']);
    const canViewDashboardRecentApplications = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_RECENT_APPLICATIONS']);
    const canViewDashboardRecentEmployees = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_RECENT_EMPLOYEES']);
    const canViewDashboardCardActiveLeases = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_CARD_ACTIVE_LEASES']);
    const canViewDashboardCardPendingLeases = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_CARD_PENDING_LEASES']);
    const canViewDashboardCardPendingTasks = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_CARD_PENDING_TASKS']);
    const canViewDashboardCardTotalRevenue = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_CARD_TOTAL_REVENUE']);
    const canViewDashboardCardEmployeeCommissions = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_CARD_EMPLOYEE_COMMISSIONS']);
    const canViewDashboardCardTotalVehicles = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_CARD_TOTAL_VEHICLES']);
    const canViewDashboardCardTotalCustomers = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_CARD_TOTAL_CUSTOMERS']);
    const canViewDashboardCardTotalEmployees = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_CARD_TOTAL_EMPLOYEES']);
    const canViewDashboardCardActiveEmployees = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_CARD_ACTIVE_EMPLOYEES']);
    const canViewDashboardCardTotalDealers = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_CARD_TOTAL_DEALERS']);
    const canViewDashboardCardActiveDealers = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_CARD_ACTIVE_DEALERS']);
    const canViewDashboardCardScannedDocuments = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_CARD_SCANNED_DOCUMENTS']);
    const canViewDashboardCardEnrolledBiometrics = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_CARD_ENROLLED_BIOMETRICS']);
    const canViewDashboardCardTotalApplications = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_CARD_TOTAL_APPLICATIONS']);
    const canViewDashboardCardCashTransactions = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_CARD_CASH_TRANSACTIONS']);
    const canViewDashboardCardInstallmentTransactions = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_CARD_INSTALLMENT_TRANSACTIONS']);
    const canViewDashboardCardReceivedInstallments = canViewDashboard && hasAnyFeature(user, ['FEAT_DASHBOARD_CARD_RECEIVED_INSTALLMENTS']);
    const canViewApplicationsList = canViewApplications && hasAnyFeature(user, ['FEAT_APPLICATIONS_LIST']);
    const canViewWorkflowTasks = canViewWorkflow && hasAnyFeature(user, ['FEAT_WORKFLOW_TASKS']);
    const canViewWorkflowConfig = canViewWorkflow && hasAnyFeature(user, ['FEAT_WORKFLOW_CONFIG']);
    const canOpenWorkflowWorkspace = canViewWorkflow && (canViewWorkflowConfig || canViewWorkflowTasks);
    const canViewProductForm = canManageProducts && hasAnyFeature(user, ['FEAT_PRODUCT_FORM']);
    const canViewProductTypeMaster = canManageProducts && hasAnyFeature(user, ['FEAT_PRODUCT_TYPE_MGMT']);
    const canViewProductRegister = canManageProducts && hasAnyFeature(user, ['FEAT_PRODUCT_REGISTER']);
    const canViewCompanyForm = canManageStock && hasAnyFeature(user, ['FEAT_COMPANY_FORM']);
    const canViewCompanyDirectory = canManageStock && hasAnyFeature(user, ['FEAT_COMPANY_DIRECTORY']);
    const canViewSalesAgreementForm = canCreateSales && hasAnyFeature(user, ['FEAT_SALES_AGREEMENT_FORM']);
    const canViewSalesAgreementSummary = canCreateSales && hasAnyFeature(user, ['FEAT_SALES_AGREEMENT_SUMMARY']);
    const canViewSalesInstallmentPreview = canCreateSales && hasAnyFeature(user, ['FEAT_SALES_INSTALLMENT_PREVIEW']);
    const canViewSalesRegister = canCreateSales && hasAnyFeature(user, ['FEAT_SALES_REGISTER']);
    const canUpdateSalesRegister = hasAnyFeature(user, ['FEAT_SALES_UPDATE', 'FEAT_SALES_MGMT']);
    const canViewTransactionRegister = canManageSales && hasAnyFeature(user, ['FEAT_TRANSACTION_REGISTER']);
    const canViewStockOrderForm = canManageStock && hasAnyFeature(user, ['FEAT_STOCK_ORDER_FORM']);
    const canViewStockReceived = canManageStock && hasAnyFeature(user, ['FEAT_STOCK_RECEIVED_VIEW']);
    const canViewStockRegister = canManageStock && hasAnyFeature(user, ['FEAT_STOCK_REGISTER']);
    const canViewInstallmentOverview = canManageInstallments && hasAnyFeature(user, ['FEAT_INSTALLMENT_OVERVIEW']);
    const canViewInstallmentCollection = canManageInstallments && hasAnyFeature(user, ['FEAT_INSTALLMENT_COLLECTION']);
    const canOpenSalesWorkspace = [
        canViewSalesAgreementForm,
        canViewSalesAgreementSummary,
        canViewSalesInstallmentPreview,
        canViewSalesRegister,
    ].some(Boolean);
    const canOpenInstallmentWorkspace = [
        canViewInstallmentOverview,
        canViewInstallmentCollection,
    ].some(Boolean);
const canEditCustomerRecord = canOpenCustomers && hasAnyFeature(user, ['FEAT_CUSTOMER_RECORD_EDIT', 'FEAT_CUSTOMER_MGMT']);
const canDeleteCustomerRecord = canOpenCustomers && hasAnyFeature(user, ['FEAT_CUSTOMER_RECORD_DELETE', 'FEAT_CUSTOMER_MGMT']);
const canViewCustomerRecord = canOpenCustomers && hasAnyFeature(user, ['FEAT_CUSTOMER_RECORD_VIEW', 'FEAT_CUSTOMER_MGMT', 'FEAT_CUSTOMER_RECORD_EDIT', 'FEAT_CUSTOMER_RECORD_DELETE']);
const canViewCustomerRegister = canOpenCustomers && hasAnyFeature(user, ['FEAT_CUSTOMER_REGISTER', 'FEAT_CUSTOMER_MGMT', 'FEAT_CUSTOMER_RECORD_VIEW', 'FEAT_CUSTOMER_RECORD_EDIT', 'FEAT_CUSTOMER_RECORD_DELETE']);
const canViewCustomerFingerprint = canOpenCustomers && hasAnyFeature(user, ['FEAT_CUSTOMER_FINGERPRINT', 'FEAT_CUSTOMER_MGMT', 'FEAT_CUSTOMER_BIOMETRIC', 'FEAT_BIOMETRIC']);
// Show the intake form if the role explicitly has it, or if they can edit customer records (edit button uses the form).
const canViewCustomerForm = canOpenCustomers && (hasAnyFeature(user, ['FEAT_CUSTOMER_FORM', 'FEAT_CUSTOMER_MGMT']) || canEditCustomerRecord);
const canUnlockCustomerOwnership = canOpenCustomers && hasAnyFeature(user, ['FEAT_CUSTOMER_OWNERSHIP_UNLOCK']) && hasAnyFeature(user, ['FEAT_CUSTOMER_MGMT']);
const canViewEmployeeForm = canManageEmployees && hasAnyFeature(user, ['FEAT_EMPLOYEE_FORM']);
const canEditEmployees = canManageEmployees && hasAnyFeature(user, ['FEAT_EMPLOYEE_EDIT']);
const canChangeEmployeeRecord = canManageEmployees && (!employeeForm.id || canEditEmployees);
const canUnlockEmployeeSecurityFields = canEditEmployees && hasAnyFeature(user, ['FEAT_EMPLOYEE_SECURITY_UNLOCK']);
const canViewEmployeeRoleFeaturesDisplay = canManageEmployees && hasAnyFeature(user, ['FEAT_EMPLOYEE_ROLE_FEATURES_DISPLAY']);
    const canViewEmployeeExtraFeatures = canManageEmployees && hasAnyFeature(user, ['FEAT_EMPLOYEE_EXTRA_FEATURES']);
    const canViewEmployeeAdvanceCash = canManageEmployees && hasAnyFeature(user, ['FEAT_EMPLOYEE_ADVANCE_CASH']);
    const canViewEmployeeSalaryGeneration = canManageEmployees && hasAnyFeature(user, ['FEAT_EMPLOYEE_SALARY_GENERATION']);
    const canViewEmployeeDirectory = canManageEmployees && hasAnyFeature(user, ['FEAT_EMPLOYEE_DIRECTORY']);
    const canViewEmployeeCommissionLedger = canManageEmployees && hasAnyFeature(user, ['FEAT_EMPLOYEE_COMMISSION_LEDGER']);
    const canViewEmployeeSalaryRecord = canManageEmployees && hasAnyFeature(user, ['FEAT_EMPLOYEE_SALARY_RECORD']);
    const canViewEmployeeAdvanceHistory = canManageEmployees && hasAnyFeature(user, ['FEAT_EMPLOYEE_ADVANCE_HISTORY']);
    const canViewEmployeeGeneratedSalaries = canManageEmployees && hasAnyFeature(user, ['FEAT_EMPLOYEE_GENERATED_SALARIES']);
    const canViewDealerForm = canManageDealers && hasAnyFeature(user, ['FEAT_DEALER_FORM']);
    const canViewDealerSummary = canManageDealers && hasAnyFeature(user, ['FEAT_DEALER_SUMMARY']);
    const canViewDealerDirectory = canManageDealers && hasAnyFeature(user, ['FEAT_DEALER_DIRECTORY']);
    const canViewReportStockInventory = (canManageSales || canManageStock) && hasAnyFeature(user, ['FEAT_REPORT_STOCK_INVENTORY']);
    const canViewReportDailySales = (canManageSales || canManageStock) && hasAnyFeature(user, ['FEAT_REPORT_DAILY_SALES']);
    const canViewReportStockReceived = (canManageSales || canManageStock) && hasAnyFeature(user, ['FEAT_REPORT_STOCK_RECEIVED']);
    const canViewReportCustomers = (canManageSales || canManageStock) && hasAnyFeature(user, ['FEAT_REPORT_CUSTOMERS']);
    const canViewReportCustomerTransactions = (canManageSales || canManageStock) && hasAnyFeature(user, ['FEAT_REPORT_CUSTOMER_TRANSACTIONS']);
    const canViewReportBusinessTransactions = (canManageSales || canManageStock) && hasAnyFeature(user, ['FEAT_REPORT_BUSINESS_TRANSACTIONS']);
    const canViewReportInvoiceView = (canManageSales || canManageStock) && hasAnyFeature(user, ['FEAT_REPORT_INVOICE_VIEW']);
    const canViewReportEmployees = (canManageEmployees || canManageSales || canManageStock) && hasAnyFeature(user, ['FEAT_REPORT_EMPLOYEES']);
    const canViewReportSalary = (canManageEmployees || canManageSales || canManageStock) && hasAnyFeature(user, ['FEAT_REPORT_SALARY']);
    const canViewReportDealerInformation = (canManageDealers || canManageEmployees || canManageSales || canManageStock) && hasAnyFeature(user, ['FEAT_REPORT_DEALER_INFORMATION']);
    const canViewReportDealerEmployees = (canManageDealers || canManageEmployees || canManageSales || canManageStock) && hasAnyFeature(user, ['FEAT_REPORT_DEALER_EMPLOYEES']);
    const canOpenReports = [
        canViewReportStockInventory,
        canViewReportDailySales,
        canViewReportStockReceived,
        canViewReportCustomers,
        canViewReportCustomerTransactions,
        canViewReportBusinessTransactions,
        canViewReportInvoiceView,
        canViewReportEmployees,
        canViewReportSalary,
        canViewReportDealerInformation,
        canViewReportDealerEmployees,
    ].some(Boolean);
    const reportLinks = useMemo(() => ([
        { key: 'report-stock-inventory', label: 'Stock Inventory Report', visible: canViewReportStockInventory },
        { key: 'report-daily-sales', label: 'Daily Transactions Sale Report', visible: canViewReportDailySales },
        { key: 'report-stock-received', label: 'Daily Transactions Stock Received', visible: canViewReportStockReceived },
        { key: 'report-customers', label: 'Customer Report', visible: canViewReportCustomers },
        { key: 'report-customer-transactions', label: 'Customer Transaction Report', visible: canViewReportCustomerTransactions },
        { key: 'report-business-transactions', label: 'Business Transaction Report', visible: canViewReportBusinessTransactions },
        { key: 'report-invoice-view', label: 'Invoice View Report', visible: canViewReportInvoiceView },
        { key: 'report-employees', label: 'Employees Report', visible: canViewReportEmployees },
        { key: 'report-salary', label: 'Salary Report', visible: canViewReportSalary },
        { key: 'report-dealer-information', label: 'Dealer Information Report', visible: canViewReportDealerInformation },
        { key: 'report-dealer-employees', label: 'Dealer Wise Employee Report', visible: canViewReportDealerEmployees },
    ].filter((report) => report.visible)), [
        canViewReportBusinessTransactions,
        canViewReportCustomerTransactions,
        canViewReportCustomers,
        canViewReportDealerEmployees,
        canViewReportDealerInformation,
        canViewReportDailySales,
        canViewReportEmployees,
        canViewReportInvoiceView,
        canViewReportSalary,
        canViewReportStockInventory,
        canViewReportStockReceived,
    ]);
    const isReportPage = activePage === 'reports' || reportLinks.some((report) => report.key === activePage);
    const tabReferences = useMemo(() => ([
        { key: 'dashboard', label: 'Dashboard', visible: canViewDashboard, featureRef: 'FEAT_DASHBOARD_VIEW' },
        { key: 'customers', label: 'Customers', visible: canOpenCustomers, featureRef: 'FEAT_CUSTOMER_MGMT / FEAT_OCR_SCAN / FEAT_BIOMETRIC / FEAT_CUSTOMER_BIOMETRIC' },
        { key: 'employees', label: 'Employees', visible: canManageEmployees, featureRef: 'FEAT_USER_MGMT' },
        { key: 'dealers', label: 'Dealers', visible: canManageDealers, featureRef: 'FEAT_DEALER_MGMT' },
        { key: 'access', label: 'Access Control', visible: canManageAccess, featureRef: 'FEAT_ACCESS_CONTROL / FEAT_USER_MGMT' },
        { key: 'applications', label: 'Applications', visible: canViewApplications, featureRef: 'FEAT_APPLICATIONS_VIEW' },
        { key: 'workflow', label: 'Workflow', visible: canOpenWorkflowWorkspace, featureRef: 'FEAT_WORKFLOW_VIEW / FEAT_WORKFLOW_CONFIG / FEAT_WORKFLOW_TASKS' },
        { key: 'user-tasks', label: 'User Tasks', visible: canViewWorkflow && canViewWorkflowTasks, featureRef: 'FEAT_WORKFLOW_VIEW / FEAT_WORKFLOW_TASKS' },
        { key: 'sales', label: 'Sales', visible: canOpenSalesWorkspace, featureRef: 'Sales function access' },
        { key: 'transactions', label: 'Adhoc Sales', visible: canViewTransactionRegister, featureRef: 'FEAT_TRANSACTION_REGISTER' },
        { key: 'reports', label: 'Reports', visible: canOpenReports, featureRef: 'Report function access' },
        { key: 'installments', label: 'Installments', visible: canOpenInstallmentWorkspace, featureRef: 'Installment function access' },
        { key: 'companies', label: 'Company Profile', visible: canManageStock, featureRef: 'FEAT_STOCK_MGMT / FEAT_FLEET_MGMT' },
        { key: 'stock', label: 'Stock', visible: canManageStock, featureRef: 'FEAT_STOCK_MGMT / FEAT_FLEET_MGMT' },
        { key: 'products', label: 'Products', visible: canManageProducts, featureRef: 'FEAT_PRODUCT_MGMT / FEAT_FLEET_MGMT' },
    ]), [
        canCreateSales,
        canManageAccess,
        canManageDealers,
        canManageEmployees,
        canManageInstallments,
        canManageSales,
        canManageProducts,
        canManageStock,
        canOpenInstallmentWorkspace,
        canOpenSalesWorkspace,
        canOpenCustomers,
        canViewApplications,
        canOpenWorkflowWorkspace,
        canViewWorkflow,
        canViewDashboard,
        canViewTransactionRegister,
        dashboardData.salesTransactions,
    ]);

    useEffect(() => {
        if (isReportPage) {
            setReportsMenuOpen(true);
        }
    }, [isReportPage]);

    useEffect(() => {
        if (loading) {
            return;
        }

        const installmentTabVisible =
            canOpenInstallmentWorkspace &&
            dashboardData.salesTransactions.some((sale) => sale.sale_mode === 'INSTALLMENT');

        const pageAccess = {
            dashboard: canViewDashboard,
            applications: canViewApplications,
            workflow: canOpenWorkflowWorkspace,
            'user-tasks': canViewWorkflow && canViewWorkflowTasks,
            products: canManageProducts,
            installments: canOpenInstallmentWorkspace || installmentTabVisible,
            stock: canManageStock,
            companies: canManageStock,
            dealers: canManageDealers,
            sales: canOpenSalesWorkspace,
            customers: canOpenCustomers,
            employees: canManageEmployees,
            access: canManageAccess,
        reports: canOpenReports,
        'report-stock-inventory': canViewReportStockInventory,
        'report-daily-sales': canViewReportDailySales,
        'report-stock-received': canViewReportStockReceived,
        'report-customers': canViewReportCustomers,
        'report-customer-transactions': canViewReportCustomerTransactions,
        'report-business-transactions': canViewReportBusinessTransactions,
        'report-invoice-view': canViewReportInvoiceView,
        'report-employees': canViewReportEmployees,
        'report-salary': canViewReportSalary,
        'report-dealer-information': canViewReportDealerInformation,
        'report-dealer-employees': canViewReportDealerEmployees,
            transactions: canViewTransactionRegister,
        };

        if (pageAccess[activePage] !== false) {
            return;
        }

        const fallbackPage = tabReferences.find((tab) => tab.visible)?.key;

        if (fallbackPage && fallbackPage !== activePage) {
            goToPage(fallbackPage, { replace: true });
        }
    }, [
        activePage,
        canCreateSales,
        canManageAccess,
        canManageDealers,
        canManageEmployees,
        canManageInstallments,
        canManageSales,
        canManageProducts,
        canManageStock,
        canOpenInstallmentWorkspace,
        canOpenSalesWorkspace,
        canOpenCustomers,
        canViewApplications,
        canOpenWorkflowWorkspace,
        canViewWorkflow,
        canViewDashboard,
        canViewReportDealerEmployees,
        canViewReportDealerInformation,
        canViewTransactionRegister,
        dashboardData.salesTransactions,
        loading,
        tabReferences,
    ]);
    useEffect(() => {
        const pageFromLocation = getCurrentRoutePage();

        if (pageFromLocation !== activePage) {
            setActivePage(pageFromLocation);
        }
    }, [location.pathname, location.search, pageKey]);

    const filteredApplications = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return dashboardData.applications;

        return dashboardData.applications.filter((application) =>
            [
                application.customer_name,
                application.brand,
                application.model,
                application.registration_number,
                application.agent_name,
                application.status,
            ]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(query))
        );
    }, [dashboardData.applications, searchTerm]);
    const applicationAds = useMemo(
        () => (dashboardData.ads || []).slice(0, 4),
        [dashboardData.ads]
    );

    const scopedProductRows = useMemo(() => {
        const products = dashboardData.products || [];
        if (realIsSuperAdmin && !isDealerProfileSwitchActive) {
            return products;
        }

        const scopedDealerId = String(currentProfileDealerId || user?.dealer_id || '').trim();
        if (!scopedDealerId) {
            return products;
        }

        return products.filter((product) => {
            const productDealerId = String(product?.dealer_id || '').trim();
            return !productDealerId || productDealerId === scopedDealerId;
        });
    }, [currentProfileDealerId, dashboardData.products, isDealerProfileSwitchActive, realIsSuperAdmin, user?.dealer_id]);

    const filteredInventory = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return scopedProductRows;

        return scopedProductRows.filter((vehicle) =>
            [
                vehicle.brand,
                vehicle.model,
                vehicle.vehicle_type,
                vehicle.color,
            ]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(query))
        );
    }, [scopedProductRows, searchTerm]);
    const formatSaleDealerIdentity = (sale) =>
        [sale?.dealer_name || 'Not set', sale?.dealer_code || 'No dealer code'].filter(Boolean).join(' / ');

    const formatSaleAgentIdentity = (sale) =>
        [sale?.agent_name || 'System', sale?.dealer_name || 'Not set'].filter(Boolean).join(' / ');

    const formatWorkflowDealerIdentity = (task) =>
        [task?.dealer_name || 'Global', task?.dealer_code || 'No dealer code'].filter(Boolean).join(' / ');

    const formatWorkflowApprovalLine = (task) => {
        const status = String(task?.approval_status || task?.task_status || 'PENDING').toUpperCase();
        const actedBy = task?.acted_by_name ? ` by ${task.acted_by_name}` : '';
        const note = String(task?.decision_notes || task?.rejection_reason || '').trim();
        return `${status}${actedBy}${note ? ` / ${note}` : ''}`;
    };

    const workflowRoleOptions = ['AGENT', 'MANAGER', 'APPLICATION_ADMIN', 'SUPER_ADMIN'];
    const workflowTaskGroups = useMemo(() => {
        const groups = new Map();

        (dashboardData.workflowTasks || []).forEach((task) => {
            const groupKey = [
                task.entity_type || 'UNKNOWN',
                task.entity_id || task.id,
                task.workflow_definition_id || 'NO_WORKFLOW',
                task.dealer_id || 'GLOBAL',
            ].join(':');

            if (!groups.has(groupKey)) {
                groups.set(groupKey, []);
            }

            groups.get(groupKey).push(task);
        });

        return Array.from(groups.entries())
            .map(([groupKey, tasks]) => {
                const sortedTasks = [...tasks].sort((a, b) => {
                    const stepDelta = Number(a.step_number || 0) - Number(b.step_number || 0);
                    if (stepDelta !== 0) return stepDelta;
                    return new Date(a.created_at || 0) - new Date(b.created_at || 0);
                });
                const primaryTask = sortedTasks[sortedTasks.length - 1] || null;
                const hasRejected = sortedTasks.some((task) => String(task.approval_status || task.task_status || '').toUpperCase() === 'REJECTED');
                const hasPending = sortedTasks.some((task) => String(task.task_status || '').toUpperCase() === 'PENDING');
                const overallStatus = hasRejected
                    ? 'REJECTED'
                    : hasPending
                        ? 'PENDING'
                        : String(primaryTask?.approval_status || primaryTask?.task_status || 'APPROVED').toUpperCase();
                const approvalTrail = sortedTasks
                    .map((task) => `${task.assigned_role_name || 'STEP'}: ${formatWorkflowApprovalLine(task)}`)
                    .join(' | ');
                const routeLabel = `${primaryTask?.requester_name || 'Unknown'} to ${sortedTasks.map((task) => task.assigned_role_name || 'STEP').join(' to ')}`;

                return {
                    key: groupKey,
                    primaryTask,
                    tasks: sortedTasks,
                    overallStatus,
                    approvalTrail,
                    routeLabel,
                };
            })
            .sort((a, b) => {
                const pendingDelta = (a.overallStatus === 'PENDING' ? 0 : 1) - (b.overallStatus === 'PENDING' ? 0 : 1);
                if (pendingDelta !== 0) return pendingDelta;
                return new Date(b.primaryTask?.created_at || 0) - new Date(a.primaryTask?.created_at || 0);
            });
    }, [dashboardData.workflowTasks]);
    const selectedWorkflowTaskGroup = useMemo(
        () => workflowTaskGroups.find((group) => group.tasks.some((task) => task.id === selectedWorkflowTaskId)) || null,
        [workflowTaskGroups, selectedWorkflowTaskId]
    );
    const selectedWorkflowTask = selectedWorkflowTaskGroup?.primaryTask || null;
    const pendingWorkflowTasks = useMemo(
        () => workflowTaskGroups.filter((group) => group.overallStatus === 'PENDING'),
        [workflowTaskGroups]
    );
    const completedWorkflowTasks = useMemo(
        () => workflowTaskGroups.filter((group) => group.overallStatus !== 'PENDING'),
        [workflowTaskGroups]
    );
    useEffect(() => {
        if (activePage !== 'user-tasks' || !selectedWorkflowTaskId || !workflowTasksTableRef.current) {
            return;
        }
        window.requestAnimationFrame(() => {
            workflowTasksTableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }, [activePage, selectedWorkflowTaskId]);

    const selectedStockProduct = useMemo(
        () => (dashboardData.products || []).find((product) => product.id === stockOrderForm.product_id) || null,
        [dashboardData.products, stockOrderForm.product_id]
    );
    const selectedStockCompany = useMemo(
        () => (dashboardData.companies || []).find((company) => company.id === stockOrderForm.company_profile_id) || null,
        [dashboardData.companies, stockOrderForm.company_profile_id]
    );
    const featureByKey = useMemo(
        () => (dashboardData.features || []).reduce((acc, feature) => {
            acc[feature.feature_key] = feature;
            return acc;
        }, {}),
        [dashboardData.features]
    );
    const accessPopupRole = useMemo(
        () => (dashboardData.roles || []).find((role) => Number(role.id) === Number(activeAccessPopup?.roleId)) || null,
        [activeAccessPopup?.roleId, dashboardData.roles]
    );
    const accessPopupGroup = useMemo(
        () => ACCESS_PAGE_GROUPS.find((group) => group.key === activeAccessPopup?.pageKey) || null,
        [activeAccessPopup?.pageKey]
    );
    const accessPopupFeatures = useMemo(
        () => getUniqueFeatures(
            (accessPopupGroup?.featureKeys || [])
                .map((featureKey) => featureByKey[featureKey])
                .filter(Boolean)
        ),
        [accessPopupGroup, featureByKey]
    );
    const accessPopupFeatureSections = useMemo(() => {
        if (!accessPopupGroup) {
            return [];
        }

        if (accessPopupGroup.key !== 'dashboard') {
            return accessPopupFeatures.length > 0
                ? [{ key: 'all', title: 'Role Features', features: accessPopupFeatures }]
                : [];
        }

        const generalFeatures = accessPopupFeatures.filter((feature) => !String(feature.key || '').includes('FEAT_DASHBOARD_CARD_'));
        const dashboardCardFeatures = accessPopupFeatures.filter((feature) => String(feature.key || '').includes('FEAT_DASHBOARD_CARD_'));

        return [
            generalFeatures.length > 0 ? { key: 'general', title: 'Dashboard Role Features', features: generalFeatures } : null,
            dashboardCardFeatures.length > 0 ? { key: 'cards', title: 'Dashboard Cards', features: dashboardCardFeatures } : null,
        ].filter(Boolean);
    }, [accessPopupFeatures, accessPopupGroup]);

    const availableSalesVehicles = useMemo(
        () => dashboardData.inventory.filter((vehicle) => {
            if (String(vehicle.status || '').toUpperCase() !== 'AVAILABLE') {
                return false;
            }

            // Only show real received stock units in Sales, not older placeholder rows.
            return (
                String(vehicle.registration_number || '').trim() &&
                String(vehicle.chassis_number || '').trim() &&
                String(vehicle.engine_number || '').trim()
            );
        }),
        [dashboardData.inventory]
    );
    const editingSaleRecord = useMemo(
        () => dashboardData.salesTransactions.find((sale) => sale.id === saleForm.id) || null,
        [dashboardData.salesTransactions, saleForm.id]
    );
    const editingSaleVehicleOption = useMemo(() => {
        if (!editingSaleRecord?.vehicle_id) {
            return null;
        }

        return {
            id: editingSaleRecord.vehicle_id,
            brand: editingSaleRecord.brand || '',
            model: editingSaleRecord.model || '',
            serial_number: editingSaleRecord.serial_number || '',
            registration_number: editingSaleRecord.registration_number || '',
            vehicle_type: editingSaleRecord.vehicle_type || '',
            chassis_number: editingSaleRecord.chassis_number || '',
            engine_number: editingSaleRecord.engine_number || '',
            image_url: editingSaleRecord.image_url || '',
            status: editingSaleRecord.sale_mode === 'CASH' ? 'SOLD' : 'INSTALLMENT',
            purchase_price: editingSaleRecord.purchase_price || 0,
            monthly_rate: editingSaleRecord.monthly_installment || 0,
        };
    }, [editingSaleRecord]);
    const salesVehicleOptions = useMemo(() => {
        if (!saleForm.id) {
            return availableSalesVehicles;
        }

        const selectedVehicle = dashboardData.inventory.find((vehicle) => vehicle.id === saleForm.vehicle_id) || editingSaleVehicle || editingSaleVehicleOption;
        if (!selectedVehicle) {
            return availableSalesVehicles;
        }

        return availableSalesVehicles.some((vehicle) => vehicle.id === selectedVehicle.id)
            ? availableSalesVehicles
            : [selectedVehicle, ...availableSalesVehicles];
    }, [availableSalesVehicles, dashboardData.inventory, editingSaleVehicle, editingSaleVehicleOption, saleForm.id, saleForm.vehicle_id]);

    const filteredCustomers = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return dashboardData.customers;

        return dashboardData.customers.filter((customer) => {
            const ocrDetails = customer.ocr_details || {};
            return [
                customer.full_name,
                customer.cnic_passport_number,
                ocrDetails.document_type,
                ocrDetails.contact_email,
                ocrDetails.contact_phone,
                customer.created_by_name,
            ]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(query));
        });
    }, [dashboardData.customers, searchTerm]);

const selectedCustomer = useMemo(
    () => dashboardData.customers.find((customer) => customer.id === selectedCustomerId) || null,
    [dashboardData.customers, selectedCustomerId]
);
    const customerOwnershipCandidates = useMemo(() => {
        const targetDealerId = String(customerForm.dealer_id || selectedCustomer?.dealer_id || user?.dealer_id || '');
        const candidatesById = new Map();
        const addCandidate = (staff) => {
            if (!staff?.id || staff.is_active === false) return;
            const staffDealerId = String(staff.dealer_id || '');
            if (targetDealerId && staffDealerId && staffDealerId !== targetDealerId) return;
            candidatesById.set(String(staff.id), staff);
        };

        if (user?.id) {
            const currentUserIsApplicationAdmin = String(user?.role_name || '').toUpperCase() === 'APPLICATION_ADMIN';
            addCandidate({
                id: user.id,
                dealer_id: currentProfileDealerId || user?.dealer_id || '',
                full_name: currentUserIsApplicationAdmin
                    ? (user?.dealer_name || user?.full_name || user?.email || 'Current user')
                    : (user?.full_name || user?.dealer_name || user?.email || 'Current user'),
                job_title: user?.role_name || '',
                dealer_name: user?.dealer_name || '',
                email: user?.email || '',
                is_active: true,
            });
        }

        (dashboardData.dealerStaff || [])
            .filter((staff) => {
                if (!staff?.id || !staff?.is_active) return false;
                const staffDealerId = String(staff.dealer_id || '');
                return !targetDealerId || staffDealerId === targetDealerId;
            })
            .forEach(addCandidate);

        return Array.from(candidatesById.values())
            .sort((a, b) => String(a.full_name || '').localeCompare(String(b.full_name || '')));
    }, [
        currentProfileDealerId,
        customerForm.dealer_id,
        dashboardData.dealerStaff,
        selectedCustomer?.dealer_id,
        user?.dealer_id,
        user?.dealer_name,
        user?.email,
        user?.full_name,
        user?.id,
        user?.role_name,
    ]);

    const filteredEmployees = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return dashboardData.employees;

        return dashboardData.employees.filter((employee) =>
            [
                employee.employee_code,
                employee.full_name,
                employee.email,
                employee.department,
                employee.job_title,
                employee.role_name,
            ]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(query))
        );
    }, [dashboardData.employees, searchTerm]);

    const selectedEmployee = useMemo(
        () => dashboardData.employees.find((employee) => employee.id === selectedEmployeeId) || null,
        [dashboardData.employees, selectedEmployeeId]
    );
    const defaultAgentRoleId = useMemo(
        () => String((dashboardData.roles || []).find((role) => role.role_name === 'AGENT')?.id || ''),
        [dashboardData.roles]
    );
    const employeeFormRoleFeatureIds = useMemo(
        () => roleAssignments[Number(employeeForm.role_id)] || [],
        [employeeForm.role_id, roleAssignments]
    );
    const employeeFormRoleFeatures = useMemo(
        () => dashboardData.features.filter((feature) => employeeFormRoleFeatureIds.includes(Number(feature.id))),
        [dashboardData.features, employeeFormRoleFeatureIds]
    );
    const employeeFormExtraFeatures = useMemo(
        () => dashboardData.features.filter((feature) => !employeeFormRoleFeatureIds.includes(Number(feature.id))),
        [dashboardData.features, employeeFormRoleFeatureIds]
    );
    const selectedEmployeeCommissions = useMemo(
        () => (dashboardData.employeeCommissions || []).filter((row) => row.employee_id === selectedEmployeeId),
        [dashboardData.employeeCommissions, selectedEmployeeId]
    );
    const selectedEmployeeAdvances = useMemo(
        () => (dashboardData.employeeAdvances || []).filter((row) => row.employee_id === selectedEmployeeId),
        [dashboardData.employeeAdvances, selectedEmployeeId]
    );
    const selectedEmployeePayrolls = useMemo(
        () => (dashboardData.employeePayrolls || []).filter((row) => row.employee_id === selectedEmployeeId),
        [dashboardData.employeePayrolls, selectedEmployeeId]
    );
    const currentPayrollMonth = useMemo(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }, []);
    const employeeCommissionTotalsMap = useMemo(() => {
        return (dashboardData.employeeCommissions || []).reduce((acc, row) => {
            const employeeId = row.employee_id;
            if (!employeeId) return acc;
            acc[employeeId] = (acc[employeeId] || 0) + Number(row.commission_amount || 0);
            return acc;
        }, {});
    }, [dashboardData.employeeCommissions]);
    const employeeOutstandingAdvanceMap = useMemo(() => {
        return (dashboardData.employeeAdvances || []).reduce((acc, row) => {
            const employeeId = row.employee_id;
            if (!employeeId || row.deducted_in_payroll_id) return acc;
            acc[employeeId] = (acc[employeeId] || 0) + Number(row.amount || 0);
            return acc;
        }, {});
    }, [dashboardData.employeeAdvances]);
    const employeeLatestPayrollMap = useMemo(() => {
        return (dashboardData.employeePayrolls || []).reduce((acc, row) => {
            const employeeId = row.employee_id;
            if (!employeeId) return acc;
            if (!acc[employeeId] || String(row.payroll_month || '') > String(acc[employeeId].payroll_month || '')) {
                acc[employeeId] = row;
            }
            return acc;
        }, {});
    }, [dashboardData.employeePayrolls]);
    const selectedEmployeeCommissionSummary = useMemo(() => {
        return selectedEmployeeCommissions.reduce((acc, row) => {
            acc.total += Number(row.commission_amount || 0);
            return acc;
        }, { total: 0 });
    }, [selectedEmployeeCommissions]);
    const selectedEmployeeOutstandingAdvance = useMemo(() => {
        return selectedEmployeeAdvances
            .filter((row) => !row.deducted_in_payroll_id)
            .reduce((sum, row) => sum + Number(row.amount || 0), 0);
    }, [selectedEmployeeAdvances]);
    const selectedEmployeeCurrentMonthCommissions = useMemo(
        () => selectedEmployeeCommissions.filter((row) => String(row.earned_on || '').slice(0, 7) === currentPayrollMonth),
        [currentPayrollMonth, selectedEmployeeCommissions]
    );
    const selectedEmployeeCurrentMonthAdvances = useMemo(
        () => selectedEmployeeAdvances.filter((row) => String(row.advance_date || '').slice(0, 7) === currentPayrollMonth),
        [currentPayrollMonth, selectedEmployeeAdvances]
    );
    const selectedEmployeeCurrentMonthOutstandingAdvance = useMemo(
        () => selectedEmployeeCurrentMonthAdvances
            .filter((row) => !row.deducted_in_payroll_id)
            .reduce((sum, row) => sum + Number(row.amount || 0), 0),
        [selectedEmployeeCurrentMonthAdvances]
    );
    const selectedEmployeeCurrentMonthPayrolls = useMemo(
        () => selectedEmployeePayrolls.filter((row) => String(row.payroll_month || '') === currentPayrollMonth),
        [currentPayrollMonth, selectedEmployeePayrolls]
    );
    const generatedPayrollEmployeeIds = useMemo(
        () => new Set((dashboardData.employeePayrolls || [])
            .filter((row) => String(row.payroll_month || '') === payrollMonth)
            .map((row) => row.employee_id)),
        [dashboardData.employeePayrolls, payrollMonth]
    );
    const salaryEligibleEmployees = useMemo(
        () => (dashboardData.employees || []).filter((employee) => employee.is_active && !generatedPayrollEmployeeIds.has(employee.id)),
        [dashboardData.employees, generatedPayrollEmployeeIds]
    );
    const selectedSalaryEmployee = useMemo(
        () => (dashboardData.employees || []).find((employee) => employee.id === salaryGenerationEmployeeId) || null,
        [dashboardData.employees, salaryGenerationEmployeeId]
    );
    const selectedSalaryEmployeeMonthCommission = useMemo(
        () => (dashboardData.employeeCommissions || [])
            .filter((row) => row.employee_id === salaryGenerationEmployeeId && String(row.earned_on || '').slice(0, 7) === payrollMonth)
            .reduce((sum, row) => sum + Number(row.commission_amount || 0), 0),
        [dashboardData.employeeCommissions, payrollMonth, salaryGenerationEmployeeId]
    );
    const selectedSalaryEmployeeOutstandingAdvance = useMemo(
        () => (dashboardData.employeeAdvances || [])
            .filter((row) => row.employee_id === salaryGenerationEmployeeId && !row.deducted_in_payroll_id && String(row.advance_date || '').slice(0, 7) <= payrollMonth)
            .reduce((sum, row) => sum + Number(row.amount || 0), 0),
        [dashboardData.employeeAdvances, payrollMonth, salaryGenerationEmployeeId]
    );
    const currentMonthPayrollRecords = useMemo(
        () => (dashboardData.employeePayrolls || []).filter((row) => String(row.payroll_month || '') === currentPayrollMonth),
        [currentPayrollMonth, dashboardData.employeePayrolls]
    );
    const totalEmployeeCommission = useMemo(
        () => (dashboardData.employeeCommissions || []).reduce((sum, row) => sum + Number(row.commission_amount || 0), 0),
        [dashboardData.employeeCommissions]
    );
    const employeeCurrentMonthCommission = useMemo(() => {
        if (!user?.employee_id) return 0;
        const currentMonth = new Date().toISOString().slice(0, 7);
        return (dashboardData.employeeCommissions || [])
            .filter((row) => row.employee_id === user.employee_id && String(row.earned_on || '').slice(0, 7) === currentMonth)
            .reduce((sum, row) => sum + Number(row.commission_amount || 0), 0);
    }, [dashboardData.employeeCommissions, user?.employee_id]);

    const selectedSaleCustomer = useMemo(
        () => dashboardData.customers.find((customer) => customer.id === saleForm.customer_id) || null,
        [dashboardData.customers, saleForm.customer_id]
    );
    const selectedSalePreviewCustomer = useMemo(() => {
        if (!selectedSaleCustomer && !editingSaleRecord) {
            return null;
        }

        const normalizedSaleCnic = normalizeIdentityNumber(
            editingSaleRecord?.cnic_passport_number || selectedSaleCustomer?.cnic_passport_number
        );
        const normalizedSaleName = String(
            editingSaleRecord?.customer_name || selectedSaleCustomer?.full_name || ''
        ).trim().toLowerCase();
        const candidates = (dashboardData.customers || []).filter((customer) => {
            if (!customer) {
                return false;
            }

            if (customer.id === selectedSaleCustomer?.id || customer.id === editingSaleRecord?.customer_id) {
                return true;
            }

            const normalizedCustomerCnic = normalizeIdentityNumber(customer.cnic_passport_number);
            const normalizedCustomerName = String(customer.full_name || '').trim().toLowerCase();

            return (normalizedSaleCnic && normalizedCustomerCnic === normalizedSaleCnic)
                || (normalizedSaleName && normalizedCustomerName === normalizedSaleName);
        });

        if (!candidates.length) {
            return selectedSaleCustomer;
        }

        return [...candidates].sort((left, right) => {
            const scoreDiff = getCustomerPreviewAssetScore(right) - getCustomerPreviewAssetScore(left);
            if (scoreDiff !== 0) {
                return scoreDiff;
            }
            return Number(new Date(right?.created_at || 0)) - Number(new Date(left?.created_at || 0));
        })[0] || selectedSaleCustomer;
    }, [dashboardData.customers, editingSaleRecord, selectedSaleCustomer]);
    const selectedSaleOcrDetails = useMemo(
        () => selectedSalePreviewCustomer?.ocr_details || editingSaleRecord?.customer_ocr_details || {},
        [editingSaleRecord, selectedSalePreviewCustomer]
    );
    const selectedSaleCustomerFrontUrl = normalizePreviewAssetPath(selectedSalePreviewCustomer?.identity_doc_url)
        || normalizePreviewAssetPath(selectedSaleOcrDetails?.identity_doc_front_url)
        || normalizePreviewAssetPath(editingSaleRecord?.customer_identity_doc_url)
        || '';
    const selectedSaleCustomerBackUrl = normalizePreviewAssetPath(selectedSalePreviewCustomer?.ocr_details?.identity_doc_back_url)
        || normalizePreviewAssetPath(selectedSaleOcrDetails?.identity_doc_back_url)
        || '';
    const selectedSaleCustomerSignatureUrl = normalizePreviewAssetPath(selectedSalePreviewCustomer?.signature_image_url)
        || normalizePreviewAssetPath(selectedSalePreviewCustomer?.ocr_details?.signature_image_url)
        || normalizePreviewAssetPath(selectedSaleOcrDetails?.signature_image_url)
        || '';
    const currentSalesDealerSignaturePath = normalizePreviewAssetPath(currentSalesDealerSignatureUrl);
    const saleDealerSignatureUrl = normalizePreviewAssetPath(saleForm.dealer_signature_url)
        || normalizePreviewAssetPath(editingSaleRecord?.dealer_signature_url)
        || normalizePreviewAssetPath(editingSaleRecord?.dealer_profile_signature_url)
        || currentSalesDealerSignaturePath;
    const saleAuthorizedSignatureUrl = normalizePreviewAssetPath(saleForm.authorized_signature_url)
        || normalizePreviewAssetPath(editingSaleRecord?.authorized_signature_url)
        || '';
    const saleCustomerCnicFrontUrl = normalizePreviewAssetPath(saleForm.customer_cnic_front_url) || selectedSaleCustomerFrontUrl;
    const saleCustomerCnicBackUrl = normalizePreviewAssetPath(saleForm.customer_cnic_back_url) || selectedSaleCustomerBackUrl;

    const selectedSaleVehicle = useMemo(
        () => dashboardData.inventory.find((vehicle) => vehicle.id === saleForm.vehicle_id) || editingSaleVehicle || editingSaleVehicleOption || null,
        [dashboardData.inventory, editingSaleVehicle, editingSaleVehicleOption, saleForm.vehicle_id]
    );
    const isSelectedSaleVehicleAvailable = useMemo(
        () => String(selectedSaleVehicle?.status || '').toUpperCase() === 'AVAILABLE',
        [selectedSaleVehicle]
    );
    const installmentSales = useMemo(
        () => dashboardData.salesTransactions.filter((sale) => sale.sale_mode === 'INSTALLMENT'),
        [dashboardData.salesTransactions]
    );
    const selectedInstallmentSale = useMemo(
        () => installmentSales.find((sale) => sale.id === selectedInstallmentSaleId) || installmentSales[0] || null,
        [installmentSales, selectedInstallmentSaleId]
    );
    const selectedInstallmentRows = useMemo(
        () =>
            [...(selectedInstallmentSale?.installments || [])]
                .filter((row) => Number(row.amount || 0) > 0 || Number(row.received_amount || 0) > 0)
                .sort((a, b) => Number(a.installment_number) - Number(b.installment_number)),
        [selectedInstallmentSale]
    );
    useEffect(() => {
        setInstallmentReceiptInputs((current) => {
            const allowedIds = new Set(selectedInstallmentRows.map((row) => row.id));
            const nextState = Object.fromEntries(
                Object.entries(current).filter(([installmentId]) => allowedIds.has(installmentId))
            );

            return Object.keys(nextState).length === Object.keys(current).length ? current : nextState;
        });
    }, [selectedInstallmentRows]);
    const selectedInstallmentVehicle = useMemo(
        () => dashboardData.inventory.find((vehicle) => vehicle.id === selectedInstallmentSale?.vehicle_id) || null,
        [dashboardData.inventory, selectedInstallmentSale]
    );
    const selectedInstallmentImageUrl = useMemo(
        () => buildAssetUrl(selectedInstallmentSale?.image_url || selectedInstallmentVehicle?.image_url || ''),
        [selectedInstallmentSale, selectedInstallmentVehicle]
    );
    const selectedInstallmentCustomer = useMemo(
        () => dashboardData.customers.find((customer) => customer.id === selectedInstallmentSale?.customer_id) || null,
        [dashboardData.customers, selectedInstallmentSale]
    );
    const selectedInstallmentPreviewCustomer = useMemo(() => {
        if (!selectedInstallmentSale) {
            return null;
        }

        const normalizedSaleCnic = normalizeIdentityNumber(selectedInstallmentSale.cnic_passport_number);
        const normalizedSaleName = String(selectedInstallmentSale.customer_name || '').trim().toLowerCase();
        const candidates = (dashboardData.customers || []).filter((customer) => {
            if (!customer) {
                return false;
            }

            if (customer.id === selectedInstallmentSale.customer_id) {
                return true;
            }

            const normalizedCustomerCnic = normalizeIdentityNumber(customer.cnic_passport_number);
            const normalizedCustomerName = String(customer.full_name || '').trim().toLowerCase();

            return (normalizedSaleCnic && normalizedCustomerCnic === normalizedSaleCnic)
                || (normalizedSaleName && normalizedCustomerName === normalizedSaleName);
        });

        if (!candidates.length) {
            return selectedInstallmentCustomer;
        }

        return [...candidates].sort((left, right) => {
            const scoreDiff = getCustomerPreviewAssetScore(right) - getCustomerPreviewAssetScore(left);
            if (scoreDiff !== 0) {
                return scoreDiff;
            }
            return Number(new Date(right?.created_at || 0)) - Number(new Date(left?.created_at || 0));
        })[0] || selectedInstallmentCustomer;
    }, [dashboardData.customers, selectedInstallmentCustomer, selectedInstallmentSale]);
    const selectedInstallmentOcrDetails = useMemo(
        () => selectedInstallmentPreviewCustomer?.ocr_details || selectedInstallmentSale?.customer_ocr_details || {},
        [selectedInstallmentPreviewCustomer, selectedInstallmentSale]
    );
    const selectedInstallmentThumbPath = normalizePreviewAssetPath(selectedInstallmentPreviewCustomer?.fingerprint_thumb_url)
        || selectedInstallmentOcrDetails?.fingerprint?.thumb_image_url
        || selectedInstallmentSale?.customer_fingerprint_thumb_url
        || '';
    const selectedInstallmentThumbUrl = useMemo(
        () => buildAssetUrl(selectedInstallmentThumbPath),
        [selectedInstallmentThumbPath]
    );
    const selectedInstallmentCnicFrontPath = normalizePreviewAssetPath(selectedInstallmentPreviewCustomer?.identity_doc_url)
        || normalizePreviewAssetPath(selectedInstallmentOcrDetails?.identity_doc_front_url)
        || normalizePreviewAssetPath(selectedInstallmentSale?.customer_identity_doc_url)
        || normalizePreviewAssetPath(selectedInstallmentSale?.customer_cnic_front_url)
        || '';
    const selectedInstallmentCnicFrontUrl = useMemo(
        () => buildAssetUrl(selectedInstallmentCnicFrontPath),
        [selectedInstallmentCnicFrontPath]
    );
    const selectedInstallmentSignaturePath = normalizePreviewAssetPath(selectedInstallmentPreviewCustomer?.signature_image_url)
        || normalizePreviewAssetPath(selectedInstallmentPreviewCustomer?.ocr_details?.signature_image_url)
        || normalizePreviewAssetPath(selectedInstallmentOcrDetails?.signature_image_url)
        || '';
    const selectedInstallmentAuthorizedSignaturePath = normalizePreviewAssetPath(selectedInstallmentSale?.authorized_signature_url)
        || normalizePreviewAssetPath(selectedInstallmentSale?.dealer_signature_url)
        || normalizePreviewAssetPath(selectedInstallmentSale?.dealer_profile_signature_url)
        || '';
    const selectedInstallmentSignatureUrl = useMemo(
        () => buildAssetUrl(selectedInstallmentSignaturePath),
        [selectedInstallmentSignaturePath]
    );
    const transactionSales = useMemo(
        () => dashboardData.salesTransactions
            .filter((sale) => String(sale.sale_mode || '').toUpperCase() === 'CASH')
            .sort((a, b) => new Date(b.purchase_date || b.created_at || 0) - new Date(a.purchase_date || a.created_at || 0)),
        [dashboardData.salesTransactions]
    );
    const selectedTransactionSale = useMemo(
        () => transactionSales.find((sale) => sale.id === selectedTransactionSaleId) || transactionSales[0] || null,
        [transactionSales, selectedTransactionSaleId]
    );
    const formatInstallmentDateLines = (dates = [], itemsPerLine = 2) => {
        if (!dates.length) {
            return 'No received installment yet';
        }

        const lines = [];
        for (let index = 0; index < dates.length; index += itemsPerLine) {
            lines.push(dates.slice(index, index + itemsPerLine).join(', '));
        }

        return lines.join('\n');
    };
    const getNormalizedInstallmentRows = (sale) =>
        [...(sale?.installments || [])]
            .filter((row) => Number(row.amount || 0) > 0 || Number(row.received_amount || 0) > 0)
            .sort((a, b) => Number(a.installment_number) - Number(b.installment_number));
    const getSaleInstallmentRows = (sale) => getNormalizedInstallmentRows(sale);
    const summarizeSaleInstallments = (sale) => {
        const rows = getSaleInstallmentRows(sale);
        const received = rows.filter((row) => String(row.status || '').toUpperCase() === 'RECEIVED');
        const actuallyCollectedRows = rows.filter((row) => Number(row.received_amount || 0) > 0);
        // Pending months = months not yet collected. If a month is partially paid, we treat it as collected
        // for the "pending installment count" shown to customers.
        const pendingRows = rows.filter((row) => {
            const status = String(row.status || '').toUpperCase();
            if (status === 'RECEIVED') return false;
            return Number(row.received_amount || 0) <= 0;
        });
        const receivedAmount = rows.reduce((sum, row) => sum + Number(row.received_amount || 0), 0);
        const totalPlannedMonths = Math.max(Number(sale?.installment_months || 0), rows.length || 0);
        const pendingCount = Math.max(totalPlannedMonths - actuallyCollectedRows.length, 0);
        const coveredByAdvanceCount = Math.max(totalPlannedMonths - actuallyCollectedRows.length - pendingRows.length, 0);
        const receivedDateLabels = actuallyCollectedRows
            .map((row) => row.due_date || row.paid_date || '')
            .filter(Boolean)
            .map((value) => new Date(value).toLocaleDateString('en-PK', {
                month: 'long',
                year: 'numeric',
            }).replace(' ', ' - '));
        const financedAmount = Number(sale?.financed_amount || 0);
        const totalPrice = Number(sale?.vehicle_price || 0);
        const downPayment = Number(sale?.down_payment || 0);
        const expectedInstallmentBalance = financedAmount > 0
            ? financedAmount
            : Math.max(totalPrice - downPayment, 0);

        return {
            rows,
            receivedCount: received.length,
            actualReceivedCount: actuallyCollectedRows.length,
            pendingCount,
            coveredByAdvanceCount,
            receivedAmount,
            receivedDateLabels,
            receivedDateLines: formatInstallmentDateLines(receivedDateLabels),
            totalPlannedMonths,
            nextPaymentAmount: Number(pendingRows[0]?.amount || 0),
            nextPaymentDate: pendingRows[0]?.due_date || '',
            totalRemainingAmount: Math.max(expectedInstallmentBalance - receivedAmount, 0),
        };
    };
    const getSalePrintContext = (sale) => {
        const saleVehicle = dashboardData.inventory.find((vehicle) => vehicle.id === sale?.vehicle_id) || null;
        const saleCustomer = dashboardData.customers.find((customer) => customer.id === sale?.customer_id) || null;
        const saleOcrDetails = saleCustomer?.ocr_details || {};

        return {
            imageUrl: buildAssetUrl(sale?.image_url || saleVehicle?.image_url || ''),
            thumbUrl: buildAssetUrl(saleOcrDetails?.fingerprint?.thumb_image_url || ''),
            signatureUrl: buildAssetUrl(saleCustomer?.signature_image_url || saleCustomer?.ocr_details?.signature_image_url || saleOcrDetails?.signature_image_url || ''),
            authorizedSignatureUrl: buildAssetUrl(sale?.authorized_signature_url || sale?.dealer_signature_url || sale?.dealer_profile_signature_url || ''),
        };
    };
    const installmentSummary = useMemo(() => {
        const rows = selectedInstallmentRows;
        const received = rows.filter((row) => String(row.status || '').toUpperCase() === 'RECEIVED');
        const collectedRows = rows.filter((row) => Number(row.received_amount || 0) > 0);
        const pendingRows = rows.filter((row) => {
            const status = String(row.status || '').toUpperCase();
            if (status === 'RECEIVED') return false;
            return Number(row.received_amount || 0) <= 0;
        });
        const nextPayment = pendingRows[0] || null;
        const receivedInstallmentAmount = rows.reduce((sum, row) => sum + Number(row.received_amount || 0), 0);
        const financedAmount = Number(selectedInstallmentSale?.financed_amount || 0);
        const totalPrice = Number(selectedInstallmentSale?.vehicle_price || 0);
        const downPayment = Number(selectedInstallmentSale?.down_payment || 0);
        const expectedInstallmentBalance = financedAmount > 0
            ? financedAmount
            : Math.max(totalPrice - downPayment, 0);
        const totalPlannedMonths = Math.max(Number(selectedInstallmentSale?.installment_months || 0), rows.length || 0);
        const pendingCount = Math.max(totalPlannedMonths - collectedRows.length, 0);

        return {
            receivedCount: received.length,
            pendingCount,
            receivedAmount: receivedInstallmentAmount,
            pendingAmount: pendingRows.reduce((sum, row) => sum + Number(row.amount || 0), 0),
            nextPaymentAmount: Number(nextPayment?.amount || 0),
            nextPaymentDate: nextPayment?.due_date || '',
            totalRemainingAmount: Math.max(expectedInstallmentBalance - receivedInstallmentAmount, 0),
        };
    }, [selectedInstallmentRows, selectedInstallmentSale]);
    const visibleSelectedInstallmentRows = useMemo(() => {
        if (installmentSummary.totalRemainingAmount > 0) {
            return selectedInstallmentRows;
        }

        return selectedInstallmentRows.filter((row) => {
            const normalizedStatus = String(row.status || '').toUpperCase();
            return Number(row.received_amount || 0) > 0 || normalizedStatus === 'RECEIVED' || normalizedStatus === 'PARTIAL';
        });
    }, [installmentSummary.totalRemainingAmount, selectedInstallmentRows]);

    const getInstallmentReceiptContext = (row) => {
        const rowIndex = visibleSelectedInstallmentRows.findIndex((item) => item.id === row.id);
        const remainingRows = rowIndex >= 0 ? visibleSelectedInstallmentRows.slice(rowIndex + 1) : [];
        const pendingRows = remainingRows.filter((item) => {
            const status = String(item.status || '').toUpperCase();
            if (status === 'RECEIVED') return false;
            // Treat partial/any received cash as "collected" so remaining months count stays accurate for customers.
            return Number(item.received_amount || 0) <= 0;
        });
        const nextPendingRow = pendingRows[0] || null;
        const rowStatus = String(row.status || 'PENDING').toUpperCase();
        // For receipts, the "installment month" should follow the due date, not the payment date.
        const installmentMonthLabel = new Date(row.due_date || new Date()).toLocaleDateString('en-PK', {
            month: 'long',
            year: 'numeric',
        });
        const paymentMonthLabel = new Date(row.paid_date || new Date()).toLocaleDateString('en-PK', {
            month: 'long',
            year: 'numeric',
        });
        const financedAmount = Number(selectedInstallmentSale?.financed_amount || 0);
        const totalPrice = Number(selectedInstallmentSale?.vehicle_price || 0);
        const downPayment = Number(selectedInstallmentSale?.down_payment || 0);
        const expectedInstallmentBalance = financedAmount > 0
            ? financedAmount
            : Math.max(totalPrice - downPayment, 0);

        const receivedBefore = rowIndex > 0
            ? visibleSelectedInstallmentRows.slice(0, rowIndex).reduce((sum, item) => sum + Number(item.received_amount || 0), 0)
            : 0;
        const receivedThrough = rowIndex >= 0
            ? visibleSelectedInstallmentRows.slice(0, rowIndex + 1).reduce((sum, item) => sum + Number(item.received_amount || 0), 0)
            : visibleSelectedInstallmentRows.reduce((sum, item) => sum + Number(item.received_amount || 0), 0);
        const overallRemainingBefore = Math.max(expectedInstallmentBalance - receivedBefore, 0);
        const overallRemainingAfter = Math.max(expectedInstallmentBalance - receivedThrough, 0);
        const installmentPlanned = Math.max(Number(row.amount || 0), 0);
        const installmentPaid = Math.max(Number(row.received_amount || 0), 0);
        const installmentRemaining = Math.max(installmentPlanned - installmentPaid, 0);
        const revisedMonthlyForRemaining = pendingRows.length > 0
            ? roundCurrencyValue(overallRemainingAfter / pendingRows.length)
            : 0;
        const totalRemainingAmount = Math.max(
            expectedInstallmentBalance -
            visibleSelectedInstallmentRows.reduce((sum, item) => sum + Number(item.received_amount || 0), 0),
            0
        );

        return {
            pendingMonths: pendingRows.length,
            remainingMonths: remainingRows.length,
            remainingAmount: totalRemainingAmount,
            overallRemainingBefore,
            overallRemainingAfter,
            installmentPlanned,
            installmentPaid,
            installmentRemaining,
            revisedMonthlyForRemaining,
            nextMonthValue: Number(nextPendingRow?.amount || 0),
            nextMonthDate: nextPendingRow?.due_date || '',
            installmentMonthLabel,
            paymentMonthLabel,
            currentStatus: rowStatus,
            currentDateLabel: row.paid_date || '',
        };
    };

    const actualVehiclePrice = useMemo(
        () => Number(selectedSaleVehicle?.purchase_price || 0),
        [selectedSaleVehicle]
    );
    const selectedSaleVehicleName = useMemo(
        () => [selectedSaleVehicle?.brand, selectedSaleVehicle?.model].filter(Boolean).join(' ') || 'Select vehicle',
        [selectedSaleVehicle]
    );
    const selectedSaleVehicleSecondaryLine = useMemo(() => {
        if (!selectedSaleVehicle) {
            return `${availableSalesVehicles.length} vehicle${availableSalesVehicles.length === 1 ? '' : 's'} available in stock`;
        }

        return selectedSaleVehicle.serial_number || 'Serial number not available';
    }, [availableSalesVehicles.length, selectedSaleVehicle]);
    const salesAnalytics = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const stockCostMap = (dashboardData.stockOrders || []).reduce((acc, order) => {
            const directKey = buildVehicleIdentityKey(order.brand, order.model, order.chassis_number, order.engine_number);
            if (normalizeTextValue(order.chassis_number) || normalizeTextValue(order.engine_number)) {
                acc[directKey] = Number(order.unit_price || 0);
            }

            const modelKey = `${normalizeTextValue(order.brand)}::${normalizeTextValue(order.model)}`;
            if (!acc[modelKey] || Number(order.unit_price || 0) > 0) {
                acc[modelKey] = Number(order.unit_price || 0);
            }

            return acc;
        }, {});

        const rows = (dashboardData.salesTransactions || [])
            .filter((sale) => {
                const saleDate = new Date(sale.created_at || sale.purchase_date || sale.agreement_date || 0);
                return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
            })
            .map((sale) => {
            const directKey = buildVehicleIdentityKey(sale.brand, sale.model, sale.chassis_number, sale.engine_number);
            const modelKey = `${normalizeTextValue(sale.brand)}::${normalizeTextValue(sale.model)}`;
            const actualPrice = Number(sale.purchase_price || 0) || Number(stockCostMap[directKey] || 0) || Number(stockCostMap[modelKey] || 0);
            const sellPrice = Number(sale.vehicle_price || 0);
            const profit = sellPrice - actualPrice;

            return {
                ...sale,
                actualPrice,
                sellPrice,
                profit,
            };
        });

        const totals = rows.reduce((acc, sale) => {
            acc.actual += sale.actualPrice;
            acc.selling += sale.sellPrice;
            acc.profit += sale.profit;
            if (String(sale.status || '').toUpperCase() === 'RECEIVED') {
                acc.received += sale.sellPrice;
            } else {
                acc.pending += sale.sellPrice;
            }
            return acc;
        }, { actual: 0, selling: 0, profit: 0, received: 0, pending: 0 });

        const recentTransactions = [...rows]
            .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        const recentChartSource = recentTransactions.slice(0, 6);

        const groupedChartMap = [...recentChartSource]
            .reverse()
            .reduce((acc, sale) => {
                const key = `${normalizeTextValue(sale.brand)}::${normalizeTextValue(sale.model)}`;

                if (!acc[key]) {
                    acc[key] = {
                        id: key,
                        label: [toDisplayTitle(sale.brand), toDisplayTitle(sale.model)].filter(Boolean).join(' ') || 'Vehicle',
                        actualPrice: 0,
                        sellPrice: 0,
                        profit: 0,
                        count: 0,
                    };
                }

                acc[key].actualPrice += sale.actualPrice;
                acc[key].sellPrice += sale.sellPrice;
                acc[key].profit += sale.profit;
                acc[key].count += 1;
                return acc;
            }, {});

        const recentChartBase = Object.values(groupedChartMap);
        const recentChart = recentChartBase.map((sale) => {
            const maxValue = Math.max(sale.sellPrice, sale.actualPrice, 1);

            return {
                ...sale,
                shortLabel: sale.label.length > 18 ? `${sale.label.slice(0, 18)}...` : sale.label,
                actualHeight: `${Math.max((sale.actualPrice / maxValue) * 100, sale.actualPrice > 0 ? 12 : 0)}%`,
                sellHeight: `${Math.max((sale.sellPrice / maxValue) * 100, sale.sellPrice > 0 ? 12 : 0)}%`,
            };
        });

        return {
            totals,
            recentTransactions,
            recentChart,
            totalDeals: rows.length,
            averageProfit: rows.length ? totals.profit / rows.length : 0,
            profitMargin: totals.selling > 0 ? (totals.profit / totals.selling) * 100 : 0,
            monthLabel: now.toLocaleDateString('en-PK', { month: 'long', year: 'numeric' }),
        };
    }, [dashboardData.salesTransactions]);
    const notificationItems = useMemo(() => {
        const workflowNotifications = (dashboardData.workflowTasks || [])
            .filter((task) => String(task.task_status || '').toUpperCase() === 'PENDING')
            .map((task) => ({
                id: `workflow-${task.id}`,
                type: 'WORKFLOW',
                taskId: task.id,
                title: `Approval request from ${task.requester_name || 'user'}`,
                description: `${task.customer_name || 'Customer'} / ${[task.brand, task.model].filter(Boolean).join(' ') || 'Vehicle'}${task.serial_number ? ` / ${task.serial_number}` : ''}`,
                occurredAt: task.created_at || task.updated_at || '',
                pageKey: 'user-tasks',
            }));
        const saleNotifications = (dashboardData.salesTransactions || []).map((sale) => ({
            id: `sale-${sale.id}`,
            type: 'SALE',
            title: `Sale created for ${sale.customer_name || 'customer'}`,
            description: `${[sale.brand, sale.model].filter(Boolean).join(' ') || 'Vehicle'}${sale.serial_number ? ` / ${sale.serial_number}` : ''}`,
            occurredAt: sale.created_at || sale.purchase_date || sale.agreement_date || '',
            pageKey: 'sales',
        }));
        const stockOrderNotifications = (dashboardData.stockOrders || []).map((order) => ({
            id: `stock-order-${order.id}`,
            type: 'STOCK_ORDER',
            title: `Stock order created for ${order.brand || 'vehicle'} ${order.model || ''}`.trim(),
            description: `${order.company_name || 'Supplier'}${order.expected_delivery_date ? ` / delivery ${order.expected_delivery_date}` : ''}`,
            occurredAt: order.created_at || '',
            pageKey: 'stock',
        }));
        const stockReceivedNotifications = (dashboardData.stockOrders || [])
            .filter((order) => Number(order.received_quantity || 0) > 0 || String(order.order_status || '').toUpperCase() === 'RECEIVED')
            .map((order) => ({
                id: `stock-received-${order.id}`,
                type: 'STOCK_RECEIVED',
                title: `Stock received for ${order.brand || 'vehicle'} ${order.model || ''}`.trim(),
                description: `${order.company_name || 'Supplier'}${order.received_at ? ` / received ${String(order.received_at).slice(0, 10)}` : ''}`,
                occurredAt: order.received_at || order.updated_at || order.created_at || '',
                pageKey: 'stock',
            }));
        const installmentNotifications = (dashboardData.salesTransactions || []).flatMap((sale) =>
            (sale.installments || [])
                .filter((installment) => String(installment.status || '').toUpperCase() === 'RECEIVED' && installment.paid_date)
                .map((installment) => ({
                    id: `installment-${installment.id}`,
                    type: 'INSTALLMENT',
                    title: `Installment received from ${sale.customer_name || 'customer'}`,
                    description: `${[sale.brand, sale.model].filter(Boolean).join(' ') || 'Vehicle'} / installment #${installment.installment_number}`,
                    occurredAt: installment.paid_date || '',
                    pageKey: 'installments',
                }))
        );

        return [
            ...workflowNotifications,
            ...saleNotifications,
            ...stockOrderNotifications,
            ...stockReceivedNotifications,
            ...installmentNotifications,
        ]
            .filter((item) => item.occurredAt)
            .sort((a, b) => new Date(b.occurredAt || 0) - new Date(a.occurredAt || 0))
            .slice(0, 20);
    }, [dashboardData.salesTransactions, dashboardData.stockOrders, dashboardData.workflowTasks]);
    const readNotificationKeySet = useMemo(
        () => new Set((readNotificationKeys || []).map((value) => String(value || '').trim()).filter(Boolean)),
        [readNotificationKeys]
    );
    const unreadNotifications = useMemo(() => {
        return notificationItems.filter((item) => !readNotificationKeySet.has(String(item.id || '')));
    }, [notificationItems, readNotificationKeySet]);
    const companyBusinessAnalytics = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const stockSourceMap = (dashboardData.stockOrders || []).reduce((acc, order) => {
            const directKey = buildVehicleIdentityKey(order.brand, order.model, order.chassis_number, order.engine_number);
            const modelKey = `${normalizeTextValue(order.brand)}::${normalizeTextValue(order.model)}`;
            const companyName = order.company_name || order.profile_company_name || 'Unknown Company';
            const payload = {
                companyName,
                actualPrice: Number(order.unit_price || 0),
            };

            if (normalizeTextValue(order.chassis_number) || normalizeTextValue(order.engine_number)) {
                acc[directKey] = payload;
            }

            if (!acc[modelKey] || Number(order.unit_price || 0) > 0) {
                acc[modelKey] = payload;
            }

            return acc;
        }, {});

        const rows = (dashboardData.salesTransactions || [])
            .filter((sale) => {
                const saleDate = new Date(sale.created_at || sale.purchase_date || sale.agreement_date || 0);
                return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
            })
            .reduce((acc, sale) => {
                const directKey = buildVehicleIdentityKey(sale.brand, sale.model, sale.chassis_number, sale.engine_number);
                const modelKey = `${normalizeTextValue(sale.brand)}::${normalizeTextValue(sale.model)}`;
                const matchedStock = stockSourceMap[directKey] || stockSourceMap[modelKey] || { companyName: 'Unknown Company', actualPrice: Number(sale.purchase_price || 0) };
                const companyName = matchedStock.companyName || 'Unknown Company';

                if (!acc[companyName]) {
                    acc[companyName] = {
                        companyName,
                        actual: 0,
                        selling: 0,
                        profit: 0,
                        deals: 0,
                    };
                }

                const actualPrice = Number(sale.purchase_price || 0) || Number(matchedStock.actualPrice || 0);
                const sellingPrice = Number(sale.vehicle_price || 0);
                acc[companyName].actual += actualPrice;
                acc[companyName].selling += sellingPrice;
                acc[companyName].profit += sellingPrice - actualPrice;
                acc[companyName].deals += 1;
                return acc;
            }, {});

        return Object.values(rows).sort((a, b) => b.profit - a.profit);
    }, [dashboardData.salesTransactions, dashboardData.stockOrders]);
    const normalizedReportKeyword = normalizeTextValue(reportKeyword);
    const isWithinReportRange = (value) => {
        const dateValue = String(value || '').slice(0, 10);
        if (!dateValue) return false;
        if (reportDateFrom && dateValue < reportDateFrom) return false;
        if (reportDateTo && dateValue > reportDateTo) return false;
        return true;
    };
    const resolvedBranchName = user?.dealer_name || dashboardData.dealers?.[0]?.dealer_name || 'Main Branch';
    const getReportBranchValue = (row) => row?.dealer_name || resolvedBranchName;
    const canViewAllReportBranches = realIsSuperAdmin && !user?.effective_dealer_id;
    const reportBranchOptions = useMemo(() => {
        if (!canViewAllReportBranches) {
            return resolvedBranchName ? [resolvedBranchName] : [];
        }

        const options = new Set(
            (dashboardData.dealers || [])
                .map((dealer) => String(dealer.dealer_name || '').trim())
                .filter(Boolean)
        );

        if (resolvedBranchName) {
            options.add(resolvedBranchName);
        }

        return Array.from(options).filter(Boolean).sort((a, b) => a.localeCompare(b));
    }, [canViewAllReportBranches, dashboardData.dealers, resolvedBranchName]);
    useEffect(() => {
        if (!canViewAllReportBranches && resolvedBranchName && reportBranchName !== resolvedBranchName) {
            setReportBranchName(resolvedBranchName);
        }
    }, [canViewAllReportBranches, reportBranchName, resolvedBranchName]);
    const matchesReportBranch = (value) => reportBranchName === 'ALL' || String(value || '').trim() === reportBranchName;
    const reportAgentOptions = useMemo(() => {
        const options = new Set();

        (dashboardData.employees || []).forEach((employee) => {
            const name = String(employee.full_name || '').trim();
            if (name) options.add(name);
        });

        (dashboardData.dealerStaff || []).forEach((staff) => {
            const name = String(staff.full_name || '').trim();
            if (name) options.add(name);
        });

        return Array.from(options).sort((a, b) => a.localeCompare(b));
    }, [dashboardData.dealerStaff, dashboardData.employees]);
    const matchesReportAgent = (value) => reportAgentName === 'ALL' || String(value || '').trim() === reportAgentName;
    const computeSaleReportAmounts = (sale) => {
        const saleMode = String(sale?.sale_mode || '').toUpperCase();
        const totalPrice = Number(sale?.vehicle_price || 0);
        const downPayment = Number(sale?.down_payment || 0);
        const installments = Array.isArray(sale?.installments) ? sale.installments : [];
        const installmentReceived = installments.reduce((sum, row) => sum + Number(row?.received_amount || 0), 0);

        if (saleMode === 'CASH') {
            const isReceived = String(sale?.status || '').toUpperCase() === 'RECEIVED';
            const received = isReceived ? totalPrice : 0;
            const pending = Math.max(totalPrice - received, 0);
            return {
                totalPrice,
                receivedAmount: received,
                pendingAmount: pending,
                derivedStatus: isReceived ? 'RECEIVED' : (String(sale?.status || 'PENDING').toUpperCase() || 'PENDING'),
            };
        }

        // INSTALLMENT: treat down payment + any received installments as received.
        const received = Math.max(downPayment + installmentReceived, 0);
        const pending = Math.max(totalPrice - received, 0);
        const derivedStatus = pending <= 0
            ? 'RECEIVED'
            : received > 0
                ? 'PARTIAL'
                : 'PENDING';

        return {
            totalPrice,
            receivedAmount: received,
            pendingAmount: pending,
            derivedStatus,
        };
    };
    const reportSalesRows = useMemo(() => {
        return (dashboardData.salesTransactions || [])
            .map((sale) => {
                const computed = computeSaleReportAmounts(sale);
                const searchable = normalizeTextValue([
                    sale.customer_name,
                    sale.cnic_passport_number,
                    sale.brand,
                    sale.model,
                    sale.color,
                    sale.product_description,
                    sale.registration_number,
                    sale.agreement_number,
                    sale.agent_name,
                ].filter(Boolean).join(' '));

                return {
                    ...sale,
                    report_received_amount: computed.receivedAmount,
                    report_pending_amount: computed.pendingAmount,
                    report_status: computed.derivedStatus,
                    searchable,
                };
            })
            .filter((sale) => {
                const saleMode = String(sale.sale_mode || '').toUpperCase();
                const status = String(sale.report_status || sale.status || '').toUpperCase();

                if (!isWithinReportRange(sale.purchase_date || sale.agreement_date || sale.created_at)) return false;
                if (!matchesReportBranch(getReportBranchValue(sale))) return false;
                if (!matchesReportAgent(sale.agent_name)) return false;
                if (reportSaleMode !== 'ALL' && saleMode !== reportSaleMode) return false;
                if (reportStatus !== 'ALL') {
                    if (reportStatus === 'PENDING') {
                        if (!['PENDING', 'PARTIAL'].includes(status)) return false;
                    } else if (status !== reportStatus) {
                        return false;
                    }
                }
                if (normalizedReportKeyword && !sale.searchable.includes(normalizedReportKeyword)) return false;
                return true;
            })
            .sort((a, b) => new Date(b.purchase_date || b.created_at || 0) - new Date(a.purchase_date || a.created_at || 0));
    }, [dashboardData.salesTransactions, normalizedReportKeyword, reportAgentName, reportBranchName, reportDateFrom, reportDateTo, reportSaleMode, reportStatus, resolvedBranchName]);
    const reportSalesTotals = useMemo(() => {
        return reportSalesRows.reduce((acc, sale) => {
            acc.deals += 1;
            acc.amount += Number(sale.vehicle_price || 0);
            acc.received += Number(sale.report_received_amount || 0);
            acc.pending += Number(sale.report_pending_amount || 0);
            return acc;
        }, { deals: 0, amount: 0, received: 0, pending: 0 });
    }, [reportSalesRows]);
    const reportSalesCommissionTotal = useMemo(() => {
        const saleIds = new Set(reportSalesRows.map((sale) => sale.id));
        return (dashboardData.employeeCommissions || []).reduce((sum, row) => {
            if (!saleIds.has(row.sale_id)) return sum;
            return sum + Number(row.commission_amount || 0);
        }, 0);
    }, [dashboardData.employeeCommissions, reportSalesRows]);
    const reportStockReceivedRows = useMemo(() => {
        return (dashboardData.stockOrders || [])
            .filter((order) => {
                const status = String(order.order_status || order.status || '').toUpperCase();
                const searchable = normalizeTextValue([
                    order.company_name,
                    order.brand,
                    order.model,
                    order.vehicle_type,
                    order.ordered_by_name,
                ].filter(Boolean).join(' '));
                const hasReceived = Number(order.received_quantity || 0) > 0 || status === 'RECEIVED' || status === 'PARTIAL';

                if (!hasReceived) return false;
                if (!isWithinReportRange(order.received_at || order.updated_at || order.created_at)) return false;
                if (!matchesReportBranch(getReportBranchValue(order))) return false;
                if (!matchesReportAgent(order.ordered_by_name)) return false;
                if (reportStatus !== 'ALL' && status !== reportStatus) return false;
                if (normalizedReportKeyword && !searchable.includes(normalizedReportKeyword)) return false;
                return true;
            })
            .sort((a, b) => new Date(b.received_at || b.updated_at || b.created_at || 0) - new Date(a.received_at || a.updated_at || a.created_at || 0));
    }, [dashboardData.stockOrders, normalizedReportKeyword, reportAgentName, reportBranchName, reportDateFrom, reportDateTo, reportStatus, resolvedBranchName]);
    const reportCustomerRows = useMemo(() => {
        const getCustomerStatus = (customer) => {
            if (customer.biometric_hash) return 'BIOMETRIC_ENROLLED';
            if (customer.identity_doc_url || customer.ocr_details?.identity_doc_back_url) return 'DOCUMENTED';
            if (customer.ocr_details?.raw_ocr_text) return 'OCR_READY';
            return 'PENDING';
        };

        return (dashboardData.customers || [])
            .map((customer) => ({
                ...customer,
                report_status: getCustomerStatus(customer),
                branch_name: getReportBranchValue(customer),
            }))
            .filter((customer) => {
                const searchable = normalizeTextValue([
                    customer.full_name,
                    customer.cnic_passport_number,
                    customer.created_by_name,
                    customer.ocr_details?.country,
                    customer.ocr_details?.address,
                ].filter(Boolean).join(' '));

                if (!matchesReportBranch(customer.branch_name)) return false;
                if (reportStatus !== 'ALL' && customer.report_status !== reportStatus) return false;
                if (normalizedReportKeyword && !searchable.includes(normalizedReportKeyword)) return false;
                return true;
            })
            .sort((a, b) => String(a.full_name || '').localeCompare(String(b.full_name || '')));
    }, [dashboardData.customers, normalizedReportKeyword, reportBranchName, reportStatus, resolvedBranchName]);
    const reportCustomerTransactionRows = useMemo(() => {
        return (dashboardData.salesTransactions || [])
            .map((sale) => {
                const summary = summarizeSaleInstallments(sale);
                const searchable = normalizeTextValue([
                    sale.customer_name,
                    sale.cnic_passport_number,
                    sale.brand,
                    sale.model,
                    sale.color,
                    sale.product_description,
                    sale.registration_number,
                    sale.agreement_number,
                    sale.agent_name,
                ].filter(Boolean).join(' '));

                return {
                    ...sale,
                    branch_name: getReportBranchValue(sale),
                    received_installment_dates: summary.receivedDateLabels,
                    received_installment_dates_label: summary.receivedDateLines,
                    pending_installments: summary.pendingCount,
                    actual_received_installments: summary.actualReceivedCount,
                    advance_covered_installments: summary.coveredByAdvanceCount,
                    total_installment_months: summary.totalPlannedMonths,
                    searchable,
                };
            })
            .filter((sale) => {
                const status = String(sale.status || '').toUpperCase();
                const saleMode = String(sale.sale_mode || '').toUpperCase();

                if (!isWithinReportRange(sale.purchase_date || sale.agreement_date || sale.created_at)) return false;
                if (!matchesReportBranch(sale.branch_name)) return false;
                if (!matchesReportAgent(sale.agent_name)) return false;
                if (reportSaleMode !== 'ALL' && saleMode !== reportSaleMode) return false;
                if (reportStatus !== 'ALL' && status !== reportStatus) return false;
                if (normalizedReportKeyword && !sale.searchable.includes(normalizedReportKeyword)) return false;
                return true;
            })
            .sort((a, b) => new Date(b.purchase_date || b.created_at || 0) - new Date(a.purchase_date || a.created_at || 0));
    }, [dashboardData.salesTransactions, normalizedReportKeyword, reportAgentName, reportBranchName, reportDateFrom, reportDateTo, reportSaleMode, reportStatus, resolvedBranchName]);
    const reportBusinessTransactionRows = useMemo(() => {
        return (dashboardData.salesTransactions || [])
            .map((sale) => {
                const actualPrice = Number(sale.purchase_price || 0);
                const sellingPrice = Number(sale.vehicle_price || 0);
                const profitLoss = sellingPrice - actualPrice;
                const searchable = normalizeTextValue([
                    sale.customer_name,
                    sale.cnic_passport_number,
                    sale.brand,
                    sale.model,
                    sale.color,
                    sale.product_description,
                    sale.registration_number,
                    sale.agreement_number,
                    sale.agent_name,
                ].filter(Boolean).join(' '));

                return {
                    ...sale,
                    branch_name: getReportBranchValue(sale),
                    actual_price: actualPrice,
                    selling_price: sellingPrice,
                    profit_loss: profitLoss,
                    business_status: profitLoss >= 0 ? 'PROFIT' : 'LOSS',
                    searchable,
                };
            })
            .filter((sale) => {
                const status = String(sale.status || '').toUpperCase();
                const saleMode = String(sale.sale_mode || '').toUpperCase();

                if (!isWithinReportRange(sale.purchase_date || sale.agreement_date || sale.created_at)) return false;
                if (!matchesReportBranch(sale.branch_name)) return false;
                if (!matchesReportAgent(sale.agent_name)) return false;
                if (reportSaleMode !== 'ALL' && saleMode !== reportSaleMode) return false;
                if (reportStatus !== 'ALL' && status !== reportStatus && sale.business_status !== reportStatus) return false;
                if (normalizedReportKeyword && !sale.searchable.includes(normalizedReportKeyword)) return false;
                return true;
            })
            .sort((a, b) => new Date(b.purchase_date || b.created_at || 0) - new Date(a.purchase_date || a.created_at || 0));
    }, [dashboardData.salesTransactions, normalizedReportKeyword, reportAgentName, reportBranchName, reportDateFrom, reportDateTo, reportSaleMode, reportStatus, resolvedBranchName]);
    const reportBusinessTotals = useMemo(() => {
        return reportBusinessTransactionRows.reduce((acc, sale) => {
            acc.actual += Number(sale.actual_price || 0);
            acc.selling += Number(sale.selling_price || 0);
            acc.net += Number(sale.profit_loss || 0);
            if (Number(sale.profit_loss || 0) >= 0) {
                acc.profit += Number(sale.profit_loss || 0);
            } else {
                acc.loss += Math.abs(Number(sale.profit_loss || 0));
            }
            return acc;
        }, { actual: 0, selling: 0, net: 0, profit: 0, loss: 0 });
    }, [reportBusinessTransactionRows]);
    const reportInvoiceRows = useMemo(() => {
        return (dashboardData.salesTransactions || [])
            .map((sale) => {
                const searchable = normalizeTextValue([
                    sale.customer_name,
                    sale.cnic_passport_number,
                    sale.brand,
                    sale.model,
                    sale.registration_number,
                    sale.agreement_number,
                    sale.agent_name,
                ].filter(Boolean).join(' '));

                return {
                    ...sale,
                    branch_name: getReportBranchValue(sale),
                    searchable,
                };
            })
            .filter((sale) => {
                const status = String(sale.status || '').toUpperCase();
                const saleMode = String(sale.sale_mode || '').toUpperCase();

                if (!isWithinReportRange(sale.purchase_date || sale.agreement_date || sale.created_at)) return false;
                if (!matchesReportBranch(sale.branch_name)) return false;
                if (!matchesReportAgent(sale.agent_name)) return false;
                if (reportSaleMode !== 'ALL' && saleMode !== reportSaleMode) return false;
                if (reportStatus !== 'ALL' && status !== reportStatus) return false;
                if (normalizedReportKeyword && !sale.searchable.includes(normalizedReportKeyword)) return false;
                return true;
            })
            .sort((a, b) => new Date(b.purchase_date || b.created_at || 0) - new Date(a.purchase_date || a.created_at || 0));
    }, [dashboardData.salesTransactions, normalizedReportKeyword, reportAgentName, reportBranchName, reportDateFrom, reportDateTo, reportSaleMode, reportStatus, resolvedBranchName]);
    const reportEmployeeRows = useMemo(() => {
        return (dashboardData.employees || [])
            .map((employee) => ({
                ...employee,
                report_status: employee.is_active ? 'ACTIVE' : 'INACTIVE',
                branch_name: employee.dealer_name || resolvedBranchName,
                earned_commission: Number(employeeCommissionTotalsMap[employee.id] || 0),
                outstanding_advance: Number(employeeOutstandingAdvanceMap[employee.id] || 0),
                latest_net_salary: Number(employeeLatestPayrollMap[employee.id]?.net_salary || 0),
            }))
            .filter((employee) => {
                const searchable = normalizeTextValue([
                    employee.full_name,
                    employee.employee_code,
                    employee.email,
                    employee.phone,
                    employee.department,
                    employee.job_title,
                    employee.commission_percentage,
                    employee.commission_value,
                    employee.earned_commission,
                    employee.outstanding_advance,
                    employee.latest_net_salary,
                    employee.role_name,
                ].filter(Boolean).join(' '));

                if (!matchesReportBranch(employee.branch_name)) return false;
                if (!matchesReportAgent(employee.full_name)) return false;
                if (reportStatus !== 'ALL' && employee.report_status !== reportStatus) return false;
                if (normalizedReportKeyword && !searchable.includes(normalizedReportKeyword)) return false;
                return true;
            })
            .sort((a, b) => String(a.full_name || '').localeCompare(String(b.full_name || '')));
    }, [dashboardData.employees, employeeCommissionTotalsMap, employeeLatestPayrollMap, employeeOutstandingAdvanceMap, normalizedReportKeyword, reportAgentName, reportBranchName, reportStatus, resolvedBranchName]);
    const reportSalaryRows = useMemo(() => {
        const employeeMap = new Map((dashboardData.employees || []).map((employee) => [employee.id, employee]));
        return (dashboardData.employeePayrolls || [])
            .map((row) => {
                const employee = employeeMap.get(row.employee_id) || {};
                return {
                    ...row,
                    full_name: employee.full_name || 'Unknown Employee',
                    employee_code: employee.employee_code || 'Not set',
                    department: employee.department || 'Not set',
                    branch_name: employee.dealer_name || resolvedBranchName,
                    report_status: 'GENERATED',
                };
            })
            .filter((row) => {
                const searchable = normalizeTextValue([
                    row.full_name,
                    row.employee_code,
                    row.department,
                    row.branch_name,
                    row.payroll_month,
                ].filter(Boolean).join(' '));

                if (!isWithinReportRange(row.created_at || `${row.payroll_month}-01`)) return false;
                if (!matchesReportBranch(row.branch_name)) return false;
                if (!matchesReportAgent(row.full_name)) return false;
                if (reportStatus !== 'ALL' && row.report_status !== reportStatus) return false;
                if (normalizedReportKeyword && !searchable.includes(normalizedReportKeyword)) return false;
                return true;
            })
            .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }, [dashboardData.employeePayrolls, dashboardData.employees, normalizedReportKeyword, reportAgentName, reportBranchName, reportDateFrom, reportDateTo, reportStatus, resolvedBranchName]);
    const reportDealerInformationRows = useMemo(() => {
        const getDealerEmployeeMergeKey = (employee) => {
            const normalizedDealerId = String(employee?.dealer_id || '').trim().toUpperCase();
            const normalizedUserId = String(employee?.user_id || '').trim().toUpperCase();
            const normalizedEmail = String(employee?.email || '').trim().toUpperCase();
            const normalizedCode = String(employee?.employee_code || '').trim().toUpperCase();
            const normalizedName = String(employee?.full_name || '').trim().toUpperCase();

            if (normalizedUserId) return `${normalizedDealerId}::USER::${normalizedUserId}`;
            if (normalizedEmail) return `${normalizedDealerId}::EMAIL::${normalizedEmail}`;
            if (normalizedCode && normalizedCode !== 'LINKED USER') return `${normalizedDealerId}::CODE::${normalizedCode}`;
            return `${normalizedDealerId}::NAME::${normalizedName}`;
        };
        const getDealerEmployeePriority = (employee) => {
            const hasRealEmployeeCode = String(employee?.employee_code || '').trim().toUpperCase() !== 'LINKED USER';
            const hasDepartment = Boolean(String(employee?.department || '').trim());
            const hasRole = Boolean(String(employee?.role_name || '').trim());
            return [hasRealEmployeeCode, hasDepartment, hasRole].filter(Boolean).length;
        };
        const employeesByDealerId = (dashboardData.employees || []).reduce((acc, employee) => {
            const dealerId = employee.dealer_id || user?.dealer_id || 'current-dealer';
            if (!acc[dealerId]) {
                acc[dealerId] = [];
            }
            acc[dealerId].push(employee);
            return acc;
        }, {});
        const dealerStaffByDealerId = (dashboardData.dealerStaff || []).reduce((acc, staff) => {
            const dealerId = staff.dealer_id || user?.dealer_id || 'current-dealer';
            if (!acc[dealerId]) {
                acc[dealerId] = [];
            }
            acc[dealerId].push(staff);
            return acc;
        }, {});

        const dealerRows = (dashboardData.dealers || []).map((dealer) => {
            const mergedEmployees = [
                ...(employeesByDealerId[dealer.id] || []),
                ...(dealerStaffByDealerId[dealer.id] || []).map((staff) => ({
                    id: `staff-${staff.id}`,
                    user_id: staff.id,
                    dealer_id: staff.dealer_id,
                    employee_code: staff.employee_code || 'Linked User',
                    full_name: staff.full_name || 'Not set',
                    email: staff.email || '',
                    department: staff.department || staff.job_title || 'Dealer Staff',
                    role_name: staff.role_name || 'No role',
                    is_active: staff.is_active ?? true,
                })),
            ];
            const employees = Array.from(
                mergedEmployees.reduce((acc, employee) => {
                    const dedupeKey = getDealerEmployeeMergeKey(employee);
                    const existing = acc.get(dedupeKey);
                    if (!existing || getDealerEmployeePriority(employee) >= getDealerEmployeePriority(existing)) {
                        acc.set(dedupeKey, employee);
                    }
                    return acc;
                }, new Map()).values()
            ).sort((a, b) => String(a.full_name || '').localeCompare(String(b.full_name || '')));
            const activeEmployees = employees.filter((employee) => employee.is_active).length;
            const searchable = normalizeTextValue([
                dealer.dealer_name,
                dealer.dealer_code,
                dealer.dealer_address,
                dealer.contact_email,
                dealer.mobile_number,
                dealer.admin_full_name,
                dealer.admin_email,
                ...employees.flatMap((employee) => [employee.full_name, employee.employee_code, employee.email, employee.department]),
            ].filter(Boolean).join(' '));

            return {
                ...dealer,
                branch_name: dealer.dealer_name || resolvedBranchName,
                report_status: dealer.is_active ? 'ACTIVE' : 'INACTIVE',
                employee_count: employees.length,
                active_employee_count: activeEmployees,
                employees,
                searchable,
            };
        });

        if (dealerRows.length === 0 && user?.dealer_name) {
            const employees = Array.from(
                [
                    ...(dashboardData.employees || []),
                    ...((dashboardData.dealerStaff || []).map((staff) => ({
                        id: `staff-${staff.id}`,
                        user_id: staff.id,
                        dealer_id: staff.dealer_id,
                        employee_code: staff.employee_code || 'Linked User',
                        full_name: staff.full_name || 'Not set',
                        email: staff.email || '',
                        department: staff.department || staff.job_title || 'Dealer Staff',
                        role_name: staff.role_name || 'No role',
                        is_active: staff.is_active ?? true,
                    }))),
                ].reduce((acc, employee) => {
                    const dedupeKey = getDealerEmployeeMergeKey(employee);
                    const existing = acc.get(dedupeKey);
                    if (!existing || getDealerEmployeePriority(employee) >= getDealerEmployeePriority(existing)) {
                        acc.set(dedupeKey, employee);
                    }
                    return acc;
                }, new Map()).values()
            ).sort((a, b) => String(a.full_name || '').localeCompare(String(b.full_name || '')));
            dealerRows.push({
                id: user?.dealer_id || 'current-dealer',
                dealer_code: user?.dealer_code || 'No dealer code',
                dealer_name: user.dealer_name,
                dealer_logo_url: user.dealer_logo_url || '',
                dealer_address: user.dealer_address || '',
                dealer_cnic: '',
                mobile_country_code: user.mobile_country_code || '',
                mobile_number: user.mobile_number || '',
                currency_code: user.currency_code || '',
                contact_email: user.contact_email || '',
                admin_full_name: '',
                admin_email: '',
                branch_name: user.dealer_name,
                report_status: 'ACTIVE',
                employee_count: employees.length,
                active_employee_count: employees.filter((employee) => employee.is_active).length,
                employees,
                searchable: normalizeTextValue([
                    user.dealer_name,
                    user.dealer_address,
                    user.contact_email,
                    user.mobile_number,
                    ...employees.flatMap((employee) => [employee.full_name, employee.employee_code, employee.email, employee.department]),
                ].filter(Boolean).join(' ')),
            });
        }

        return dealerRows
            .filter((dealer) => {
                if (!matchesReportBranch(dealer.branch_name)) return false;
                if (reportStatus !== 'ALL' && dealer.report_status !== reportStatus) return false;
                if (normalizedReportKeyword && !dealer.searchable.includes(normalizedReportKeyword)) return false;
                return true;
            })
            .sort((a, b) => String(a.dealer_name || '').localeCompare(String(b.dealer_name || '')));
    }, [dashboardData.dealerStaff, dashboardData.dealers, dashboardData.employees, normalizedReportKeyword, reportBranchName, reportStatus, resolvedBranchName, user?.contact_email, user?.dealer_address, user?.dealer_id, user?.dealer_logo_url, user?.dealer_name, user?.mobile_country_code, user?.mobile_number, user?.currency_code]);
    const reportDealerEmployeeRows = useMemo(() => {
        const currentRoleName = String(user?.role_name || '').toUpperCase();
        const currentUserId = String(user?.id || '');
        const currentDealerId = String(user?.dealer_id || '');
        const canSeeDealerEmployeeRow = (row) => {
            const rowRole = String(row.role_name || '').toUpperCase();
            const rowUserId = String(row.user_id || '');
            const rowDealerId = String(row.dealer_id || '');

            if (currentRoleName === 'SUPER_ADMIN') return true;
            if (currentRoleName === 'AGENT') return rowUserId && rowUserId === currentUserId;
            if (currentRoleName === 'MANAGER') {
                return rowDealerId === currentDealerId && rowRole !== 'APPLICATION_ADMIN' && rowRole !== 'SUPER_ADMIN';
            }
            if (currentRoleName === 'APPLICATION_ADMIN') {
                return rowDealerId === currentDealerId && rowRole !== 'SUPER_ADMIN';
            }
            return rowDealerId === currentDealerId;
        };
        const dealerMap = new Map((dashboardData.dealers || []).map((dealer) => [dealer.id, dealer]));
        const mergedRows = [
            ...(dashboardData.employees || []).map((employee) => {
                const dealer = dealerMap.get(employee.dealer_id) || null;
                return {
                    id: employee.id,
                    user_id: employee.user_id || '',
                    dealer_id: employee.dealer_id || user?.dealer_id || '',
                    dealer_name: dealer?.dealer_name || employee.dealer_name || user?.dealer_name || 'Unassigned Dealer',
                    dealer_code: dealer?.dealer_code || employee.dealer_code || 'No dealer code',
                    full_name: employee.full_name || 'Not set',
                    employee_code: employee.employee_code || 'Not set',
                    login_email: employee.email || 'No email',
                    designation: employee.job_title || employee.department || 'Not set',
                    role_name: employee.role_name || 'No role',
                    hired_at: employee.hired_at || '',
                    resigned_status: employee.is_active ? 'ACTIVE' : 'RESIGNED',
                    status: employee.is_active ? 'ACTIVE' : 'INACTIVE',
                    searchable: normalizeTextValue([
                        dealer?.dealer_name,
                        dealer?.dealer_code,
                        employee.full_name,
                        employee.employee_code,
                        employee.email,
                        employee.department,
                        employee.job_title,
                        employee.role_name,
                    ].filter(Boolean).join(' ')),
                };
            }),
            ...(dashboardData.dealerStaff || []).map((staff) => {
                const dealer = dealerMap.get(staff.dealer_id) || null;
                return {
                    id: `staff-${staff.id}`,
                    user_id: staff.id,
                    dealer_id: staff.dealer_id || user?.dealer_id || '',
                    dealer_name: dealer?.dealer_name || staff.dealer_name || user?.dealer_name || 'Unassigned Dealer',
                    dealer_code: dealer?.dealer_code || staff.dealer_code || 'No dealer code',
                    full_name: staff.full_name || 'Not set',
                    employee_code: staff.employee_code || 'Linked User',
                    login_email: staff.email || 'No email',
                    designation: staff.job_title || staff.department || staff.role_name || 'Dealer Staff',
                    role_name: staff.role_name || 'No role',
                    hired_at: staff.hired_at || staff.created_at || '',
                    resigned_status: staff.is_active ? 'ACTIVE' : 'RESIGNED',
                    status: staff.is_active ? 'ACTIVE' : 'INACTIVE',
                    searchable: normalizeTextValue([
                        dealer?.dealer_name,
                        dealer?.dealer_code,
                        staff.full_name,
                        staff.employee_code,
                        staff.email,
                        staff.department,
                        staff.job_title,
                        staff.role_name,
                    ].filter(Boolean).join(' ')),
                };
            }),
        ];

        return Array.from(
            mergedRows.reduce((acc, row) => {
                const dedupeKey = `${row.dealer_id || 'dealer'}::${row.login_email || ''}::${row.employee_code || ''}::${row.full_name || ''}`;
                if (!acc.has(dedupeKey)) {
                    acc.set(dedupeKey, row);
                }
                return acc;
            }, new Map()).values()
        )
            .filter((row) => {
                if (!canSeeDealerEmployeeRow(row)) return false;
                if (!matchesReportBranch(row.dealer_name)) return false;
                if (!matchesReportAgent(row.full_name)) return false;
                if (reportStatus !== 'ALL' && row.status !== reportStatus && row.resigned_status !== reportStatus) return false;
                if (normalizedReportKeyword && !row.searchable.includes(normalizedReportKeyword)) return false;
                return true;
            })
            .sort((a, b) => {
                const dealerCompare = String(a.dealer_name || '').localeCompare(String(b.dealer_name || ''));
                if (dealerCompare !== 0) return dealerCompare;
                return String(a.full_name || '').localeCompare(String(b.full_name || ''));
            });
    }, [dashboardData.dealerStaff, dashboardData.dealers, dashboardData.employees, normalizedReportKeyword, reportAgentName, reportBranchName, reportDateFrom, reportDateTo, reportStatus, user?.dealer_id, user?.dealer_name, user?.id, user?.role_name]);
    const reportStockInventoryRows = useMemo(() => {
        const startDateKey = toLocalDateKey(reportDateFrom);
        const endDateKey = toLocalDateKey(reportDateTo);
        const previousDateKey = shiftDateKey(startDateKey, -1);
        const map = {};
        const saleByVehicleId = new Map(
            (dashboardData.salesTransactions || [])
                .filter((sale) => sale.vehicle_id)
                .map((sale) => [sale.vehicle_id, sale])
        );
        const saleByIdentityKey = new Map(
            (dashboardData.salesTransactions || [])
                .filter((sale) => sale.chassis_number || sale.engine_number)
                .map((sale) => [buildVehicleIdentityKey(sale.brand, sale.model, sale.chassis_number, sale.engine_number), sale])
        );
        const stockCostMap = (dashboardData.stockOrders || []).reduce((acc, order) => {
            const modelKey = `${normalizeTextValue(order.brand)}::${normalizeTextValue(order.model)}::${normalizeTextValue(order.vehicle_type)}::${normalizeTextValue(getReportBranchValue(order))}`;
            const identityKey = buildVehicleIdentityKey(order.brand, order.model, order.chassis_number, order.engine_number);
            const nextCost = Number(order.unit_price || 0);
            if (!acc[modelKey] || nextCost > 0) {
                acc[modelKey] = nextCost;
            }
            if ((order.chassis_number || order.engine_number) && (!acc[identityKey] || nextCost > 0)) {
                acc[identityKey] = nextCost;
            }
            return acc;
        }, {});
        const stockCompanyMap = (dashboardData.stockOrders || []).reduce((acc, order) => {
            const companyName = order.company_name || order.profile_company_name || '';
            const modelKey = `${normalizeTextValue(order.brand)}::${normalizeTextValue(order.model)}::${normalizeTextValue(order.vehicle_type)}::${normalizeTextValue(getReportBranchValue(order))}`;
            const identityKey = buildVehicleIdentityKey(order.brand, order.model, order.chassis_number, order.engine_number);
            if (companyName) {
                if (!acc[modelKey]) {
                    acc[modelKey] = companyName;
                }
                if (order.chassis_number || order.engine_number) {
                    acc[identityKey] = companyName;
                }
            }
            return acc;
        }, {});

        const ensureStockRow = ({
            rowKey,
            brand,
            model,
            vehicle_type,
            branch_name,
            color,
            product_description,
            serial_number,
            registration_number,
            chassis_number,
            engine_number,
            company_name,
        }) => {
            const key = rowKey;
            if (!map[key]) {
                map[key] = {
                    key,
                    brand: brand || 'Unknown',
                    model: model || 'Unknown',
                    vehicle_type: vehicle_type || 'Unknown',
                    color: color || '',
                    product_description: product_description || '',
                    serial_number: serial_number || '',
                    registration_number: registration_number || '',
                    chassis_number: chassis_number || '',
                    engine_number: engine_number || '',
                    branch_name: branch_name || resolvedBranchName,
                    company_name: company_name || '',
                    opening_quantity: 0,
                    received_quantity: 0,
                    intransit_quantity: 0,
                    cash_sales_quantity: 0,
                    installment_sales_quantity: 0,
                    total_sales_quantity: 0,
                    closing_quantity: 0,
                    closing_value: 0,
                };
            }

            return map[key];
        };

        (dashboardData.inventory || []).forEach((vehicle) => {
            const hasRealVehicleIdentity =
                String(vehicle.registration_number || '').trim()
                && String(vehicle.chassis_number || '').trim()
                && String(vehicle.engine_number || '').trim();

            if (!hasRealVehicleIdentity) {
                return;
            }

            const branchName = getReportBranchValue(vehicle);
            if (!matchesReportBranch(branchName)) return;
            const identityKey = buildVehicleIdentityKey(vehicle.brand, vehicle.model, vehicle.chassis_number, vehicle.engine_number);
            const modelCostKey = `${normalizeTextValue(vehicle.brand)}::${normalizeTextValue(vehicle.model)}::${normalizeTextValue(vehicle.vehicle_type)}::${normalizeTextValue(branchName)}`;
            const row = ensureStockRow({
                rowKey: String(vehicle.id || identityKey || `${vehicle.serial_number || ''}::${vehicle.registration_number || ''}`),
                brand: vehicle.brand,
                model: vehicle.model,
                vehicle_type: vehicle.vehicle_type,
                branch_name: branchName,
                color: vehicle.color,
                product_description: vehicle.product_description || vehicle.description,
                serial_number: vehicle.serial_number,
                registration_number: vehicle.registration_number,
                chassis_number: vehicle.chassis_number,
                engine_number: vehicle.engine_number,
                company_name: stockCompanyMap[identityKey] || stockCompanyMap[modelCostKey] || '',
            });
            const vehicleCreatedAt = toLocalDateKey(vehicle.created_at);
            const linkedSale = saleByVehicleId.get(vehicle.id) || saleByIdentityKey.get(identityKey) || null;
            const soldAt = toLocalDateKey(linkedSale?.purchase_date || linkedSale?.agreement_date || linkedSale?.created_at);
            const availableAtStart =
                previousDateKey
                && vehicleCreatedAt
                && vehicleCreatedAt <= previousDateKey
                && (!soldAt || soldAt > previousDateKey);
            const availableAtEnd =
                endDateKey
                && vehicleCreatedAt
                && vehicleCreatedAt <= endDateKey
                && (!soldAt || soldAt > endDateKey);

            if (availableAtStart) {
                row.opening_quantity += 1;
            }

            if (vehicleCreatedAt && vehicleCreatedAt >= startDateKey && vehicleCreatedAt <= endDateKey) {
                row.received_quantity += 1;
            }

            if (availableAtEnd) {
                row.closing_quantity += 1;
            }
        });

        (dashboardData.salesTransactions || []).forEach((sale) => {
            const saleDate = toLocalDateKey(sale.purchase_date || sale.agreement_date || sale.created_at);
            if (!saleDate || saleDate < startDateKey || saleDate > endDateKey) return;
            const branchName = getReportBranchValue(sale);
            if (!matchesReportBranch(branchName)) return;
            const identityKey = buildVehicleIdentityKey(sale.brand, sale.model, sale.chassis_number, sale.engine_number);
            const modelCostKey = `${normalizeTextValue(sale.brand)}::${normalizeTextValue(sale.model)}::${normalizeTextValue(sale.vehicle_type)}::${normalizeTextValue(branchName)}`;
            const row = ensureStockRow({
                rowKey: String(sale.vehicle_id || identityKey || `${sale.serial_number || ''}::${sale.registration_number || ''}`),
                brand: sale.brand,
                model: sale.model,
                vehicle_type: sale.vehicle_type,
                branch_name: branchName,
                color: sale.color,
                product_description: sale.product_description,
                serial_number: sale.serial_number,
                registration_number: sale.registration_number,
                chassis_number: sale.chassis_number,
                engine_number: sale.engine_number,
                company_name: stockCompanyMap[identityKey] || stockCompanyMap[modelCostKey] || '',
            });
            const saleMode = String(sale.sale_mode || '').toUpperCase();
            if (saleMode === 'CASH') {
                row.cash_sales_quantity += 1;
            }
            if (saleMode === 'INSTALLMENT') {
                row.installment_sales_quantity += 1;
            }
            row.total_sales_quantity += 1;
        });

        (dashboardData.stockOrders || []).forEach((order) => {
            const branchName = getReportBranchValue(order);
            if (!matchesReportBranch(branchName)) return;

            const createdAt = toLocalDateKey(order.created_at);
            if (!createdAt || createdAt < startDateKey || createdAt > endDateKey) return;

            const receivedAt = toLocalDateKey(order.received_at);
            const receivedByEnd =
                (Number(order.received_quantity || 0) > 0 || String(order.order_status || '').toUpperCase() === 'RECEIVED')
                && receivedAt
                && receivedAt <= endDateKey;

            if (receivedByEnd) {
                return;
            }

            const row = ensureStockRow({
                rowKey: `intransit-${order.id}`,
                brand: order.brand,
                model: order.model,
                vehicle_type: order.vehicle_type,
                branch_name: branchName,
                color: order.product_color || order.color,
                product_description: order.product_description,
                serial_number: '',
                registration_number: '',
                chassis_number: '',
                engine_number: '',
                company_name: order.company_name || order.profile_company_name || '',
            });

            row.intransit_quantity += 1;
        });

        return Object.values(map).filter((row) => {
            const stockCostKey = buildVehicleIdentityKey(row.brand, row.model, row.chassis_number, row.engine_number);
            const stockCostFallbackKey = `${normalizeTextValue(row.brand)}::${normalizeTextValue(row.model)}::${normalizeTextValue(row.vehicle_type)}::${normalizeTextValue(row.branch_name)}`;
            const searchable = normalizeTextValue([
                row.brand,
                row.model,
                row.vehicle_type,
                row.color,
                row.product_description,
                row.branch_name,
                row.company_name,
                row.serial_number,
                row.registration_number,
                row.chassis_number,
                row.engine_number,
            ].join(' '));
            const stockStatusMatch =
                reportStatus === 'ALL'
                || (reportStatus === 'OPENING' && row.opening_quantity > 0)
                || (reportStatus === 'INTRANSIT' && row.intransit_quantity > 0)
                || (reportStatus === 'CASH_SALES' && row.cash_sales_quantity > 0)
                || (reportStatus === 'INSTALLMENT_SALES' && row.installment_sales_quantity > 0)
                || (reportStatus === 'CLOSING' && row.closing_quantity > 0);
            const modeMatch =
                reportSaleMode === 'ALL'
                || (reportSaleMode === 'CASH' && row.cash_sales_quantity > 0)
                || (reportSaleMode === 'INSTALLMENT' && row.installment_sales_quantity > 0);

            row.closing_value = roundCurrencyValue(Number(stockCostMap[stockCostKey] || stockCostMap[stockCostFallbackKey] || 0) * Number(row.closing_quantity || 0));
            return stockStatusMatch && modeMatch && (!normalizedReportKeyword || searchable.includes(normalizedReportKeyword));
        }).sort((a, b) => `${a.brand} ${a.model} ${a.serial_number} ${a.registration_number}`.localeCompare(`${b.brand} ${b.model} ${b.serial_number} ${b.registration_number}`));
    }, [dashboardData.inventory, dashboardData.salesTransactions, dashboardData.stockOrders, normalizedReportKeyword, reportBranchName, reportDateFrom, reportDateTo, reportSaleMode, reportStatus, resolvedBranchName]);
    const overviewMetrics = useMemo(() => {
        const salesRows = dashboardData.salesTransactions || [];
        const computedCashTransactions = salesRows.filter((sale) => String(sale.sale_mode || '').toUpperCase() === 'CASH').length;
        const computedInstallmentTransactions = salesRows.filter((sale) => String(sale.sale_mode || '').toUpperCase() === 'INSTALLMENT').length;
        const computedReceivedInstallments = salesRows.reduce((sum, sale) => {
            if (String(sale.sale_mode || '').toUpperCase() !== 'INSTALLMENT') {
                return sum;
            }

            return sum + (sale.installments || []).filter((row) => (
                String(row.status || '').toUpperCase() === 'RECEIVED'
                || Number(row.received_amount || 0) > 0
            )).length;
        }, 0);
        const cashTransactions = Number(dashboardData.metrics.cashTransactions ?? computedCashTransactions);
        const installmentTransactions = Number(dashboardData.metrics.installmentTransactions ?? computedInstallmentTransactions);
        const receivedInstallments = Number(dashboardData.metrics.receivedInstallments ?? computedReceivedInstallments);

        return {
            settledLeases: Number(dashboardData.metrics.activeLeases || 0),
            pendingLeases: Number(dashboardData.metrics.pendingLeases || 0),
            pendingTasks: Number(dashboardData.metrics.pendingTasks || 0),
            totalRevenue: salesAnalytics.totals.selling || Number(dashboardData.metrics.totalRevenue || 0),
            leasingApplications: Number(dashboardData.metrics.totalApplications || 0),
            cashTransactions,
            installmentTransactions,
            receivedInstallments,
        };
    }, [dashboardData.metrics, dashboardData.salesTransactions, salesAnalytics.totals.selling]);
    const installmentMarkupPreview = useMemo(() => {
        if (saleForm.sale_mode !== 'INSTALLMENT') {
            return 0;
        }

        const actualPrice = Number(selectedSaleVehicle?.purchase_price || 0);
        const totalPrice = Number(saleForm.vehicle_price || 0);

        if (actualPrice <= 0 || totalPrice <= 0) {
            return 0;
        }

        return roundCurrencyValue(((totalPrice - actualPrice) / actualPrice) * 100);
    }, [saleForm.sale_mode, saleForm.vehicle_price, selectedSaleVehicle]);

    const stockOrders = dashboardData.stockOrders || [];
    const filteredStockOrders = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return stockOrders;

        return stockOrders.filter((order) =>
            [
                order.company_name,
                order.company_email,
                order.brand,
                order.model,
                order.vehicle_type,
                order.order_status,
            ]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(query))
        );
    }, [searchTerm, stockOrders]);
    const receivedStockOrders = useMemo(
        () => filteredStockOrders.filter((order) => Number(order.received_quantity || 0) > 0 || String(order.order_status || '').toUpperCase() === 'RECEIVED'),
        [filteredStockOrders]
    );
    const pendingStockOrders = useMemo(
        () => filteredStockOrders.filter((order) => String(order.order_status || '').toUpperCase() !== 'RECEIVED'),
        [filteredStockOrders]
    );
    const filteredDealers = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return dashboardData.dealers || [];

        return (dashboardData.dealers || []).filter((dealer) =>
            [
                dealer.dealer_code,
                dealer.dealer_name,
                dealer.dealer_address,
                dealer.dealer_cnic,
                dealer.mobile_number,
                dealer.currency_code,
                dealer.app_status,
            ]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(query))
        );
    }, [dashboardData.dealers, searchTerm]);

    useEffect(() => {
        if (!selectedSaleVehicle) return;

        const actualPrice = Number(selectedSaleVehicle.purchase_price || 0);
        const cashMarginValue = Number(selectedSaleVehicle.cash_markup_value || 0);
        const cashMarginPercent = Number(selectedSaleVehicle.cash_markup_percent || 0);
        const installmentPercent = Number(selectedSaleVehicle.installment_markup_percent || 0);
        const installmentMonthsDefault = Number(selectedSaleVehicle.installment_months || 0) || 12;

        const cashSellPrice = actualPrice > 0
            ? cashMarginValue > 0
                ? actualPrice + cashMarginValue
                : actualPrice * (1 + cashMarginPercent / 100)
            : 0;
        const installmentSellPrice = actualPrice > 0 ? actualPrice * (1 + installmentPercent / 100) : 0;

        setSaleForm((current) => ({
            ...current,
            vehicle_price:
                current.sale_mode === 'INSTALLMENT'
                    ? current.vehicle_price || (installmentSellPrice > 0 ? String(installmentSellPrice) : '')
                    : current.vehicle_price || (cashSellPrice > 0 ? String(cashSellPrice) : String(selectedSaleVehicle.purchase_price || '')),
            monthly_installment:
                current.sale_mode === 'INSTALLMENT'
                    ? current.monthly_installment
                    : current.monthly_installment || String(selectedSaleVehicle.monthly_rate || ''),
            installment_months:
                current.sale_mode === 'INSTALLMENT'
                    ? current.installment_months || String(installmentMonthsDefault)
                    : current.installment_months,
            financed_amount:
                current.sale_mode === 'INSTALLMENT'
                    ? current.financed_amount || String(Math.max(Number(current.vehicle_price || selectedSaleVehicle.purchase_price || 0) - Number(current.down_payment || 0), 0))
                    : current.financed_amount,
        }));
    }, [selectedSaleVehicle]);

    useEffect(() => {
        if (!selectedStockProduct) return;

        setStockOrderForm((current) => {
            const nextUnitPrice = current.unit_price || String(selectedStockProduct.purchase_price || '') || '';
            const computedTotal = Number(nextUnitPrice || 0) > 0 ? String(Number(nextUnitPrice || 0)) : current.total_amount;

            if (
                current.brand === (selectedStockProduct.brand || '') &&
                current.model === (selectedStockProduct.model || '') &&
                current.vehicle_type === (selectedStockProduct.vehicle_type || '') &&
                current.color === (selectedStockProduct.color || '') &&
                current.product_description === (selectedStockProduct.description || '') &&
                current.unit_price === nextUnitPrice &&
                current.total_amount === computedTotal
            ) {
                return current;
            }

            return {
                ...current,
                brand: selectedStockProduct.brand || '',
                model: selectedStockProduct.model || '',
                vehicle_type: selectedStockProduct.vehicle_type || '',
                color: selectedStockProduct.color || '',
                product_description: selectedStockProduct.description || '',
                unit_price: nextUnitPrice,
                total_amount: computedTotal || '',
            };
        });
    }, [selectedStockProduct]);

    useEffect(() => {
        if (!selectedStockCompany) return;

        setStockOrderForm((current) => {
            if (
                current.company_name === (selectedStockCompany.company_name || '') &&
                current.company_email === (selectedStockCompany.company_email || '')
            ) {
                return current;
            }

            return {
                ...current,
                company_name: selectedStockCompany.company_name || '',
                company_email: selectedStockCompany.company_email || '',
            };
        });
    }, [selectedStockCompany]);

    useEffect(() => {
        if (salaryEligibleEmployees.some((employee) => employee.id === salaryGenerationEmployeeId)) {
            return;
        }

        setSalaryGenerationEmployeeId(salaryEligibleEmployees[0]?.id || '');
    }, [salaryEligibleEmployees, salaryGenerationEmployeeId]);

    useEffect(() => {
        if (saleForm.sale_mode !== 'INSTALLMENT') return;

        const totalInstallmentPrice = Math.max(Number(saleForm.vehicle_price || 0), 0);
        const downPayment = Math.min(Number(saleForm.down_payment || 0), totalInstallmentPrice);
        const financedAmount = Math.max(roundCurrencyValue(totalInstallmentPrice - downPayment), 0);
        const installmentMonths = Math.max(Number(saleForm.installment_months || 12), 1);
        const monthlyInstallment = financedAmount > 0
            ? roundCurrencyValue(financedAmount / installmentMonths)
            : 0;

        setSaleForm((current) => {
            const nextFinancedAmount = financedAmount ? String(financedAmount) : '0';
            const nextMonthlyInstallment = monthlyInstallment ? String(monthlyInstallment) : '0';
            const nextInstallmentMonths = current.installment_months || '12';

            if (
                current.financed_amount === nextFinancedAmount &&
                current.monthly_installment === nextMonthlyInstallment &&
                current.installment_months === nextInstallmentMonths
            ) {
                return current;
            }

            return {
                ...current,
                financed_amount: nextFinancedAmount,
                monthly_installment: nextMonthlyInstallment,
                installment_months: nextInstallmentMonths,
            };
        });
    }, [saleForm.down_payment, saleForm.installment_months, saleForm.sale_mode, saleForm.vehicle_price]);

    useEffect(() => {
        const themeExists = dashboardThemes.some((theme) => theme.key === dashboardTheme);
        const nextTheme = themeExists ? dashboardTheme : 'sandstone';

        if (nextTheme !== dashboardTheme) {
            setDashboardTheme(nextTheme);
            return;
        }

        if (hasThemePreference) {
            localStorage.setItem(DASHBOARD_THEME_STORAGE_KEY, nextTheme);
        } else {
            localStorage.removeItem(DASHBOARD_THEME_STORAGE_KEY);
        }
    }, [dashboardTheme, hasThemePreference]);

    useEffect(() => {
        if (hasThemePreference) {
            return;
        }

        const dealerTheme = dashboardThemes.some((theme) => theme.key === user?.theme_key)
            ? user.theme_key
            : 'sandstone';

        if (dealerTheme !== dashboardTheme) {
            setDashboardTheme(dealerTheme);
        }
    }, [dashboardTheme, hasThemePreference, user?.theme_key]);

    useEffect(() => {
        setPendingDashboardTheme(dashboardTheme);
    }, [dashboardTheme]);

    useEffect(() => {
        if (!user) return;

        setProfileForm({
            full_name: user.full_name || '',
            email: user.email || '',
            brand_name: user.brand_name || '',
            brand_logo_url: user.brand_logo_url || '',
            brand_address: user.brand_address || '',
            password: '',
        });
    }, [user?.id, user?.full_name, user?.email, user?.brand_name, user?.brand_logo_url, user?.brand_address]);

    useEffect(() => {
        if (!notificationsOpen) {
            return;
        }

        const handleOutsideNotifications = () => {
            setNotificationsOpen(false);
        };

        window.addEventListener('click', handleOutsideNotifications);
        return () => window.removeEventListener('click', handleOutsideNotifications);
    }, [notificationsOpen]);

    useEffect(() => {
        if (!profilePanelOpen) {
            return;
        }

        const handleOutsideProfile = () => {
            setProfilePanelOpen(false);
        };

        window.addEventListener('click', handleOutsideProfile);
        return () => window.removeEventListener('click', handleOutsideProfile);
    }, [profilePanelOpen]);

    useEffect(() => {
        if (!salesVehicleDropdownOpen) {
            return;
        }

        const handleOutsideSalesVehicleDropdown = () => {
            setSalesVehicleDropdownOpen(false);
        };

        window.addEventListener('click', handleOutsideSalesVehicleDropdown);
        return () => window.removeEventListener('click', handleOutsideSalesVehicleDropdown);
    }, [salesVehicleDropdownOpen]);

    const installmentPreview = useMemo(() => {
        if (saleForm.sale_mode !== 'INSTALLMENT' || !saleForm.first_due_date || !saleForm.installment_months || !saleForm.monthly_installment) {
            return [];
        }

        return Array.from({ length: Number(saleForm.installment_months) || 0 }, (_, index) => {
            const dueDate = new Date(saleForm.first_due_date);
            dueDate.setMonth(dueDate.getMonth() + index);
            return {
                installment_number: index + 1,
                due_date: dueDate.toISOString().slice(0, 10),
                amount: saleForm.monthly_installment,
            };
        });
    }, [saleForm.first_due_date, saleForm.installment_months, saleForm.monthly_installment, saleForm.sale_mode]);

    const resetCustomerForm = ({ preserveSelection = false } = {}) => {
        const defaultDealerId = currentProfileDealerId || user?.dealer_id || '';
        const shouldPresetOwnership = !isSuperAdmin || !canUnlockCustomerOwnership;
        setCustomerForm({
            ...emptyCustomerForm,
            dealer_id: shouldPresetOwnership ? defaultDealerId : '',
            created_by_agent: shouldPresetOwnership ? (user?.id || '') : '',
        });
        setCustomerMessage('');
        if (!preserveSelection) {
            setSelectedCustomerId('');
        }
    };
    useEffect(() => {
        setCustomerForm((current) => {
            if (current.id) {
                return current;
            }
            const nextDealerId = currentProfileDealerId || user?.dealer_id || '';
            const nextOwnerId = user?.id || '';
            if (!nextDealerId) {
                return current;
            }
            const shouldPresetOwnership = !isSuperAdmin || !canUnlockCustomerOwnership;
            const nextFormState = shouldPresetOwnership
                ? {
                    ...current,
                    dealer_id: nextDealerId,
                    created_by_agent: nextOwnerId,
                }
                : {
                    ...current,
                    dealer_id: current.dealer_id || nextDealerId,
                    created_by_agent: current.created_by_agent || nextOwnerId,
                };
            if (current.dealer_id === nextFormState.dealer_id && current.created_by_agent === nextFormState.created_by_agent) {
                return current;
            }
            return nextFormState;
        });
    }, [canUnlockCustomerOwnership, currentProfileDealerId, isSuperAdmin, user?.dealer_id, user?.id]);

    const resetEmployeeForm = ({ preserveSelection = false } = {}) => {
        setEmployeeForm({
            ...emptyEmployeeForm,
            dealer_id: canUnlockEmployeeSecurityFields ? (isSuperAdmin ? '' : (user?.dealer_id || '')) : (currentProfileDealerId || user?.dealer_id || ''),
            role_id: canUnlockEmployeeSecurityFields ? '' : defaultAgentRoleId,
            is_active: true,
        });
        setEmployeeMessage('');
        setEmployeeAccessPopupOpen(false);
        if (!preserveSelection) {
            setSelectedEmployeeId('');
        }
    };
    useEffect(() => {
        setEmployeeForm((current) => {
            if (current.id || canUnlockEmployeeSecurityFields) {
                return current;
            }
            const nextDealerId = currentProfileDealerId || user?.dealer_id || '';
            const nextRoleId = current.role_id || defaultAgentRoleId;
            if (current.dealer_id === nextDealerId && current.role_id === nextRoleId && current.is_active === true) {
                return current;
            }
            return {
                ...current,
                dealer_id: nextDealerId,
                role_id: nextRoleId,
                is_active: true,
            };
        });
    }, [canUnlockEmployeeSecurityFields, currentProfileDealerId, defaultAgentRoleId, user?.dealer_id]);

    const resetAdvanceForm = () => {
        setAdvanceForm({ amount: '', reason: '', advance_date: new Date().toISOString().slice(0, 10) });
    };

    const resetProductForm = () => {
        setProductForm({
            ...emptyProductForm,
            vehicle_type: dashboardData.vehicleTypes?.[0]?.type_key || '',
        });
        setProductMessage('');
    };

    const resetCompanyForm = () => {
        setCompanyForm(emptyCompanyForm);
        setCompanyMessage('');
    };

    const resetSaleForm = () => {
        setSaleForm({
            ...emptySaleForm,
            dealer_signature_url: currentSalesDealerSignatureUrl,
        });
        setEditingSaleVehicle(null);
        setSaleFormReadOnly(false);
        setSaleMessage('');
    };

    const resetStockOrderForm = () => {
        setStockOrderForm(emptyStockOrderForm);
        setStockMessage('');
    };

    const resetDealerForm = () => {
        setDealerForm(emptyDealerForm);
        setDealerMessage('');
    };

    const resetWorkflowDefinitionForm = () => {
        setWorkflowDefinitionForm({
            ...emptyWorkflowDefinitionForm,
            dealer_id: isSuperAdmin ? '' : (user?.dealer_id || ''),
        });
        setWorkflowMessage('');
    };

    const handleEditDealer = (dealer) => {
        setDealerForm({
            id: dealer.id || '',
            dealer_name: dealer.dealer_name || '',
            theme_key: dealer.theme_key || 'sandstone',
            dealer_logo_url: dealer.dealer_logo_url || '',
            dealer_signature_url: dealer.dealer_signature_url || '',
            dealer_address: dealer.dealer_address || '',
            dealer_cnic: dealer.dealer_cnic || '',
            mobile_country: dealer.mobile_country || 'QATAR',
            mobile_country_code: dealer.mobile_country_code || '+974',
            mobile_number: dealer.mobile_number || '',
            currency_code: dealer.currency_code || 'QAR',
            contact_email: dealer.contact_email || '',
            admin_full_name: dealer.admin_full_name || '',
            admin_email: dealer.admin_email || '',
            admin_password: '',
            admin_role_id: dealer.admin_role_id ? String(dealer.admin_role_id) : '4',
            backup_directory: '',
            notes: dealer.notes || '',
            is_active: dealer.is_active ?? true,
        });
        setDealerMessage(`Editing ${dealer.dealer_name}`);
        goToPage('dealers');
    };

    const handleDeleteDealer = async (dealer) => {
        if (!canManageDealers) {
            setDealerMessage('Only the super admin can delete dealer applications.');
            return;
        }

        const shouldDelete = window.confirm(`Delete dealer "${dealer.dealer_name}"?`);
        if (!shouldDelete) return;

        try {
            await API.delete(`/dealers/${dealer.id}`);
            if (dealerForm.id === dealer.id) {
                resetDealerForm();
            }
            await loadDashboard();
            setDealerMessage(`Deleted ${dealer.dealer_name}.`);
        } catch (err) {
            setDealerMessage(
                err.response?.data?.error ||
                err.response?.data?.message ||
                'Unable to delete dealer application.'
            );
        }
    };

    const handleCustomerChange = (event) => {
        const { name, value } = event.target;
        setCustomerForm((current) => {
            if (name === 'dealer_id') {
                return {
                    ...current,
                    dealer_id: value,
                    created_by_agent: current.dealer_id === value ? current.created_by_agent : '',
                };
            }
            return { ...current, [name]: value };
        });
    };

    const handleEmployeeChange = (event) => {
        const { name, type, value, checked } = event.target;
        setEmployeeForm((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleProductChange = (event) => {
        const { name, value } = event.target;
        setProductForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleCompanyChange = (event) => {
        const { name, value } = event.target;
        setCompanyForm((current) => ({ ...current, [name]: value }));
    };

    const handleEditCompany = (company) => {
        setCompanyForm({
            id: company.id || '',
            company_name: company.company_name || '',
            company_email: company.company_email || '',
            contact_person: company.contact_person || '',
            phone: company.phone || '',
            address: company.address || '',
            notes: company.notes || '',
        });
        setCompanyMessage(`Editing ${company.company_name}`);
        goToPage('companies');
    };

    const handleDeleteCompany = async (company) => {
        const shouldDelete = window.confirm(`Delete company "${company.company_name}"?`);
        if (!shouldDelete) return;

        try {
            await API.delete(`/companies/${company.id}`);
            if (companyForm.id === company.id) {
                resetCompanyForm();
            }
            await loadDashboard();
            setCompanyMessage(`Deleted ${company.company_name}.`);
        } catch (err) {
            setCompanyMessage(err.response?.data?.message || 'Unable to delete company profile.');
        }
    };

    const handleSaleChange = (event) => {
        const { name, value } = event.target;
        setSaleForm((current) => {
            if (name === 'customer_id') {
                const selectedCustomer = (dashboardData.customers || []).find((customer) => customer.id === value);
                return {
                    ...current,
                    customer_id: value,
                    customer_cnic_front_url: selectedCustomer?.identity_doc_url || '',
                    customer_cnic_back_url: selectedCustomer?.ocr_details?.identity_doc_back_url || '',
                };
            }

            if (name === 'sale_mode') {
                const nextMonths = current.installment_months || '12';
                const actualPrice = Number(selectedSaleVehicle?.purchase_price || 0);
                const cashMarginValue = Number(selectedSaleVehicle?.cash_markup_value || 0);
                const cashMarginPercent = Number(selectedSaleVehicle?.cash_markup_percent || 0);
                const installmentPercent = Number(selectedSaleVehicle?.installment_markup_percent || 0);
                const installmentMonthsDefault = Number(selectedSaleVehicle?.installment_months || 0) || 12;

                const cashSellPrice = actualPrice > 0
                    ? cashMarginValue > 0
                        ? actualPrice + cashMarginValue
                        : actualPrice * (1 + cashMarginPercent / 100)
                    : 0;
                const installmentSellPrice = actualPrice > 0 ? actualPrice * (1 + installmentPercent / 100) : 0;

                return {
                    ...current,
                    sale_mode: value,
                    down_payment: value === 'CASH' ? '' : current.down_payment,
                    financed_amount: value === 'CASH' ? '' : current.financed_amount,
                    monthly_installment: value === 'CASH' ? '' : current.monthly_installment,
                    installment_months: value === 'CASH' ? '' : (current.installment_months || String(installmentMonthsDefault) || nextMonths),
                    first_due_date: value === 'CASH' ? '' : current.first_due_date,
                    vehicle_price: value === 'CASH'
                        ? (cashSellPrice > 0 ? String(cashSellPrice) : current.vehicle_price)
                        : (installmentSellPrice > 0 ? String(installmentSellPrice) : current.vehicle_price),
                };
            }

            if (name === 'down_payment' || name === 'installment_months' || name === 'first_due_date') {
                return {
                    ...current,
                    [name]: value,
                };
            }

            return { ...current, [name]: value };
        });
    };

    const handleStockOrderChange = (event) => {
        const { name, value } = event.target;

        setStockOrderForm((current) => {
            if (name === 'company_profile_id') {
                const selectedCompany = (dashboardData.companies || []).find((company) => company.id === value);
                return {
                    ...current,
                    company_profile_id: value,
                    company_name: selectedCompany?.company_name || '',
                    company_email: selectedCompany?.company_email || '',
                };
            }

            if (name === 'product_id') {
                const selectedProduct = (dashboardData.products || []).find((product) => product.id === value);
                const nextUnitPrice = Number(selectedProduct?.purchase_price || 0);

                return {
                    ...current,
                    product_id: value,
                    vehicle_type: selectedProduct?.vehicle_type || '',
                    brand: selectedProduct?.brand || '',
                    model: selectedProduct?.model || '',
                    color: selectedProduct?.color || '',
                    product_description: selectedProduct?.description || '',
                    unit_price: nextUnitPrice ? String(nextUnitPrice) : '',
                    total_amount: nextUnitPrice > 0 ? String(nextUnitPrice) : '',
                };
            }

            const nextState = { ...current, [name]: value };
            const unitPrice = Number(nextState.unit_price || 0);

            if (name === 'unit_price') {
                nextState.total_amount = unitPrice > 0 ? String(unitPrice) : '';
            }

            return nextState;
        });
    };

    const handleDealerChange = (event) => {
        const { name, type, value, checked } = event.target;
        if (name === 'mobile_country') {
            setDealerForm((current) => ({
                ...current,
                mobile_country: value,
                mobile_country_code: dealerCountryCodeMap[value] || current.mobile_country_code || '',
            }));
            return;
        }
        setDealerForm((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleWorkflowDefinitionChange = (event) => {
        const { name, type, value, checked } = event.target;
        setWorkflowDefinitionForm((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleEditWorkflowDefinition = (definition) => {
        setWorkflowDefinitionForm({
            id: definition.id || '',
            definition_name: definition.definition_name || '',
            workflow_type: definition.workflow_type || 'SALE_APPROVAL',
            dealer_id: definition.dealer_id || '',
            requester_role_name: definition.requester_role_name || 'AGENT',
            first_approver_role_name: definition.first_approver_role_name || 'MANAGER',
            second_approver_role_name: definition.second_approver_role_name || '',
            is_active: definition.is_active ?? true,
        });
        setWorkflowMessage(`Editing ${definition.definition_name}`);
    };

    const handleProfileChange = (event) => {
        const { name, value } = event.target;
        setProfileForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSuperAdminProfileSwitch = async (event) => {
        const nextDealerId = event.target.value || null;

        try {
            setSwitchingProfile(true);
            const { data } = await API.post('/auth/switch-profile', {
                dealer_id: nextDealerId,
            });

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setDashboardData((current) => ({
                ...current,
                user: data.user,
            }));
            setProfileMessage(nextDealerId ? `Dealer profile loaded: ${data.user?.dealer_name || 'Dealer'}` : 'Switched back to super admin profile.');
            await loadDashboard();
        } catch (err) {
            setProfileMessage(err.response?.data?.message || 'Unable to switch profile right now.');
        } finally {
            setSwitchingProfile(false);
        }
    };

    const handleRevertSuperAdminProfile = async () => {
        try {
            setSwitchingProfile(true);
            const { data } = await API.post('/auth/switch-profile', {
                dealer_id: null,
            });

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setDashboardData((current) => ({
                ...current,
                user: data.user,
            }));
            setProfileMessage('Switched back to super admin profile.');
            await loadDashboard();
        } catch (err) {
            setProfileMessage(err.response?.data?.message || 'Unable to switch back to super admin profile right now.');
        } finally {
            setSwitchingProfile(false);
        }
    };

    const handleVehicleTypeSubmit = async (event) => {
        event.preventDefault();

        if (!newVehicleType.trim()) {
            setVehicleTypeMessage('Vehicle type name is required.');
            return;
        }

        try {
            setSavingVehicleType(true);
            await API.post('/products/vehicle-types', {
                display_name: newVehicleType.trim(),
            });
            await loadDashboard();
            setVehicleTypeMessage('Vehicle type saved successfully.');
            setNewVehicleType('');
        } catch (err) {
            setVehicleTypeMessage(err.response?.data?.message || 'Unable to save vehicle type.');
        } finally {
            setSavingVehicleType(false);
        }
    };

    const handleWorkflowDefinitionSubmit = async (event) => {
        event.preventDefault();

        if (!workflowDefinitionForm.definition_name.trim()) {
            setWorkflowMessage('Workflow name is required.');
            return;
        }

        try {
            setSavingWorkflowDefinition(true);
            await API.post('/workflow/definitions', {
                ...workflowDefinitionForm,
                dealer_id: isSuperAdmin ? (workflowDefinitionForm.dealer_id || null) : (user?.dealer_id || null),
            });
            await loadDashboard();
            resetWorkflowDefinitionForm();
            setWorkflowMessage('Workflow definition saved successfully.');
        } catch (err) {
            setWorkflowMessage(err.response?.data?.message || 'Unable to save workflow definition.');
        } finally {
            setSavingWorkflowDefinition(false);
        }
    };

    const handleWorkflowTaskAction = async (taskId, action) => {
        const notePrompt = action === 'approve'
            ? 'Approval notes (optional):'
            : 'Rejection reason:';
        const decisionNotes = window.prompt(notePrompt, '') ?? '';

        if (action === 'reject' && !decisionNotes.trim()) {
            setWorkflowMessage('Rejection reason is required.');
            return;
        }

        try {
            setProcessingWorkflowTaskId(taskId);
            await API.patch(`/workflow/tasks/${taskId}/${action}`, {
                decision_notes: decisionNotes.trim(),
            });
            await loadDashboard();
            setWorkflowMessage(action === 'approve' ? 'Workflow task approved.' : 'Workflow task rejected.');
        } catch (err) {
            setWorkflowMessage(err.response?.data?.message || 'Unable to process workflow task.');
        } finally {
            setProcessingWorkflowTaskId('');
        }
    };

    const handleEmployeeFeatureToggle = (featureId) => {
        setEmployeeForm((current) => {
            const exists = current.feature_ids.includes(featureId);
            return {
                ...current,
                feature_ids: exists
                    ? current.feature_ids.filter((id) => id !== featureId)
                    : [...current.feature_ids, featureId],
            };
        });
    };

    const handleEmployeeDeniedFeatureToggle = (featureId) => {
        setEmployeeForm((current) => {
            const exists = current.denied_feature_ids.includes(featureId);
            return {
                ...current,
                denied_feature_ids: exists
                    ? current.denied_feature_ids.filter((id) => id !== featureId)
                    : [...current.denied_feature_ids, featureId],
            };
        });
    };

    const handleRoleFeatureToggle = (roleId, featureId) => {
        setRoleAssignments((current) => {
            const currentFeatures = current[roleId] || [];
            const exists = currentFeatures.includes(featureId);

            return {
                ...current,
                [roleId]: exists
                    ? currentFeatures.filter((id) => id !== featureId)
                    : [...currentFeatures, featureId],
            };
        });
    };

    const handleSaveRolePermissions = async (roleId) => {
        if (!canManageAccess) {
            setAccessMessage('Only the super admin can assign roles and features.');
            return;
        }

        try {
            setSavingAccess(true);
            const { data } = await API.put(`/admin/access/roles/${roleId}`, {
                feature_ids: roleAssignments[roleId] || [],
            });

            setDashboardData((current) => ({
                ...current,
                rolePermissions: data.rolePermissions,
            }));
            setAccessMessage('Role permissions updated successfully.');
        } catch (err) {
            setAccessMessage(err.response?.data?.message || 'Unable to update role permissions.');
        } finally {
            setSavingAccess(false);
        }
    };
    const openAccessPopup = (roleId, pageKey) => {
        setActiveAccessPopup({ roleId, pageKey });
    };
    const closeAccessPopup = () => {
        setActiveAccessPopup(null);
    };
    const markNotificationsAsSeen = async (notificationKeys = []) => {
        const keysToMark = [...new Set((notificationKeys.length > 0 ? notificationKeys : unreadNotifications.map((item) => item.id))
            .map((value) => String(value || '').trim())
            .filter(Boolean))];

        if (keysToMark.length === 0) {
            return;
        }

        try {
            const { data } = await API.post('/admin/notifications/read', {
                notification_keys: keysToMark,
            });
            setReadNotificationKeys(data.notificationReadKeys || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to update notification read status.');
        }
    };
    const handleNotificationClick = async (item) => {
        if (item.pageKey === 'user-tasks' && item.taskId) {
            setSelectedWorkflowTaskId(item.taskId);
        }
        goToPage(item.pageKey);
        setNotificationsOpen(false);
        await markNotificationsAsSeen([item.id]);
    };
    const toggleNotificationsPanel = () => {
        setNotificationsOpen((current) => !current);
        setProfilePanelOpen(false);
    };

    const toggleProfilePanel = () => {
        setProfilePanelOpen((current) => !current);
        setNotificationsOpen(false);
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleEditCustomer = (customer) => {
        if (!canEditCustomerRecord) {
            setCustomerMessage('Your account does not have permission to edit customer records.');
            return;
        }

        const mapped = mapCustomerFromApi(customer);
        setCustomerForm(mapped);
        setSelectedCustomerId(customer.id);
        goToPage('customers');
        setCustomerMessage(`Editing ${customer.full_name}`);
    };

    const handleEditEmployee = (employee) => {
        if (!canEditEmployees) {
            setEmployeeMessage('Only the super admin can edit employee records.');
            return;
        }

        setEmployeeForm(mapEmployeeFromApi(employee));
        setSelectedEmployeeId(employee.id);
        goToPage('employees');
        setEmployeeMessage(`Editing ${employee.full_name}`);
    };

    const handleEditProduct = (product) => {
        setProductForm({
            id: product.id || '',
            brand: product.brand || '',
            model: product.model || '',
            vehicle_type: product.vehicle_type || '',
            color: product.color || '',
            description: product.description || '',
            image_url: product.image_url || '',
            monthly_rate: String(product.monthly_rate || ''),
            purchase_price: String(product.purchase_price || ''),
            cash_markup_percent: String(product.cash_markup_percent ?? ''),
            cash_markup_value: String(product.cash_markup_value ?? ''),
            installment_markup_percent: String(product.installment_markup_percent ?? ''),
            installment_months: String(product.installment_months ?? '12'),
            status: product.status || 'AVAILABLE',
        });
        setProductMessage(`Editing ${[product.brand, product.model].filter(Boolean).join(' ')}`);
        goToPage('products');
    };

    const handleEditSale = (sale) => {
        if (!canUpdateSalesRegister || !canViewSalesAgreementForm) {
            setSaleMessage('Your account does not have permission to update sales transactions.');
            return;
        }

        const resolvedVehicleId = resolveVehicleIdFromSale(sale, dashboardData.inventory);

        setSaleForm({
            id: sale.id,
            customer_id: sale.customer_id || '',
            vehicle_id: resolvedVehicleId,
            sale_mode: sale.sale_mode || 'CASH',
            agreement_number: sale.agreement_number || '',
            agreement_date: sale.agreement_date ? String(sale.agreement_date).slice(0, 10) : new Date().toISOString().slice(0, 10),
            purchase_date: sale.purchase_date ? String(sale.purchase_date).slice(0, 10) : new Date().toISOString().slice(0, 10),
            agreement_pdf_url: sale.agreement_pdf_url || '',
            dealer_signature_url: sale.dealer_signature_url || currentSalesDealerSignatureUrl,
            authorized_signature_url: sale.authorized_signature_url || '',
            customer_cnic_front_url: sale.customer_cnic_front_url || '',
            customer_cnic_back_url: sale.customer_cnic_back_url || '',
            bank_check_url: sale.bank_check_url || '',
            misc_document_url: sale.misc_document_url || '',
            vehicle_price: String(sale.vehicle_price || ''),
            down_payment: String(sale.down_payment || ''),
            financed_amount: String(sale.financed_amount || ''),
            monthly_installment: String(sale.monthly_installment || ''),
            installment_months: String(sale.installment_months || ''),
            first_due_date: sale.first_due_date ? String(sale.first_due_date).slice(0, 10) : '',
            witness_name: sale.witness_name || '',
            witness_cnic: sale.witness_cnic || '',
            witness_two_name: sale.witness_two_name || '',
            witness_two_cnic: sale.witness_two_cnic || '',
            remarks: sale.remarks || '',
        });
        setEditingSaleVehicle({
            id: resolvedVehicleId,
            brand: sale.brand || '',
            model: sale.model || '',
            registration_number: sale.registration_number || '',
            vehicle_type: sale.vehicle_type || '',
            chassis_number: sale.chassis_number || '',
            engine_number: sale.engine_number || '',
            image_url: sale.image_url || '',
            status: sale.sale_mode === 'CASH' ? 'SOLD' : 'INSTALLMENT',
            purchase_price: sale.vehicle_price || 0,
            monthly_rate: sale.monthly_installment || 0,
        });
        setSaleFormReadOnly(false);
        goToPage('sales');
        setSaleMessage(`Updating sale for ${sale.customer_name}`);
    };

    const handleViewSale = (sale) => {
        if (!canOpenSalesWorkspace || (!canViewSalesAgreementSummary && !canViewSalesRegister && !canViewSalesAgreementForm)) {
            setSaleMessage('Your account does not have permission to view sales transactions.');
            return;
        }

        const resolvedVehicleId = resolveVehicleIdFromSale(sale, dashboardData.inventory);

        setSaleForm({
            id: sale.id,
            customer_id: sale.customer_id || '',
            vehicle_id: resolvedVehicleId,
            sale_mode: sale.sale_mode || 'CASH',
            agreement_number: sale.agreement_number || '',
            agreement_date: sale.agreement_date ? String(sale.agreement_date).slice(0, 10) : new Date().toISOString().slice(0, 10),
            purchase_date: sale.purchase_date ? String(sale.purchase_date).slice(0, 10) : new Date().toISOString().slice(0, 10),
            agreement_pdf_url: sale.agreement_pdf_url || '',
            dealer_signature_url: sale.dealer_signature_url || currentSalesDealerSignatureUrl,
            authorized_signature_url: sale.authorized_signature_url || '',
            customer_cnic_front_url: sale.customer_cnic_front_url || '',
            customer_cnic_back_url: sale.customer_cnic_back_url || '',
            bank_check_url: sale.bank_check_url || '',
            misc_document_url: sale.misc_document_url || '',
            vehicle_price: String(sale.vehicle_price || ''),
            down_payment: String(sale.down_payment || ''),
            financed_amount: String(sale.financed_amount || ''),
            monthly_installment: String(sale.monthly_installment || ''),
            installment_months: String(sale.installment_months || ''),
            first_due_date: sale.first_due_date ? String(sale.first_due_date).slice(0, 10) : '',
            witness_name: sale.witness_name || '',
            witness_cnic: sale.witness_cnic || '',
            witness_two_name: sale.witness_two_name || '',
            witness_two_cnic: sale.witness_two_cnic || '',
            remarks: sale.remarks || '',
        });
        setEditingSaleVehicle({
            id: resolvedVehicleId,
            brand: sale.brand || '',
            model: sale.model || '',
            registration_number: sale.registration_number || '',
            vehicle_type: sale.vehicle_type || '',
            chassis_number: sale.chassis_number || '',
            engine_number: sale.engine_number || '',
            image_url: sale.image_url || '',
            status: sale.sale_mode === 'CASH' ? 'SOLD' : 'INSTALLMENT',
            purchase_price: sale.vehicle_price || 0,
            monthly_rate: sale.monthly_installment || 0,
        });
        setSaleFormReadOnly(true);
        goToPage('sales');
        setSaleMessage(`Viewing sale for ${sale.customer_name}`);
    };

    const handleProcessOcr = () => {
        if (!canUseOcr) {
            setCustomerMessage('Your account does not have CNIC and Passport Scanning access.');
            return;
        }

        if (!customerForm.raw_ocr_text.trim()) {
            setCustomerMessage('Paste OCR text from a CNIC image scan first.');
            return;
        }

        const extracted = extractOcrFields(customerForm.raw_ocr_text, customerForm.document_type, 'MANUAL');
        setCustomerForm((current) => ({
            ...current,
            document_type: extracted.document_type,
            cnic_passport_number: extracted.cnic_passport_number || current.cnic_passport_number,
            contact_email: extracted.contact_email || current.contact_email,
            contact_phone: extracted.contact_phone || current.contact_phone,
            gender: extracted.gender || current.gender,
            country: extracted.country || current.country,
            address: extracted.address || current.address,
            date_of_birth: extracted.date_of_birth || current.date_of_birth,
            extracted_name: extracted.extracted_name || current.extracted_name,
            father_name: extracted.father_name || current.father_name,
            full_name: extracted.extracted_name || current.full_name,
        }));
        setCustomerMessage('OCR text processed. Review the extracted fields before saving.');
    };

    const handleCaptureFingerprint = async () => {
        if (!canCreateCustomerBiometric) {
            setCustomerMessage('Your account does not have customer biometric creation access.');
            return;
        }

        try {
            setUploadingCustomerAsset(true);
            const bridgeCapture = await captureFingerprintFromBridge();
            const templateSeed = bridgeCapture.template || customerForm.fingerprint_seed.trim();

            if (!templateSeed) {
                throw new Error('The thumb device did not return enrollment data.');
            }

            const biometricHash = await hashFingerprintSeed(templateSeed);
            let thumbUrl = customerForm.fingerprint_thumb_url;

            if (bridgeCapture.imageDataUrl) {
                const thumbFile = await dataUrlToFile(bridgeCapture.imageDataUrl, `fingerprint-${Date.now()}.png`);
                const uploadedThumb = await uploadCustomerAssetFile(thumbFile, 'THUMB');
                thumbUrl = uploadedThumb.url || thumbUrl;
            } else if (bridgeCapture.imageUrl) {
                thumbUrl = bridgeCapture.imageUrl;
            }

            setCustomerForm((current) => ({
                ...current,
                biometric_hash: biometricHash,
                fingerprint_seed: templateSeed,
                fingerprint_status: 'ENROLLED',
                fingerprint_quality: bridgeCapture.quality || current.fingerprint_quality || 'HIGH',
                fingerprint_device: bridgeCapture.device || current.fingerprint_device || 'Biometric Device',
                fingerprint_thumb_url: thumbUrl || current.fingerprint_thumb_url,
            }));
            setCustomerMessage('Fingerprint scanned successfully and ready to save.');
            window.alert('Fingerprint scan completed successfully.');
            return;
        } catch (bridgeError) {
            const manualSeed = customerForm.fingerprint_seed.trim();
            if (!manualSeed) {
                const failureMessage = bridgeError.message || 'Thumb device service is not operational. Start the biometric device service or use thumb upload.';
                setCustomerMessage(failureMessage);
                window.alert(failureMessage);
                return;
            }

            const biometricHash = await hashFingerprintSeed(manualSeed);
            setCustomerForm((current) => ({
                ...current,
                biometric_hash: biometricHash,
                fingerprint_status: 'ENROLLED',
                fingerprint_quality: current.fingerprint_quality || 'HIGH',
            }));
            setCustomerMessage(`${bridgeError.message || 'Thumb device service is not operational.'} Manual fingerprint seed hashed instead.`);
        } finally {
            setUploadingCustomerAsset(false);
        }
    };

    const handleCustomerSubmit = async (event) => {
        event.preventDefault();

        if (!customerForm.full_name.trim() || !customerForm.cnic_passport_number.trim()) {
            setCustomerMessage('Customer name and CNIC/Passport number are required.');
            return;
        }

        if (!customerForm.id && !canManageCustomers) {
            setCustomerMessage('Your account does not have permission to create new customers.');
            return;
        }

        if (customerForm.id && !canEditCustomerRecord) {
            setCustomerMessage('Your account does not have permission to update customer records.');
            return;
        }

        const payload = {
            created_by_agent: canUnlockCustomerOwnership ? (customerForm.created_by_agent || null) : undefined,
            full_name: customerForm.full_name.trim(),
            cnic_passport_number: customerForm.cnic_passport_number.trim(),
            identity_doc_url: customerForm.identity_doc_url.trim(),
            identity_doc_back_url: customerForm.identity_doc_back_url.trim(),
            biometric_hash: customerForm.biometric_hash,
            document_type: customerForm.document_type,
            contact_email: customerForm.contact_email.trim(),
            contact_phone: customerForm.contact_phone.trim(),
            gender: customerForm.gender.trim(),
            country: customerForm.country.trim(),
            address: customerForm.address.trim(),
            date_of_birth: customerForm.date_of_birth.trim(),
            extracted_name: customerForm.extracted_name.trim(),
            father_name: customerForm.father_name.trim(),
            raw_ocr_text: customerForm.raw_ocr_text,
            fingerprint_status: customerForm.fingerprint_status,
            fingerprint_quality: customerForm.fingerprint_quality.trim(),
            fingerprint_device: customerForm.fingerprint_device.trim(),
            fingerprint_thumb_url: customerForm.fingerprint_thumb_url.trim(),
            signature_image_url: customerForm.signature_image_url.trim(),
        };

        try {
            setSavingCustomer(true);
            let response;

            if (customerForm.id) {
                response = await API.put(`/customers/${customerForm.id}`, payload);
                setCustomerMessage('Customer updated successfully.');
            } else {
                response = await API.post('/customers', payload);
                setCustomerMessage('Customer created successfully.');
            }

            await loadDashboard();
            setSelectedCustomerId(response.data.id);
            resetCustomerForm({ preserveSelection: true });
        } catch (err) {
            const status = err.response?.status;
            const apiMessage = err.response?.data?.message;
            const apiError = err.response?.data?.error;
            const existingCustomer = err.response?.data?.existing_customer;

            if (status === 409 && existingCustomer?.id) {
                try {
                    // Ensure the existing customer is present in the in-memory list even if the dashboard payload is limited/scoped.
                    const { data } = await API.get(`/customers/${existingCustomer.id}`);
                    setDashboardData((current) => {
                        const existing = (current.customers || []).some((c) => c.id === data.id);
                        return {
                            ...current,
                            customers: existing ? current.customers : [data, ...(current.customers || [])],
                        };
                    });
                    setSelectedCustomerId(existingCustomer.id);
                    setSearchTerm(String(existingCustomer.cnic_passport_number || customerForm.cnic_passport_number || '').trim());
                    setCustomerMessage(apiMessage || 'Customer already exists. Opened the existing record.');
                    return;
                } catch (_) {
                    // fall through to normal error message
                }
            }

            if (status === 409 && !existingCustomer?.id) {
                // Some scopes (or older servers) may not return existing_customer. Try to locate it by CNIC within
                // the caller's accessible customer list, then open it.
                try {
                    const normalized = normalizeIdentityNumber(customerForm.cnic_passport_number);
                    if (normalized) {
                        const { data } = await API.get('/customers');
                        const match = (data || []).find((c) => normalizeIdentityNumber(c?.cnic_passport_number) === normalized);
                        if (match?.id) {
                            setDashboardData((current) => {
                                const already = (current.customers || []).some((c) => c.id === match.id);
                                return {
                                    ...current,
                                    customers: already ? current.customers : [match, ...(current.customers || [])],
                                };
                            });
                            setSelectedCustomerId(match.id);
                            setSearchTerm(customerForm.cnic_passport_number.trim());
                            setCustomerMessage(apiMessage || 'Customer already exists. Opened the existing record.');
                            return;
                        }
                    }
                } catch (_) {
                    // ignore and show normal error
                }
            }

            setCustomerMessage(
                apiError
                    ? `${apiMessage || 'Unable to save customer.'} (${apiError})`
                    : (apiMessage || 'Unable to save customer right now.')
            );
        } finally {
            setSavingCustomer(false);
        }
    };

    const handleDeleteCustomer = async (customer) => {
        if (!canDeleteCustomerRecord) {
            setCustomerMessage('Your account does not have permission to delete customer records.');
            return;
        }

        const shouldDelete = window.confirm(`Delete customer "${customer.full_name}"?`);
        if (!shouldDelete) return;

        try {
            await API.delete(`/customers/${customer.id}`);
            setCustomerMessage(`Deleted ${customer.full_name}.`);
            if (selectedCustomerId === customer.id) {
                setSelectedCustomerId('');
            }
            if (customerForm.id === customer.id) {
                resetCustomerForm();
            }
            await loadDashboard();
        } catch (err) {
            setCustomerMessage(err.response?.data?.message || 'Unable to delete customer.');
        }
    };

    const handleEmployeeSubmit = async (event) => {
        event.preventDefault();

        if (!canManageEmployees) {
            setEmployeeMessage('Your account does not have employee management access.');
            return;
        }

        if (employeeForm.id && !canEditEmployees) {
            setEmployeeMessage('Only the super admin can edit employee records.');
            return;
        }

        if (!employeeForm.id && !canUnlockEmployeeSecurityFields) {
            setEmployeeMessage('Employee creation is blocked because the Employee Security Unlock feature is disabled for this account.');
            return;
        }

        if (!employeeForm.employee_code.trim() || !employeeForm.full_name.trim() || !employeeForm.email.trim()) {
            setEmployeeMessage('Employee code, full name, and email are required.');
            return;
        }

        if (realIsSuperAdmin && !employeeForm.dealer_id) {
            setEmployeeMessage('Select the dealer this employee belongs to.');
            return;
        }

        const payload = {
            user_id: employeeForm.user_id || null,
            password: employeeForm.password || undefined,
            dealer_id: realIsSuperAdmin ? (employeeForm.dealer_id || null) : (user?.dealer_id || null),
            employee_code: employeeForm.employee_code.trim(),
            full_name: employeeForm.full_name.trim(),
            email: employeeForm.email.trim(),
            phone: employeeForm.phone.trim(),
            cnic_number: employeeForm.cnic_number.trim(),
            cnic_doc_url: employeeForm.cnic_doc_url.trim(),
            cnic_front_url: employeeForm.cnic_front_url.trim(),
            cnic_back_url: employeeForm.cnic_back_url.trim(),
            department: employeeForm.department.trim(),
            job_title: employeeForm.job_title.trim(),
            commission_percentage: Number(employeeForm.commission_percentage || 0),
            commission_value: Number(employeeForm.commission_value || 0),
            base_salary: Number(employeeForm.base_salary || 0),
            role_id: employeeForm.role_id ? Number(employeeForm.role_id) : null,
            is_active: employeeForm.is_active,
            hired_at: employeeForm.hired_at || null,
            notes: employeeForm.notes.trim(),
            feature_ids: employeeForm.feature_ids,
            denied_feature_ids: employeeForm.denied_feature_ids,
        };

        try {
            setSavingEmployee(true);
            let response;

            if (employeeForm.id) {
                response = await API.put(`/employees/${employeeForm.id}`, payload);
                setEmployeeMessage('Employee updated successfully.');
            } else {
                response = await API.post('/employees', payload);
                setEmployeeMessage('Employee created successfully.');
            }

            await loadDashboard();
            setSelectedEmployeeId(response.data.id);
            resetEmployeeForm({ preserveSelection: true });
            setEmployeeAccessPopupOpen(false);
        } catch (err) {
            setEmployeeMessage(err.response?.data?.message || 'Unable to save employee right now.');
        } finally {
            setSavingEmployee(false);
        }
    };

    const handleAdvanceChange = (event) => {
        const { name, value } = event.target;
        setAdvanceForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleEmployeeAdvanceSubmit = async (event) => {
        event.preventDefault();

        if (!selectedEmployeeId) {
            setEmployeeMessage('Select an employee first to record advance cash.');
            return;
        }

        if (Number(advanceForm.amount || 0) <= 0) {
            setEmployeeMessage('Advance amount must be greater than zero.');
            return;
        }

        try {
            setSavingAdvance(true);
            await API.post(`/employees/${selectedEmployeeId}/advances`, {
                amount: Number(advanceForm.amount || 0),
                reason: advanceForm.reason.trim(),
                advance_date: advanceForm.advance_date || null,
            });
            await loadDashboard();
            resetAdvanceForm();
            setEmployeeMessage('Employee advance cash recorded successfully.');
        } catch (err) {
            setEmployeeMessage(err.response?.data?.message || 'Unable to record employee advance.');
        } finally {
            setSavingAdvance(false);
        }
    };

    const handleGenerateEmployeeSalary = async () => {
        if (!salaryGenerationEmployeeId) {
            setEmployeeMessage('Select an employee from the salary dropdown first.');
            return;
        }

        const payrollAlreadyExists = (dashboardData.employeePayrolls || []).some(
            (row) => row.employee_id === salaryGenerationEmployeeId && String(row.payroll_month || '') === payrollMonth
        );

        if (payrollAlreadyExists) {
            setEmployeeMessage(`Salary already generated for ${payrollMonth}.`);
            return;
        }

        try {
            setSavingPayroll(true);
            await API.post(`/employees/${salaryGenerationEmployeeId}/generate-salary`, {
                payroll_month: payrollMonth,
            });
            await loadDashboard();
            setEmployeeMessage(`Salary generated for ${payrollMonth}.`);
        } catch (err) {
            setEmployeeMessage(err.response?.data?.message || 'Unable to generate employee salary.');
        } finally {
            setSavingPayroll(false);
        }
    };

    const handleDeleteEmployee = async (employee) => {
        if (!canManageEmployees) {
            setEmployeeMessage('Your account does not have permission to delete employee records.');
            return;
        }

        const shouldDelete = window.confirm(`Delete employee "${employee.full_name}"?`);
        if (!shouldDelete) return;

        try {
            await API.delete(`/employees/${employee.id}`);
            setEmployeeMessage(`Deleted ${employee.full_name}.`);
            if (selectedEmployeeId === employee.id) {
                setSelectedEmployeeId('');
            }
            if (employeeForm.id === employee.id) {
                resetEmployeeForm();
            }
            await loadDashboard();
        } catch (err) {
            setEmployeeMessage(err.response?.data?.message || 'Unable to delete employee.');
        }
    };

    const handleProductSubmit = async (event) => {
        event.preventDefault();

        if (!productForm.brand.trim() || !productForm.model.trim() || !productForm.vehicle_type.trim()) {
            setProductMessage('Brand, model, and vehicle type are required.');
            return;
        }

        if (!productForm.image_url) {
            setProductMessage('Product image is required.');
            return;
        }

        try {
            setSavingProduct(true);
            if (productForm.id) {
                await API.put(`/products/${productForm.id}`, {
                    ...productForm,
                    monthly_rate: Number(productForm.monthly_rate || 0),
                    purchase_price: Number(productForm.purchase_price || 0),
                    cash_markup_percent: Number(productForm.cash_markup_percent || 0),
                    cash_markup_value: Number(productForm.cash_markup_value || 0),
                    installment_markup_percent: Number(productForm.installment_markup_percent || 0),
                    installment_months: Number(productForm.installment_months || 12),
                });
                setProductMessage('Product vehicle updated successfully.');
            } else {
                await API.post('/products', {
                    ...productForm,
                    monthly_rate: Number(productForm.monthly_rate || 0),
                    purchase_price: Number(productForm.purchase_price || 0),
                    cash_markup_percent: Number(productForm.cash_markup_percent || 0),
                    cash_markup_value: Number(productForm.cash_markup_value || 0),
                    installment_markup_percent: Number(productForm.installment_markup_percent || 0),
                    installment_months: Number(productForm.installment_months || 12),
                });
                setProductMessage('Product vehicle created successfully.');
            }
            await loadDashboard();
            resetProductForm();
        } catch (err) {
            setProductMessage(err.response?.data?.message || 'Unable to save product vehicle.');
        } finally {
            setSavingProduct(false);
        }
    };

    const handleCompanySubmit = async (event) => {
        event.preventDefault();

        if (!String(companyForm.company_name || '').trim()) {
            setCompanyMessage('Company name is required.');
            return;
        }

        try {
            setSavingCompany(true);
            if (companyForm.id) {
                await API.put(`/companies/${companyForm.id}`, companyForm);
            } else {
                await API.post('/companies', companyForm);
            }
            await loadDashboard();
            resetCompanyForm();
            setCompanyMessage(companyForm.id ? 'Company profile updated successfully.' : 'Company profile saved successfully.');
        } catch (err) {
            setCompanyMessage(err.response?.data?.message || 'Unable to save company profile.');
        } finally {
            setSavingCompany(false);
        }
    };

    const handleProductImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('productImage', file);

        try {
            setSavingProduct(true);
            const { data } = await API.post('/products/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProductForm((current) => ({ ...current, image_url: data.url }));
            setProductMessage(`Product image uploaded: ${data.originalName}`);
        } catch (err) {
            setProductMessage(err.response?.data?.message || 'Unable to upload product image.');
        } finally {
            setSavingProduct(false);
        }
    };

    const handleAgreementUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('agreement', file);

        try {
            setUploadingAgreement(true);
            const { data } = await API.post('/sales/upload-agreement', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSaleForm((current) => ({ ...current, agreement_pdf_url: data.url }));
            setSaleMessage(`Agreement uploaded: ${data.originalName}`);
        } catch (err) {
            setSaleMessage(err.response?.data?.message || 'Unable to upload agreement PDF.');
        } finally {
            setUploadingAgreement(false);
        }
    };

    const handleSaleDocumentUpload = async (event, targetField, targetLabel, setUploadingState) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('document', file);

        try {
            setUploadingState(true);
            const { data } = await API.post('/sales/upload-document', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSaleForm((current) => ({ ...current, [targetField]: data.url }));
            setSaleMessage(`${targetLabel} uploaded: ${data.originalName}`);
        } catch (err) {
            setSaleMessage(err.response?.data?.message || `Unable to upload ${targetLabel.toLowerCase()}.`);
        } finally {
            setUploadingState(false);
        }
    };

    const handleBankSlipUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('bankSlip', file);

        try {
            setUploadingBankSlip(true);
            const { data } = await API.post('/stock/upload-slip', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setStockOrderForm((current) => ({ ...current, bank_slip_url: data.url }));
            setStockMessage(`Bank slip uploaded: ${data.originalName}`);
        } catch (err) {
            setStockMessage(err.response?.data?.message || 'Unable to upload bank slip.');
        } finally {
            setUploadingBankSlip(false);
        }
    };

    const handleDealerLogoUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('dealerLogo', file);

        try {
            setSavingDealer(true);
            const { data } = await API.post('/dealers/upload-logo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setDealerForm((current) => ({ ...current, dealer_logo_url: data.url }));
            setDealerMessage(`Dealer logo uploaded: ${data.originalName}`);
        } catch (err) {
            setDealerMessage(err.response?.data?.message || 'Unable to upload dealer logo.');
        } finally {
            setSavingDealer(false);
        }
    };
    const handleDealerSignatureUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('dealerSignature', file);

        try {
            setSavingDealer(true);
            const { data } = await API.post('/dealers/upload-signature', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setDealerForm((current) => ({ ...current, dealer_signature_url: data.url }));
            setDealerMessage(`Dealer signature uploaded: ${data.originalName}`);
        } catch (err) {
            setDealerMessage(err.response?.data?.message || 'Unable to upload dealer signature.');
        } finally {
            setSavingDealer(false);
        }
    };
    const handleSaleDealerSignatureUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('dealerSignature', file);

        try {
            setSavingSale(true);
            const { data } = await API.post('/dealers/upload-signature', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSaleForm((current) => ({ ...current, dealer_signature_url: data.url }));
            setSaleMessage(`Dealer signature uploaded for sale: ${data.originalName}`);
        } catch (err) {
            setSaleMessage(err.response?.data?.message || 'Unable to upload dealer signature for sale.');
        } finally {
            setSavingSale(false);
        }
    };

    const uploadCustomerAssetFile = async (file, assetType) => {
        const formData = new FormData();
        formData.append('customerAsset', file);
        formData.append('assetType', assetType);

        const { data } = await API.post('/customers/upload-asset', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return data;
    };

    const extractSignatureCropFromCnic = async (file) => {
        if (!String(file?.type || '').startsWith('image/')) {
            return null;
        }

        const objectUrl = URL.createObjectURL(file);

        try {
            const image = await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error('Unable to read CNIC image for signature crop.'));
                img.src = objectUrl;
            });

            const cropWidth = Math.max(180, Math.round(image.width * 0.36));
            const cropHeight = Math.max(72, Math.round(image.height * 0.14));
            const cropX = Math.max(Math.round(image.width * 0.08), 0);
            const cropY = Math.max(image.height - cropHeight - Math.round(image.height * 0.08), 0);

            const canvas = document.createElement('canvas');
            canvas.width = cropWidth;
            canvas.height = cropHeight;

            const context = canvas.getContext('2d');
            if (!context) {
                throw new Error('Unable to prepare signature crop.');
            }

            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, cropWidth, cropHeight);
            context.drawImage(
                image,
                cropX,
                cropY,
                cropWidth,
                cropHeight,
                0,
                0,
                cropWidth,
                cropHeight
            );

            const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
            if (!blob) {
                throw new Error('Unable to generate signature crop.');
            }

            return new File([blob], `${file.name.replace(/\.[^.]+$/, '') || 'cnic-signature'}-signature.png`, {
                type: 'image/png',
            });
        } finally {
            URL.revokeObjectURL(objectUrl);
        }
    };

    const extractBackAddressCropFromCnic = async (file) => {
        if (!String(file?.type || '').startsWith('image/')) {
            return null;
        }

        const objectUrl = URL.createObjectURL(file);

        try {
            const image = await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error('Unable to read CNIC back image for address crop.'));
                img.src = objectUrl;
            });

            const cropWidth = Math.max(180, Math.round(image.width * 0.56));
            const cropHeight = Math.max(70, Math.round(image.height * 0.23));
            const cropX = Math.max(0, Math.round(image.width * 0.17));
            const cropY = Math.max(0, Math.round(image.height * 0.24));

            const canvas = document.createElement('canvas');
            canvas.width = cropWidth;
            canvas.height = cropHeight;

            const context = canvas.getContext('2d');
            if (!context) {
                throw new Error('Unable to prepare address crop.');
            }

            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, cropWidth, cropHeight);
            context.drawImage(
                image,
                cropX,
                cropY,
                cropWidth,
                cropHeight,
                0,
                0,
                cropWidth,
                cropHeight
            );

            const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
            if (!blob) {
                throw new Error('Unable to generate address crop.');
            }

            return new File([blob], `${file.name.replace(/\.[^.]+$/, '') || 'cnic-back'}-address.png`, {
                type: 'image/png',
            });
        } finally {
            URL.revokeObjectURL(objectUrl);
        }
    };

    const handleCustomerAssetUpload = async (event, targetField, successLabel, assetType = '') => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploadingCustomerAsset(true);
            const uploadAssetType = assetType === 'CNIC_BACK' ? 'CNIC_BACK_ORIGINAL' : assetType;
            const data = await uploadCustomerAssetFile(file, uploadAssetType);
            let ocrData = data;

            if (assetType === 'CNIC_BACK') {
                const addressCropFile = await extractBackAddressCropFromCnic(file);
                if (addressCropFile) {
                    ocrData = await uploadCustomerAssetFile(addressCropFile, 'CNIC_BACK');
                }
            }

            setCustomerForm((current) => {
                const nextState = { ...current, [targetField]: data.url };

                if ((assetType === 'CNIC_FRONT' || assetType === 'CNIC_BACK') && ocrData.ocr?.raw_text) {
                    const extracted = extractOcrFields(ocrData.ocr.raw_text, current.document_type, assetType);
                    nextState.raw_ocr_text = [current.raw_ocr_text, ocrData.ocr.raw_text].filter(Boolean).join('\n\n');
                    nextState.document_type = extracted.document_type || current.document_type;
                    nextState.cnic_passport_number = extracted.cnic_passport_number || current.cnic_passport_number;
                    nextState.contact_email = extracted.contact_email || current.contact_email;
                    nextState.contact_phone = extracted.contact_phone || current.contact_phone;
                    nextState.gender = extracted.gender || current.gender;
                    nextState.country = extracted.country || current.country;
                    nextState.address = extracted.address || current.address;
                    nextState.date_of_birth = extracted.date_of_birth || current.date_of_birth;
                    nextState.extracted_name = extracted.extracted_name || current.extracted_name;
                    nextState.father_name = extracted.father_name || current.father_name;
                    nextState.full_name = extracted.extracted_name || current.full_name;
                }

                return nextState;
            });

            if (assetType === 'CNIC_FRONT') {
                try {
                    const signatureCropFile = await extractSignatureCropFromCnic(file);
                    if (signatureCropFile) {
                        const signatureData = await uploadCustomerAssetFile(signatureCropFile, 'SIGNATURE');
                        setCustomerForm((current) => ({
                            ...current,
                            signature_image_url: signatureData.url || current.signature_image_url,
                        }));
                    }
                } catch (signatureError) {
                    setCustomerMessage(signatureError.message || 'CNIC uploaded, but signature crop could not be prepared.');
                    return;
                }
            }

            if ((assetType === 'CNIC_FRONT' || assetType === 'CNIC_BACK') && ocrData.ocr?.raw_text) {
                setCustomerMessage(
                    assetType === 'CNIC_FRONT'
                        ? `${successLabel} uploaded, OCR imported, and signature prepared from CNIC front.`
                        : `${successLabel} uploaded and OCR imported from the highlighted address area.`
                );
            } else if ((assetType === 'CNIC_FRONT' || assetType === 'CNIC_BACK') && ocrData.ocr && !ocrData.ocr.raw_text) {
                setCustomerMessage('Document not verified, please scan properly.');
            } else if ((assetType === 'CNIC_FRONT' || assetType === 'CNIC_BACK') && ocrData.ocr?.error) {
                setCustomerMessage(`${successLabel} uploaded, but OCR could not read the file. ${ocrData.ocr.error}`);
            } else {
                setCustomerMessage(`${successLabel} uploaded: ${data.originalName}`);
            }
        } catch (err) {
            setCustomerMessage(err.response?.data?.message || `Unable to upload ${successLabel.toLowerCase()}.`);
        } finally {
            setUploadingCustomerAsset(false);
            event.target.value = '';
        }
    };

    const handleEmployeeDocumentUpload = async (event, targetField = 'cnic_front_url') => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploadingEmployeeDocument(true);
            const formData = new FormData();
            formData.append('employeeDocument', file);
            const { data } = await API.post('/employees/upload-cnic', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setEmployeeForm((current) => ({
                ...current,
                [targetField]: data.url || '',
                cnic_doc_url: targetField === 'cnic_front_url'
                    ? (data.url || '')
                    : current.cnic_doc_url,
            }));
            setEmployeeMessage(`Employee ${targetField === 'cnic_back_url' ? 'CNIC back' : 'CNIC front'} uploaded: ${data.originalName}`);
        } catch (err) {
            setEmployeeMessage(err.response?.data?.message || 'Unable to upload employee CNIC.');
        } finally {
            setUploadingEmployeeDocument(false);
            event.target.value = '';
        }
    };

    const handleProfileLogoUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profileLogo', file);

        try {
            setSavingProfile(true);
            const { data } = await API.post('/auth/profile/upload-logo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProfileForm((current) => ({ ...current, brand_logo_url: data.url }));
            setProfileMessage(`Profile logo uploaded: ${data.originalName}`);
        } catch (err) {
            setProfileMessage(err.response?.data?.message || 'Unable to upload profile logo.');
        } finally {
            setSavingProfile(false);
            event.target.value = '';
        }
    };

    const handleDealerSubmit = async (event) => {
        event.preventDefault();

        if (!canManageDealers) {
            setDealerMessage('Only the super admin can create dealer applications.');
            return;
        }

        if (!dealerForm.dealer_name.trim() || !dealerForm.dealer_signature_url.trim() || !dealerForm.dealer_address.trim() || !dealerForm.dealer_cnic.trim() || !dealerForm.mobile_number.trim() || !dealerForm.admin_full_name.trim() || !dealerForm.admin_email.trim() || (!dealerForm.id && !dealerForm.admin_password.trim())) {
            setDealerMessage(dealerForm.id ? 'Dealer profile fields, signature image, and dealer admin identity are required.' : 'Dealer profile fields, signature image, and dealer admin credentials are required.');
            return;
        }

        try {
            setSavingDealer(true);
            const payload = {
                ...dealerForm,
                dealer_name: dealerForm.dealer_name.trim(),
                dealer_address: dealerForm.dealer_address.trim(),
                dealer_cnic: dealerForm.dealer_cnic.trim(),
                dealer_signature_url: dealerForm.dealer_signature_url.trim(),
                mobile_number: dealerForm.mobile_number.trim(),
                contact_email: dealerForm.contact_email.trim(),
                admin_full_name: dealerForm.admin_full_name.trim(),
                admin_email: dealerForm.admin_email.trim(),
                admin_password: dealerForm.admin_password,
                admin_role_id: dealerForm.admin_role_id ? Number(dealerForm.admin_role_id) : null,
                backup_directory: dealerForm.backup_directory.trim(),
                notes: dealerForm.notes.trim(),
            };
            const { data } = dealerForm.id
                ? await API.put(`/dealers/${dealerForm.id}`, payload)
                : await API.post('/dealers', payload);
            await loadDashboard();
            const backupMessage =
                  data.backup?.status === 'COMPLETED'
                      ? ` Empty template backup saved to: ${data.backup.file_path}`
                      : data.backup?.status === 'FAILED'
                          ? ` Dealer created, but empty template backup failed: ${data.backup.error}`
                          : '';
            resetDealerForm();
            setDealerMessage(
                dealerForm.id
                    ? `Dealer updated. Dealer admin login: ${data.dealer_admin?.email || dealerForm.admin_email.trim()}.${data.backup ? backupMessage.replace('Dealer created, but empty template backup failed:', ' Dealer updated, but empty template backup failed:') : ''}`
                    : `Dealer created. Dealer admin login: ${data.dealer_admin?.email || dealerForm.admin_email.trim()}.${backupMessage}`
            );
        } catch (err) {
            setDealerMessage(
                err.response?.data?.error ||
                err.response?.data?.message ||
                'Unable to create dealer application.'
            );
        } finally {
            setSavingDealer(false);
        }
    };

    const handleProfileSubmit = async (event) => {
        event.preventDefault();

        if (!profileForm.full_name.trim() || !profileForm.email.trim()) {
            setProfileMessage('Name and email are required.');
            return;
        }

        try {
            setSavingProfile(true);
            const { data } = await API.put('/auth/profile', {
                full_name: profileForm.full_name.trim(),
                email: profileForm.email.trim(),
                password: profileForm.password,
                brand_name: profileForm.brand_name.trim(),
                brand_logo_url: profileForm.brand_logo_url,
                brand_address: profileForm.brand_address.trim(),
            });

            setDashboardData((current) => ({
                ...current,
                user: {
                    ...(current.user || {}),
                    ...data,
                },
            }));
            localStorage.setItem('user', JSON.stringify(data));
            setProfileForm((current) => ({ ...current, password: '' }));
            setProfileMessage(data.password_updated ? 'Profile updated and password changed successfully.' : 'Profile updated successfully.');
        } catch (err) {
            setProfileMessage(err.response?.data?.message || 'Unable to update profile right now.');
        } finally {
            setSavingProfile(false);
        }
    };

    const handleSaleSubmit = async (event) => {
        event.preventDefault();

        const showSalePopupMessage = (message) => {
            setSaleMessage(message);
            window.alert(message);
        };

        if (saleFormReadOnly) {
            return;
        }

        if (!saleForm.customer_id || !saleForm.vehicle_id) {
            showSalePopupMessage('Customer and vehicle are required.');
            return;
        }

        if (!salesVehicleOptions.some((vehicle) => vehicle.id === saleForm.vehicle_id)) {
            showSalePopupMessage('Only available vehicles can be selected for a new sale.');
            return;
        }

        if (!saleCustomerCnicFrontUrl) {
            showSalePopupMessage('Customer CNIC front is required on the customer profile before creating a sale.');
            return;
        }

        if (saleForm.sale_mode === 'INSTALLMENT' && (!saleForm.installment_months || !saleForm.first_due_date || !saleForm.monthly_installment)) {
            showSalePopupMessage('Installment count, first due date, and monthly installment are required for installment sales.');
            return;
        }

        try {
            setSavingSale(true);
            const payload = {
                ...saleForm,
                customer_cnic_front_url: saleCustomerCnicFrontUrl,
                customer_cnic_back_url: saleCustomerCnicBackUrl,
                agreement_date: saleForm.agreement_date?.trim() ? saleForm.agreement_date.trim() : null,
                purchase_date: saleForm.purchase_date?.trim() ? saleForm.purchase_date.trim() : null,
                first_due_date: saleForm.first_due_date?.trim() ? saleForm.first_due_date.trim() : null,
                vehicle_price: Number(saleForm.vehicle_price || 0),
                down_payment: Number(saleForm.down_payment || 0),
                financed_amount: Number(saleForm.financed_amount || 0),
                monthly_installment: Number(saleForm.monthly_installment || 0),
                installment_months: Number(saleForm.installment_months || 0),
            };
            if (saleForm.id) {
                await API.put(`/sales/${saleForm.id}`, payload);
                setSaleMessage('Sales transaction updated successfully.');
            } else {
                await API.post('/sales', payload);
                setSaleMessage('Sales transaction created successfully.');
            }
            await loadDashboard();
            resetSaleForm();
        } catch (err) {
            const apiMessage = err.response?.data?.message;
            const apiError = err.response?.data?.error;
            showSalePopupMessage(
                apiError
                    ? `${apiMessage || 'Unable to save sales transaction.'} (${apiError})`
                    : (apiMessage || 'Unable to save sales transaction.')
            );
        } finally {
            setSavingSale(false);
        }
    };

    const handleStockOrderSubmit = async (event) => {
        event.preventDefault();

        if (!stockOrderForm.company_profile_id || !stockOrderForm.product_id || !stockOrderForm.bank_slip_url) {
            setStockMessage('Company profile, product vehicle, and bank slip are required.');
            return;
        }

        try {
            setSavingStock(true);
            await API.post('/stock/orders', {
                ...stockOrderForm,
                quantity: 1,
                unit_price: Number(stockOrderForm.unit_price || 0),
                total_amount: Number(stockOrderForm.total_amount || 0),
            });
            await loadDashboard();
            resetStockOrderForm();
            setStockMessage('Stock order created and processing email status has been recorded.');
        } catch (err) {
            setStockMessage(err.response?.data?.message || 'Unable to create stock order.');
        } finally {
            setSavingStock(false);
        }
    };

    const handleResendStockOrderEmail = async (orderId) => {
        if (!orderId) {
            return;
        }

        try {
            setSavingStock(true);
            const { data } = await API.post(`/stock/orders/${orderId}/resend-email`);
            setStockMessage(data.message || 'Stock order email sent successfully.');
            await loadDashboard();
        } catch (err) {
            const errorDetail = err.response?.data?.error;
            setStockMessage(errorDetail || err.response?.data?.message || 'Unable to resend stock order email.');
            await loadDashboard();
        } finally {
            setSavingStock(false);
        }
    };

    const openStockReceiveModal = (order) => {
        setReceivingStockOrder(order);
        setStockReceiveItems([createEmptyReceiveItem(order.product_color || order.color || '')]);
    };

    const closeStockReceiveModal = () => {
        setReceivingStockOrder(null);
        setStockReceiveItems([createEmptyReceiveItem()]);
    };

    const handleStockReceiveItemChange = (index, field, value) => {
        setStockReceiveItems((current) =>
            current.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                        ...item,
                        [field]: value,
                    }
                    : item
            )
        );
    };

    const handleSubmitReceivedStock = async (event) => {
        event.preventDefault();

        if (!receivingStockOrder) {
            return;
        }

        const missingItem = stockReceiveItems.find(
            (item) =>
                !String(item.registration_number || '').trim() ||
                !String(item.chassis_number || '').trim() ||
                !String(item.engine_number || '').trim()
        );

        if (missingItem) {
            setStockMessage('Registration number, chassis number, and engine number are required for each received vehicle.');
            return;
        }

        try {
            setSavingStock(true);
            await API.patch(`/stock/orders/${receivingStockOrder.id}`, {
                received_items: stockReceiveItems,
                received_at: new Date().toISOString(),
                notes: receivingStockOrder.notes || '',
            });
            setStockMessage(`Stock order ${receivingStockOrder.id} updated with the received vehicle details.`);
            await loadDashboard();
            closeStockReceiveModal();
        } catch (err) {
            setStockMessage(err.response?.data?.message || 'Unable to save received stock details.');
        } finally {
            setSavingStock(false);
        }
    };

    const handleOpenInstallmentPage = (saleId) => {
        setSelectedInstallmentSaleId(saleId);
        goToPage('installments');
    };

    const openPrintWindow = (title, bodyHtml) => {
        const printWindow = window.open('', '_blank', 'width=980,height=760');
        if (!printWindow) {
            setSaleMessage('Allow popups in your browser to print the invoice.');
            return;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <title>${escapeHtml(title)}</title>
                <style>
                    @page { size: A4 portrait; margin: 10mm; }
                    html, body { width: 210mm; min-height: 297mm; margin: 0; padding: 0; color: #0f172a; background: #fff; font-family: Arial, sans-serif; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .page { box-sizing: border-box; width: 190mm; min-height: 277mm; padding: 8mm 9mm; margin: 0 auto; }
                    .brand-block { display: flex; justify-content: space-between; gap: 18px; align-items: center; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid #dbe2ea; }
                    .print-brand-logo { width: 72px; height: 72px; object-fit: cover; border-radius: 16px; border: 1px solid #dbe2ea; background: #fff; }
                    .header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 2px solid #dbeafe; padding-bottom: 18px; margin-bottom: 20px; }
                    .kicker { color: #2563eb; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 6px; }
                    h1, h2, h3, p { margin: 0; }
                    .subtitle { color: #64748b; margin-top: 6px; }
                    .hero { display: grid; grid-template-columns: 58mm 1fr; gap: 14px; margin-bottom: 16px; }
                    .hero img, .hero .fallback { width: 100%; height: 220px; object-fit: cover; border-radius: 14px; border: 1px solid #cbd5e1; background: #f8fafc; }
                    .hero .fallback { display: flex; align-items: center; justify-content: center; color: #64748b; font-weight: 700; }
                    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 14px; }
                    .label { display: block; color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.08em; }
                    .value { font-size: 16px; font-weight: 700; color: #0f172a; }
                    .stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin: 14px 0 16px; }
                    .stat { border: 1px solid #dbeafe; background: #f8fbff; border-radius: 12px; padding: 14px; }
                    .stat strong { display: block; margin-top: 6px; font-size: 18px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 14px; }
                    th { text-align: left; font-size: 11px; text-transform: uppercase; color: #64748b; background: #f8fafc; padding: 12px 10px; border-bottom: 2px solid #dbeafe; }
                    td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
                    .badge { display: inline-block; padding: 6px 12px; border-radius: 999px; font-weight: 700; font-size: 12px; }
                    .received { background: #dcfce7; color: #166534; }
                    .pending { background: #fef3c7; color: #92400e; }
                    .approval-strip { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 16px; page-break-inside: avoid; break-inside: avoid; }
                    .approval-card { border: 1px solid #dbe2ea; border-radius: 14px; padding: 16px; background: #fff; }
                    .approval-card img, .approval-card .empty, .approval-card iframe { width: 100%; height: 130px; object-fit: contain; border: 1px solid #dbe2ea; border-radius: 12px; background: #f8fafc; }
                    .approval-card .empty { display: flex; align-items: center; justify-content: center; color: #64748b; font-weight: 700; }
                    .signature-strip { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 16px; page-break-inside: avoid; break-inside: avoid; }
                    .signature-panel { border: 1px solid #dbe2ea; border-radius: 14px; padding: 14px; background: #fff; }
                    .signature-box { height: 34mm; display: flex; align-items: center; justify-content: center; border: 1px solid #dbe2ea; border-radius: 12px; background: #f8fafc; overflow: hidden; }
                    .signature-box img, .signature-box iframe { width: 100%; height: 100%; object-fit: contain; border: 0; background: #f8fafc; }
                    .asset-link { display: inline-flex; align-items: center; justify-content: center; min-width: 120px; min-height: 44px; }
                    .signature-line { margin-top: 10px; padding-top: 8px; border-top: 1px dashed #94a3b8; font-size: 12px; font-weight: 700; color: #334155; text-align: center; }
                    .footer { margin-top: 14px; color: #64748b; font-size: 12px; }
                    @media print {
                        html, body { width: auto; min-height: auto; }
                        .page { width: auto; min-height: auto; padding: 0; }
                    }
                </style>
            </head>
            <body>
                ${bodyHtml}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };

    const renderPrintBrandBlock = () => `
        <div class="brand-block">
            <div>
                <p class="kicker">${escapeHtml(appBrandName)}</p>
                <p class="subtitle">${escapeHtml(appBrandAddress)}</p>
                <p class="subtitle">${escapeHtml(appBrandContact)}</p>
            </div>
            ${dealerBrandLogo ? `<img src="${escapeHtml(dealerBrandLogo)}" alt="${escapeHtml(appBrandName)}" class="print-brand-logo" />` : ''}
        </div>
    `;

    const handlePrintInvoice = () => {
        if (!selectedInstallmentSale) return;

        const bodyHtml = `
            <div class="page">
                ${renderPrintBrandBlock()}
                <div class="header">
                    <div>
                        <p class="kicker">${escapeHtml(appBrandName)} Invoice</p>
                        <h1>Installment Transaction Statement</h1>
                        <p class="subtitle">Customer, vehicle, and full transaction details.</p>
                    </div>
                    <div>
                        <span class="label">Agreement No.</span>
                        <div class="value">${escapeHtml(selectedInstallmentSale.agreement_number || 'Not set')}</div>
                        <span class="label" style="margin-top:10px;">Printed On</span>
                        <div class="value">${escapeHtml(new Date().toLocaleDateString('en-PK'))}</div>
                    </div>
                </div>
                <div class="hero">
                    ${selectedInstallmentImageUrl ? `<img src="${escapeHtml(selectedInstallmentImageUrl)}" alt="Vehicle" />` : `<div class="fallback">No vehicle image</div>`}
                    <div class="grid">
                        <div><span class="label">Customer</span><div class="value">${escapeHtml(selectedInstallmentSale.customer_name)}</div></div>
                        <div><span class="label">Customer CNIC</span><div class="value">${escapeHtml(selectedInstallmentSale.cnic_passport_number)}</div></div>
                        <div><span class="label">Dealer</span><div class="value">${escapeHtml(formatSaleDealerIdentity(selectedInstallmentSale))}</div></div>
                        <div><span class="label">Recorded By</span><div class="value">${escapeHtml(selectedInstallmentSale.agent_name || 'System')}</div></div>
                        <div><span class="label">Vehicle</span><div class="value">${escapeHtml(`${selectedInstallmentSale.brand} ${selectedInstallmentSale.model}`)}</div></div>
                        <div><span class="label">Registration</span><div class="value">${escapeHtml(selectedInstallmentSale.registration_number || 'Not set')}</div></div>
                        <div><span class="label">Chassis</span><div class="value">${escapeHtml(selectedInstallmentSale.chassis_number || 'Not set')}</div></div>
                        <div><span class="label">Engine</span><div class="value">${escapeHtml(selectedInstallmentSale.engine_number || 'Not set')}</div></div>
                        <div><span class="label">Total Price</span><div class="value">${escapeHtml(formatCurrency(selectedInstallmentSale.vehicle_price))}</div></div>
                        <div><span class="label">Down Payment</span><div class="value">${escapeHtml(formatCurrency(selectedInstallmentSale.down_payment))}</div></div>
                        <div><span class="label">Monthly Installment</span><div class="value">${escapeHtml(formatCurrency(selectedInstallmentSale.monthly_installment))}</div></div>
                        <div><span class="label">Total Remaining</span><div class="value">${escapeHtml(formatCurrency(installmentSummary.totalRemainingAmount))}</div></div>
                    </div>
                </div>
                <div class="stats">
                    <div class="stat"><span class="label">Received Cash</span><strong>${escapeHtml(formatCurrency(installmentSummary.receivedAmount))}</strong></div>
                    <div class="stat"><span class="label">Next Payment</span><strong>${escapeHtml(formatCurrency(installmentSummary.nextPaymentAmount))}</strong></div>
                    <div class="stat"><span class="label">Next Due Date</span><strong>${escapeHtml(installmentSummary.nextPaymentDate || 'No pending installment')}</strong></div>
                    <div class="stat"><span class="label">Pending Installments</span><strong>${escapeHtml(String(installmentSummary.pendingCount))}</strong></div>
                </div>
                <div class="approval-strip">
                    <div class="approval-card">
                        <span class="label">Biometric Thumb</span>
                        ${selectedInstallmentThumbUrl ? `<img src="${escapeHtml(selectedInstallmentThumbUrl)}" alt="Biometric thumb" />` : `<div class="empty">Thumb not attached</div>`}
                    </div>
                    <div class="approval-card">
                        <span class="label">Customer CNIC Front</span>
                        ${renderPrintAssetMarkup(selectedInstallmentCnicFrontPath, 'CNIC front not attached', 'Customer CNIC front')}
                    </div>
                </div>
                <div class="signature-strip">
                    <div class="signature-panel">
                        <span class="label">Customer Signature</span>
                        <div class="signature-box">
                            ${renderPrintAssetMarkup(selectedInstallmentSignaturePath, 'Signature not attached', 'Customer signature')}
                        </div>
                        <div class="signature-line">Customer Signature</div>
                    </div>
                    <div class="signature-panel">
                        <span class="label">Authorized Signature</span>
                        <div class="signature-box">
                            ${renderPrintAssetMarkup(selectedInstallmentAuthorizedSignaturePath, 'Authorized signatory', 'Authorized signature')}
                        </div>
                        <div class="signature-line">${escapeHtml(selectedInstallmentSale.agent_name || 'Authorized Officer')}</div>
                    </div>
                </div>
                <p class="footer">Generated from ${escapeHtml(appBrandName)} installment transactions.</p>
            </div>
        `;

        openPrintWindow(`Invoice ${selectedInstallmentSale.agreement_number || selectedInstallmentSale.id}`, bodyHtml);
    };

    const handleViewTransaction = (sale) => {
        if (!sale) return;

        setTransactionActionState({ saleId: sale.id, action: 'view' });
        setSelectedTransactionSaleId(sale.id);

        window.requestAnimationFrame(() => {
            if (String(sale.sale_mode || '').toUpperCase() === 'INSTALLMENT') {
                const summary = summarizeSaleInstallments(sale);
                if (summary.pendingCount > 0) {
                    handleOpenInstallmentPage(sale.id);
                    setTransactionActionState({ saleId: '', action: '' });
                    return;
                }
            }

            goToPage('transactions');
            setTransactionActionState({ saleId: '', action: '' });
        });
    };

    const handlePrintTransaction = (sale) => {
        if (!sale) return;

        setTransactionActionState({ saleId: sale.id, action: 'print' });
        const summary = summarizeSaleInstallments(sale);
        const printContext = getSalePrintContext(sale);
        const isInstallment = String(sale.sale_mode || '').toUpperCase() === 'INSTALLMENT';

        const bodyHtml = `
            <div class="page">
                ${renderPrintBrandBlock()}
                <div class="header">
                    <div>
                        <p class="kicker">${escapeHtml(appBrandName)} Transaction</p>
                        <h1>${isInstallment ? 'Installment Transaction Statement' : 'Cash Transaction Receipt'}</h1>
                        <p class="subtitle">Customer, vehicle, and payment details.</p>
                    </div>
                    <div>
                        <span class="label">Agreement No.</span>
                        <div class="value">${escapeHtml(sale.agreement_number || 'Not set')}</div>
                        <span class="label" style="margin-top:10px;">Printed On</span>
                        <div class="value">${escapeHtml(new Date().toLocaleDateString('en-PK'))}</div>
                    </div>
                </div>
                <div class="hero">
                    ${printContext.imageUrl ? `<img src="${escapeHtml(printContext.imageUrl)}" alt="Vehicle" />` : `<div class="fallback">No vehicle image</div>`}
                    <div class="grid">
                        <div><span class="label">Customer</span><div class="value">${escapeHtml(sale.customer_name || 'Not set')}</div></div>
                        <div><span class="label">Customer CNIC</span><div class="value">${escapeHtml(sale.cnic_passport_number || 'Not set')}</div></div>
                        <div><span class="label">Dealer</span><div class="value">${escapeHtml(formatSaleDealerIdentity(sale))}</div></div>
                        <div><span class="label">Recorded By</span><div class="value">${escapeHtml(sale.agent_name || 'System')}</div></div>
                        <div><span class="label">Vehicle</span><div class="value">${escapeHtml(`${sale.brand || ''} ${sale.model || ''}`.trim() || 'Not set')}</div></div>
                        <div><span class="label">Mode</span><div class="value">${escapeHtml(sale.sale_mode || 'Not set')}</div></div>
                        <div><span class="label">Registration</span><div class="value">${escapeHtml(sale.registration_number || 'Not set')}</div></div>
                        <div><span class="label">Purchase Date</span><div class="value">${escapeHtml(sale.purchase_date || 'Not set')}</div></div>
                        <div><span class="label">Chassis</span><div class="value">${escapeHtml(sale.chassis_number || 'Not set')}</div></div>
                        <div><span class="label">Engine</span><div class="value">${escapeHtml(sale.engine_number || 'Not set')}</div></div>
                        <div><span class="label">Total Price</span><div class="value">${escapeHtml(formatCurrency(sale.vehicle_price))}</div></div>
                        <div><span class="label">Status</span><div class="value">${escapeHtml(sale.status || 'Not set')}</div></div>
                        <div><span class="label">Down Payment</span><div class="value">${escapeHtml(formatCurrency(sale.down_payment || 0))}</div></div>
                        <div><span class="label">Monthly Installment</span><div class="value">${escapeHtml(formatCurrency(sale.monthly_installment || 0))}</div></div>
                    </div>
                </div>
                <div class="stats">
                    <div class="stat"><span class="label">Received Cash</span><strong>${escapeHtml(formatCurrency(isInstallment ? summary.receivedAmount : sale.vehicle_price || 0))}</strong></div>
                    <div class="stat"><span class="label">Pending Installments</span><strong>${escapeHtml(String(isInstallment ? summary.pendingCount : 0))}</strong></div>
                    <div class="stat"><span class="label">Next Due Date</span><strong>${escapeHtml(isInstallment ? summary.nextPaymentDate || 'No pending installment' : 'Paid in full')}</strong></div>
                    <div class="stat"><span class="label">Total Remaining</span><strong>${escapeHtml(formatCurrency(isInstallment ? summary.totalRemainingAmount : 0))}</strong></div>
                </div>
                <div class="approval-strip">
                    <div class="approval-card">
                        <span class="label">Biometric Thumb</span>
                        ${printContext.thumbUrl ? `<img src="${escapeHtml(printContext.thumbUrl)}" alt="Biometric thumb" />` : `<div class="empty">Thumb not attached</div>`}
                    </div>
                    <div class="approval-card">
                        <span class="label">Customer Signature</span>
                        ${printContext.signatureUrl ? `<img src="${escapeHtml(printContext.signatureUrl)}" alt="Customer signature" />` : `<div class="empty">Signature not attached</div>`}
                    </div>
                    <div class="approval-card">
                        <span class="label">Authorized Signature</span>
                        ${printContext.authorizedSignatureUrl ? `<img src="${escapeHtml(printContext.authorizedSignatureUrl)}" alt="Authorized signature" />` : `<div class="empty">Authorized signatory</div>`}
                    </div>
                </div>
                <p class="footer">Generated from ${escapeHtml(appBrandName)} transaction records.</p>
            </div>
        `;

        openPrintWindow(`Transaction ${sale.agreement_number || sale.id}`, bodyHtml);
        window.setTimeout(() => {
            setTransactionActionState({ saleId: '', action: '' });
        }, 400);
    };

    const handlePrintSalarySlip = (row) => {
        if (!row) return;

        const printedOn = new Date().toLocaleDateString('en-PK');
        const bodyHtml = `
            <div class="page">
                ${renderPrintBrandBlock()}
                <div class="header">
                    <div>
                        <p class="kicker">${escapeHtml(appBrandName)} Payroll</p>
                        <h1>Employee Salary Slip</h1>
                        <p class="subtitle">Generated salary slip for ${escapeHtml(row.payroll_month || 'selected month')}.</p>
                    </div>
                    <div>
                        <span class="label">Printed On</span>
                        <div class="value">${escapeHtml(printedOn)}</div>
                    </div>
                </div>
                <div class="grid" style="margin-bottom: 18px;">
                    <div><span class="label">Employee</span><div class="value">${escapeHtml(row.full_name || 'Not set')}</div></div>
                    <div><span class="label">Employee Code</span><div class="value">${escapeHtml(row.employee_code || 'Not set')}</div></div>
                    <div><span class="label">Department</span><div class="value">${escapeHtml(row.department || 'Not set')}</div></div>
                    <div><span class="label">Branch</span><div class="value">${escapeHtml(row.branch_name || 'Main Branch')}</div></div>
                    <div><span class="label">Payroll Month</span><div class="value">${escapeHtml(row.payroll_month || 'Not set')}</div></div>
                    <div><span class="label">Status</span><div class="value">${escapeHtml(row.report_status || 'GENERATED')}</div></div>
                </div>
                <div class="stats">
                    <div class="stat"><span class="label">Base Salary</span><strong>${escapeHtml(formatCurrency(row.base_salary || 0))}</strong></div>
                    <div class="stat"><span class="label">Commission</span><strong>${escapeHtml(formatCurrency(row.total_commission || 0))}</strong></div>
                    <div class="stat"><span class="label">Advance Deduction</span><strong>${escapeHtml(formatCurrency(row.total_advances || 0))}</strong></div>
                    <div class="stat"><span class="label">Net Salary</span><strong>${escapeHtml(formatCurrency(row.net_salary || 0))}</strong></div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Component</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Base Salary</td>
                            <td>${escapeHtml(formatCurrency(row.base_salary || 0))}</td>
                        </tr>
                        <tr>
                            <td>Add: Total Commission</td>
                            <td>${escapeHtml(formatCurrency(row.total_commission || 0))}</td>
                        </tr>
                        <tr>
                            <td>Less: Advance Deduction</td>
                            <td>${escapeHtml(formatCurrency(row.total_advances || 0))}</td>
                        </tr>
                        <tr>
                            <td><strong>Net Salary</strong></td>
                            <td><strong>${escapeHtml(formatCurrency(row.net_salary || 0))}</strong></td>
                        </tr>
                    </tbody>
                </table>
                <p class="footer">This is a system-generated salary slip from ${escapeHtml(appBrandName)}.</p>
            </div>
        `;

        openPrintWindow(`Salary Slip ${row.employee_code || row.full_name || row.id} - ${row.payroll_month || 'Payroll'}`, bodyHtml);
    };

    const handlePrintReport = () => {
        const printedOn = new Date().toLocaleDateString('en-PK');
        const reportRangeLabel = `${reportDateFrom || 'Start'} to ${reportDateTo || 'Today'}`;
        let reportTitle = 'Report';
        let bodyHtml = '';

        if (activePage === 'report-stock-inventory') {
            reportTitle = `Stock Inventory Report - ${reportRangeLabel}`;
            bodyHtml = `
                <div class="page">
                    ${renderPrintBrandBlock()}
                    <div class="header">
                        <div>
                            <p class="kicker">${escapeHtml(appBrandName)} Reports</p>
                            <h1>Stock Inventory Report</h1>
                            <p class="subtitle">Date range ${escapeHtml(reportRangeLabel)} with opening stock, in-transit orders, sales quantity, and closing stock.</p>
                        </div>
                        <div>
                            <span class="label">Printed On</span>
                            <div class="value">${escapeHtml(printedOn)}</div>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Branch</th>
                                <th>Company</th>
                                <th>Vehicle</th>
                                <th>Type</th>
                                <th>Color</th>
                                <th>Description</th>
                                <th>Opening Qty</th>
                                <th>In Transit</th>
                                <th>Sales Qty</th>
                                <th>Closing Qty</th>
                                <th>Closing Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportStockInventoryRows.map((row) => `
                                <tr>
                                    <td>${escapeHtml(row.branch_name || 'Main Branch')}</td>
                                    <td>${escapeHtml(row.company_name || 'Not set')}</td>
                                    <td>${escapeHtml(`${row.brand} ${row.model}`)}<br />${escapeHtml(row.serial_number || row.registration_number || 'No serial')}</td>
                                    <td>${escapeHtml(row.vehicle_type)}</td>
                                    <td>${escapeHtml(row.color || 'Not set')}</td>
                                    <td>${escapeHtml(row.product_description || 'No description')}</td>
                                    <td>${escapeHtml(String(row.opening_quantity || 0))}</td>
                                    <td>${escapeHtml(String(row.intransit_quantity || 0))}</td>
                                    <td>${escapeHtml(String(row.total_sales_quantity || 0))}</td>
                                    <td>${escapeHtml(String(row.closing_quantity || 0))}</td>
                                    <td>${escapeHtml(formatCurrency(row.closing_value || 0))}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else if (activePage === 'report-daily-sales') {
            reportTitle = `Daily Sale Report - ${reportRangeLabel}`;
            bodyHtml = `
                <div class="page">
                    ${renderPrintBrandBlock()}
                    <div class="header">
                        <div>
                            <p class="kicker">${escapeHtml(appBrandName)} Reports</p>
                            <h1>Daily Transactions Sale Report</h1>
                            <p class="subtitle">Date range ${escapeHtml(reportRangeLabel)} with branch, mode, status, and keyword filters.</p>
                        </div>
                        <div>
                            <span class="label">Printed On</span>
                            <div class="value">${escapeHtml(printedOn)}</div>
                        </div>
                    </div>
                    <div class="stats">
                        <div class="stat"><span class="label">Deals</span><strong>${escapeHtml(String(reportSalesTotals.deals))}</strong></div>
                        <div class="stat"><span class="label">Total Amount</span><strong>${escapeHtml(formatCurrency(reportSalesTotals.amount))}</strong></div>
                        <div class="stat"><span class="label">Received</span><strong>${escapeHtml(formatCurrency(reportSalesTotals.received))}</strong></div>
                        <div class="stat"><span class="label">Pending</span><strong>${escapeHtml(formatCurrency(reportSalesTotals.pending))}</strong></div>
                        <div class="stat"><span class="label">Total Commission</span><strong>${escapeHtml(formatCurrency(reportSalesCommissionTotal))}</strong></div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Vehicle</th>
                                <th>Mode</th>
                                <th>Branch</th>
                                <th>Status</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportSalesRows.map((sale) => `
                                <tr>
                                    <td>${escapeHtml(String(sale.purchase_date || sale.agreement_date || sale.created_at || '').slice(0, 10) || 'Not set')}</td>
                                    <td>${escapeHtml(sale.customer_name || 'Not set')}</td>
                                    <td>${escapeHtml(`${sale.brand || ''} ${sale.model || ''}`.trim() || 'Not set')}</td>
                                    <td>${escapeHtml(sale.sale_mode || 'Not set')}</td>
                                    <td>${escapeHtml(getReportBranchValue(sale))}</td>
                                    <td>${escapeHtml(String(sale.report_status || sale.status || 'Not set').toUpperCase())}</td>
                                    <td>${escapeHtml(formatCurrency(sale.vehicle_price || 0))}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else if (activePage === 'report-stock-received') {
            reportTitle = `Daily Stock Received Report - ${reportRangeLabel}`;
            bodyHtml = `
                <div class="page">
                    ${renderPrintBrandBlock()}
                    <div class="header">
                        <div>
                            <p class="kicker">${escapeHtml(appBrandName)} Reports</p>
                            <h1>Daily Stock Received Report</h1>
                            <p class="subtitle">Received stock within ${escapeHtml(reportRangeLabel)} with branch and status filters.</p>
                        </div>
                        <div>
                            <span class="label">Printed On</span>
                            <div class="value">${escapeHtml(printedOn)}</div>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Company</th>
                                <th>Vehicle</th>
                                <th>Branch</th>
                                <th>Received</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportStockReceivedRows.map((row) => `
                                <tr>
                                    <td>${escapeHtml(String(row.received_at || row.updated_at || row.created_at || '').slice(0, 10) || 'Not set')}</td>
                                    <td>${escapeHtml(row.company_name || 'Not set')}</td>
                                    <td>${escapeHtml(`${row.brand || ''} ${row.model || ''}`.trim() || 'Not set')}</td>
                                    <td>${escapeHtml(getReportBranchValue(row))}</td>
                                    <td>${escapeHtml(Number(row.received_quantity || 0) > 0 ? 'Yes' : 'Pending')}</td>
                                    <td>${escapeHtml(row.order_status || row.status || 'Not set')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else if (activePage === 'report-customers') {
            reportTitle = 'Customer Report';
            bodyHtml = `
                <div class="page">
                    ${renderPrintBrandBlock()}
                    <div class="header">
                        <div>
                            <p class="kicker">${escapeHtml(appBrandName)} Reports</p>
                            <h1>Customer Report</h1>
                            <p class="subtitle">Customer registry with branch, status, and keyword filters.</p>
                        </div>
                        <div>
                            <span class="label">Printed On</span>
                            <div class="value">${escapeHtml(printedOn)}</div>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>CNIC</th>
                                <th>Status</th>
                                <th>Country</th>
                                <th>Branch</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportCustomerRows.map((row) => `
                                <tr>
                                    <td>${escapeHtml(row.full_name || 'Not set')}</td>
                                    <td>${escapeHtml(row.cnic_passport_number || 'Not set')}</td>
                                    <td>${escapeHtml(row.report_status || 'PENDING')}</td>
                                    <td>${escapeHtml(row.ocr_details?.country || 'Not set')}</td>
                                    <td>${escapeHtml(row.branch_name || 'Main Branch')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else if (activePage === 'report-customer-transactions') {
            reportTitle = `Customer Transaction Report - ${reportRangeLabel}`;
            bodyHtml = `
                <div class="page">
                    ${renderPrintBrandBlock()}
                    <div class="header">
                        <div>
                            <p class="kicker">${escapeHtml(appBrandName)} Reports</p>
                            <h1>Customer Transaction Report</h1>
                            <p class="subtitle">Cash and installment purchases with received installment dates.</p>
                        </div>
                        <div>
                            <span class="label">Printed On</span>
                            <div class="value">${escapeHtml(printedOn)}</div>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Vehicle</th>
                                <th>Mode</th>
                                <th>Status</th>
                                <th>Received Installment Dates</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportCustomerTransactionRows.map((row) => `
                                <tr>
                                    <td>${escapeHtml(String(row.purchase_date || row.agreement_date || row.created_at || '').slice(0, 10) || 'Not set')}</td>
                                    <td>${escapeHtml(row.customer_name || 'Not set')}</td>
                                    <td>${escapeHtml(`${row.brand || ''} ${row.model || ''}`.trim() || 'Not set')}</td>
                                    <td>${escapeHtml(row.sale_mode || 'Not set')}</td>
                                    <td>${escapeHtml(row.status || 'Not set')}</td>
                                    <td>${escapeHtml(row.sale_mode === 'INSTALLMENT' ? row.received_installment_dates_label : 'Cash sale')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else if (activePage === 'report-business-transactions') {
            reportTitle = `Business Transaction Report - ${reportRangeLabel}`;
            bodyHtml = `
                <div class="page">
                    ${renderPrintBrandBlock()}
                    <div class="header">
                        <div>
                            <p class="kicker">${escapeHtml(appBrandName)} Reports</p>
                            <h1>Business Transaction Report</h1>
                            <p class="subtitle">Actual price, selling price, and profit or loss by transaction.</p>
                        </div>
                        <div>
                            <span class="label">Printed On</span>
                            <div class="value">${escapeHtml(printedOn)}</div>
                        </div>
                    </div>
                    <div class="stats">
                        <div class="stat"><span class="label">Actual Value</span><strong>${escapeHtml(formatCurrency(reportBusinessTotals.actual))}</strong></div>
                        <div class="stat"><span class="label">Selling Value</span><strong>${escapeHtml(formatCurrency(reportBusinessTotals.selling))}</strong></div>
                        <div class="stat"><span class="label">Profit</span><strong>${escapeHtml(formatCurrency(reportBusinessTotals.profit))}</strong></div>
                        <div class="stat"><span class="label">Loss</span><strong>${escapeHtml(formatCurrency(reportBusinessTotals.loss))}</strong></div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Vehicle</th>
                                <th>Mode</th>
                                <th>Actual Price</th>
                                <th>Selling Price</th>
                                <th>Profit / Loss</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportBusinessTransactionRows.map((row) => `
                                <tr>
                                    <td>${escapeHtml(String(row.purchase_date || row.agreement_date || row.created_at || '').slice(0, 10) || 'Not set')}</td>
                                    <td>${escapeHtml(row.customer_name || 'Not set')}</td>
                                    <td>${escapeHtml(`${row.brand || ''} ${row.model || ''}`.trim() || 'Not set')}</td>
                                    <td>${escapeHtml(row.sale_mode || 'Not set')}</td>
                                    <td>${escapeHtml(formatCurrency(row.actual_price || 0))}</td>
                                    <td>${escapeHtml(formatCurrency(row.selling_price || 0))}</td>
                                    <td>${escapeHtml(formatCurrency(row.profit_loss || 0))}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else if (activePage === 'report-invoice-view') {
            reportTitle = `Invoice View Report - ${reportRangeLabel}`;
            bodyHtml = `
                <div class="page">
                    ${renderPrintBrandBlock()}
                    <div class="header">
                        <div>
                            <p class="kicker">${escapeHtml(appBrandName)} Reports</p>
                            <h1>Invoice View Report</h1>
                            <p class="subtitle">Transactions ready for invoice opening with branch, mode, status, and date filters.</p>
                        </div>
                        <div>
                            <span class="label">Printed On</span>
                            <div class="value">${escapeHtml(printedOn)}</div>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Vehicle</th>
                                <th>Mode</th>
                                <th>Branch</th>
                                <th>Status</th>
                                <th>Agreement</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportInvoiceRows.map((row) => `
                                <tr>
                                    <td>${escapeHtml(String(row.purchase_date || row.agreement_date || row.created_at || '').slice(0, 10) || 'Not set')}</td>
                                    <td>${escapeHtml(row.customer_name || 'Not set')}</td>
                                    <td>${escapeHtml(`${row.brand || ''} ${row.model || ''}`.trim() || 'Not set')}</td>
                                    <td>${escapeHtml(row.sale_mode || 'Not set')}</td>
                                    <td>${escapeHtml(row.branch_name || 'Main Branch')}</td>
                                    <td>${escapeHtml(row.status || 'Not set')}</td>
                                    <td>${escapeHtml(row.agreement_number || 'Not set')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else if (activePage === 'report-employees') {
            reportTitle = 'Employees Report';
            bodyHtml = `
                <div class="page">
                    ${renderPrintBrandBlock()}
                    <div class="header">
                        <div>
                            <p class="kicker">${escapeHtml(appBrandName)} Reports</p>
                            <h1>Employees Report</h1>
                            <p class="subtitle">Employee records with branch, status, and keyword filters.</p>
                        </div>
                        <div>
                            <span class="label">Printed On</span>
                            <div class="value">${escapeHtml(printedOn)}</div>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Code</th>
                                <th>Department</th>
                                <th>Commission %</th>
                                <th>Commission Value</th>
                                <th>Total Earned Commission</th>
                                <th>Outstanding Advance</th>
                                <th>Status</th>
                                <th>Branch</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportEmployeeRows.map((row) => `
                                <tr>
                                    <td>${escapeHtml(row.full_name || 'Not set')}</td>
                                    <td>${escapeHtml(row.employee_code || 'Not set')}</td>
                                    <td>${escapeHtml(row.department || 'Not set')}</td>
                                    <td>${escapeHtml(`${Number(row.commission_percentage || 0)}%`)}</td>
                                    <td>${escapeHtml(formatCurrency(row.commission_value || 0))}</td>
                                    <td>${escapeHtml(formatCurrency(row.earned_commission || 0))}</td>
                                    <td>${escapeHtml(formatCurrency(row.outstanding_advance || 0))}</td>
                                    <td>${escapeHtml(row.report_status || 'Not set')}</td>
                                    <td>${escapeHtml(row.branch_name || 'Main Branch')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else if (activePage === 'report-salary') {
            reportTitle = 'Salary Report';
            bodyHtml = `
                <div class="page">
                    ${renderPrintBrandBlock()}
                    <div class="header">
                        <div>
                            <p class="kicker">${escapeHtml(appBrandName)} Reports</p>
                            <h1>Salary Report</h1>
                            <p class="subtitle">Generated payroll records with branch and date filters.</p>
                        </div>
                        <div>
                            <span class="label">Printed On</span>
                            <div class="value">${escapeHtml(printedOn)}</div>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Code</th>
                                <th>Payroll Month</th>
                                <th>Base Salary</th>
                                <th>Commission</th>
                                <th>Advance Deduction</th>
                                <th>Net Salary</th>
                                <th>Branch</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportSalaryRows.map((row) => `
                                <tr>
                                    <td>${escapeHtml(row.full_name || 'Not set')}</td>
                                    <td>${escapeHtml(row.employee_code || 'Not set')}</td>
                                    <td>${escapeHtml(row.payroll_month || 'Not set')}</td>
                                    <td>${escapeHtml(formatCurrency(row.base_salary || 0))}</td>
                                    <td>${escapeHtml(formatCurrency(row.total_commission || 0))}</td>
                                    <td>${escapeHtml(formatCurrency(row.total_advances || 0))}</td>
                                    <td>${escapeHtml(formatCurrency(row.net_salary || 0))}</td>
                                    <td>${escapeHtml(row.branch_name || 'Main Branch')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else if (activePage === 'report-dealer-information') {
            reportTitle = 'Dealer Information Report';
            bodyHtml = `
                <div class="page">
                    ${renderPrintBrandBlock()}
                    <div class="header">
                        <div>
                            <p class="kicker">${escapeHtml(appBrandName)} Reports</p>
                            <h1>Dealer Information Report</h1>
                            <p class="subtitle">Dealer profile details with employee directory grouped under each dealer.</p>
                        </div>
                        <div>
                            <span class="label">Printed On</span>
                            <div class="value">${escapeHtml(printedOn)}</div>
                        </div>
                    </div>
                    ${reportDealerInformationRows.map((dealer) => `
                        <div class="section">
                            <h2>${escapeHtml(dealer.dealer_name || 'Dealer')}</h2>
                            <p><strong>Code:</strong> ${escapeHtml(dealer.dealer_code || 'Not set')}</p>
                            <p><strong>Address:</strong> ${escapeHtml(dealer.dealer_address || 'Not set')}</p>
                            <p><strong>Contact:</strong> ${escapeHtml([dealer.mobile_country_code, dealer.mobile_number].filter(Boolean).join(' ') || dealer.contact_email || 'Not set')}</p>
                            <p><strong>Currency:</strong> ${escapeHtml(dealer.currency_code || 'Not set')} | <strong>Status:</strong> ${escapeHtml(dealer.report_status || 'Not set')}</p>
                            <p><strong>Employees:</strong> ${escapeHtml(String(dealer.employee_count || 0))} total / ${escapeHtml(String(dealer.active_employee_count || 0))} active</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Code</th>
                                        <th>Email</th>
                                        <th>Department</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${dealer.employees.length > 0 ? dealer.employees.map((employee) => `
                                        <tr>
                                            <td>${escapeHtml(employee.full_name || 'Not set')}</td>
                                            <td>${escapeHtml(employee.employee_code || 'Not set')}</td>
                                            <td>${escapeHtml(employee.email || 'No email')}</td>
                                            <td>${escapeHtml(employee.department || 'Not set')}</td>
                                            <td>${escapeHtml(employee.role_name || 'No role')}</td>
                                            <td>${escapeHtml(employee.is_active ? 'ACTIVE' : 'INACTIVE')}</td>
                                        </tr>
                                    `).join('') : `
                                        <tr>
                                            <td colspan="6">No employees linked to this dealer.</td>
                                        </tr>
                                    `}
                                </tbody>
                            </table>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (activePage === 'report-dealer-employees') {
            reportTitle = 'Dealer Wise Employee Report';
            bodyHtml = `
                <div class="page">
                    ${renderPrintBrandBlock()}
                    <div class="header">
                        <div>
                            <p class="kicker">${escapeHtml(appBrandName)} Reports</p>
                            <h1>Dealer Wise Employee Report</h1>
                            <p class="subtitle">Dealer wise employee directory with hire date, designation, login email, and resignation status.</p>
                        </div>
                        <div>
                            <span class="label">Printed On</span>
                            <div class="value">${escapeHtml(printedOn)}</div>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Dealer</th>
                                <th>Employee</th>
                                <th>Designation</th>
                                <th>Code</th>
                                <th>Login Email</th>
                                <th>Hire Date</th>
                                <th>Resigned</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportDealerEmployeeRows.map((row) => `
                                <tr>
                                    <td>${escapeHtml(row.dealer_name || 'Not set')}<br>${escapeHtml(row.dealer_code || 'No dealer code')}</td>
                                    <td>${escapeHtml(row.full_name || 'Not set')}<br>${escapeHtml(row.role_name || 'No role')}</td>
                                    <td>${escapeHtml(row.designation || 'Not set')}</td>
                                    <td>${escapeHtml(row.employee_code || 'Not set')}</td>
                                    <td>${escapeHtml(row.login_email || 'No email')}</td>
                                    <td>${escapeHtml(String(row.hired_at || '').slice(0, 10) || 'Not set')}</td>
                                    <td>${escapeHtml(row.resigned_status || 'Not set')}</td>
                                    <td>${escapeHtml(row.status || 'Not set')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        openPrintWindow(reportTitle, bodyHtml);
    };

    const handlePrintInstallmentReceipt = (row) => {
        if (!selectedInstallmentSale) return;

        const context = getInstallmentReceiptContext(row);
        // Carry forward (customer meaning): unpaid amount of this month's planned installment
        // that will be added into the next month's payable amount.
        const carryForwardValue = Math.max(Number(row.carry_forward_amount || 0), 0);
        const carryForwardLabel = carryForwardValue > 0 ? formatCurrency(carryForwardValue) : formatCurrency(0);
        // Backend behavior: if partial, it increases the next installment amount by carryForward.
        // So the next month's payable is simply the next pending installment's amount (already adjusted).
        const nextMonthPayableRaw = Math.max(Number(context.nextMonthValue || 0), 0);
        const nextMonthPayable = Math.min(nextMonthPayableRaw, Math.max(Number(context.overallRemainingAfter || 0), 0));
        const bodyHtml = `
            <div class="page">
                ${renderPrintBrandBlock()}
                <div class="header">
                    <div>
                        <p class="kicker">${escapeHtml(appBrandName)} Receipt</p>
                        <h1>Installment Payment Invoice</h1>
                        <p class="subtitle">Single transaction receipt showing this month's balance, carry forward, and total remaining.</p>
                    </div>
                    <div>
                        <span class="label">Agreement No.</span>
                        <div class="value">${escapeHtml(selectedInstallmentSale.agreement_number || 'Not set')}</div>
                        <span class="label" style="margin-top:10px;">Transaction Date</span>
                        <div class="value">${escapeHtml(row.paid_date || row.due_date)}</div>
                        <span class="label" style="margin-top:10px;">Installment Month</span>
                        <div class="value">${escapeHtml(context.installmentMonthLabel)}</div>
                        <span class="label" style="margin-top:10px;">Status</span>
                        <div class="value">${escapeHtml(context.currentStatus)}</div>
                    </div>
                </div>
                <div class="hero">
                    ${selectedInstallmentImageUrl ? `<img src="${escapeHtml(selectedInstallmentImageUrl)}" alt="Vehicle" />` : `<div class="fallback">No vehicle image</div>`}
                    <div class="grid">
                        <div><span class="label">Customer</span><div class="value">${escapeHtml(selectedInstallmentSale.customer_name)}</div></div>
                        <div><span class="label">Customer CNIC</span><div class="value">${escapeHtml(selectedInstallmentSale.cnic_passport_number)}</div></div>
                        <div><span class="label">Dealer</span><div class="value">${escapeHtml(formatSaleDealerIdentity(selectedInstallmentSale))}</div></div>
                        <div><span class="label">Recorded By</span><div class="value">${escapeHtml(selectedInstallmentSale.agent_name || 'System')}</div></div>
                        <div><span class="label">Vehicle</span><div class="value">${escapeHtml(`${selectedInstallmentSale.brand} ${selectedInstallmentSale.model}`)}</div></div>
                        <div><span class="label">Registration</span><div class="value">${escapeHtml(selectedInstallmentSale.registration_number || 'Not set')}</div></div>
                        <div><span class="label">Installment No.</span><div class="value">${escapeHtml(String(row.installment_number))}</div></div>
                        <div><span class="label">Due Date</span><div class="value">${escapeHtml(row.due_date)}</div></div>
                        <div><span class="label">Planned Amount</span><div class="value">${escapeHtml(formatCurrency(row.amount))}</div></div>
                        <div><span class="label">Received Cash</span><div class="value">${escapeHtml(formatCurrency(row.received_amount))}</div></div>
                        <div><span class="label">Installment Remaining</span><div class="value">${escapeHtml(formatCurrency(context.installmentRemaining))}</div></div>
                        <div><span class="label">Carry Forward (Next Month Add)</span><div class="value">${escapeHtml(carryForwardLabel)}</div></div>
                        <div><span class="label">Next Month Payable</span><div class="value">${escapeHtml(formatCurrency(nextMonthPayable))}</div></div>
                        <div><span class="label">Payment Date</span><div class="value">${escapeHtml(context.currentDateLabel || 'Not available')}</div></div>
                    </div>
                </div>
                <div class="stats">
                    <div class="stat"><span class="label">Installment Month</span><strong>${escapeHtml(context.installmentMonthLabel)}</strong></div>
                    <div class="stat"><span class="label">Payment Month</span><strong>${escapeHtml(context.paymentMonthLabel)}</strong></div>
                    <div class="stat"><span class="label">Current Status</span><strong>${escapeHtml(context.currentStatus)}</strong></div>
                    <div class="stat"><span class="label">Total Remaining After</span><strong>${escapeHtml(formatCurrency(context.overallRemainingAfter))}</strong></div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Dealer</th>
                            <th>Vehicle</th>
                            <th>Received</th>
                            <th>Carry Forward</th>
                            <th>Next Month Payable</th>
                            <th>Total Remaining After</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${escapeHtml(selectedInstallmentSale.customer_name)}</td>
                            <td>${escapeHtml(formatSaleDealerIdentity(selectedInstallmentSale))}</td>
                            <td>${escapeHtml(`${selectedInstallmentSale.brand} ${selectedInstallmentSale.model}`)}</td>
                            <td>${escapeHtml(formatCurrency(row.received_amount))}</td>
                            <td>${escapeHtml(carryForwardLabel)}</td>
                            <td>${escapeHtml(formatCurrency(nextMonthPayable))}</td>
                            <td>${escapeHtml(formatCurrency(context.overallRemainingAfter))}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="approval-strip">
                    <div class="approval-card">
                        <span class="label">Biometric Thumb</span>
                        ${selectedInstallmentThumbUrl ? `<img src="${escapeHtml(selectedInstallmentThumbUrl)}" alt="Biometric thumb" />` : `<div class="empty">Thumb not attached</div>`}
                    </div>
                    <div class="approval-card">
                        <span class="label">Customer Signature</span>
                        ${selectedInstallmentSignatureUrl ? `<img src="${escapeHtml(selectedInstallmentSignatureUrl)}" alt="Customer signature" />` : `<div class="empty">Signature not attached</div>`}
                    </div>
                </div>
                <p class="footer" style="margin-top: 14px;">${escapeHtml(installmentServiceChargeNote)}</p>
                <p class="footer">This receipt covers installment ${escapeHtml(String(row.installment_number))} of ${escapeHtml(String(selectedInstallmentSale.installment_months || selectedInstallmentRows.length || 0))}.</p>
            </div>
        `;

        openPrintWindow(`Receipt ${selectedInstallmentSale.agreement_number || selectedInstallmentSale.id} - ${row.installment_number}`, bodyHtml);
    };

    const TABLE_INCREMENT = 5;

    const toggleExpandedTable = (key, nextCount) => {
        setExpandedTables((current) => ({
            ...current,
            [key]: nextCount,
        }));
    };

    const getVisibleRows = (key, rows) => {
        const visibleCount = expandedTables[key] || TABLE_INCREMENT;
        return rows.slice(0, visibleCount);
    };

    const renderTableLimitControl = (key, totalCount) => {
        if (totalCount <= TABLE_INCREMENT) return null;

        const visibleCount = Math.min(expandedTables[key] || TABLE_INCREMENT, totalCount);
        const remainingCount = Math.max(totalCount - visibleCount, 0);

        return (
            <div className="table-limit-controls">
                {remainingCount > 0 ? (
                    <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => toggleExpandedTable(key, Math.min(visibleCount + TABLE_INCREMENT, totalCount))}
                    >
                        {`View more (${Math.min(TABLE_INCREMENT, remainingCount)} more)`}
                    </button>
                ) : null}
                {visibleCount > TABLE_INCREMENT ? (
                    <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => toggleExpandedTable(key, Math.max(visibleCount - TABLE_INCREMENT, TABLE_INCREMENT))}
                    >
                        View less
                    </button>
                ) : null}
            </div>
        );
    };

    const renderMetricCard = (label, value, options = {}) => {
        const { valueClassName = '', iconKey = 'applications' } = options;

        return (
            <div className={`metric-card metric-card-${iconKey}`}>
                <span className={`metric-card-icon metric-card-icon-${iconKey}`} aria-hidden="true">
                    {metricIcons[iconKey] || metricIcons.applications}
                </span>
                <label>{label}</label>
                <div className={`value ${valueClassName}`.trim()}>{value}</div>
            </div>
        );
    };

    const renderReportFilters = (config = {}) => {
        const {
            title = 'Report Filters',
            showDateRange = true,
            showBranch = true,
            showAgent = false,
            agentLabel = 'Agent Name',
            showMode = false,
            statusOptions = [{ value: 'ALL', label: 'All' }],
            searchPlaceholder = 'Search report records...',
        } = config;

        return (
            <div className="table-card">
                <div className="section-header">
                    <h3>{title}</h3>
                    <button type="button" className="primary-btn" onClick={handlePrintReport}>Print Report</button>
                </div>
                <div className="form-grid">
                    {showDateRange ? (
                        <>
                            <label className="field">
                                <span>Date From</span>
                                <input type="date" value={reportDateFrom} onChange={(event) => setReportDateFrom(event.target.value)} />
                            </label>
                            <label className="field">
                                <span>Date To</span>
                                <input type="date" value={reportDateTo} onChange={(event) => setReportDateTo(event.target.value)} />
                            </label>
                        </>
                    ) : null}
                    {showBranch ? (
                        <label className="field">
                            <span>Branch Name</span>
                            <select value={reportBranchName} onChange={(event) => setReportBranchName(event.target.value)}>
                                {canViewAllReportBranches ? <option value="ALL">All</option> : null}
                                {reportBranchOptions.map((branchName) => (
                                    <option key={branchName} value={branchName}>
                                        {branchName}
                                    </option>
                                ))}
                            </select>
                        </label>
                    ) : null}
                    {showAgent ? (
                        <label className="field">
                            <span>{agentLabel}</span>
                            <select value={reportAgentName} onChange={(event) => setReportAgentName(event.target.value)}>
                                <option value="ALL">All</option>
                                {reportAgentOptions.map((agentName) => (
                                    <option key={agentName} value={agentName}>
                                        {agentName}
                                    </option>
                                ))}
                            </select>
                        </label>
                    ) : null}
                    {showMode ? (
                        <label className="field">
                            <span>Mode Filter</span>
                            <select value={reportSaleMode} onChange={(event) => setReportSaleMode(event.target.value)}>
                                <option value="ALL">All</option>
                                <option value="CASH">Cash</option>
                                <option value="INSTALLMENT">Installment</option>
                            </select>
                        </label>
                    ) : null}
                    <label className="field">
                        <span>Status Filter</span>
                        <select value={reportStatus} onChange={(event) => setReportStatus(event.target.value)}>
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="field full-span">
                        <span>Search</span>
                        <input value={reportKeyword} onChange={(event) => setReportKeyword(event.target.value)} placeholder={searchPlaceholder} />
                    </label>
                </div>
            </div>
        );
    };

    const renderReportsSelector = () => (
        <>
            <div className="page-heading">
                <h1>Reports</h1>
                <p>Click the report link you want, then use the matching filters and print button for that report only.</p>
            </div>

            <div className="table-card">
                <div className="section-header">
                    <h3>Select Report</h3>
                    <span className="section-caption">Choose the specific report hyperlink</span>
                </div>
                <div className="report-link-grid">
                    {reportLinks.map((report) => (
                        <button
                            key={report.key}
                            type="button"
                            className="report-link-card"
                            onClick={() => goToPage(report.key)}
                        >
                            <span className="report-link-label">{report.label}</span>
                            <span className="report-link-arrow">Open</span>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );

    const handleReceiveInstallment = async (installment) => {
        const installmentId = installment?.id;
        if (!installmentId) {
            return;
        }

        const showInstallmentPopupMessage = (message) => {
            setSaleMessage(message);
            window.alert(message);
        };

        const normalizedAmount = String(installmentReceiptInputs[installmentId] ?? '').trim();
        let payload = {};

        if (normalizedAmount) {
            const receivedAmount = Number(normalizedAmount);
            const receiptContext = getInstallmentReceiptContext(installment);

            if (!Number.isFinite(receivedAmount) || receivedAmount <= 0) {
                showInstallmentPopupMessage('Received amount must be greater than zero.');
                return;
            }

            if (receivedAmount > Number(receiptContext.remainingAmount || 0)) {
                showInstallmentPopupMessage('Received amount is not correct or greater than the total remaining amount.');
                return;
            }

            if (!receiptContext.nextMonthDate && receivedAmount < Number(receiptContext.remainingAmount || 0)) {
                showInstallmentPopupMessage(`Please enter the full remaining amount for the last installment: ${formatCurrency(receiptContext.remainingAmount)}.`);
                return;
            }

            payload = { received_amount: receivedAmount };
        }

        try {
            setReceivingInstallmentId(installmentId);
            await API.patch(`/sales/installments/${installmentId}/receive`, payload);
            await loadDashboard();
            setInstallmentReceiptInputs((current) => {
                const nextState = { ...current };
                delete nextState[installmentId];
                return nextState;
            });
            showInstallmentPopupMessage(normalizedAmount ? 'Installment receipt saved successfully.' : 'Monthly installment marked as received.');
        } catch (err) {
            showInstallmentPopupMessage(err.response?.data?.message || 'Unable to mark installment as received.');
        } finally {
            setReceivingInstallmentId('');
        }
    };

    const handleInstallmentReceiptInputChange = (installmentId, value) => {
        setInstallmentReceiptInputs((current) => ({
            ...current,
            [installmentId]: value,
        }));
    };

    const renderEmptyState = (message) => (
        <div className="empty-state">
            <p>{message}</p>
        </div>
    );

    const renderCustomerDetails = () => {
        if (!selectedCustomer) {
            return renderEmptyState('Select a customer to view OCR, identity, and biometric details.');
        }

        const isEditingSelectedCustomer = customerForm.id && customerForm.id === selectedCustomer.id;
        const ocrDetails = {
            ...(selectedCustomer.ocr_details || {}),
            identity_doc_back_url: isEditingSelectedCustomer
                ? (customerForm.identity_doc_back_url || selectedCustomer.ocr_details?.identity_doc_back_url || '')
                : (selectedCustomer.ocr_details?.identity_doc_back_url || ''),
        };
        const fingerprint = ocrDetails.fingerprint || {};
        const currentCustomerFrontUrl = isEditingSelectedCustomer
            ? (customerForm.identity_doc_url || selectedCustomer.identity_doc_url || '')
            : (selectedCustomer.identity_doc_url || '');

        return (
            <div className="table-card">
                <h3>
                    Customer Profile
                    {selectedCustomer.full_name ? ` • ${selectedCustomer.full_name}` : ''}
                </h3>
                <div className="detail-grid">
                    <div>
                        <span className="meta-label">Full Name</span>
                        <p className="meta-value">{selectedCustomer.full_name}</p>
                    </div>
                    <div>
                        <span className="meta-label">Document</span>
                        <p className="meta-value">{ocrDetails.document_type || 'Not tagged'}</p>
                    </div>
                    <div>
                        <span className="meta-label">CNIC / Passport</span>
                        <p className="meta-value">{selectedCustomer.cnic_passport_number}</p>
                    </div>
                    <div>
                        <span className="meta-label">Father Name</span>
                        <p className="meta-value">{ocrDetails.father_name || 'Not provided'}</p>
                    </div>
                    <div>
                        <span className="meta-label">Date Of Birth</span>
                        <p className="meta-value">{ocrDetails.date_of_birth || 'Not provided'}</p>
                    </div>
                    <div>
                        <span className="meta-label">Gender</span>
                        <p className="meta-value">{ocrDetails.gender || 'Not provided'}</p>
                    </div>
                    <div>
                        <span className="meta-label">Created By</span>
                        <p className="meta-value">{getCustomerCreatedByLabel(selectedCustomer)}</p>
                    </div>
                    <div>
                        <span className="meta-label">Assigned Dealer</span>
                        <p className="meta-value">{selectedCustomer.dealer_name || user?.dealer_name || 'Not set'}</p>
                    </div>
                    <div>
                        <span className="meta-label">Contact Email</span>
                        <p className="meta-value">{ocrDetails.contact_email || 'Not provided'}</p>
                    </div>
                    <div>
                        <span className="meta-label">Contact Phone</span>
                        <p className="meta-value">{ocrDetails.contact_phone || 'Not provided'}</p>
                    </div>
                    <div>
                        <span className="meta-label">Country</span>
                        <p className="meta-value">{ocrDetails.country || 'Not provided'}</p>
                    </div>
                    <div className="full-span">
                        <span className="meta-label">Address</span>
                        <p className="meta-value">{ocrDetails.address || 'Not provided'}</p>
                    </div>
                </div>

                <div className="feature-list">
                    <span className="feature-pill">{selectedCustomer.biometric_hash ? 'Fingerprint Enrolled' : 'Fingerprint Pending'}</span>
                    <span className="feature-pill">{ocrDetails.raw_ocr_text ? 'OCR Imported' : 'OCR Pending'}</span>
                    <span className="feature-pill">{currentCustomerFrontUrl ? 'Document Linked' : 'No Document URL'}</span>
                    <span className="feature-pill">{fingerprint.thumb_image_url ? 'Thumb Image Ready' : 'No Thumb Image'}</span>
                    <span className="feature-pill">{ocrDetails.signature_image_url ? 'Signature Ready' : 'No Signature'}</span>
                </div>

                <div className="scan-preview">
                    <div>
                        <span className="meta-label">Fingerprint Device</span>
                        <p className="meta-value">{fingerprint.device || 'Not recorded'}</p>
                    </div>
                    <div>
                        <span className="meta-label">Fingerprint Quality</span>
                        <p className="meta-value">{fingerprint.quality || 'Not recorded'}</p>
                    </div>
                    <div className="full-span">
                        <span className="meta-label">OCR Extracted Name</span>
                        <p className="meta-value">{ocrDetails.extracted_name || 'Not extracted yet'}</p>
                    </div>
                    <div>
                        <span className="meta-label">CNIC Front Preview</span>
                        <div className="employee-document-preview">
                            {currentCustomerFrontUrl ? (
                                isPreviewableImage(currentCustomerFrontUrl) ? (
                                    <img
                                        src={buildAssetUrl(currentCustomerFrontUrl)}
                                        alt="Customer CNIC front"
                                        className="employee-document-image"
                                    />
                                ) : isPreviewablePdf(currentCustomerFrontUrl) ? (
                                    <iframe
                                        src={buildAssetUrl(currentCustomerFrontUrl)}
                                        title="Customer CNIC front PDF"
                                        className="employee-document-frame"
                                    />
                                ) : (
                                    <a href={buildAssetUrl(currentCustomerFrontUrl)} target="_blank" rel="noreferrer" className="view-btn">
                                        Open CNIC Front
                                    </a>
                                )
                            ) : (
                                <div className="employee-document-empty">No CNIC front uploaded</div>
                            )}
                        </div>
                    </div>
                    <div>
                        <span className="meta-label">CNIC Back Preview</span>
                        <div className="employee-document-preview">
                            {ocrDetails.identity_doc_back_url ? (
                                isPreviewableImage(ocrDetails.identity_doc_back_url) ? (
                                    <img
                                        src={buildAssetUrl(ocrDetails.identity_doc_back_url)}
                                        alt="Customer CNIC back"
                                        className="employee-document-image"
                                    />
                                ) : isPreviewablePdf(ocrDetails.identity_doc_back_url) ? (
                                    <iframe
                                        src={buildAssetUrl(ocrDetails.identity_doc_back_url)}
                                        title="Customer CNIC back PDF"
                                        className="employee-document-frame"
                                    />
                                ) : (
                                    <a href={buildAssetUrl(ocrDetails.identity_doc_back_url)} target="_blank" rel="noreferrer" className="view-btn">
                                        Open CNIC Back
                                    </a>
                                )
                            ) : (
                                <div className="employee-document-empty">No CNIC back uploaded</div>
                            )}
                        </div>
                    </div>
                    <div>
                        <span className="meta-label">Thumb Preview</span>
                        {fingerprint.thumb_image_url ? <img src={buildAssetUrl(fingerprint.thumb_image_url)} alt="Thumbprint" className="product-thumb" /> : <p className="meta-value">Not uploaded</p>}
                    </div>
                    <div>
                        <span className="meta-label">Signature Preview</span>
                        {ocrDetails.signature_image_url ? <img src={buildAssetUrl(ocrDetails.signature_image_url)} alt="Signature" className="product-thumb" /> : <p className="meta-value">Not uploaded</p>}
                    </div>
                    <div className="full-span">
                        <span className="meta-label">OCR Text</span>
                        <pre className="scan-box">{ocrDetails.raw_ocr_text || 'No OCR text captured yet.'}</pre>
                    </div>
                    <div className="full-span">
                        <span className="meta-label">Biometric Hash</span>
                        <pre className="scan-box">{selectedCustomer.biometric_hash || 'No fingerprint hash stored yet.'}</pre>
                    </div>
                </div>
            </div>
        );
    };

    const renderEmployeeDetails = () => {
        if (!selectedEmployee) {
            return renderEmptyState('Select an employee to view assigned role and feature access.');
        }

        const isEditingSelectedEmployee = employeeForm.id && employeeForm.id === selectedEmployee.id;
        const currentEmployeeCnicNumber = isEditingSelectedEmployee
            ? (employeeForm.cnic_number || selectedEmployee.cnic_number || '')
            : (selectedEmployee.cnic_number || '');
        const currentEmployeeFrontUrl = isEditingSelectedEmployee
            ? (employeeForm.cnic_front_url || employeeForm.cnic_doc_url || selectedEmployee.cnic_front_url || selectedEmployee.cnic_doc_url || '')
            : (selectedEmployee.cnic_front_url || selectedEmployee.cnic_doc_url || '');
        const currentEmployeeBackUrl = isEditingSelectedEmployee
            ? (employeeForm.cnic_back_url || selectedEmployee.cnic_back_url || '')
            : (selectedEmployee.cnic_back_url || '');

        return (
            <div className="table-card">
                <h3>
                    Employee Access Profile
                    {selectedEmployee.full_name ? ` • ${selectedEmployee.full_name}` : ''}
                </h3>
                <div className="detail-grid">
                    <div>
                        <span className="meta-label">Employee</span>
                        <p className="meta-value">{selectedEmployee.full_name || 'Not set'}</p>
                    </div>
                    <div>
                        <span className="meta-label">Employee Code</span>
                        <p className="meta-value">{selectedEmployee.employee_code}</p>
                    </div>
                    <div>
                        <span className="meta-label">Role</span>
                        <p className="meta-value">{selectedEmployee.role_name || 'No role assigned'}</p>
                    </div>
                    <div>
                        <span className="meta-label">Assigned Dealer</span>
                        <p className="meta-value">{selectedEmployee.dealer_name || user?.dealer_name || 'Not set'}</p>
                    </div>
                    <div>
                        <span className="meta-label">Created By</span>
                        <p className="meta-value">{selectedEmployee.created_by_name || selectedEmployee.created_by_email || 'Not set'}</p>
                    </div>
                    <div>
                        <span className="meta-label">Position</span>
                        <p className="meta-value">{selectedEmployee.department || 'Not set'}</p>
                    </div>
                    <div>
                        <span className="meta-label">Designation</span>
                        <p className="meta-value">{selectedEmployee.job_title || 'Not set'}</p>
                    </div>
                    <div>
                        <span className="meta-label">Commission %</span>
                        <p className="meta-value">{Number(selectedEmployee.commission_percentage || 0)}%</p>
                    </div>
                    <div>
                        <span className="meta-label">Commission Value</span>
                        <p className="meta-value">{formatCurrency(selectedEmployee.commission_value || 0)}</p>
                    </div>
                    <div>
                        <span className="meta-label">Base Salary</span>
                        <p className="meta-value">{formatCurrency(selectedEmployee.base_salary || 0)}</p>
                    </div>
                    <div>
                        <span className="meta-label">Current Month Commission</span>
                        <p className="meta-value">{formatCurrency(selectedEmployeeCurrentMonthCommissions.reduce((sum, row) => sum + Number(row.commission_amount || 0), 0))}</p>
                    </div>
                    <div>
                        <span className="meta-label">Current Month Advance</span>
                        <p className="meta-value">{formatCurrency(selectedEmployeeCurrentMonthOutstandingAdvance || 0)}</p>
                    </div>
                    <div>
                        <span className="meta-label">Email</span>
                        <p className="meta-value break-anywhere">{selectedEmployee.email}</p>
                    </div>
                    <div>
                        <span className="meta-label">CNIC</span>
                        <p className="meta-value">{currentEmployeeCnicNumber || 'Not set'}</p>
                    </div>
                    <div>
                        <span className="meta-label">Status</span>
                        <p className="meta-value">{selectedEmployee.is_active ? 'Active' : 'Inactive'}</p>
                    </div>
                </div>

                <div className="scan-preview">
                    <div>
                        <span className="meta-label">CNIC Front Preview</span>
                        <div className="employee-document-preview">
                            {currentEmployeeFrontUrl ? (
                                isPreviewableImage(currentEmployeeFrontUrl) ? (
                                    <img
                                        src={buildAssetUrl(currentEmployeeFrontUrl)}
                                        alt={`${selectedEmployee.full_name} CNIC front`}
                                        className="employee-document-image"
                                    />
                                ) : isPreviewablePdf(currentEmployeeFrontUrl) ? (
                                    <iframe
                                        src={buildAssetUrl(currentEmployeeFrontUrl)}
                                        title={`${selectedEmployee.full_name} CNIC front PDF`}
                                        className="employee-document-frame"
                                    />
                                ) : (
                                    <a href={buildAssetUrl(currentEmployeeFrontUrl)} target="_blank" rel="noreferrer" className="view-btn">
                                        Open CNIC Front
                                    </a>
                                )
                            ) : (
                                <div className="employee-document-empty">No employee CNIC front uploaded</div>
                            )}
                        </div>
                    </div>
                    <div>
                        <span className="meta-label">CNIC Back Preview</span>
                        <div className="employee-document-preview">
                            {currentEmployeeBackUrl ? (
                                isPreviewableImage(currentEmployeeBackUrl) ? (
                                    <img
                                        src={buildAssetUrl(currentEmployeeBackUrl)}
                                        alt={`${selectedEmployee.full_name} CNIC back`}
                                        className="employee-document-image"
                                    />
                                ) : isPreviewablePdf(currentEmployeeBackUrl) ? (
                                    <iframe
                                        src={buildAssetUrl(currentEmployeeBackUrl)}
                                        title={`${selectedEmployee.full_name} CNIC back PDF`}
                                        className="employee-document-frame"
                                    />
                                ) : (
                                    <a href={buildAssetUrl(currentEmployeeBackUrl)} target="_blank" rel="noreferrer" className="view-btn">
                                        Open CNIC Back
                                    </a>
                                )
                            ) : (
                                <div className="employee-document-empty">No employee CNIC back uploaded</div>
                            )}
                        </div>
                    </div>
                </div>

                {canViewEmployeeRoleFeaturesDisplay ? (
                    <div className="feature-stack">
                        <div>
                            <span className="meta-label">Role and Features Display</span>
                            <div className="feature-list">
                                {(selectedEmployee.role_features || []).length > 0 ? (
                                    selectedEmployee.role_features.map((feature) => (
                                        <span key={`role-${selectedEmployee.id}-${feature.id}`} className="feature-pill">
                                            {feature.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="feature-pill muted">No role features</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <span className="meta-label">Extra Assigned Features</span>
                            <div className="feature-list">
                                {(selectedEmployee.assigned_features || []).length > 0 ? (
                                    selectedEmployee.assigned_features.map((feature) => (
                                        <span key={`assigned-${selectedEmployee.id}-${feature.id}`} className="feature-pill">
                                            {feature.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="feature-pill muted">No extra employee features</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <span className="meta-label">Restricted Features</span>
                            <div className="feature-list">
                                {(selectedEmployee.denied_features || []).length > 0 ? (
                                    selectedEmployee.denied_features.map((feature) => (
                                        <span key={`denied-${selectedEmployee.id}-${feature.id}`} className="feature-pill muted">
                                            {feature.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="feature-pill muted">No restricted features</span>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    };

    const workspaceContext = {
        actualVehiclePrice,
        advanceForm,
        appBrandAddress,
        appBrandContact,
        appBrandName,
        availableSalesVehicles,
        buildAssetUrl,
        canChangeEmployeeRecord,
        canCreateCustomerBiometric,
        canCreateSales,
        canDeleteCustomerRecord,
        canEditCustomerDealerDropdown,
        canEditCustomerRecord,
        canEditEmployees,
        canManageCustomers,
        canManageEmployees,
        canManageInstallments,
        canManageSales,
        canManageStock,
        canOpenCustomers,
        canOpenWorkflowWorkspace,
        canUnlockCustomerOwnership,
        canUnlockEmployeeSecurityFields,
        canUseOcr,
        canViewCustomerFingerprint,
        canViewCustomerForm,
        canViewCustomerRecord,
        canViewCustomerRegister,
        canViewInstallmentCollection,
        canViewInstallmentOverview,
        canViewSalesAgreementForm,
        canViewSalesAgreementSummary,
        canViewSalesInstallmentPreview,
        canViewSalesRegister,
        canUpdateSalesRegister,
        canViewTransactionRegister,
        canViewWorkflowConfig,
        canViewWorkflowTasks,
        completedWorkflowTasks,
        currentMonthPayrollRecords,
        currentPayrollMonth,
        currentSalesDealerSignatureUrl,
        customerDealerOptions,
        customerForm,
        customerMessage,
        customerOwnershipCandidates,
        dashboardData,
        editingSaleRecord,
        employeeForm,
        employeeFormRoleFeatures,
        employeeMessage,
        filteredCustomers,
        filteredEmployees,
        formatCompactCurrency,
        formatCurrency,
        formatSaleAgentIdentity,
        formatSaleDealerIdentity,
        formatWorkflowApprovalLine,
        formatWorkflowDealerIdentity,
        getDocumentDisplayName,
        getEmployeeEffectiveFeatureCount,
        getReportBranchValue,
        getStatusClass,
        getVisibleRows,
        handleAdvanceChange,
        handleAgreementUpload,
        handleCaptureFingerprint,
        handleCustomerAssetUpload,
        handleCustomerChange,
        handleCustomerSubmit,
        handleDeleteCustomer,
        handleDeleteEmployee,
        handleEditCustomer,
        handleEditEmployee,
        handleEditSale,
        handleEditWorkflowDefinition,
        handleEmployeeAdvanceSubmit,
        handleEmployeeChange,
        handleEmployeeDocumentUpload,
        handleEmployeeSubmit,
        handleGenerateEmployeeSalary,
        handleInstallmentReceiptInputChange,
        handleOpenInstallmentPage,
        handlePrintInstallmentReceipt,
        handlePrintInvoice,
        handlePrintSalarySlip,
        handlePrintTransaction,
        handleProcessOcr,
        handleReceiveInstallment,
        handleSaleChange,
        handleSaleDealerSignatureUpload,
        handleSaleDocumentUpload,
        handleSaleSubmit,
        handleViewSale,
        handleViewTransaction,
        handleWorkflowDefinitionChange,
        handleWorkflowDefinitionSubmit,
        handleWorkflowTaskAction,
        installmentMarkupPreview,
        installmentPreview,
        installmentReceiptInputs,
        installmentSales,
        installmentSummary,
        isPreviewableImage,
        isPreviewablePdf,
        isSelectedSaleVehicleAvailable,
        isSuperAdmin,
        payrollMonth,
        pendingWorkflowTasks,
        processingWorkflowTaskId,
        realIsSuperAdmin,
        receivingInstallmentId,
        renderAssetPreview,
        renderCustomerDetails,
        renderEmployeeDetails,
        renderEmptyState,
        renderMetricCard,
        renderReportFilters,
        renderReportsSelector,
        renderTableLimitControl,
        reportBusinessTotals,
        reportBusinessTransactionRows,
        reportCustomerRows,
        reportCustomerTransactionRows,
        reportDateFrom,
        reportDateTo,
        reportDealerEmployeeRows,
        reportDealerInformationRows,
        reportEmployeeRows,
        reportInvoiceRows,
        reportSalaryRows,
        reportSalesCommissionTotal,
        reportSalesRows,
        reportSalesTotals,
        reportStockInventoryRows,
        reportStockReceivedRows,
        resetCustomerForm,
        resetEmployeeForm,
        resetSaleForm,
        resetWorkflowDefinitionForm,
        resolvedBranchName,
        salaryEligibleEmployees,
        salaryGenerationEmployeeId,
        saleAuthorizedSignatureUrl,
        saleCustomerCnicBackUrl,
        saleCustomerCnicFrontUrl,
        saleDealerSignatureUrl,
        saleForm,
        saleFormReadOnly,
        saleMessage,
        salesVehicleDropdownOpen,
        salesVehicleOptions,
        savingAdvance,
        savingCustomer,
        savingEmployee,
        savingPayroll,
        savingSale,
        savingWorkflowDefinition,
        selectedCustomer,
        selectedEmployee,
        selectedEmployeeCurrentMonthAdvances,
        selectedEmployeeCurrentMonthCommissions,
        selectedEmployeeCurrentMonthPayrolls,
        selectedEmployeeId,
        selectedInstallmentAuthorizedSignaturePath,
        selectedInstallmentCnicFrontPath,
        selectedInstallmentImageUrl,
        selectedInstallmentSale,
        selectedInstallmentSignaturePath,
        selectedInstallmentThumbUrl,
        selectedSalaryEmployee,
        selectedSalaryEmployeeMonthCommission,
        selectedSalaryEmployeeOutstandingAdvance,
        selectedSaleCustomer,
        selectedSaleCustomerSignatureUrl,
        selectedSaleVehicle,
        selectedSaleVehicleName,
        selectedSaleVehicleSecondaryLine,
        selectedWorkflowTask,
        selectedWorkflowTaskGroup,
        setEmployeeAccessPopupOpen,
        setPayrollMonth,
        setSalaryGenerationEmployeeId,
        setSaleForm,
        setSalesVehicleDropdownOpen,
        setSelectedCustomerId,
        setSelectedEmployeeId,
        setSelectedInstallmentSaleId,
        setSelectedWorkflowTaskId,
        setTransactionActionState,
        setUploadingSaleAuthorizedSignature,
        setUploadingSaleBankCheck,
        setUploadingSaleMiscDocument,
        summarizeSaleInstallments,
        tableActionIcons,
        transactionActionState,
        transactionSales,
        uploadingAgreement,
        uploadingCustomerAsset,
        uploadingEmployeeDocument,
        uploadingSaleAuthorizedSignature,
        uploadingSaleBankCheck,
        uploadingSaleMiscDocument,
        user,
        visibleSelectedInstallmentRows,
        workflowDefinitionForm,
        workflowMessage,
        workflowRoleOptions,
    };

    const renderContent = () => {
        switch (activePage) {
            case 'applications':
                return <Applications
                    canViewApplications={canViewApplications}
                    adMessage={adMessage}
                    canManageAds={canManageAds}
                    handleAdSubmit={handleAdSubmit}
                    adForm={adForm}
                    handleAdChange={handleAdChange}
                    handleAdUpload={handleAdUpload}
                    resetAdForm={resetAdForm}
                    savingAd={savingAd}
                    adPreviewUrl={adPreviewUrl}
                    applicationAds={applicationAds}
                    dashboardData={dashboardData}
                    buildAssetUrl={buildAssetUrl}
                    handleAdEdit={handleAdEdit}
                    handleAdDelete={handleAdDelete}
                    canViewApplicationsList={canViewApplicationsList}
                    filteredApplications={filteredApplications}
                    renderEmptyState={renderEmptyState}
                    getVisibleRows={getVisibleRows}
                    getStatusClass={getStatusClass}
                    formatCurrency={formatCurrency}
                    renderTableLimitControl={renderTableLimitControl}
                />;

            case 'products':
                return <Products
                    canManageProducts={canManageProducts}
                    canViewProductForm={canViewProductForm}
                    handleProductSubmit={handleProductSubmit}
                    productForm={productForm}
                    resetProductForm={resetProductForm}
                    savingProduct={savingProduct}
                    productMessage={productMessage}
                    handleProductChange={handleProductChange}
                    dashboardData={dashboardData}
                    handleProductImageUpload={handleProductImageUpload}
                    formatCurrency={formatCurrency}
                    canViewProductTypeMaster={canViewProductTypeMaster}
                    vehicleTypeMessage={vehicleTypeMessage}
                    handleVehicleTypeSubmit={handleVehicleTypeSubmit}
                    newVehicleType={newVehicleType}
                    setNewVehicleType={setNewVehicleType}
                    savingVehicleType={savingVehicleType}
                    canViewProductRegister={canViewProductRegister}
                    filteredInventory={filteredInventory}
                    renderEmptyState={renderEmptyState}
                    buildAssetUrl={buildAssetUrl}
                    handleEditProduct={handleEditProduct}
                />;

            case 'companies':
                return <CompanyProfile
                    canManageStock={canManageStock}
                    canViewCompanyForm={canViewCompanyForm}
                    handleCompanySubmit={handleCompanySubmit}
                    companyForm={companyForm}
                    resetCompanyForm={resetCompanyForm}
                    savingCompany={savingCompany}
                    companyMessage={companyMessage}
                    handleCompanyChange={handleCompanyChange}
                    canViewCompanyDirectory={canViewCompanyDirectory}
                    dashboardData={dashboardData}
                    renderEmptyState={renderEmptyState}
                    handleEditCompany={handleEditCompany}
                    handleDeleteCompany={handleDeleteCompany}
                />;

            case 'workflow':
                return <Workflow ctx={workspaceContext} />;
            case 'user-tasks':
                return <UserTasks
                    canViewWorkflowTasks={canViewWorkflowTasks}
                    workflowTasksTableRef={workflowTasksTableRef}
                    pendingWorkflowTasks={pendingWorkflowTasks}
                    completedWorkflowTasks={completedWorkflowTasks}
                    workflowTaskGroups={workflowTaskGroups}
                    renderEmptyState={renderEmptyState}
                    getStatusClass={getStatusClass}
                    selectedWorkflowTaskId={selectedWorkflowTaskId}
                    formatWorkflowDealerIdentity={formatWorkflowDealerIdentity}
                    setSelectedWorkflowTaskId={setSelectedWorkflowTaskId}
                />;
            case 'sales':
                return <Sales ctx={workspaceContext} />;
            case 'transactions':
                return <Transactions ctx={workspaceContext} />;
            case 'reports':
                return <Reports ctx={workspaceContext} />;
            case 'report-stock-inventory':
                return <StockInventoryReport ctx={workspaceContext} />;
            case 'report-daily-sales':
                return <DailySalesReport ctx={workspaceContext} />;
            case 'report-stock-received':
                return <StockReceivedReport ctx={workspaceContext} />;
            case 'report-customers':
                return <CustomersReport ctx={workspaceContext} />;
            case 'report-customer-transactions':
                return <CustomerTransactionsReport ctx={workspaceContext} />;
            case 'report-business-transactions':
                return <BusinessTransactionsReport ctx={workspaceContext} />;
            case 'report-invoice-view':
                return <InvoiceViewReport ctx={workspaceContext} />;
            case 'report-employees':
                return <EmployeesReport ctx={workspaceContext} />;
            case 'report-salary':
                return <SalaryReport ctx={workspaceContext} />;
            case 'report-dealer-information':
                return <DealerInformationReport ctx={workspaceContext} />;
            case 'report-dealer-employees':
                return <DealerEmployeesReport ctx={workspaceContext} />;
            case 'stock':
                return <Stock
                    canManageStock={canManageStock}
                    canViewStockOrderForm={canViewStockOrderForm}
                    handleStockOrderSubmit={handleStockOrderSubmit}
                    savingStock={savingStock}
                    stockMessage={stockMessage}
                    stockOrderForm={stockOrderForm}
                    handleStockOrderChange={handleStockOrderChange}
                    dashboardData={dashboardData}
                    handleBankSlipUpload={handleBankSlipUpload}
                    uploadingBankSlip={uploadingBankSlip}
                    canViewStockReceived={canViewStockReceived}
                    receivedStockOrders={receivedStockOrders}
                    renderEmptyState={renderEmptyState}
                    getStatusClass={getStatusClass}
                    canViewStockRegister={canViewStockRegister}
                    pendingStockOrders={pendingStockOrders}
                    formatCurrency={formatCurrency}
                    buildAssetUrl={buildAssetUrl}
                    openStockReceiveModal={openStockReceiveModal}
                    handleResendStockOrderEmail={handleResendStockOrderEmail}
                />;

            case 'installments':
                return <Installments ctx={workspaceContext} />;
            case 'customers':
                return <Customers ctx={workspaceContext} />;
            case 'employees':
                return <Employees ctx={workspaceContext} />;
            case 'access':
                return <AccessControl
                    canManageAccess={canManageAccess}
                    accessMessage={accessMessage}
                    dashboardData={dashboardData}
                    savingAccess={savingAccess}
                    handleSaveRolePermissions={handleSaveRolePermissions}
                    ACCESS_PAGE_GROUPS={ACCESS_PAGE_GROUPS}
                    getUniqueFeatures={getUniqueFeatures}
                    featureByKey={featureByKey}
                    roleAssignments={roleAssignments}
                    openAccessPopup={openAccessPopup}
                />;

            case 'dealers':
                return <Dealers
                    canManageDealers={canManageDealers}
                    canViewDealerForm={canViewDealerForm}
                    handleDealerSubmit={handleDealerSubmit}
                    dealerForm={dealerForm}
                    resetDealerForm={resetDealerForm}
                    savingDealer={savingDealer}
                    dealerMessage={dealerMessage}
                    handleDealerChange={handleDealerChange}
                    handleDealerLogoUpload={handleDealerLogoUpload}
                    handleDealerSignatureUpload={handleDealerSignatureUpload}
                    renderAssetPreview={renderAssetPreview}
                    dashboardThemes={dashboardThemes}
                    dealerCountryOptions={dealerCountryOptions}
                    dashboardData={dashboardData}
                    setDealerForm={setDealerForm}
                    canViewDealerSummary={canViewDealerSummary}
                    canViewDealerDirectory={canViewDealerDirectory}
                    filteredDealers={filteredDealers}
                    renderEmptyState={renderEmptyState}
                    buildAssetUrl={buildAssetUrl}
                    getStatusClass={getStatusClass}
                    handleEditDealer={handleEditDealer}
                    handleDeleteDealer={handleDeleteDealer}
                />;

            default:
                return (
                    <>
                        <div className="page-heading">
                            <h1>Executive Overview</h1>
                            <p>
                                {Number(user?.role_id) === 3
                                    ? 'Tracking your sales pipeline, received business, and overdue follow-ups for this month.'
                                    : 'Monitoring live leasing activity, fleet readiness, customer onboarding, and revenue.'}
                            </p>
                        </div>

                        <div className="metrics-grid">
                            {Number(user?.role_id) === 3 ? (
                                <>
                                    <div className="metric-card"><label>Received Sales</label><div className="value success">{formatCompactCurrency(dashboardData.employeeSales.receivedValue)}</div></div>
                                    <div className="metric-card"><label>Pending Sales</label><div className="value warning">{formatCompactCurrency(dashboardData.employeeSales.pendingValue)}</div></div>
                                    <div className="metric-card"><label>Earned Commission</label><div className="value success">{formatCompactCurrency(employeeCurrentMonthCommission)}</div></div>
                                    <div className="metric-card"><label>Outstanding Advance</label><div className="value warning">{formatCompactCurrency(selectedEmployeeOutstandingAdvance)}</div></div>
                                    <div className="metric-card"><label>Overdue This Month</label><div className="value warning">{dashboardData.employeeSales.overdueFollowups}</div></div>
                                    <div className="metric-card"><label>Received Count</label><div className="value">{dashboardData.employeeSales.receivedCount}</div></div>
                                    <div className="metric-card"><label>Pending Count</label><div className="value">{dashboardData.employeeSales.pendingCount}</div></div>
                                    <div className="metric-card"><label>Visible Applications</label><div className="value">{filteredApplications.length}</div></div>
                                </>
                            ) : (
                                <>
                                    {canViewDashboardCardActiveLeases ? renderMetricCard('Total Settled Leases', overviewMetrics.settledLeases, { iconKey: 'leases' }) : null}
                                    {canViewDashboardCardPendingLeases ? renderMetricCard('Total Customer Pending Lease', overviewMetrics.pendingLeases, { valueClassName: 'warning', iconKey: 'tasks' }) : null}
                                    {canViewDashboardCardPendingTasks ? renderMetricCard('Total Pending Tasks', overviewMetrics.pendingTasks, { valueClassName: 'warning', iconKey: 'tasks' }) : null}
                                    {canViewDashboardCardTotalRevenue ? renderMetricCard('Total Revenue', formatCompactCurrency(overviewMetrics.totalRevenue), { valueClassName: 'success', iconKey: 'revenue' }) : null}
                                    {canViewDashboardCardEmployeeCommissions ? renderMetricCard('Total Employee Commissions', formatCompactCurrency(totalEmployeeCommission), { valueClassName: 'success', iconKey: 'employees' }) : null}
                                    {canViewDashboardCardTotalVehicles ? renderMetricCard('Total Vehicles', dashboardData.metrics.totalVehicles, { iconKey: 'vehicles' }) : null}
                                    {canViewDashboardCardTotalCustomers ? renderMetricCard('Total Customers', dashboardData.metrics.totalCustomers, { iconKey: 'customers' }) : null}
                                    {canViewDashboardCardTotalEmployees ? renderMetricCard('Total Employees', dashboardData.metrics.totalEmployees, { iconKey: 'employees' }) : null}
                                    {canViewDashboardCardActiveEmployees ? renderMetricCard('Total Active Employees', dashboardData.metrics.activeEmployees, { iconKey: 'employees' }) : null}
                                    {canViewDashboardCardTotalDealers ? renderMetricCard(isDealerScopedDashboard ? 'Visible Dealers' : 'Total Dealers', dashboardData.metrics.totalDealers, { iconKey: 'dealers' }) : null}
                                    {canViewDashboardCardActiveDealers ? renderMetricCard(isDealerScopedDashboard ? 'Visible Active Dealers' : 'Total Active Dealers', dashboardData.metrics.activeDealers, { iconKey: 'dealers' }) : null}
                                    {canViewDashboardCardScannedDocuments ? renderMetricCard('Total Scanned Documents', dashboardData.metrics.scannedDocuments, { iconKey: 'documents' }) : null}
                                    {canViewDashboardCardEnrolledBiometrics ? renderMetricCard('Total Enrolled Biometrics', dashboardData.metrics.enrolledBiometrics, { iconKey: 'biometrics' }) : null}
                                    {canViewDashboardCardTotalApplications ? renderMetricCard('Total Customer Leasing Applications', overviewMetrics.leasingApplications, { iconKey: 'applications' }) : null}
                                    {canViewDashboardCardCashTransactions ? renderMetricCard('Total Cash Transactions', overviewMetrics.cashTransactions, { iconKey: 'revenue' }) : null}
                                    {canViewDashboardCardInstallmentTransactions ? renderMetricCard('Total Installment Transactions', overviewMetrics.installmentTransactions, { iconKey: 'tasks' }) : null}
                                    {canViewDashboardCardReceivedInstallments ? renderMetricCard('Total Received Installments', overviewMetrics.receivedInstallments, { iconKey: 'applications' }) : null}
                                </>
                            )}
                        </div>

                        <div className="dashboard-split">
                            {canViewDashboardSalesPerformance ? (
                            <div className="table-card sales-insight-card">
                                <div className="section-header">
                                    <div>
                                        <h3>Sales Performance</h3>
                                        <p className="section-caption">Live comparison of actual cost, selling price, and realized profit for {salesAnalytics.monthLabel}.</p>
                                    </div>
                                    <span className="feature-pill">{salesAnalytics.totalDeals} total sales</span>
                                </div>

                                <div className="sales-summary-grid">
                                    <div className="sales-summary-stat">
                                        <span className="meta-label">Actual Value</span>
                                        <strong>{formatCompactCurrency(salesAnalytics.totals.actual)}</strong>
                                    </div>
                                    <div className="sales-summary-stat">
                                        <span className="meta-label">Selling Value</span>
                                        <strong>{formatCompactCurrency(salesAnalytics.totals.selling)}</strong>
                                    </div>
                                    <div className="sales-summary-stat">
                                        <span className="meta-label">Gross Profit</span>
                                        <strong>{formatCompactCurrency(salesAnalytics.totals.profit)}</strong>
                                    </div>
                                    <div className="sales-summary-stat">
                                        <span className="meta-label">Profit Margin</span>
                                        <strong>{roundCurrencyValue(salesAnalytics.profitMargin)}%</strong>
                                    </div>
                                </div>

                                {salesAnalytics.recentChart.length === 0 ? (
                                    renderEmptyState('No sales transactions are available yet for charting.')
                                ) : (
                                    <div className="sales-chart">
                                        {salesAnalytics.recentChart.map((sale) => (
                                            <div key={sale.id} className="sales-chart-item">
                                                <div className="sales-chart-bars">
                                                    <div className="sales-chart-bar actual" style={{ height: sale.actualHeight }} title={`Actual: ${formatCurrency(sale.actualPrice)}`} />
                                                    <div className="sales-chart-bar selling" style={{ height: sale.sellHeight }} title={`Selling: ${formatCurrency(sale.sellPrice)}`} />
                                                </div>
                                                <div className="sales-chart-meta">
                                                    <strong>{sale.shortLabel}</strong>
                                                    <span>{formatCompactCurrency(sale.actualPrice)} actual</span>
                                                    <span>{formatCompactCurrency(sale.sellPrice)} selling</span>
                                                    <span>{formatCurrency(sale.profit)} profit{sale.count > 1 ? ` across ${sale.count} sales` : ''}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            ) : null}

                            {canViewDashboardProfitTransactions ? (
                            <div className="table-card sales-insight-card">
                                <div className="section-header">
                                    <div>
                                        <h3>Recent Profit Transactions</h3>
                                        <p className="section-caption">Actual price, selling price, and profit shown for {salesAnalytics.monthLabel}.</p>
                                    </div>
                                </div>

                                {salesAnalytics.recentTransactions.length === 0 ? (
                                    renderEmptyState(`No sales transactions recorded in ${salesAnalytics.monthLabel} yet.`)
                                ) : (
                                    <>
                                        <table className="pro-table">
                                            <thead>
                                                <tr>
                                                    <th>Vehicle</th>
                                                    <th>Employee</th>
                                                    <th>Actual</th>
                                                    <th>Selling</th>
                                                    <th>Profit</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getVisibleRows('recent-profit-transactions', salesAnalytics.recentTransactions).map((sale) => (
                                                    <tr key={sale.id}>
                                                        <td>{sale.customer_name}<br />{[sale.brand, sale.model].filter(Boolean).join(' ')}</td>
                                                        <td>{sale.agent_name || 'System'}<br />{sale.dealer_name || 'Not set'}</td>
                                                        <td>{formatCurrency(sale.actualPrice)}</td>
                                                        <td>{formatCurrency(sale.sellPrice)}</td>
                                                        <td>{formatCurrency(sale.profit)}</td>
                                                        <td><span className={getStatusClass(sale.status)}>{sale.status}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {renderTableLimitControl('recent-profit-transactions', salesAnalytics.recentTransactions.length)}
                                    </>
                                )}
                            </div>
                            ) : null}
                        </div>

                        {canViewDashboardCompanyProfitability ? (
                        <div className="table-card sales-insight-card">
                            <div className="section-header">
                                <div>
                                    <h3>Company Business Profitability</h3>
                                    <p className="section-caption">Company-wise actual cost, selling value, and profit or loss for {salesAnalytics.monthLabel}.</p>
                                </div>
                            </div>

                            {companyBusinessAnalytics.length === 0 ? (
                                renderEmptyState(`No company profitability data available in ${salesAnalytics.monthLabel} yet.`)
                            ) : (
                                <>
                                    <table className="pro-table">
                                        <thead>
                                            <tr>
                                                <th>Company</th>
                                                <th>Deals</th>
                                                <th>Actual Cost</th>
                                                <th>Selling Value</th>
                                                <th>Profit / Loss</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getVisibleRows('company-profitability', companyBusinessAnalytics).map((row) => (
                                                <tr key={row.companyName}>
                                                    <td>{row.companyName}</td>
                                                    <td>{row.deals}</td>
                                                    <td>{formatCurrency(row.actual)}</td>
                                                    <td>{formatCurrency(row.selling)}</td>
                                                    <td>
                                                        <span className={row.profit >= 0 ? 'pill-active' : 'pill-warning'}>
                                                            {formatCurrency(row.profit)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {renderTableLimitControl('company-profitability', companyBusinessAnalytics.length)}
                                </>
                            )}
                        </div>
                        ) : null}

                        <div className="dashboard-split">
                            {canViewDashboardRecentApplications ? (
                            <div className="table-card">
                                <h3>{Number(user?.role_id) === 3 ? 'My Applications' : 'Recent Applications'}</h3>
                                {filteredApplications.length === 0 ? (
                                    renderEmptyState('No lease applications are available yet. Create one to see it here.')
                                ) : (
                                    <>
                                        <table className="pro-table">
                                            <thead>
                                                <tr>
                                                    <th>Client Name</th>
                                                    <th>Vehicle Model</th>
                                                    <th>Status</th>
                                                    <th>Monthly Rate</th>
                                                    <th>Total Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getVisibleRows('recent-applications', filteredApplications).map((application) => (
                                                    <tr key={application.id}>
                                                        <td>{application.customer_name || 'Unassigned Customer'}</td>
                                                        <td>{[application.brand, application.model].filter(Boolean).join(' ') || 'Vehicle Pending'}</td>
                                                        <td><span className={getStatusClass(application.status)}>{application.status || 'Unknown'}</span></td>
                                                        <td>{formatCurrency(application.monthly_installment)}</td>
                                                        <td>{formatCurrency(application.total_amount)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {renderTableLimitControl('recent-applications', filteredApplications.length)}
                                    </>
                                )}
                            </div>
                            ) : null}

                            {canViewDashboardRecentEmployees ? (
                            <div className="table-card">
                                <h3>Recent Employees</h3>
                                {dashboardData.employees.length === 0 ? (
                                    renderEmptyState('No employees have been created yet.')
                                ) : (
                                    <>
                                        <table className="pro-table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Code</th>
                                                    <th>Role</th>
                                                    <th>Features</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getVisibleRows('recent-employees', dashboardData.employees).map((employee) => {
                                                    return (
                                                        <tr key={employee.id}>
                                                            <td>{employee.full_name}<br />{employee.job_title || employee.department || 'No designation'}<br />{employee.dealer_name || 'Not set'}</td>
                                                            <td>{employee.employee_code}</td>
                                                            <td>{employee.role_name || 'No role'}</td>
                                            <td>{getEmployeeEffectiveFeatureCount(employee)}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                        {renderTableLimitControl('recent-employees', dashboardData.employees.length)}
                                    </>
                                )}
                            </div>
                            ) : null}
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="dashboard-layout" data-theme={dashboardTheme}>
            <aside className="app-sidebar">
                <nav className="side-nav">
                    {tabReferences.filter((tab) => tab.visible).map((tab) => {
                        if (tab.key === 'reports') {
                            return (
                                <div key={tab.key} className={`nav-group ${isReportPage ? 'open' : ''}`}>
                                    <button
                                        type="button"
                                        className={`nav-btn nav-btn-parent ${isReportPage ? 'active' : ''}`}
                                        onClick={() => {
                                            setReportsMenuOpen((current) => !current);
                                            goToPage('reports');
                                        }}
                                        title={tab.featureRef}
                                    >
                                        <span className="nav-btn-content">
                                            <span className={`nav-btn-icon nav-btn-icon-${tab.key}`} aria-hidden="true">{sidebarTabIcons[tab.key] || metricIcons.documents}</span>
                                            <span className="nav-btn-label">{tab.label}</span>
                                        </span>
                                        <span className={`nav-arrow ${reportsMenuOpen ? 'open' : ''}`}>▸</span>
                                    </button>
                                    {reportsMenuOpen ? (
                                        <div className="nav-submenu">
                                            {reportLinks.map((report) => (
                                                <button
                                                    key={report.key}
                                                    type="button"
                                                    className={`nav-sub-btn ${activePage === report.key ? 'active' : ''}`}
                                                    onClick={() => goToPage(report.key)}
                                                >
                                                    {report.label}
                                                </button>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            );
                        }

                        return (
                            <button
                                key={tab.key}
                                className={`nav-btn ${activePage === tab.key ? 'active' : ''}`}
                                onClick={() => goToPage(tab.key)}
                                title={tab.featureRef}
                            >
                                <span className="nav-btn-content">
                                    <span className={`nav-btn-icon nav-btn-icon-${tab.key}`} aria-hidden="true">{sidebarTabIcons[tab.key] || metricIcons.documents}</span>
                                    <span className="nav-btn-label">{tab.label}</span>
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            <header className="dashboard-header">
                <div className="header-main">
                    <div className="header-dealer-banner">
                        {dealerBrandLogo ? (
                            <img src={dealerBrandLogo} alt={appBrandName} className="header-dealer-logo" />
                        ) : (
                            <div className="header-dealer-logo fallback">{getInitials(appBrandName)}</div>
                        )}
                        <div className="header-dealer-copy">
                            <strong>{appBrandName}</strong>
                            <span>{`Address: ${appBrandAddress}`}</span>
                        </div>
                    </div>
                </div>

                <div className="user-meta">
                    {canUseProfileSwitch ? (
                        <div className="profile-switcher-wrap">
                            <label className="profile-switcher">
                                <span>Profile</span>
                                <select value={currentProfileDealerId} onChange={handleSuperAdminProfileSwitch} disabled={switchingProfile}>
                                    <option value="">Super Admin Profile</option>
                                    {(dashboardData.dealers || []).map((dealer) => (
                                        <option key={`profile-switch-${dealer.id}`} value={dealer.id}>
                                            {dealer.dealer_name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            {isDealerProfileSwitchActive ? (
                                <button
                                    type="button"
                                    className="secondary-btn profile-revert-btn"
                                    onClick={handleRevertSuperAdminProfile}
                                    disabled={switchingProfile}
                                >
                                    {switchingProfile ? 'Switching...' : 'Back to Super Admin'}
                                </button>
                            ) : null}
                        </div>
                    ) : null}
                    {canManageThemes ? (
                        <label className="theme-switcher">
                            <span>Theme</span>
                            <select value={pendingDashboardTheme} onChange={(event) => setPendingDashboardTheme(event.target.value)}>
                                {dashboardThemes.map((theme) => (
                                    <option key={theme.key} value={theme.key}>
                                        {theme.label}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                className="primary-btn theme-apply-btn"
                                onClick={() => {
                                    setHasThemePreference(true);
                                    setDashboardTheme(pendingDashboardTheme);
                                }}
                                disabled={pendingDashboardTheme === dashboardTheme}
                            >
                                Apply Theme
                            </button>
                        </label>
                    ) : null}
                    <div className="agent-strip">
                        <span className="agent-strip-label">Agent</span>
                        <strong>{displayUserName}</strong>
                    </div>
                    <div className="notification-wrap" onClick={(event) => event.stopPropagation()}>
                        <button
                            type="button"
                            className={`notification-btn ${unreadNotifications.length > 0 ? 'has-unread' : 'quiet'} ${notificationsOpen ? 'open' : ''}`}
                            onClick={toggleNotificationsPanel}
                            title={unreadNotifications.length > 0 ? `${unreadNotifications.length} unread notification(s)` : 'No unread notifications'}
                        >
                            <span className={`notification-icon ${unreadNotifications.length > 0 ? 'ringing' : 'silent'}`} aria-hidden="true">{unreadNotifications.length > 0 ? '🔔' : '🔕'}</span>
                            {unreadNotifications.length > 0 ? (
                                <span className="notification-badge">{Math.min(unreadNotifications.length, 9)}{unreadNotifications.length > 9 ? '+' : ''}</span>
                            ) : null}
                        </button>
                        {notificationsOpen ? (
                            <div className="notification-panel">
                                <div className="section-header">
                                    <div>
                                        <h3>Notifications</h3>
                                        <p className="section-caption">{unreadNotifications.length} unread update(s)</p>
                                    </div>
                                    <button type="button" className="view-btn" onClick={() => { void markNotificationsAsSeen(); }}>
                                        Mark Read
                                    </button>
                                </div>
                                {notificationItems.length === 0 ? (
                                    <div className="feedback-card">No transaction notifications yet.</div>
                                ) : (
                                    <div className="notification-list">
                                        {notificationItems.map((item) => {
                                            const isUnread = unreadNotifications.some((notification) => notification.id === item.id);
                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    className={`notification-item ${isUnread ? 'unread' : 'read'}`}
                                                    onClick={() => handleNotificationClick(item)}
                                                >
                                                    <span className="notification-item-title">{item.title}</span>
                                                    <span className="notification-item-desc">{item.description}</span>
                                                    <span className="notification-item-time">{String(item.occurredAt || '').slice(0, 16).replace('T', ' ')}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>
                    <div className="profile-wrap" onClick={(event) => event.stopPropagation()}>
                        <button
                            type="button"
                            className={`avatar avatar-button ${profilePanelOpen ? 'open' : ''}`}
                            onClick={toggleProfilePanel}
                            title={isSuperAdmin ? 'Open profile' : 'User avatar'}
                        >
                            {getInitials(user?.full_name)}
                        </button>
                        {profilePanelOpen ? (
                            <div className="profile-panel">
                                <div className="profile-panel-head">
                                    <div>
                                        <h3>{user?.full_name || 'MotorLease User'}</h3>
                                        <p className="section-caption">{user?.role_name || 'User'} account</p>
                                    </div>
                                </div>
                                <div className="profile-panel-summary">
                                    <p><strong>Name:</strong> {user?.full_name || 'Not set'}</p>
                                    <p><strong>Email:</strong> {user?.email || 'Not set'}</p>
                                </div>
                                {isSuperAdmin ? (
                                    <>
                                        {profileMessage ? <div className="notice-banner">{profileMessage}</div> : null}
                                        <form className="profile-panel-form" onSubmit={handleProfileSubmit}>
                                            <label className="field"><span>Name</span><input name="full_name" value={profileForm.full_name} onChange={handleProfileChange} placeholder="Super admin full name" /></label>
                                            <label className="field"><span>Email</span><input type="email" name="email" value={profileForm.email} onChange={handleProfileChange} placeholder="admin@motorlease.com" /></label>
                                            <label className="field"><span>Brand Name</span><input name="brand_name" value={profileForm.brand_name} onChange={handleProfileChange} placeholder="MotorLease" /></label>
                                            <label className="field"><span>Reset Password</span><input type="password" name="password" value={profileForm.password} onChange={handleProfileChange} placeholder="Leave blank to keep current password" /></label>
                                            <label className="field full-span"><span>Brand Address</span><textarea rows="3" name="brand_address" value={profileForm.brand_address} onChange={handleProfileChange} placeholder="Head office address" /></label>
                                            <label className="field full-span"><span>Profile Logo</span><input type="file" accept="image/*" onChange={handleProfileLogoUpload} /></label>
                                            <label className="field full-span"><span>Uploaded Logo URL</span><input name="brand_logo_url" value={profileForm.brand_logo_url} onChange={handleProfileChange} readOnly /></label>
                                            <button type="submit" className="primary-btn full-span" disabled={savingProfile}>
                                                {savingProfile ? 'Saving...' : 'Update Profile'}
                                            </button>
                                        </form>
                                    </>
                                ) : null}
                                <button type="button" className="logout-btn profile-logout-btn" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </header>

            <main className="content-area">
                {loading ? (
                    <div className="feedback-card">Loading dashboard data...</div>
                ) : error ? (
                    <div className="feedback-card error">{error}</div>
                ) : (
                    renderContent()
                )}
            </main>

            {receivingStockOrder ? (
            <div className="receive-modal-backdrop" onClick={closeStockReceiveModal}>
                <div className="receive-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="section-header">
                            <div>
                                <h3>Receive Stock Details</h3>
                                <p className="section-caption">
                                    {receivingStockOrder.brand} {receivingStockOrder.model} / {receivingStockOrder.vehicle_type}
                                </p>
                            </div>
                            <button type="button" className="view-btn" onClick={closeStockReceiveModal}>
                                Close
                            </button>
                        </div>

                        <form className="receive-modal-form" onSubmit={handleSubmitReceivedStock}>
                            <div className="form-grid">
                                <label className="field">
                                    <span>Company</span>
                                    <input value={receivingStockOrder.company_name || ''} readOnly />
                                </label>
                                <label className="field">
                                    <span>Product Vehicle</span>
                                    <input value={[receivingStockOrder.brand, receivingStockOrder.model, receivingStockOrder.vehicle_type].filter(Boolean).join(' / ')} readOnly />
                                </label>
                                <label className="field">
                                    <span>Default Color</span>
                                    <input value={receivingStockOrder.product_color || receivingStockOrder.color || ''} readOnly />
                                </label>
                            </div>

                            <div className="receive-items-list">
                                {stockReceiveItems.map((item, index) => (
                                    <div key={`receive-item-${index}`} className="table-card receive-item-card">
                                        <div className="section-header">
                                            <h3>Vehicle #{index + 1}</h3>
                                        </div>
                                        <div className="form-grid">
                                            <label className="field">
                                                <span>Registration Number</span>
                                                <input
                                                    value={item.registration_number}
                                                    onChange={(event) => handleStockReceiveItemChange(index, 'registration_number', event.target.value)}
                                                />
                                            </label>
                                            <label className="field">
                                                <span>Chassis Number</span>
                                                <input
                                                    value={item.chassis_number}
                                                    onChange={(event) => handleStockReceiveItemChange(index, 'chassis_number', event.target.value)}
                                                />
                                            </label>
                                            <label className="field">
                                                <span>Engine Number</span>
                                                <input
                                                    value={item.engine_number}
                                                    onChange={(event) => handleStockReceiveItemChange(index, 'engine_number', event.target.value)}
                                                />
                                            </label>
                                            <label className="field">
                                                <span>Color</span>
                                                <input
                                                    value={item.color}
                                                    onChange={(event) => handleStockReceiveItemChange(index, 'color', event.target.value)}
                                                />
                                            </label>
                                            <label className="field full-span">
                                                <span>Generated Serial Number</span>
                                                <input
                                                    value={buildGeneratedVehicleSerial({
                                                        brand: receivingStockOrder.brand,
                                                        color: item.color || receivingStockOrder.product_color || receivingStockOrder.color,
                                                        model: receivingStockOrder.model,
                                                        chassis_number: item.chassis_number,
                                                        engine_number: item.engine_number,
                                                    })}
                                                    readOnly
                                                    placeholder="STK + brand + color + model + chassis + engine"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="receive-modal-actions">
                                <button type="button" className="view-btn" onClick={closeStockReceiveModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="primary-btn" disabled={savingStock}>
                                    {savingStock ? 'Saving...' : 'Save Received Vehicle'}
                                </button>
                            </div>
                        </form>
                    </div>
            </div>
            ) : null}

            {employeeAccessPopupOpen ? (
            <div className="receive-modal-backdrop" onClick={() => setEmployeeAccessPopupOpen(false)}>
                    <div className="receive-modal access-permission-modal employee-access-modal" onClick={(event) => event.stopPropagation()}>
                    <div className="section-header">
                        <div>
                            <h3>Employee Roles and Features</h3>
                            <p className="section-caption">
                                Manage inherited role access, extra access for this employee only, and restricted role access without stretching the page.
                            </p>
                        </div>
                        <button type="button" className="view-btn" onClick={() => setEmployeeAccessPopupOpen(false)}>Close</button>
                    </div>
                    <div className="access-feature-sections">
                        <section className="access-feature-section">
                            <h4 className="access-feature-heading">Inherited From Role</h4>
                            <p className="section-caption">These features are already assigned through the selected role and are automatically active for this employee.</p>
                            <div className="feature-checklist inherited-feature-checklist">
                                {employeeFormRoleFeatures.length > 0 ? (
                                    employeeFormRoleFeatures.map((feature) => (
                                        <label key={`popup-inherited-${feature.id}`} className="feature-option feature-option-inherited">
                                            <input type="checkbox" checked readOnly disabled />
                                            <span>{getAccessFeatureLabel(feature)}</span>
                                        </label>
                                    ))
                                ) : (
                                    <span className="feature-pill muted">Select a role to load inherited features</span>
                                )}
                            </div>
                        </section>
                        <section className="access-feature-section">
                            <h4 className="access-feature-heading">Restrict Access For This Employee</h4>
                            <div className="feature-checklist">
                                {employeeFormRoleFeatures.length > 0 ? employeeFormRoleFeatures.map((feature) => (
                                    <label key={`popup-deny-${feature.id}`} className="feature-option">
                                        <input
                                            type="checkbox"
                                            checked={employeeForm.denied_feature_ids.includes(Number(feature.id))}
                                            onChange={() => handleEmployeeDeniedFeatureToggle(Number(feature.id))}
                                            disabled={!canChangeEmployeeRecord}
                                        />
                                        <span>{getAccessFeatureLabel(feature)}</span>
                                    </label>
                                )) : (
                                    <span className="feature-pill muted">No inherited role features available to restrict</span>
                                )}
                            </div>
                        </section>
                        <section className="access-feature-section">
                            <h4 className="access-feature-heading">Add Extra Access For This Employee</h4>
                            <p className="section-caption">Only features not already assigned by the role are listed here.</p>
                            <div className="feature-checklist">
                                {employeeFormExtraFeatures.map((feature) => (
                                    <label key={`popup-extra-${feature.id}`} className="feature-option">
                                        <input
                                            type="checkbox"
                                            checked={employeeForm.feature_ids.includes(Number(feature.id))}
                                            onChange={() => handleEmployeeFeatureToggle(Number(feature.id))}
                                            disabled={!canChangeEmployeeRecord}
                                        />
                                        <span>{getAccessFeatureLabel(feature)}</span>
                                    </label>
                                ))}
                                {employeeFormExtraFeatures.length === 0 ? (
                                    <span className="feature-pill muted">All available features for this role are already assigned above</span>
                                ) : null}
                            </div>
                        </section>
                    </div>
                    <div className="receive-modal-actions">
                        <button type="button" className="view-btn" onClick={() => setEmployeeAccessPopupOpen(false)}>Done</button>
                    </div>
                </div>
            </div>
            ) : null}

            {activeAccessPopup && accessPopupRole && accessPopupGroup ? (
            <div className="receive-modal-backdrop" onClick={closeAccessPopup}>
                    <div className="receive-modal access-permission-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="section-header">
                            <div>
                                <h3>{accessPopupGroup.label} Roles and Features</h3>
                                <p className="section-caption">
                                    Role: {accessPopupRole.role_name}. Enable or disable the available role features for this page.
                                </p>
                            </div>
                            <button type="button" className="view-btn" onClick={closeAccessPopup}>
                                Close
                            </button>
                        </div>

                        {accessPopupGroup.description ? (
                            <div className="access-popup-intro">{accessPopupGroup.description}</div>
                        ) : null}

                        <div className="access-feature-sections">
                            {accessPopupFeatureSections.length > 0 ? accessPopupFeatureSections.map((section) => (
                                <div key={section.key} className="access-feature-section">
                                    <div className="access-feature-heading">{section.title}</div>
                                    <div className="feature-checklist">
                                        {section.features.map((feature) => (
                                            <label key={`${accessPopupRole.id}-${feature.id}`} className="feature-option">
                                                <input
                                                    type="checkbox"
                                                    checked={(roleAssignments[accessPopupRole.id] || []).includes(Number(feature.id))}
                                                    onChange={() => handleRoleFeatureToggle(accessPopupRole.id, Number(feature.id))}
                                                    disabled={!canManageAccess}
                                                />
                                                <span>{getAccessFeatureLabel(feature)}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )) : <div className="feedback-card">No functions are mapped to this page yet.</div>}
                        </div>

                        <div className="receive-modal-actions">
                            <button type="button" className="view-btn" onClick={closeAccessPopup}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="primary-btn"
                                disabled={!canManageAccess || savingAccess}
                                onClick={async () => {
                                    await handleSaveRolePermissions(accessPopupRole.id);
                                    closeAccessPopup();
                                }}
                            >
                                {savingAccess ? 'Saving...' : 'Save Role Features'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
            {activePage === 'user-tasks' && selectedWorkflowTask ? (
                <div className="receive-modal-backdrop" onClick={() => setSelectedWorkflowTaskId('')}>
                    <div className="receive-modal access-permission-modal workflow-task-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="section-header">
                            <div>
                                <h3>User Task Details</h3>
                                <p className="section-caption">{selectedWorkflowTask.assigned_role_name} review</p>
                            </div>
                            <button type="button" className="view-btn" onClick={() => setSelectedWorkflowTaskId('')}>
                                Close
                            </button>
                        </div>
                        <div className="detail-grid">
                            <div><span className="meta-label">Workflow</span><p className="meta-value">{selectedWorkflowTask.definition_name || 'Sale Approval'}</p></div>
                            <div><span className="meta-label">Approval Line</span><p className="meta-value">{selectedWorkflowTaskGroup?.approvalTrail || formatWorkflowApprovalLine(selectedWorkflowTask)}</p></div>
                            <div><span className="meta-label">Dealer</span><p className="meta-value">{formatWorkflowDealerIdentity(selectedWorkflowTask)}</p></div>
                            <div><span className="meta-label">Requested By</span><p className="meta-value">{selectedWorkflowTask.requester_name || 'Unknown'}</p></div>
                            <div><span className="meta-label">Customer</span><p className="meta-value">{selectedWorkflowTask.customer_name || 'Not set'}{selectedWorkflowTask.cnic_passport_number ? ` / ${selectedWorkflowTask.cnic_passport_number}` : ''}</p></div>
                            <div><span className="meta-label">Vehicle</span><p className="meta-value">{selectedWorkflowTask.brand} {selectedWorkflowTask.model}{selectedWorkflowTask.serial_number ? ` / ${selectedWorkflowTask.serial_number}` : selectedWorkflowTask.registration_number ? ` / ${selectedWorkflowTask.registration_number}` : ''}</p></div>
                            <div><span className="meta-label">Chassis / Engine</span><p className="meta-value">{selectedWorkflowTask.chassis_number || 'Not set'} / {selectedWorkflowTask.engine_number || 'Not set'}</p></div>
                            <div><span className="meta-label">Sale Mode</span><p className="meta-value">{selectedWorkflowTask.sale_mode || 'Not set'}</p></div>
                            <div><span className="meta-label">Vehicle Price</span><p className="meta-value">{formatCurrency(selectedWorkflowTask.vehicle_price || 0)}</p></div>
                            <div><span className="meta-label">Agreement No.</span><p className="meta-value">{selectedWorkflowTask.agreement_number || 'Not set'}</p></div>
                            <div><span className="meta-label">Purchase Date</span><p className="meta-value">{selectedWorkflowTask.purchase_date || selectedWorkflowTask.agreement_date || 'Not set'}</p></div>
                        </div>
                        <div className="inline-actions spaced-top">
                            {selectedWorkflowTask.agreement_pdf_url ? (
                                <a className="view-btn" href={buildAssetUrl(selectedWorkflowTask.agreement_pdf_url)} target="_blank" rel="noreferrer">Open Attachment</a>
                            ) : (
                                <span className="feature-pill muted">No attachment uploaded</span>
                            )}
                            {canViewSalesAgreementForm ? (
                                <button
                                    type="button"
                                    className="view-btn"
                                    onClick={() => {
                                        const workflowSale = (dashboardData.salesTransactions || []).find((sale) => sale.id === selectedWorkflowTask.entity_id);
                                        if (workflowSale) {
                                            handleEditSale(workflowSale);
                                        }
                                    }}
                                >
                                    View / Edit Form
                                </button>
                            ) : null}
                            {String(selectedWorkflowTask.task_status || '').toUpperCase() === 'PENDING' ? (
                                <>
                                    <button
                                        type="button"
                                        className="secondary-btn"
                                        onClick={() => handleWorkflowTaskAction(selectedWorkflowTask.id, 'reject')}
                                        disabled={processingWorkflowTaskId === selectedWorkflowTask.id}
                                    >
                                        {processingWorkflowTaskId === selectedWorkflowTask.id ? 'Saving...' : 'Reject'}
                                    </button>
                                    <button
                                        type="button"
                                        className="primary-btn"
                                        onClick={() => handleWorkflowTaskAction(selectedWorkflowTask.id, 'approve')}
                                        disabled={processingWorkflowTaskId === selectedWorkflowTask.id}
                                    >
                                        {processingWorkflowTaskId === selectedWorkflowTask.id ? 'Saving...' : 'Approve'}
                                    </button>
                                </>
                            ) : null}
                        </div>
                        {null}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default Dashboard;
