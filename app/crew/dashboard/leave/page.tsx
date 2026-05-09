'use client';

import StatusBadge from '@/components/StatusBadge';
import { useLeaveFeature } from '@/features/leave/hooks/useLeave';

const TYPE_ICONS = {
  Vacation: '🏖',
  Sick: '🤒',
  Emergency: '🚨',
};

export default function LeavePage() {
  const {
    user,
    leave,
    showForm,
    setShowForm,
    form,
    setForm,
    submitLeave,
  } = useLeaveFeature();

  if (!user) return null;

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">Leave Management</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-amber-500 text-black px-3 py-1.5 rounded-lg text-sm font-semibold"
        >
          + File Leave
        </button>
      </div>

      {/* Messages */}
      {leave.error && (
        <div className="p-3 rounded-lg bg-red-950 text-red-400 border border-red-900 text-sm">
          {leave.error}
        </div>
      )}

      {leave.success && (
        <div className="p-3 rounded-lg bg-green-950 text-green-400 border border-green-900 text-sm font-semibold">
          {leave.success}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#1a1a1a] border border-[#252525] rounded-xl p-3 text-center">
          <div className="text-xs text-gray-500 uppercase">Balance</div>
          <div className="text-xl font-bold text-green-400">
            {user.leaveBalance}
          </div>
          <div className="text-[10px] text-gray-600">days</div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#252525] rounded-xl p-3 text-center">
          <div className="text-xs text-gray-500 uppercase">Pending</div>
          <div className="text-xl font-bold text-yellow-400">
            {leave.counts.pending}
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#252525] rounded-xl p-3 text-center">
          <div className="text-xs text-gray-500 uppercase">Approved</div>
          <div className="text-xl font-bold text-green-400">
            {leave.counts.approved}
          </div>
        </div>
      </div>

      {/* History */}
      <div className="bg-[#1a1a1a] border border-[#252525] rounded-xl p-4">
        <h2 className="text-xs uppercase text-gray-500 mb-3">
          Leave History
        </h2>

        {leave.leaves.length === 0 ? (
          <p className="text-gray-600 text-sm">
            No leave requests yet
          </p>
        ) : (
          leave.leaves.map((l) => (
            <div
              key={l.id}
              className="bg-[#111] rounded-lg p-3 mb-2 flex gap-3"
            >
              <span className="text-xl">
                {TYPE_ICONS[l.type]}
              </span>

              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-sm">
                    {l.type} Leave
                  </span>
                  <StatusBadge status={l.status} />
                </div>

                <div className="text-xs text-gray-500 mt-1">
                  {l.from} → {l.to}
                </div>

                <div className="text-xs text-gray-600 mt-1">
                  {l.reason}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/70 flex items-end justify-center mb-15 md:mb-0mb-15 md:mb-0"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-md bg-[#1a1a1a] border border-[#2a2a2a] rounded-t-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold mb-4">
              File Leave Request
            </h2>

            {/* Type */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(['Vacation', 'Sick', 'Emergency'] as const).map(
                (t) => (
                  <button
                    key={t}
                    onClick={() =>
                      setForm({ ...form, type: t })
                    }
                    className={`p-2 rounded-lg text-sm font-semibold border ${
                      form.type === t
                        ? 'bg-amber-900 text-amber-400 border-amber-500'
                        : 'bg-[#111] text-gray-500 border-[#2a2a2a]'
                    }`}
                  >
                    {TYPE_ICONS[t]} {t}
                  </button>
                )
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <input
                type="date"
                className="bg-[#111] border border-[#2a2a2a] p-2 rounded text-sm"
                value={form.from}
                onChange={(e) =>
                  setForm({ ...form, from: e.target.value })
                }
              />

              <input
                type="date"
                className="bg-[#111] border border-[#2a2a2a] p-2 rounded text-sm"
                value={form.to}
                onChange={(e) =>
                  setForm({ ...form, to: e.target.value })
                }
              />
            </div>

            {/* Reason */}
            <input
              className="w-full bg-[#111] border border-[#2a2a2a] p-2 rounded mb-4 text-sm"
              placeholder="Reason"
              value={form.reason}
              onChange={(e) =>
                setForm({ ...form, reason: e.target.value })
              }
            />

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="bg-[#222] px-3 py-2 rounded text-sm"
              >
                Cancel
              </button>

              <button
                onClick={submitLeave}
                disabled={leave.loading}
                className="flex-1 bg-amber-500 text-black font-semibold rounded py-2"
              >
                {leave.loading
                  ? 'Submitting...'
                  : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}