--
-- PostgreSQL database dump
--

\restrict HfGHvHkLywbspZU7ATcw7A7iQELOvBJIs2P5eXZmfw1Ek3EgusEMXDzhcsf1XQa

-- Dumped from database version 17.7
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.workflow_tasks DROP CONSTRAINT IF EXISTS workflow_tasks_workflow_definition_id_fkey;
ALTER TABLE IF EXISTS ONLY public.workflow_tasks DROP CONSTRAINT IF EXISTS workflow_tasks_dealer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.workflow_tasks DROP CONSTRAINT IF EXISTS workflow_tasks_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.workflow_tasks DROP CONSTRAINT IF EXISTS workflow_tasks_acted_by_fkey;
ALTER TABLE IF EXISTS ONLY public.workflow_definitions DROP CONSTRAINT IF EXISTS workflow_definitions_updated_by_fkey;
ALTER TABLE IF EXISTS ONLY public.workflow_definitions DROP CONSTRAINT IF EXISTS workflow_definitions_dealer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.workflow_definitions DROP CONSTRAINT IF EXISTS workflow_definitions_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.vehicles DROP CONSTRAINT IF EXISTS vehicles_source_stock_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_role_id_fkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_dealer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.stock_orders DROP CONSTRAINT IF EXISTS stock_orders_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.stock_orders DROP CONSTRAINT IF EXISTS stock_orders_ordered_by_fkey;
ALTER TABLE IF EXISTS ONLY public.stock_orders DROP CONSTRAINT IF EXISTS stock_orders_company_profile_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sales_transactions DROP CONSTRAINT IF EXISTS sales_transactions_workflow_definition_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sales_transactions DROP CONSTRAINT IF EXISTS sales_transactions_vehicle_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sales_transactions DROP CONSTRAINT IF EXISTS sales_transactions_last_workflow_action_by_fkey;
ALTER TABLE IF EXISTS ONLY public.sales_transactions DROP CONSTRAINT IF EXISTS sales_transactions_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sales_transactions DROP CONSTRAINT IF EXISTS sales_transactions_agent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sale_installments DROP CONSTRAINT IF EXISTS sale_installments_sale_id_fkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_role_id_fkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_feature_id_fkey;
ALTER TABLE IF EXISTS ONLY public.lease_applications DROP CONSTRAINT IF EXISTS lease_applications_vehicle_id_fkey;
ALTER TABLE IF EXISTS ONLY public.lease_applications DROP CONSTRAINT IF EXISTS lease_applications_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.lease_applications DROP CONSTRAINT IF EXISTS lease_applications_agent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.employees DROP CONSTRAINT IF EXISTS employees_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.employees DROP CONSTRAINT IF EXISTS employees_role_id_fkey;
ALTER TABLE IF EXISTS ONLY public.employees DROP CONSTRAINT IF EXISTS employees_dealer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.employees DROP CONSTRAINT IF EXISTS employees_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.employee_salary_advances DROP CONSTRAINT IF EXISTS employee_salary_advances_employee_id_fkey;
ALTER TABLE IF EXISTS ONLY public.employee_salary_advances DROP CONSTRAINT IF EXISTS employee_salary_advances_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.employee_payrolls DROP CONSTRAINT IF EXISTS employee_payrolls_generated_by_fkey;
ALTER TABLE IF EXISTS ONLY public.employee_payrolls DROP CONSTRAINT IF EXISTS employee_payrolls_employee_id_fkey;
ALTER TABLE IF EXISTS ONLY public.employee_features DROP CONSTRAINT IF EXISTS employee_features_feature_id_fkey;
ALTER TABLE IF EXISTS ONLY public.employee_features DROP CONSTRAINT IF EXISTS employee_features_employee_id_fkey;
ALTER TABLE IF EXISTS ONLY public.employee_feature_overrides DROP CONSTRAINT IF EXISTS employee_feature_overrides_feature_id_fkey;
ALTER TABLE IF EXISTS ONLY public.employee_feature_overrides DROP CONSTRAINT IF EXISTS employee_feature_overrides_employee_id_fkey;
ALTER TABLE IF EXISTS ONLY public.employee_commissions DROP CONSTRAINT IF EXISTS employee_commissions_sale_id_fkey;
ALTER TABLE IF EXISTS ONLY public.employee_commissions DROP CONSTRAINT IF EXISTS employee_commissions_installment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.employee_commissions DROP CONSTRAINT IF EXISTS employee_commissions_employee_id_fkey;
ALTER TABLE IF EXISTS ONLY public.dealers DROP CONSTRAINT IF EXISTS dealers_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.dealers DROP CONSTRAINT IF EXISTS dealers_admin_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_created_by_agent_fkey;
DROP TRIGGER IF EXISTS trg_vehicles_updated_at ON public.vehicles;
DROP TRIGGER IF EXISTS trg_stock_orders_updated_at ON public.stock_orders;
DROP TRIGGER IF EXISTS trg_sales_transactions_updated_at ON public.sales_transactions;
DROP TRIGGER IF EXISTS trg_employees_updated_at ON public.employees;
DROP TRIGGER IF EXISTS trg_dealers_updated_at ON public.dealers;
DROP INDEX IF EXISTS public.workflow_tasks_lookup_idx;
DROP INDEX IF EXISTS public.workflow_definitions_lookup_idx;
DROP INDEX IF EXISTS public.vehicles_serial_number_unique_idx;
DROP INDEX IF EXISTS public.vehicles_registration_number_unique_idx;
DROP INDEX IF EXISTS public.vehicles_engine_number_unique_idx;
DROP INDEX IF EXISTS public.vehicles_chassis_number_unique_idx;
DROP INDEX IF EXISTS public.stock_orders_serial_number_idx;
DROP INDEX IF EXISTS public.product_catalog_serial_number_unique_idx;
DROP INDEX IF EXISTS public.product_catalog_registration_number_unique_idx;
DROP INDEX IF EXISTS public.product_catalog_engine_number_unique_idx;
DROP INDEX IF EXISTS public.product_catalog_chassis_number_unique_idx;
DROP INDEX IF EXISTS public.employees_dealer_code_unique_idx;
ALTER TABLE IF EXISTS ONLY public.workflow_tasks DROP CONSTRAINT IF EXISTS workflow_tasks_pkey;
ALTER TABLE IF EXISTS ONLY public.workflow_definitions DROP CONSTRAINT IF EXISTS workflow_definitions_pkey;
ALTER TABLE IF EXISTS ONLY public.vehicles DROP CONSTRAINT IF EXISTS vehicles_registration_number_key;
ALTER TABLE IF EXISTS ONLY public.vehicles DROP CONSTRAINT IF EXISTS vehicles_pkey;
ALTER TABLE IF EXISTS ONLY public.vehicle_types DROP CONSTRAINT IF EXISTS vehicle_types_type_key_key;
ALTER TABLE IF EXISTS ONLY public.vehicle_types DROP CONSTRAINT IF EXISTS vehicle_types_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.stock_orders DROP CONSTRAINT IF EXISTS stock_orders_pkey;
ALTER TABLE IF EXISTS ONLY public.sales_transactions DROP CONSTRAINT IF EXISTS sales_transactions_pkey;
ALTER TABLE IF EXISTS ONLY public.sale_installments DROP CONSTRAINT IF EXISTS sale_installments_sale_id_installment_number_key;
ALTER TABLE IF EXISTS ONLY public.sale_installments DROP CONSTRAINT IF EXISTS sale_installments_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_role_name_key;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.product_catalog DROP CONSTRAINT IF EXISTS product_catalog_pkey;
ALTER TABLE IF EXISTS ONLY public.lease_applications DROP CONSTRAINT IF EXISTS lease_applications_pkey;
ALTER TABLE IF EXISTS ONLY public.features DROP CONSTRAINT IF EXISTS features_pkey;
ALTER TABLE IF EXISTS ONLY public.features DROP CONSTRAINT IF EXISTS features_feature_key_key;
ALTER TABLE IF EXISTS ONLY public.employees DROP CONSTRAINT IF EXISTS employees_user_id_key;
ALTER TABLE IF EXISTS ONLY public.employees DROP CONSTRAINT IF EXISTS employees_pkey;
ALTER TABLE IF EXISTS ONLY public.employees DROP CONSTRAINT IF EXISTS employees_email_key;
ALTER TABLE IF EXISTS ONLY public.employee_salary_advances DROP CONSTRAINT IF EXISTS employee_salary_advances_pkey;
ALTER TABLE IF EXISTS ONLY public.employee_payrolls DROP CONSTRAINT IF EXISTS employee_payrolls_pkey;
ALTER TABLE IF EXISTS ONLY public.employee_payrolls DROP CONSTRAINT IF EXISTS employee_payrolls_employee_id_payroll_month_key;
ALTER TABLE IF EXISTS ONLY public.employee_features DROP CONSTRAINT IF EXISTS employee_features_pkey;
ALTER TABLE IF EXISTS ONLY public.employee_feature_overrides DROP CONSTRAINT IF EXISTS employee_feature_overrides_pkey;
ALTER TABLE IF EXISTS ONLY public.employee_commissions DROP CONSTRAINT IF EXISTS employee_commissions_pkey;
ALTER TABLE IF EXISTS ONLY public.dealers DROP CONSTRAINT IF EXISTS dealers_pkey;
ALTER TABLE IF EXISTS ONLY public.dealers DROP CONSTRAINT IF EXISTS dealers_dealer_code_key;
ALTER TABLE IF EXISTS ONLY public.dealers DROP CONSTRAINT IF EXISTS dealers_application_slug_key;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_pkey;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_cnic_passport_number_key;
ALTER TABLE IF EXISTS ONLY public.company_profiles DROP CONSTRAINT IF EXISTS company_profiles_pkey;
ALTER TABLE IF EXISTS ONLY public.company_profiles DROP CONSTRAINT IF EXISTS company_profiles_company_name_key;
ALTER TABLE IF EXISTS public.vehicle_types ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.roles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.features ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.workflow_tasks;
DROP TABLE IF EXISTS public.workflow_definitions;
DROP TABLE IF EXISTS public.vehicles;
DROP SEQUENCE IF EXISTS public.vehicle_types_id_seq;
DROP TABLE IF EXISTS public.vehicle_types;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.stock_orders;
DROP TABLE IF EXISTS public.sales_transactions;
DROP TABLE IF EXISTS public.sale_installments;
DROP SEQUENCE IF EXISTS public.roles_id_seq;
DROP TABLE IF EXISTS public.roles;
DROP TABLE IF EXISTS public.role_permissions;
DROP TABLE IF EXISTS public.product_catalog;
DROP TABLE IF EXISTS public.lease_applications;
DROP SEQUENCE IF EXISTS public.features_id_seq;
DROP TABLE IF EXISTS public.features;
DROP TABLE IF EXISTS public.employees;
DROP TABLE IF EXISTS public.employee_salary_advances;
DROP TABLE IF EXISTS public.employee_payrolls;
DROP TABLE IF EXISTS public.employee_features;
DROP TABLE IF EXISTS public.employee_feature_overrides;
DROP TABLE IF EXISTS public.employee_commissions;
DROP TABLE IF EXISTS public.dealers;
DROP TABLE IF EXISTS public.customers;
DROP TABLE IF EXISTS public.company_profiles;
DROP FUNCTION IF EXISTS public.set_updated_at_generic();
DROP FUNCTION IF EXISTS public.set_updated_at_employees();
DROP EXTENSION IF EXISTS pgcrypto;
--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: set_updated_at_employees(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at_employees() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$;


--
-- Name: set_updated_at_generic(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at_generic() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: company_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.company_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_name character varying(180) NOT NULL,
    company_email character varying(180),
    contact_person character varying(160),
    phone character varying(60),
    address text,
    notes text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    full_name character varying(255),
    cnic_passport_number character varying(50),
    ocr_details jsonb,
    biometric_hash text,
    identity_doc_url text,
    created_by_agent uuid
);


--
-- Name: dealers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dealers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    dealer_code character varying(30) NOT NULL,
    dealer_name character varying(160) NOT NULL,
    dealer_logo_url text,
    dealer_address text,
    dealer_cnic character varying(30),
    mobile_country character varying(60) DEFAULT 'QATAR'::character varying NOT NULL,
    mobile_country_code character varying(10) DEFAULT '+974'::character varying NOT NULL,
    mobile_number character varying(30) NOT NULL,
    currency_code character varying(10) DEFAULT 'QAR'::character varying NOT NULL,
    contact_email character varying(160),
    notes text,
    app_status character varying(20) DEFAULT 'FRESH_START'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    application_slug character varying(160),
    db_clone_name character varying(160),
    db_backup_label character varying(160),
    provisioning_status character varying(30) DEFAULT 'READY_FOR_CLONE'::character varying NOT NULL,
    admin_user_id uuid,
    theme_key character varying(40) DEFAULT 'sandstone'::character varying NOT NULL
);


