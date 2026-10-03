filepath = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/components/layout/Header.tsx'
with open(filepath, 'r') as f:
    content = f.read()

import1 = "import { useState, useEffect } from 'react';"
if 'import { useState, useEffect } from' not in content:
    content = content.replace("import React from 'react';", "import React, { useState, useEffect } from 'react';")

state_code = """  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(true);
    const t = setTimeout(() => setIsNavigating(false), 200);
    return () => clearTimeout(t);
  }, [location.pathname]);"""

content = content.replace("const location = useLocation();", state_code)

level2_old = 'className="absolute top-[calc(100%-2px)] left-0 min-w-[200px] bg-white rounded-xl shadow-lg border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50"'
level2_new = 'className={`absolute top-[calc(100%-2px)] left-0 min-w-[200px] bg-white rounded-xl shadow-lg border border-slate-100 py-2 transition-all duration-200 transform z-50 ${isNavigating ? "hidden" : "opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0"}`}'
content = content.replace(level2_old, level2_new)

level3_old = 'className="absolute top-0 left-full ml-1 min-w-[220px] bg-white rounded-xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 transform -translate-x-2 group-hover/sub:translate-x-0 z-50"'
level3_new = 'className={`absolute top-0 left-full ml-1 min-w-[220px] bg-white rounded-xl shadow-xl border border-slate-100 py-2 transition-all duration-200 transform z-50 ${isNavigating ? "hidden" : "opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible -translate-x-2 group-hover/sub:translate-x-0"}`}'
content = content.replace(level3_old, level3_new)

with open(filepath, 'w') as f:
    f.write(content)
