// [Vedanti] OrderTokenBadge.jsx - Placeholder
import React from 'react';

const OrderTokenBadge = ({ token = 'CB-000' }) => {
  return (
    <div className="inline-block p-4 bg-orange-100 text-orange-800 font-bold rounded-xl border border-orange-200">
      Token: {token}
    </div>
  );
};

export default OrderTokenBadge;
