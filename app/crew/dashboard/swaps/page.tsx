'use client';

import { useEffect } from 'react';
import StatusBadge from '@/components/StatusBadge';
import { useSwaps } from '@/features/swap/hooks/useEmployeeSwap';

export default function SwapsPage() {
  const {
    user,
    schedule,
    colleagues,
    swapCandidates,
    msg,
    showForm,
    setShowForm,
    form,
    setForm,
    requestSwap,
    fetchSwapCandidates, // 👈 ADD THIS in your hook
    loadingCandidates,    // 👈 ADD THIS in your hook
  } = useSwaps();

  if (!user) return null;

  const swaps = schedule.swaps;
  const inbound = swaps.filter(
    (s) => s.targetId === user.id && s.status === 'Pending'
  );
  const outbound = swaps.filter(
    (s) => s.requesterId === user.id
  );

  // ── FIX: fetch candidates when date changes ───────────────────────────────
  useEffect(() => {
    if (!form.date) return;

    fetchSwapCandidates(form.date);

    // reset selection when date changes (prevents stale data bug)
    setForm((prev) => ({
      ...prev,
      targetId: '',
      shiftType: 'Morning',
    }));
  }, [form.date]);

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">Shift Swaps</h1>

        <button
          onClick={() => {
            setForm({
              date: '',
              targetId: '',
              shiftType: 'Morning',
              note: '',
            });
            setShowForm(true);
          }}
          className="bg-amber-500 text-black px-3 py-1.5 rounded-lg text-sm font-semibold"
        >
          + Request swap
        </button>
      </div>

      {/* Message */}
      {msg && (
        <div
          className={`p-3 rounded-lg text-sm font-semibold border ${
            msg.ok
              ? 'bg-green-950 text-green-400 border-green-900'
              : 'bg-red-950 text-red-400 border-red-900'
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Inbound */}
      <div className="bg-[#1a1a1a] border border-[#252525] rounded-xl p-4">
        <h2 className="text-xs uppercase text-gray-500 font-semibold mb-3">
          Requests for You ({inbound.length})
        </h2>

        {inbound.length === 0 ? (
          <p className="text-gray-600 text-sm">No incoming swap requests</p>
        ) : (
          inbound.map((swap) => (
            <div key={swap.id} className="bg-[#111] p-3 rounded-lg mb-2">
              <p className="text-sm font-semibold">
                Employee #{swap.requesterId} wants to swap
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {swap.date} · {swap.shiftType}
              </p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => schedule.acceptSwap(swap.id)}
                  className="bg-amber-500 text-black px-3 py-1 rounded-md text-xs font-semibold"
                >
                  Accept
                </button>

                <button
                  onClick={() => schedule.denySwap(swap.id)}
                  className="bg-red-900 text-red-300 px-3 py-1 rounded-md text-xs"
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Outbound */}
      <div className="bg-[#1a1a1a] border border-[#252525] rounded-xl p-4">
        <h2 className="text-xs uppercase text-gray-500 font-semibold mb-3">
          Your Requests ({outbound.length})
        </h2>

        {outbound.length === 0 ? (
          <p className="text-gray-600 text-sm">No swap requests</p>
        ) : (
          outbound.map((swap) => (
            <div
              key={swap.id}
              className="flex justify-between bg-[#111] p-3 rounded-lg mb-2"
            >
              <div>
                <p className="text-sm font-semibold">
                  → Employee #{swap.targetId}
                </p>
                <p className="text-xs text-gray-500">
                  {swap.date} · {swap.shiftType}
                </p>
              </div>

              <StatusBadge status={swap.status} />
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/70 flex items-end justify-center mb-15 md:mb-0"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-md bg-[#1a1a1a] border border-[#2a2a2a] rounded-t-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold mb-4">Request Shift Swap</h2>

            {/* DATE */}
            <input
              type="date"
              className="w-full bg-[#111] border border-[#2a2a2a] p-2 rounded mb-3"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />

            {/* LOADING STATE */}
            {loadingCandidates && (
              <p className="text-xs text-gray-500 mb-2">
                Loading available colleagues...
              </p>
            )}

            {/* CANDIDATES */}
            <select
              className="w-full bg-[#111] border border-[#2a2a2a] p-2 rounded mb-3"
              value={form.targetId}
              onChange={(e) => {
                const selected = swapCandidates.find(
                  (c) => String(c.employee_id) === e.target.value
                );

                setForm({
                  ...form,
                  targetId: e.target.value,
                  shiftType: selected?.shift_type ?? 'Morning',
                });
              }}
              disabled={!form.date || loadingCandidates}
            >
              <option value="">
                {form.date
                  ? 'Select colleague'
                  : 'Pick a date first'}
              </option>

              {swapCandidates.map((c) => (
                <option key={c.employee_id} value={c.employee_id}>
                  {c.first_name} {c.last_name} — {c.shift_type}
                </option>
              ))}
            </select>

            {/* SHIFT */}
            <select
              className="w-full bg-[#111] border border-[#2a2a2a] p-2 rounded mb-3"
              value={form.shiftType}
              onChange={(e) =>
                setForm({
                  ...form,
                  shiftType: e.target.value as any,
                })
              }
            >
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
            </select>

            {/* NOTE */}
            <input
              className="w-full bg-[#111] border border-[#2a2a2a] p-2 rounded mb-4"
              placeholder="Note (optional)"
              value={form.note}
              onChange={(e) =>
                setForm({ ...form, note: e.target.value })
              }
            />

            {/* ACTIONS */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="bg-[#222] px-3 py-2 rounded text-sm"
              >
                Cancel
              </button>

              <button
                onClick={requestSwap}
                className="flex-1 bg-amber-500 text-black font-semibold rounded py-2"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}