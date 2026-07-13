"use client";

import { useState } from "react";
import { File, Minus, Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What is the Environmental Ship Index (ESI)?",
    answer:
      "The ESI is a voluntary identification scheme that evaluates the environmental performance of ocean-going vessels. It scores ships from 0 (baseline IMO compliance) to 100 (zero emission) based on NOx, SOx, and CO₂ performance, giving ports and stakeholders a transparent benchmark.",
  },
  {
    question: "How is the ESI score calculated?",
    answer:
      "The ESI score is calculated by combining sub-scores for NOx, SOx, and GHG emissions. Each category measures how far a vessel's performance exceeds the current IMO regulatory baseline. The individual sub-scores are weighted and summed to produce a total score between 0 and 100.",
  },
  {
    question: "Who decides what incentives a port offers?",
    answer:
      "Each participating port authority independently determines the type and level of incentives it offers to vessels with high ESI scores. Incentives can include reduced port dues, priority berthing, or other benefits. Ports publish their incentive structures on the ESI website.",
  },
  {
    question: "Is participation in the ESI mandatory?",
    answer:
      "No, the ESI is a completely voluntary scheme. Ship owners and operators choose to participate by registering their vessels and submitting the required emissions data. There is no regulatory requirement to join, but participation can lead to financial benefits at participating ports.",
  },
  {
    question: "How often are ESI scores updated?",
    answer:
      "ESI scores are recalculated at the beginning of each new reference period, typically annually. Vessel owners must submit updated emissions data and documentation for each period. Scores remain valid throughout the reference period unless a vessel's status changes.",
  },
  {
    question: "What is the URN (Underwater Radiated Noise) score?",
    answer:
      "The URN score is an additional ESI module that evaluates a vessel's contribution to reducing underwater radiated noise pollution. It considers factors such as propeller design, hull form, onboard noise-reducing technologies, and operational measures like Vessel Speed Reduction (VSR) in sensitive marine areas.",
  },
  {
    question: "What fuels qualify for GHG scoring?",
    answer:
      "Fuels that qualify for GHG scoring include LNG, methanol, biofuels, hydrogen, ammonia, and other alternative fuels with lower well-to-wake greenhouse gas emissions compared to conventional marine fuels. The scoring considers the full lifecycle emissions including production, transport, and combustion.",
  },
  {
    question: "How do I enroll my vessel in the ESI?",
    answer:
      "To enroll a vessel, log in to the OceanScore Data Hub and navigate to the ESI section. Select your vessel and click 'Enroll'. You will need to provide technical documentation including your IAPP certificate, engine specifications, and fuel consumption data for the relevant reference period.",
  },
];

