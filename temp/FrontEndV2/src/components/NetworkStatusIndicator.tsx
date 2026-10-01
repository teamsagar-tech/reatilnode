import React, { useState, useEffect } from 'react';

export default function NetworkStatusIndicator() {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const checkSpeed = () => {
        // downlink is in Megabits per second (Mbps)
        // 0.5 Mbps = 500 kbps
        if (connection.downlink < 0.5 || connection.effectiveType?.includes('2g')) {
          setIsSlow(true);
        } else {
          setIsSlow(false);
        }
      };

      // Check on initial load
      checkSpeed();

      // Listen for network changes (if the user's wifi suddenly drops speed)
      connection.addEventListener('change', checkSpeed);
      return () => connection.removeEventListener('change', checkSpeed);
    }
  }, []);

  if (!isSlow) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-red-500 text-white px-4 py-2 rounded-md shadow-lg font-bold flex items-center gap-2 animate-pulse text-[12px] pointer-events-none">
      ⚠️ Slow Internet Connection Detected! The system may take longer to respond.
    </div>
  );
}
