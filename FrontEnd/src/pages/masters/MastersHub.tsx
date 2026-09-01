import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Package, Users, Settings, Database, ArrowRight, Tags, Briefcase, MapPin, Target, Palette, Shirt } from 'lucide-react';

const masterCategories = [
  {
    title: "Inventory Masters",
    icon: Package,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    items: [
      { name: "Item Master", path: "/masters/item", icon: Package },
      { name: "Brand Master", path: "/masters/brand", icon: Tags },
      { name: "Category Master", path: "/masters/category", icon: Database },
      { name: "Sub-Category", path: "/masters/subcategory", icon: Database },
      { name: "Department", path: "/masters/department", icon: Briefcase },
      { name: "Section", path: "/masters/section", icon: Target },
      { name: "Style", path: "/masters/style", icon: Shirt },
      { name: "Sub-Style", path: "/masters/substyle", icon: Shirt },
      { name: "Size Master", path: "/masters/size", icon: Target },
      { name: "Color Master", path: "/masters/color", icon: Palette },
      { name: "Material", path: "/masters/material", icon: Package },
      { name: "HSN/SAC", path: "/masters/hsnsac", icon: Database },
    ]
  },
  {
    title: "Accounting & Logistics",
    icon: Users,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    items: [
      { name: "Party Master", path: "/masters/party", icon: Users },
      { name: "Customer Master", path: "/masters/customer", icon: Users },
      { name: "Transporter", path: "/masters/transporter", icon: Target },
      { name: "Hundekari", path: "/masters/hundekari", icon: Target },
      { name: "Commission", path: "/masters/commission", icon: Database },
    ]
  },
  {
    title: "Configuration",
    icon: Settings,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    items: [
      { name: "Location Master", path: "/masters/location", icon: MapPin },
      { name: "Charges Type", path: "/masters/chargestype", icon: Settings },
      { name: "Item Percentage", path: "/masters/itempercentage", icon: Settings },
    ]
  }
];

export default function MastersHub() {
  return (
    <>
      <Helmet>
        <title>Masters Hub - RetailNode</title>
      </Helmet>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 animate-in fade-in zoom-in duration-500">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Masters Hub</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Configure and manage all core system entities.</p>
          </div>
        </div>

        {/* Master Categories Grid */}
        <div className="space-y-10">
          {masterCategories.map((category, idx) => {
            const CatIcon = category.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className={`px-6 py-4 border-b border-slate-100 flex items-center gap-3 ${category.bg}`}>
                  <div className={`p-2 rounded-xl bg-white shadow-sm ${category.color}`}>
                    <CatIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">{category.title}</h2>
                </div>
                
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {category.items.map((item, itemIdx) => {
                    const ItemIcon = item.icon;
                    return (
                      <Link
                        key={itemIdx}
                        to={item.path}
                        className={`group flex items-center justify-between p-4 rounded-2xl border ${category.border} bg-white hover:${category.bg} transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-slate-50 group-hover:bg-white transition-colors ${category.color}`}>
                            <ItemIcon className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-slate-700 text-sm">{item.name}</span>
                        </div>
                        <ArrowRight className={`w-4 h-4 ${category.color} opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300`} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
