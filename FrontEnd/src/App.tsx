import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { HelmetProvider } from 'react-helmet-async'
import Login from "./pages/Login"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import TermsOfService from "./pages/TermsOfService"
import Contact from "./pages/Contact"
import ImpersonateAuth from "./pages/auth/ImpersonateAuth"
import DashboardLayout from "./components/layout/DashboardLayout"
import Dashboard from "./pages/Dashboard"
import PurchaseInvoice from "./pages/inventory/PurchaseInvoice"
import PointOfSales from "./pages/sales/PointOfSales/PointOfSales"

// Purchase Orders
import PurchaseOrder from "./pages/purchase/PurchaseOrder/PurchaseOrder";

// Stock Transfer
import StockTransferList from "./pages/inventory/StockTransfer/StockTransferList"
import StockRequest from "./pages/inventory/StockTransfer/StockRequest"
import ApproveRequest from "./pages/inventory/StockTransfer/ApproveRequest"
import BoxesOverview from "./pages/inventory/StockTransfer/BoxesOverview"
import BoxManagement from "./pages/inventory/StockTransfer/BoxManagement"
import BoxPacking from "./pages/inventory/StockTransfer/BoxPacking"
// Masters
import ItemMaster from "./pages/masters/inventory/ItemMaster"
import BrandMaster from "./pages/masters/inventory/BrandMaster"
import CategoryMaster from "./pages/masters/inventory/CategoryMaster"
import SubCategoryMaster from "./pages/masters/inventory/SubCategoryMaster"
import DepartmentMaster from "./pages/masters/inventory/DepartmentMaster"

// Auto-generated Pages
import SalesDrafts from "./pages/sales/Drafts/SalesDrafts";
import SalesReturn from './pages/sales/Returns/SalesReturn';
import AllSalesReturn from './pages/sales/Returns/AllSalesReturn';
import QuickSellReturn from './pages/sales/Returns/QuickSellReturn';
import TransportPayment from './pages/purchase/TransportPayment';
import HundekariPayment from './pages/purchase/HundekariPayment';
import PriceApprovalQueue from "./pages/sales/Approvals/PriceApprovalQueue";
import CreditApprovalQueue from "./pages/sales/Approvals/CreditApprovalQueue";
import AdvanceReceiptPage from "./pages/sales/Receipts/AdvanceReceiptPage";
import PurchaseInvoiceList from "./pages/purchase/Invoice/PurchaseInvoiceList";
import CSVPurchaseInvoice from "./pages/purchase/Invoice/CSVPurchaseInvoice";
import PurchaseReturn from "./pages/purchase/Returns/PurchaseReturn";
import DebitNotePage from "./pages/purchase/Returns/DebitNotePage";
import ReturnChallanPage from "./pages/purchase/Returns/ReturnChallanPage";
import ManualPurchaseReturn from "./pages/purchase/Returns/ManualPurchaseReturn";
import LRPendingList from "./pages/logistics/LRPending/LRPendingList";
import InwardOverview from "./pages/logistics/Inward/InwardOverview";
import InwardScanning from "./pages/logistics/Inward/InwardScanning";
import BulkTransitIn from "./pages/logistics/Inward/BulkTransitIn";
import ViewInTransitInvoice from "./pages/logistics/Invoices/ViewInTransitInvoice";
import ViewBarcodedInvoice from "./pages/logistics/Invoices/ViewBarcodedInvoice";
import VerifyStock from "./pages/inventory/Verification/VerifyStock";
import VerifyStockHistory from "./pages/inventory/Verification/VerifyStockHistory";
import LabelPrintPage from "./pages/inventory/Barcodes/LabelPrintPage";
import BulkLabelPrint from "./pages/inventory/Barcodes/BulkLabelPrint";
import BarcodedProducts from "./pages/inventory/Barcodes/BarcodedProducts";
import BarcodesSearch from "./pages/inventory/Barcodes/BarcodesSearch";
import AttendanceEntry from "./pages/hr/Attendance/AttendanceEntry";
import ShiftMaster from "./pages/hr/Attendance/ShiftMaster";
import UserShifts from "./pages/hr/Attendance/UserShifts";
import SalaryManagement from "./pages/hr/Payroll/SalaryManagement";
import Payroll from "./pages/hr/Payroll/Payroll";
import ExpenseEntries from "./pages/hr/Payroll/ExpenseEntries";
import ExpenseDashboard from "./pages/hr/Payroll/ExpenseDashboard";
import TenantUsers from "./pages/superadmin/TenantUsers";
import HSNSalesReport from "./pages/reports/Sales/HSNSalesReport";
import DepartmentSalesReport from "./pages/reports/Sales/DepartmentSalesReport";
import SalesmanPerformanceReport from "./pages/reports/Sales/SalesmanPerformanceReport";
import PORegister from "./pages/reports/Purchase/PORegister";
import SupplierSummary from "./pages/reports/Purchase/SupplierSummary";
import PartyPerformance from "./pages/reports/Purchase/PartyPerformance";
import CurrentStock from "./pages/reports/Inventory/CurrentStock";
import CategoryStock from "./pages/reports/Inventory/CategoryStock";
import StockAgeing from "./pages/reports/Inventory/StockAgeing";
import InTransitStock from "./pages/reports/Inventory/InTransitStock";
import GstrReport from "./pages/reports/Compliance/GstrReport";
import EInvoiceReport from "./pages/reports/Compliance/EInvoiceReport";
import DailyRegisters from "./pages/reports/Compliance/DailyRegisters";
import UserMaster from "./pages/settings/Users/UserMaster";
import Roles from "./pages/settings/Users/Roles";
import UserRoles from "./pages/settings/Users/UserRoles";
import Tokens from "./pages/settings/Users/Tokens";
import Salesmen from "./pages/settings/Users/Salesmen";
import SystemConfig from "./pages/settings/System/SystemConfig";
import AuditLog from "./pages/settings/System/AuditLog";
import ProjectStatus from "./pages/settings/System/ProjectStatus";
import VendorPaymentStatus from "./pages/settings/Portals/VendorPaymentStatus";
import AdminVendorPOTracker from "./pages/settings/Portals/AdminVendorPOTracker";
import SectionMaster from "./pages/masters/inventory/SectionMaster"
import StyleMaster from "./pages/masters/inventory/StyleMaster"
import SubStyleMaster from "./pages/masters/inventory/SubStyleMaster"
import DesignMaster from "./pages/masters/inventory/DesignMaster"
import SizeMaster from "./pages/masters/inventory/SizeMaster"
import ColorMaster from "./pages/masters/inventory/ColorMaster"
import MaterialMaster from "./pages/masters/inventory/MaterialMaster"
import HSNSACMaster from "./pages/masters/inventory/HSNSACMaster"
import PartyMaster from "./pages/masters/accounting/PartyMaster"
import CustomerMaster from "./pages/masters/accounting/CustomerMaster"
import TransporterMaster from "./pages/masters/accounting/TransporterMaster"
import HundekariMaster from "./pages/masters/accounting/HundekariMaster"
import CommissionMaster from "./pages/masters/accounting/CommissionMaster"
import LocationMaster from "./pages/masters/config/LocationMaster"
import ChargesTypeMaster from "./pages/masters/config/ChargesTypeMaster"
import ItemPercentageMaster from "./pages/masters/config/ItemPercentageMaster"
import MastersHub from "./pages/masters/MastersHub"