--
-- Name: employee_commissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_commissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_id uuid NOT NULL,
    sale_id uuid,
    installment_id uuid,
    commission_type character varying(30) NOT NULL,
    base_amount numeric(12,2) DEFAULT 0 NOT NULL,
    commission_percentage numeric(8,2) DEFAULT 0 NOT NULL,
    commission_value numeric(12,2) DEFAULT 0 NOT NULL,
    commission_amount numeric(12,2) DEFAULT 0 NOT NULL,
    earned_on date DEFAULT CURRENT_DATE NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: employee_feature_overrides; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_feature_overrides (
    employee_id uuid NOT NULL,
    feature_id integer NOT NULL,
    access_mode character varying(10) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT employee_feature_overrides_access_mode_check CHECK (((access_mode)::text = ANY ((ARRAY['ALLOW'::character varying, 'DENY'::character varying])::text[])))
);


--
-- Name: employee_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_features (
    employee_id uuid NOT NULL,
    feature_id integer NOT NULL
);


--
-- Name: employee_payrolls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_payrolls (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_id uuid NOT NULL,
    payroll_month character varying(7) NOT NULL,
    base_salary numeric(12,2) DEFAULT 0 NOT NULL,
    total_commission numeric(12,2) DEFAULT 0 NOT NULL,
    total_advances numeric(12,2) DEFAULT 0 NOT NULL,
    net_salary numeric(12,2) DEFAULT 0 NOT NULL,
    generated_by uuid,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: employee_salary_advances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_salary_advances (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_id uuid NOT NULL,
    advance_date date DEFAULT CURRENT_DATE NOT NULL,
    amount numeric(12,2) DEFAULT 0 NOT NULL,
    reason text,
    deducted_in_payroll_id uuid,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: employees; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employees (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    employee_code character varying(30) NOT NULL,
    full_name character varying(120) NOT NULL,
    email character varying(120) NOT NULL,
    phone character varying(30),
    department character varying(80),
    job_title character varying(80),
    role_id integer,
    is_active boolean DEFAULT true NOT NULL,
    hired_at timestamp with time zone DEFAULT now() NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    dealer_id uuid NOT NULL,
    commission_percentage numeric(8,2) DEFAULT 0 NOT NULL,
    commission_value numeric(12,2) DEFAULT 0 NOT NULL,
    base_salary numeric(12,2) DEFAULT 0 NOT NULL,
    cnic_number character varying(80),
    cnic_doc_url text,
    cnic_front_url text,
    cnic_back_url text,
    created_by uuid
);


--
-- Name: features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.features (
    id integer NOT NULL,
    feature_key character varying(100) NOT NULL,
    display_name character varying(100) NOT NULL
);


--
-- Name: features_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.features_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: features_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.features_id_seq OWNED BY public.features.id;


--
-- Name: lease_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lease_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid,
    vehicle_id uuid,
    agent_id uuid,
    duration_months integer NOT NULL,
    monthly_installment numeric(12,2) NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    status character varying(20) DEFAULT 'PENDING'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: product_catalog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_catalog (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand character varying(120) NOT NULL,
    model character varying(120) NOT NULL,
    vehicle_type character varying(80) NOT NULL,
    color character varying(80),
    image_url text NOT NULL,
    monthly_rate numeric(12,2) DEFAULT 0 NOT NULL,
    purchase_price numeric(12,2) DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    description text,
    serial_number character varying(220),
    registration_number character varying(120),
    chassis_number character varying(160),
    engine_number character varying(160)
);


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_permissions (
    role_id integer NOT NULL,
    feature_id integer NOT NULL
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    role_name character varying(50) NOT NULL
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: sale_installments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sale_installments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sale_id uuid NOT NULL,
    installment_number integer NOT NULL,
    due_date date NOT NULL,
    amount numeric(12,2) DEFAULT 0 NOT NULL,
    status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    paid_date date,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    received_amount numeric(12,2) DEFAULT 0 NOT NULL,
    carry_forward_amount numeric(12,2) DEFAULT 0 NOT NULL
);


--
-- Name: sales_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    vehicle_id uuid NOT NULL,
    agent_id uuid NOT NULL,
    sale_mode character varying(20) NOT NULL,
    agreement_number character varying(60),
    agreement_date date DEFAULT CURRENT_DATE NOT NULL,
    agreement_pdf_url text,
    purchase_date date DEFAULT CURRENT_DATE NOT NULL,
    vehicle_price numeric(12,2) DEFAULT 0 NOT NULL,
    down_payment numeric(12,2) DEFAULT 0 NOT NULL,
    financed_amount numeric(12,2) DEFAULT 0 NOT NULL,
    monthly_installment numeric(12,2) DEFAULT 0 NOT NULL,
    installment_months integer DEFAULT 0 NOT NULL,
    first_due_date date,
    witness_name character varying(120),
    witness_cnic character varying(30),
    remarks text,
    status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    witness_two_name character varying(120),
    witness_two_cnic character varying(30),
    workflow_definition_id uuid,
    approval_status character varying(30) DEFAULT 'APPROVED'::character varying NOT NULL,
    current_workflow_step integer DEFAULT 0 NOT NULL,
    rejection_reason text,
    last_workflow_action_at timestamp with time zone,
    last_workflow_action_by uuid,
    CONSTRAINT sales_transactions_sale_mode_check CHECK (((sale_mode)::text = ANY ((ARRAY['CASH'::character varying, 'INSTALLMENT'::character varying])::text[])))
);


--
-- Name: stock_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stock_orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ordered_by uuid NOT NULL,
    company_name character varying(120) NOT NULL,
    company_email character varying(160),
    vehicle_type character varying(30) NOT NULL,
    brand character varying(80) NOT NULL,
    model character varying(80) NOT NULL,
    chassis_number character varying(100),
    engine_number character varying(100),
    quantity integer DEFAULT 1 NOT NULL,
    unit_price numeric(12,2) DEFAULT 0 NOT NULL,
    total_amount numeric(12,2) DEFAULT 0 NOT NULL,
    expected_delivery_date date,
    bank_slip_url text,
    notes text,
    order_status character varying(20) DEFAULT 'PROCESSING'::character varying NOT NULL,
    email_sent boolean DEFAULT false NOT NULL,
    email_error text,
    received_quantity integer DEFAULT 0 NOT NULL,
    received_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    product_id uuid,
    company_profile_id uuid,
    product_description text,
    serial_number character varying(260)
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    role_id integer,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    password text,
    dealer_id uuid,
    brand_name character varying(180),
    brand_logo_url text,
    brand_address text
);


