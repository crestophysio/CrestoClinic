"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, Save, X, HelpCircle, MessageSquare } from "lucide-react";
import { useAdminFeedback } from "@/components/AdminFeedback";

export default function AdminFAQsPage() {
  const { confirm, notify } = useAdminFeedback();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ question: "", answer: "" });

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/faqs");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setFaqs(data);
      }
    } catch (err) {
      console.error("Failed to load FAQs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData({ question: "", answer: "" });
    setShowModal(true);
  };

  const handleOpenEdit = (faq: any) => {
    setEditId(faq._id);
    setFormData({ question: faq.question, answer: faq.answer });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) return;
    setSaving(true);

    try {
      const method = editId ? "PUT" : "POST";
      const payload = editId ? { ...formData, id: editId } : formData;

      const res = await fetch("/api/faqs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save FAQ");
      notify("success", editId ? "FAQ updated successfully." : "FAQ added successfully.");
      setShowModal(false);
      fetchFaqs();
    } catch (err) {
      console.error(err);
      notify("error", "Could not save the FAQ. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete FAQ?",
      message: "This will permanently remove the question and answer. This cannot be undone.",
      confirmText: "Delete",
    });
    if (!ok) return;

    try {
      const res = await fetch(`/api/faqs?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete FAQ");
      notify("success", "FAQ deleted.");
      fetchFaqs();
    } catch (err) {
      console.error(err);
      notify("error", "Could not delete the FAQ.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-3xl text-slate-800">FAQ Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Add, edit, or remove frequently asked questions shown on the public site.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-teal hover:bg-teal-dark text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer text-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Add FAQ</span>
        </button>
      </div>

      {/* Stats badge */}
      <div className="flex items-center gap-3">
        <div className="px-4 py-2 bg-teal-tint rounded-xl text-teal-dark text-xs font-bold border border-teal/20">
          {faqs.length} FAQ{faqs.length !== 1 ? "s" : ""} total
        </div>
        <div className="px-4 py-2 bg-brand-blush rounded-xl text-pink-safe text-xs font-bold border border-pink/15">
          First 4 shown on homepage
        </div>
      </div>

      {/* FAQ List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal" />
        </div>
      ) : faqs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-200 rounded-3xl bg-white">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-semibold">No FAQs yet</p>
          <p className="text-slate-400 text-xs mt-1">Click "Add FAQ" to create your first one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={faq._id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex gap-4 items-start"
            >
              {/* Number badge */}
              <div className="shrink-0 w-8 h-8 rounded-full bg-teal-tint text-teal font-bold text-xs flex items-center justify-center border border-teal/20">
                {idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold text-sm text-slate-800 mb-1.5 leading-snug">
                      {faq.question}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {faq.answer}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 mt-0.5">
                    {idx < 4 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200 whitespace-nowrap">
                        Shown on homepage
                      </span>
                    )}
                    <button
                      onClick={() => handleOpenEdit(faq)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
                      title="Edit FAQ"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(faq._id)}
                      className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-500 cursor-pointer"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100">
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal" />
                <h3 className="font-heading font-bold text-lg">
                  {editId ? "Edit FAQ" : "Add New FAQ"}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Question <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, question: e.target.value }))
                  }
                  placeholder="e.g. How many physiotherapy sessions will I need?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Answer <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, answer: e.target.value }))
                  }
                  placeholder="Provide a clear, helpful answer..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800 resize-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-teal hover:bg-teal-dark text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer text-sm shadow-sm active:scale-95"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{editId ? "Update FAQ" : "Save FAQ"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
