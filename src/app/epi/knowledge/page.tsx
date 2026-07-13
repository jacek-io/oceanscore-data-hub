"use client";

import { useState } from "react";
import { File, Minus, Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What is the Environmental Port Index (EPI)?",
    answer:
      "EPI is a per-port-call environmental reporting tool developed in collaboration with DNV and used primarily by Norwegian and Icelandic ports. Unlike ESI, which gives a vessel a single score valid for a period, EPI calculates a new score for every individual port call — measuring how a ship performed environmentally during one specific stay.",
  },
  {
    question: "How are EPI score calculated?",
    answer:
      "EPI scores are based on utility data submitted at departure: fuel consumed, CO₂ emissions, SOx, NOx, particulate matter, and shore power usage. These values are compared against the vessel's EPI Baseline for that specific port, producing a score from 0 to 100.",
  },
  {
    question: "What is an EPI Baseline and how is it set?",
    answer:
      "An EPI Baseline is established per vessel per port based on historical performance data. It represents the expected environmental footprint for a typical call at that port. The baseline is set during enrollment and periodically recalibrated as more data becomes available.",
  },
  {
    question: "What data must be submitted after each port call?",
    answer:
      "After each port call, the vessel must submit: arrival and departure dates, hours at port, fuel consumed (tonnes), CO₂ emissions (tonnes), SOx emissions (tonnes), NOx emissions (tonnes), particulate matter (tonnes), and shore power usage (MWh). This data is entered via the OceanScore Data Hub.",
  },
  {
    question: "When is the submission deadline for a port call?",
    answer:
      "Submissions are due within 14 days of departure from the port. After this deadline, the port call status changes to 'Overdue'. Late submissions may still be accepted but could affect the vessel's compliance record with the participating port authority.",
  },
  {
    question: "What is the URN (Underwater Radiated Noise) score?",
    answer:
      "The URN score is an optional module that evaluates a vessel's contribution to reducing underwater radiated noise during its port stay. It considers factors like engine load, propeller cavitation levels, and use of noise-mitigating technologies while in port waters.",
  },
  {
    question: "Which ports participate in EPI?",
    answer:
      "EPI is currently used by ports in Norway and Iceland, with plans to expand to additional Nordic and European ports. Participating ports offer various incentives for vessels achieving high EPI scores, including reduced port fees and priority berthing.",
  },
  {
    question: "How is EPI different from ESI?",
    answer:
      "While ESI evaluates a vessel's overall environmental performance with a single score valid for a reference period, EPI is granular — it scores each individual port call separately. ESI focuses on ship-level compliance; EPI focuses on operational performance during specific stays.",
  },
];

export default function EpiKnowledgePage() {
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
          Methodologies and frequently asked questions about EPI
        </p>
      </div>

      {/* Methodology Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* EPI Methodology */}
        <div className="bg-white rounded-[16px] p-5 flex flex-col gap-4">
          <div className="w-8 h-8 rounded-full bg-[#d0e5c3] flex items-center justify-center">
            <File className="w-4 h-4 text-[#5C8A3E]" />
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-medium text-foreground tracking-[-0.48px]">
              EPI Methodology
            </h3>
            <p className="text-sm text-[#4a5565] leading-[1.5] tracking-[-0.14px]">
              How EPI scores are calculated per port call: utility data submitted on
              departure (fuel, CO₂, SOx, NOx, particulates) is compared to the vessel&apos;s EPI
              Baseline at that port to produce a score from 0–100.
            </p>
          </div>
          <a
            href="#"
            className="text-sm text-primary border-b border-primary self-start pb-0.5"
          >
            Download PDF
          </a>
        </div>

        {/* Rating Bands & Thresholds */}
        <div className="bg-white rounded-[16px] p-5 flex flex-col gap-4">
          <div className="w-8 h-8 rounded-full bg-[#cce1ff] flex items-center justify-center">
            <File className="w-4 h-4 text-[#4780CF]" />
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-medium text-foreground tracking-[-0.48px]">
              Rating Bands &amp; Thresholds
            </h3>
            <p className="text-sm text-[#4a5565] leading-[1.5] tracking-[-0.14px]">
              How EPI Baselines are established per vessel per port, what utility data
              must be recorded during the stay, and how to submit it via Data Hub on
              departure.
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
              Everything you need to know about the
              Environmental Port Index. Can&apos;t find the answer
              you are looking for?
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