--
-- Name: vehicle_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vehicle_types (
    id integer NOT NULL,
    type_key character varying(30) NOT NULL,
    display_name character varying(60) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: vehicle_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vehicle_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vehicle_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vehicle_types_id_seq OWNED BY public.vehicle_types.id;


--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vehicles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    brand character varying(100) NOT NULL,
    model character varying(100) NOT NULL,
    registration_number character varying(50) NOT NULL,
    vehicle_type character varying(20),
    status character varying(20) DEFAULT 'AVAILABLE'::character varying,
    monthly_rate numeric(12,2) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    chassis_number character varying(100),
    engine_number character varying(100),
    color character varying(40),
    purchase_price numeric(12,2),
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    image_url text,
    product_description text,
    serial_number character varying(260),
    source_stock_order_id uuid,
    CONSTRAINT vehicles_vehicle_type_check CHECK (((vehicle_type)::text = ANY (ARRAY['BIKE'::text, 'MOTOR'::text, 'CAR'::text, 'SUV'::text, 'VAN'::text, 'TRUCK'::text, 'BUS'::text])))
);


--
-- Name: workflow_definitions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.workflow_definitions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    definition_name character varying(180) NOT NULL,
    workflow_type character varying(60) DEFAULT 'SALE_APPROVAL'::character varying NOT NULL,
    dealer_id uuid,
    requester_role_name character varying(60) NOT NULL,
    first_approver_role_name character varying(60) NOT NULL,
    second_approver_role_name character varying(60),
    is_active boolean DEFAULT true NOT NULL,
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: workflow_tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.workflow_tasks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workflow_definition_id uuid,
    entity_type character varying(40) NOT NULL,
    entity_id uuid NOT NULL,
    dealer_id uuid,
    created_by uuid,
    assigned_role_name character varying(60) NOT NULL,
    step_number integer DEFAULT 1 NOT NULL,
    total_steps integer DEFAULT 1 NOT NULL,
    task_title character varying(220) NOT NULL,
    task_status character varying(30) DEFAULT 'PENDING'::character varying NOT NULL,
    decision_notes text,
    acted_by uuid,
    acted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: features id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.features ALTER COLUMN id SET DEFAULT nextval('public.features_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: vehicle_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle_types ALTER COLUMN id SET DEFAULT nextval('public.vehicle_types_id_seq'::regclass);


--
-- Name: company_profiles company_profiles_company_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_profiles
    ADD CONSTRAINT company_profiles_company_name_key UNIQUE (company_name);


--
-- Name: company_profiles company_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_profiles
    ADD CONSTRAINT company_profiles_pkey PRIMARY KEY (id);


--
-- Name: customers customers_cnic_passport_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_cnic_passport_number_key UNIQUE (cnic_passport_number);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: dealers dealers_application_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dealers
    ADD CONSTRAINT dealers_application_slug_key UNIQUE (application_slug);


--
-- Name: dealers dealers_dealer_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dealers
    ADD CONSTRAINT dealers_dealer_code_key UNIQUE (dealer_code);


--
-- Name: dealers dealers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dealers
    ADD CONSTRAINT dealers_pkey PRIMARY KEY (id);


--
-- Name: employee_commissions employee_commissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_commissions
    ADD CONSTRAINT employee_commissions_pkey PRIMARY KEY (id);


--
-- Name: employee_feature_overrides employee_feature_overrides_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_feature_overrides
    ADD CONSTRAINT employee_feature_overrides_pkey PRIMARY KEY (employee_id, feature_id);


--
-- Name: employee_features employee_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_features
    ADD CONSTRAINT employee_features_pkey PRIMARY KEY (employee_id, feature_id);


--
-- Name: employee_payrolls employee_payrolls_employee_id_payroll_month_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_payrolls
    ADD CONSTRAINT employee_payrolls_employee_id_payroll_month_key UNIQUE (employee_id, payroll_month);


--
-- Name: employee_payrolls employee_payrolls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_payrolls
    ADD CONSTRAINT employee_payrolls_pkey PRIMARY KEY (id);


--
-- Name: employee_salary_advances employee_salary_advances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_salary_advances
    ADD CONSTRAINT employee_salary_advances_pkey PRIMARY KEY (id);


--
-- Name: employees employees_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_email_key UNIQUE (email);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: employees employees_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_key UNIQUE (user_id);


--
-- Name: features features_feature_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.features
    ADD CONSTRAINT features_feature_key_key UNIQUE (feature_key);


--
-- Name: features features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.features
    ADD CONSTRAINT features_pkey PRIMARY KEY (id);


--
-- Name: lease_applications lease_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lease_applications
    ADD CONSTRAINT lease_applications_pkey PRIMARY KEY (id);


--
-- Name: product_catalog product_catalog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_catalog
    ADD CONSTRAINT product_catalog_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, feature_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- Name: sale_installments sale_installments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_installments
    ADD CONSTRAINT sale_installments_pkey PRIMARY KEY (id);


--
-- Name: sale_installments sale_installments_sale_id_installment_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_installments
    ADD CONSTRAINT sale_installments_sale_id_installment_number_key UNIQUE (sale_id, installment_number);


--
-- Name: sales_transactions sales_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_transactions
    ADD CONSTRAINT sales_transactions_pkey PRIMARY KEY (id);


--
-- Name: stock_orders stock_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_orders
    ADD CONSTRAINT stock_orders_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vehicle_types vehicle_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle_types
    ADD CONSTRAINT vehicle_types_pkey PRIMARY KEY (id);


--
-- Name: vehicle_types vehicle_types_type_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle_types
    ADD CONSTRAINT vehicle_types_type_key_key UNIQUE (type_key);


--
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_registration_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_registration_number_key UNIQUE (registration_number);


--
-- Name: workflow_definitions workflow_definitions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workflow_definitions
    ADD CONSTRAINT workflow_definitions_pkey PRIMARY KEY (id);


--
-- Name: workflow_tasks workflow_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workflow_tasks
    ADD CONSTRAINT workflow_tasks_pkey PRIMARY KEY (id);


--
-- Name: employees_dealer_code_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX employees_dealer_code_unique_idx ON public.employees USING btree (COALESCE(dealer_id, '00000000-0000-0000-0000-000000000000'::uuid), upper((employee_code)::text)) WHERE (COALESCE(TRIM(BOTH FROM employee_code), ''::text) <> ''::text);


--
-- Name: product_catalog_chassis_number_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX product_catalog_chassis_number_unique_idx ON public.product_catalog USING btree (upper((chassis_number)::text)) WHERE (COALESCE(TRIM(BOTH FROM chassis_number), ''::text) <> ''::text);


--
-- Name: product_catalog_engine_number_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX product_catalog_engine_number_unique_idx ON public.product_catalog USING btree (upper((engine_number)::text)) WHERE (COALESCE(TRIM(BOTH FROM engine_number), ''::text) <> ''::text);


--
-- Name: product_catalog_registration_number_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX product_catalog_registration_number_unique_idx ON public.product_catalog USING btree (upper((registration_number)::text)) WHERE (COALESCE(TRIM(BOTH FROM registration_number), ''::text) <> ''::text);


--
-- Name: product_catalog_serial_number_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX product_catalog_serial_number_unique_idx ON public.product_catalog USING btree (upper((serial_number)::text)) WHERE (COALESCE(TRIM(BOTH FROM serial_number), ''::text) <> ''::text);


--
-- Name: stock_orders_serial_number_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_orders_serial_number_idx ON public.stock_orders USING btree (upper((serial_number)::text)) WHERE (COALESCE(TRIM(BOTH FROM serial_number), ''::text) <> ''::text);


--
-- Name: vehicles_chassis_number_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX vehicles_chassis_number_unique_idx ON public.vehicles USING btree (upper((chassis_number)::text)) WHERE (COALESCE(TRIM(BOTH FROM chassis_number), ''::text) <> ''::text);


--
-- Name: vehicles_engine_number_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX vehicles_engine_number_unique_idx ON public.vehicles USING btree (upper((engine_number)::text)) WHERE (COALESCE(TRIM(BOTH FROM engine_number), ''::text) <> ''::text);


--
-- Name: vehicles_registration_number_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX vehicles_registration_number_unique_idx ON public.vehicles USING btree (upper((registration_number)::text)) WHERE (COALESCE(TRIM(BOTH FROM registration_number), ''::text) <> ''::text);


--
-- Name: vehicles_serial_number_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX vehicles_serial_number_unique_idx ON public.vehicles USING btree (upper((serial_number)::text)) WHERE (COALESCE(TRIM(BOTH FROM serial_number), ''::text) <> ''::text);


--
-- Name: workflow_definitions_lookup_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX workflow_definitions_lookup_idx ON public.workflow_definitions USING btree (workflow_type, requester_role_name, dealer_id, is_active);


--
-- Name: workflow_tasks_lookup_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX workflow_tasks_lookup_idx ON public.workflow_tasks USING btree (entity_type, entity_id, assigned_role_name, task_status, dealer_id, created_at DESC);


--
-- Name: dealers trg_dealers_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_dealers_updated_at BEFORE UPDATE ON public.dealers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_generic();


--
-- Name: employees trg_employees_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_employees();


--
-- Name: sales_transactions trg_sales_transactions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_sales_transactions_updated_at BEFORE UPDATE ON public.sales_transactions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_generic();


--
-- Name: stock_orders trg_stock_orders_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_stock_orders_updated_at BEFORE UPDATE ON public.stock_orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_generic();


--
-- Name: vehicles trg_vehicles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_generic();


--
-- Name: customers customers_created_by_agent_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_created_by_agent_fkey FOREIGN KEY (created_by_agent) REFERENCES public.users(id);


--
-- Name: dealers dealers_admin_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dealers
    ADD CONSTRAINT dealers_admin_user_id_fkey FOREIGN KEY (admin_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: dealers dealers_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dealers
    ADD CONSTRAINT dealers_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: employee_commissions employee_commissions_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_commissions
    ADD CONSTRAINT employee_commissions_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: employee_commissions employee_commissions_installment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_commissions
    ADD CONSTRAINT employee_commissions_installment_id_fkey FOREIGN KEY (installment_id) REFERENCES public.sale_installments(id) ON DELETE SET NULL;


--
-- Name: employee_commissions employee_commissions_sale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_commissions
    ADD CONSTRAINT employee_commissions_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sales_transactions(id) ON DELETE SET NULL;


--
-- Name: employee_feature_overrides employee_feature_overrides_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_feature_overrides
    ADD CONSTRAINT employee_feature_overrides_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: employee_feature_overrides employee_feature_overrides_feature_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_feature_overrides
    ADD CONSTRAINT employee_feature_overrides_feature_id_fkey FOREIGN KEY (feature_id) REFERENCES public.features(id) ON DELETE CASCADE;


--
-- Name: employee_features employee_features_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_features
    ADD CONSTRAINT employee_features_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: employee_features employee_features_feature_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_features
    ADD CONSTRAINT employee_features_feature_id_fkey FOREIGN KEY (feature_id) REFERENCES public.features(id) ON DELETE CASCADE;


--
-- Name: employee_payrolls employee_payrolls_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_payrolls
    ADD CONSTRAINT employee_payrolls_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: employee_payrolls employee_payrolls_generated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_payrolls
    ADD CONSTRAINT employee_payrolls_generated_by_fkey FOREIGN KEY (generated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: employee_salary_advances employee_salary_advances_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_salary_advances
    ADD CONSTRAINT employee_salary_advances_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: employee_salary_advances employee_salary_advances_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_salary_advances
    ADD CONSTRAINT employee_salary_advances_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: employees employees_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: employees employees_dealer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_dealer_id_fkey FOREIGN KEY (dealer_id) REFERENCES public.dealers(id) ON DELETE SET NULL;


--
-- Name: employees employees_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE SET NULL;


--
-- Name: employees employees_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: lease_applications lease_applications_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lease_applications
    ADD CONSTRAINT lease_applications_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.users(id);


--
-- Name: lease_applications lease_applications_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lease_applications
    ADD CONSTRAINT lease_applications_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: lease_applications lease_applications_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lease_applications
    ADD CONSTRAINT lease_applications_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE SET NULL;


--
-- Name: role_permissions role_permissions_feature_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_feature_id_fkey FOREIGN KEY (feature_id) REFERENCES public.features(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: sale_installments sale_installments_sale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_installments
    ADD CONSTRAINT sale_installments_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sales_transactions(id) ON DELETE CASCADE;


--
-- Name: sales_transactions sales_transactions_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_transactions
    ADD CONSTRAINT sales_transactions_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: sales_transactions sales_transactions_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_transactions
    ADD CONSTRAINT sales_transactions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE RESTRICT;


--
-- Name: sales_transactions sales_transactions_last_workflow_action_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_transactions
    ADD CONSTRAINT sales_transactions_last_workflow_action_by_fkey FOREIGN KEY (last_workflow_action_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: sales_transactions sales_transactions_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_transactions
    ADD CONSTRAINT sales_transactions_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE RESTRICT;


--
-- Name: sales_transactions sales_transactions_workflow_definition_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_transactions
    ADD CONSTRAINT sales_transactions_workflow_definition_id_fkey FOREIGN KEY (workflow_definition_id) REFERENCES public.workflow_definitions(id) ON DELETE SET NULL;


--
-- Name: stock_orders stock_orders_company_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_orders
    ADD CONSTRAINT stock_orders_company_profile_id_fkey FOREIGN KEY (company_profile_id) REFERENCES public.company_profiles(id) ON DELETE SET NULL;


--
-- Name: stock_orders stock_orders_ordered_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_orders
    ADD CONSTRAINT stock_orders_ordered_by_fkey FOREIGN KEY (ordered_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: stock_orders stock_orders_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_orders
    ADD CONSTRAINT stock_orders_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product_catalog(id) ON DELETE SET NULL;


--
-- Name: users users_dealer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_dealer_id_fkey FOREIGN KEY (dealer_id) REFERENCES public.dealers(id) ON DELETE SET NULL;


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: vehicles vehicles_source_stock_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_source_stock_order_id_fkey FOREIGN KEY (source_stock_order_id) REFERENCES public.stock_orders(id) ON DELETE SET NULL;


--
-- Name: workflow_definitions workflow_definitions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workflow_definitions
    ADD CONSTRAINT workflow_definitions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: workflow_definitions workflow_definitions_dealer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workflow_definitions
    ADD CONSTRAINT workflow_definitions_dealer_id_fkey FOREIGN KEY (dealer_id) REFERENCES public.dealers(id) ON DELETE CASCADE;


--
-- Name: workflow_definitions workflow_definitions_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workflow_definitions
    ADD CONSTRAINT workflow_definitions_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: workflow_tasks workflow_tasks_acted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workflow_tasks
    ADD CONSTRAINT workflow_tasks_acted_by_fkey FOREIGN KEY (acted_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: workflow_tasks workflow_tasks_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workflow_tasks
    ADD CONSTRAINT workflow_tasks_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: workflow_tasks workflow_tasks_dealer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workflow_tasks
    ADD CONSTRAINT workflow_tasks_dealer_id_fkey FOREIGN KEY (dealer_id) REFERENCES public.dealers(id) ON DELETE SET NULL;


--
-- Name: workflow_tasks workflow_tasks_workflow_definition_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workflow_tasks
    ADD CONSTRAINT workflow_tasks_workflow_definition_id_fkey FOREIGN KEY (workflow_definition_id) REFERENCES public.workflow_definitions(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict HfGHvHkLywbspZU7ATcw7A7iQELOvBJIs2P5eXZmfw1Ek3EgusEMXDzhcsf1XQa

