/**
 * @file OrderTokenBadge.jsx
 * @description Premium digital canteen pickup ticket pass with QR simulation, live status badge, and token copy action.
 * @author Vedanti (feat/vedanti-orders-tracking)
 */

import React, { useState } from 'react';
import {
  QrCode,
  Copy,
  Check,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  UtensilsCrossed,
  Flame,
} from 'lucide-react';

/**
 * Status configuration mapping for dynamic styles, badges, and icon representation.
 */
const STATUS_CONFIG = {
  Placed: {
    label: 'Order Placed',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    badgeBg: 'bg-amber-100/80',
    icon: Clock,
  },
  Preparing: {
    label: 'Kitchen Preparing',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    badgeBg: 'bg-blue-100/80',
    icon: Flame,
  },
  Ready: {
    label: 'Ready for Pickup',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
    dot: 'bg-emerald-500 animate-ping',
    badgeBg: 'bg-emerald-100',
    icon: CheckCircle2,
  },
  Completed: {
    label: 'Picked Up',
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
    badgeBg: 'bg-gray-100',
    icon: ShieldCheck,
  },
  Cancelled: {
    label: 'Cancelled',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
    badgeBg: 'bg-red-100',
    icon: AlertCircle,
  },
};

const OrderTokenBadge = ({
  token = 'CB-101',
  status = 'Placed',
  slotLabel = '12:30 PM - 12:45 PM',
  studentName = '',
  rollNumber = '',
  compact = false,
  counterNumber = 'Counter 2 (Hot Meals)',
}) => {
  const [copied, setCopied] = useState(false);
  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG.Placed;
  const StatusIcon = statusInfo.icon;

  const handleCopyToken = () => {
    if (navigator.clipboard && token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">Token</span>
        <span className="font-mono font-black text-sm tracking-tight">{token}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
        <span className="text-xs font-semibold text-gray-700">{status}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto bg-white rounded-3xl border border-gray-200/90 shadow-xl overflow-hidden transition-all hover:shadow-2xl">
      {/* Top Header Strip with Canteen Watermark */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-wide uppercase">CampusBite Pass</h3>
              <p className="text-[10px] text-orange-100/90 font-medium">Digital Canteen Pickup Token</p>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusInfo.badgeBg} ${statusInfo.text} shadow-xs border ${statusInfo.border}`}
          >
            <StatusIcon className="w-3.5 h-3.5 shrink-0" />
            <span>{statusInfo.label}</span>
          </div>
        </div>
      </div>

      {/* Main Ticket Body */}
      <div className="p-6 bg-gradient-to-b from-orange-50/40 via-white to-amber-50/20 text-center relative">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-600/90 block">
          Counter Display Token
        </span>

        {/* 4-Digit Prominent Monospace Token */}
        <div className="my-2 flex items-center justify-center gap-3">
          <span className="text-5xl font-black font-mono tracking-tight text-gray-900 select-all">
            {token}
          </span>
          <button
            onClick={handleCopyToken}
            title="Copy token to clipboard"
            className="p-2 rounded-xl text-gray-400 hover:text-orange-600 hover:bg-orange-100/60 transition active:scale-95"
            aria-label="Copy pickup token"
          >
            {copied ? (
              <Check className="w-5 h-5 text-emerald-600" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>

        {copied && (
          <p className="text-[11px] font-semibold text-emerald-600 -mt-1 mb-2 animate-fadeIn">
            ✓ Token copied to clipboard
          </p>
        )}

        {/* Slot Window & Counter Details */}
        <div className="mt-3 inline-flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-orange-600" />
            <span>{slotLabel}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 shadow-2xs">
            <ChefHat className="w-3.5 h-3.5 text-amber-600" />
            <span>{counterNumber}</span>
          </div>
        </div>

        {/* Ticket Perforation Dashed Separator with Left/Right Cutouts */}
        <div className="relative my-6">
          <div className="absolute -left-9 -top-3 w-6 h-6 bg-gray-50 rounded-full border-r border-gray-200" />
          <div className="border-t-2 border-dashed border-gray-200 w-full" />
          <div className="absolute -right-9 -top-3 w-6 h-6 bg-gray-50 rounded-full border-l border-gray-200" />
        </div>

        {/* Bottom Section: QR Code Simulation & Instructions */}
        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs text-left">
          {/* Simulated QR Code Graphic */}
          <div className="w-20 h-20 bg-gray-900 rounded-xl p-2 shrink-0 flex flex-col items-center justify-center text-white relative shadow-inner">
            <QrCode className="w-12 h-12 text-white" />
            <span className="text-[8px] font-mono tracking-tighter text-amber-300 mt-0.5">SCAN COUNTER</span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Express Pickup Instructions</span>
            </div>
            <p className="text-gray-500 text-[11px] leading-relaxed">
              Show this token on your phone at <strong>Counter 2</strong> when status turns{' '}
              <strong className="text-emerald-700">Ready for Pickup</strong>.
            </p>
            {(studentName || rollNumber) && (
              <p className="text-[10px] text-gray-400 pt-0.5 font-medium">
                Issued for: {studentName} {rollNumber ? `(${rollNumber})` : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTokenBadge;
