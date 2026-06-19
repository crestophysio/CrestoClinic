"use client";

import React, { useState } from "react";
import { Plus, Minus, HelpCircle, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface AllFAQsViewProps {
  faqs: any[];
}

export default function AllFAQsView({ faqs }: AllFAQsViewProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Back Button & Header */}
      <div className="mb-12">
        <Link
          href="/#faqs"
          className="inline-flex items-center gap-2 text-teal font-bold hover:text-teal-dark transition-all text-sm mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-brand-border/60 pb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-tint text-teal-dark text-xs font-semibold mb-3">
              <HelpCircle className="w-4 h-4 text-teal" />
              <span>Frequently Asked Questions</span>
            </div>
            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-brand-ink">
              All FAQs
            </h1>
            <p className="text-brand-muted text-sm mt-2">
              Everything you need to know about our physiotherapy services and treatments.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-xs shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border focus:border-teal focus:outline-none text-xs text-brand-ink"
            />
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <h2 className="sr-only">All Frequently Asked Questions</h2>
      {filteredFaqs.length === 0 ? (
        <div className="text-center py-20 text-brand-muted text-sm border border-dashed border-brand-border rounded-3xl bg-white max-w-md mx-auto">
          {searchQuery ? "No FAQs matching your search." : "No FAQs available yet."}
        </div>
      ) : (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="bg-white border border-brand-border/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none"
                >
                  <span className="font-heading font-bold text-sm sm:text-base text-brand-ink pr-4 leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 p-1.5 rounded-full border text-teal transition-colors ${
                      isOpen
                        ? "bg-teal text-white border-teal"
                        : "bg-white border-brand-border"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 border-t border-brand-border/30 text-xs sm:text-sm text-brand-muted leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Book appointment CTA */}
      <div className="mt-16 text-center">
        <p className="text-brand-muted text-sm mb-4">Still have questions? Talk to our team.</p>
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-teal text-white font-bold text-sm hover:bg-teal-dark transition-all duration-300 shadow-md active:scale-95"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