export default function KnowledgePage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [tcExpanded, setTcExpanded] = useState(false);

  return (
    <div className="px-6 py-5 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-medium text-foreground leading-tight tracking-[-0.96px]">
          Knowledge Center
        </h1>
        <p className="text-sm text-muted-foreground mt-1 tracking-[-0.14px]">
          Methodologies and frequently asked questions about ESI 2.0
        </p>
      </div>

      {/* Methodology Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* ESI Core Methodology */}
        <div className="bg-white rounded-[16px] p-5 flex flex-col gap-4">
          <div className="w-8 h-8 rounded-full bg-[#d0e5c3] flex items-center justify-center">
            <File className="w-4 h-4 text-[#5C8A3E]" />
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-medium text-foreground tracking-[-0.48px]">
              ESI Core (2.0) Methodology
            </h3>
            <p className="text-sm text-[#4a5565] leading-[1.5] tracking-[-0.14px]">
              The ESI is a voluntary identification scheme that evaluates the
              environmental performance.
            </p>
          </div>
          <a
            href="#"
            className="text-sm text-primary border-b border-primary self-start pb-0.5"
          >
            Download PDF
          </a>
        </div>

        {/* URN Methodology */}
        <div className="bg-white rounded-[16px] p-5 flex flex-col gap-4">
          <div className="w-8 h-8 rounded-full bg-[#cce1ff] flex items-center justify-center">
            <File className="w-4 h-4 text-[#4780CF]" />
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-medium text-foreground tracking-[-0.48px]">
              Underwater Radiated Noise Methodology
            </h3>
            <p className="text-sm text-[#4a5565] leading-[1.5] tracking-[-0.14px]">
              The ESI is a voluntary identification scheme that evaluates the
              environmental performance.
            </p>
          </div>
          <a
            href="#"
            className="text-sm text-primary border-b border-primary self-start pb-0.5"
          >
            Download PDF
          </a>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-[16px] p-5 flex gap-[100px]">
        {/* Left: title + contact */}
        <div className="w-[360px] shrink-0 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-medium text-foreground tracking-[-0.72px]">
              FAQs
            </h2>
            <p className="text-sm text-[#4a5565] leading-[1.5] tracking-[-0.14px]">
              Everything you need to know about the ESI 2.0 and other
              information. Can&apos;t find the answer you are looking for?
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#4a5565] leading-[1.5] tracking-[-0.14px]">
              Reach out to us at
            </span>
            <a
              href="mailto:info@oceanscore.com"
              className="text-sm text-primary border-b border-primary pb-0.5"
            >
              info@oceanscore.com
            </a>
          </div>
        </div>

        {/* Right: accordion */}
        <div className="flex-1 flex flex-col gap-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col pb-3",
                i < faqs.length - 1 && "border-b border-[#e5e7eb]"
              )}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-sm font-medium text-foreground tracking-[-0.14px]">
                  {faq.question}
                </span>
                {openFaq === i ? (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Minus className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center shrink-0">
                    <Plus className="w-4 h-4 text-[#697282]" />
                  </div>
                )}
              </button>
              {openFaq === i && faq.answer && (
                <p className="text-sm text-[#4a5565] leading-[1.5] tracking-[-0.14px] mt-4 pr-8">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="bg-white rounded-[16px] p-5 flex flex-col items-center">
        <div className="w-full flex flex-col gap-6">
          <h2 className="text-2xl font-medium text-foreground tracking-[-0.72px]">
            Terms &amp; Conditions
          </h2>
          <div
            className={cn(
              "flex flex-col gap-2 overflow-hidden relative",
              !tcExpanded && "max-h-[293px]"
            )}
          >
            <h3 className="text-lg font-medium text-foreground tracking-[-0.54px]">
              1. Definitions
            </h3>
            <div className="text-sm text-[#4a5565] leading-[1.5] tracking-[-0.14px] flex flex-col gap-0">
              <p>
                1.1 &apos;GMS&apos; means Green Mare Services Lda. &amp;
                Comandita, Rua da Alfândega, n.o 78, 3.o B, 9000-059 Funchal,
                Madeira, Portugal, or, if applicable, a different distributor
                which concludes the contract with the Client (e.g. OceanScore
                GmbH), as designated in the respective Order.
              </p>
              <p>
                1.2 &apos;Client&apos; means the entity who has entered into a
                Subscription with GMS.
              </p>
              <p>
                1.3 &apos;Parties&apos; means GMS and the Client (each
                individually referred to as &apos;Party&apos;)
              </p>
              <p>
                1.4 &apos;Order&apos; means a binding offer by the Client to
                subscribe to a specific OceanScore Product by the official means
                provided by GMS (e.g. analogue or digital order form).
              </p>
              <p>
                1.5 &apos;Subscription&apos; means, upon GMS&apos;s acceptance
                of the Client&apos;s Order the Client&apos;s subscription and
                access to the ordered OceanScore Product subject to these GTC.
              </p>
              <p>
                1.6 &apos;Confidential Information&apos; means any non-public
                information, data, materials, trade secrets, know-how, or
                proprietary information disclosed by one party
                (&quot;Disclosing Party&quot;) to the other party
                (&quot;Receiving Party&quot;) in connection with the business
                relationship of the Parties. Confidential Information shall not
                be information which
              </p>
              <ul className="list-disc ml-6">
                <li>
                  a. is already in the public domain at the time of disclosure or
                  subsequently becomes part of the public domain through no fault
                  of the Receiving Party.
                </li>
                <li>
                  b. is independently developed by the Receiving Party without
                  reference to the Confidential Information disclosed under this
                  agreement.
                </li>
                <li>
                  c. is lawfully obtained by the Receiving Party from a third
                  party without any obligation of confidentiality.
                </li>
                <li>
                  d. is required to be disclosed by law, regulation, or court
                  order, provided that the Receiving Party gives the Disclosing
                  Party prompt notice of such requirement to allow the Disclosing
                  Party an opportunity to seek protective measures.
                </li>
              </ul>
              <p>
                1.7 &apos;OceanScore Platform&apos; means the digital platform
                owned and operated by GMS for the distribution of some digital
                OceanScore Products.
              </p>
              <p>
                1.8 &apos;OceanScore Products&apos; means any and all products
                distributed by GMS (including digital and analogue, standard and
                customized products) as determined in the respective Order.
              </p>
            </div>
            {!tcExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-white to-transparent" />
            )}
          </div>
        </div>
        <button
          onClick={() => setTcExpanded(!tcExpanded)}
          className="mt-4 inline-flex items-center gap-2 h-8 px-3 py-1.5 rounded-lg border border-border bg-white text-[12px] font-normal text-foreground hover:bg-[#ebf3ff] hover:border-[#cce1ff] active:bg-[#cce1ff] active:border-[#afd0ff] transition-colors"
        >
          <ChevronDown
            className={cn(
              "w-5 h-5 transition-transform",
              tcExpanded && "rotate-180"
            )}
          />
          {tcExpanded ? "Show Less" : "Read More"}
        </button>
      </div>
    </div>
  );
}