import LRList from "./pages/purchase/LRList"
import ManageReceivable from "./pages/inventory/ManageReceivable/ManageReceivable"

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/impersonate-auth" element={<ImpersonateAuth />} />
          
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/superadmin/firms/:id/users" element={<TenantUsers />} />

            <Route path="/purchase-order" element={<PurchaseOrder />} />

            <Route path="/purchase-invoice" element={<PurchaseInvoice />} />
            <Route path="/lrs" element={<LRList />} />
            <Route path="/manage-receivable" element={<ManageReceivable />} />

            {/* New Stock Transfer Routes */}
            <Route path="/inventory/stock-transfer/list" element={<StockTransferList />} />
            <Route path="/inventory/stock-transfer/request" element={<StockRequest />} />
            <Route path="/inventory/stock-transfer/approve" element={<ApproveRequest />} />
            <Route path="/inventory/stock-transfer/boxes" element={<BoxesOverview />} />
            <Route path="/inventory/stock-transfer/boxes/manage" element={<BoxManagement />} />
            <Route path="/inventory/stock-transfer/boxes/pack" element={<BoxPacking />} />

            <Route path="/sales/pointofsales" element={<PointOfSales />} />
            <Route path="/masters/item" element={<ItemMaster />} />
            <Route path="/masters/brand" element={<BrandMaster />} />
            <Route path="/masters/category" element={<CategoryMaster />} />
            <Route path="/masters/subcategory" element={<SubCategoryMaster />} />
            <Route path="/masters/department" element={<DepartmentMaster />} />

            {/* Auto-generated Routes */}
            <Route path="/sales/drafts/sales-drafts" element={<SalesDrafts />} />
            <Route path="/sales/returns/sales-return" element={<SalesReturn />} />
            <Route path="/sales/returns/all-sales-return" element={<AllSalesReturn />} />
            <Route path="/sales/returns/quick-sell-return" element={<QuickSellReturn />} />
            <Route path="/sales/approvals/price-approval-queue" element={<PriceApprovalQueue />} />
            <Route path="/sales/approvals/credit-approval-queue" element={<CreditApprovalQueue />} />
            <Route path="/sales/receipts/advance-receipt-page" element={<AdvanceReceiptPage />} />
            <Route path="/purchase/invoice/purchase-invoice-list" element={<PurchaseInvoiceList />} />
            <Route path="/purchase/transport-payment" element={<TransportPayment />} />
            <Route path="/purchase/hundekari-payment" element={<HundekariPayment />} />
            <Route path="/purchase/invoice/csvpurchase-invoice" element={<CSVPurchaseInvoice />} />
            <Route path="/purchase/returns/purchase-return" element={<PurchaseReturn />} />
            <Route path="/purchase/returns/debit-note-page" element={<DebitNotePage />} />
            <Route path="/purchase/returns/return-challan-page" element={<ReturnChallanPage />} />
            <Route path="/purchase/returns/manual-purchase-return" element={<ManualPurchaseReturn />} />
            <Route path="/logistics/lrpending/lrpending-list" element={<LRPendingList />} />
            <Route path="/logistics/inward/inward-overview" element={<InwardOverview />} />
            <Route path="/logistics/inward/inward-scanning" element={<InwardScanning />} />
            <Route path="/logistics/inward/bulk-transit-in" element={<BulkTransitIn />} />
            <Route path="/logistics/invoices/view-in-transit-invoice" element={<ViewInTransitInvoice />} />
            <Route path="/logistics/invoices/view-barcoded-invoice" element={<ViewBarcodedInvoice />} />
            <Route path="/inventory/verification/verify-stock" element={<VerifyStock />} />
            <Route path="/inventory/verification/verify-stock-history" element={<VerifyStockHistory />} />
            <Route path="/inventory/barcodes/label-print-page" element={<LabelPrintPage />} />
            <Route path="/inventory/barcodes/bulk-label-print" element={<BulkLabelPrint />} />
            <Route path="/inventory/barcodes/barcoded-products" element={<BarcodedProducts />} />
            <Route path="/inventory/barcodes/barcodes-search" element={<BarcodesSearch />} />
            <Route path="/hr/attendance/attendance-entry" element={<AttendanceEntry />} />
            <Route path="/hr/attendance/shift-master" element={<ShiftMaster />} />
            <Route path="/hr/attendance/user-shifts" element={<UserShifts />} />
            <Route path="/hr/payroll/salary-management" element={<SalaryManagement />} />
            <Route path="/hr/payroll/payroll" element={<Payroll />} />
            <Route path="/hr/payroll/expense-entries" element={<ExpenseEntries />} />
            <Route path="/hr/payroll/expense-dashboard" element={<ExpenseDashboard />} />
            <Route path="/reports/sales/hsnsales-report" element={<HSNSalesReport />} />
            <Route path="/reports/sales/department-sales-report" element={<DepartmentSalesReport />} />
            <Route path="/reports/sales/salesman-performance-report" element={<SalesmanPerformanceReport />} />
            <Route path="/reports/purchase/poregister" element={<PORegister />} />
            <Route path="/reports/purchase/supplier-summary" element={<SupplierSummary />} />
            <Route path="/reports/purchase/party-performance" element={<PartyPerformance />} />
            <Route path="/reports/inventory/current-stock" element={<CurrentStock />} />
            <Route path="/reports/inventory/category-stock" element={<CategoryStock />} />
            <Route path="/reports/inventory/stock-ageing" element={<StockAgeing />} />
            <Route path="/reports/inventory/in-transit-stock" element={<InTransitStock />} />
            <Route path="/reports/compliance/gstr-report" element={<GstrReport />} />
            <Route path="/reports/compliance/einvoice-report" element={<EInvoiceReport />} />
            <Route path="/reports/compliance/daily-registers" element={<DailyRegisters />} />
            <Route path="/settings/users/user-master" element={<UserMaster />} />
            <Route path="/settings/users/roles" element={<Roles />} />
            <Route path="/settings/users/user-roles" element={<UserRoles />} />
            <Route path="/settings/users/tokens" element={<Tokens />} />
            <Route path="/settings/users/salesmen" element={<Salesmen />} />
            <Route path="/settings/system/system-config" element={<SystemConfig />} />
            <Route path="/settings/system/audit-log" element={<AuditLog />} />
            <Route path="/settings/system/project-status" element={<ProjectStatus />} />
            <Route path="/settings/portals/vendor-payment-status" element={<VendorPaymentStatus />} />
            <Route path="/settings/portals/admin-vendor-potracker" element={<AdminVendorPOTracker />} />
            <Route path="/masters/section" element={<SectionMaster />} />
            <Route path="/masters/style" element={<StyleMaster />} />
            <Route path="/masters/substyle" element={<SubStyleMaster />} />
            <Route path="/masters/design" element={<DesignMaster />} />
            <Route path="/masters/size" element={<SizeMaster />} />
            <Route path="/masters/color" element={<ColorMaster />} />
            <Route path="/masters/material" element={<MaterialMaster />} />
            <Route path="/masters/hsnsac" element={<HSNSACMaster />} />
            
            <Route path="/masters/party" element={<PartyMaster />} />
            <Route path="/masters/customer" element={<CustomerMaster />} />
            <Route path="/masters/transporter" element={<TransporterMaster />} />
            <Route path="/masters/hundekari" element={<HundekariMaster />} />
            <Route path="/masters/commission" element={<CommissionMaster />} />
            
            <Route path="/masters/location" element={<LocationMaster />} />
            <Route path="/masters/chargestype" element={<ChargesTypeMaster />} />
            <Route path="/masters/itempercentage" element={<ItemPercentageMaster />} />
            
            {/* Masters Hub */}
            <Route path="/masters" element={<MastersHub />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </HelmetProvider>
  )
}

export default App
