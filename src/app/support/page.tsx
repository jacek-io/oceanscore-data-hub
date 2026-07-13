import { Headset, Mail, ArrowRight } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Content area */}
      <div className="flex-1 flex flex-col items-center pt-16 px-6">
        <div className="w-full max-w-[960px] flex flex-col items-center gap-16">
          {/* Header */}
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-[32px] font-medium text-foreground leading-[1.2] tracking-[-0.96px]">
              Contact Support
            </h1>
            <p className="text-sm text-muted-foreground leading-[1.2] tracking-[-0.14px]">
              Get in touch with our team
            </p>
          </div>

          {/* Cards */}
          <div className="w-full flex flex-col items-center gap-16">
            <div className="w-full flex gap-4">
              {/* Service Phone */}
              <a
                href="tel:+351936889704"
                className="flex-1 bg-white rounded-[16px] p-5 h-[135px] flex flex-col justify-between hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-foreground">
                    Service Phone
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center">
                    <Headset className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-[#1157b2]">
                  + 351 936 889 704
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </a>

              {/* Service Backup Phone */}
              <a
                href="tel:+351936889705"
                className="flex-1 bg-white rounded-[16px] p-5 h-[135px] flex flex-col justify-between hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-foreground">
                    Service Backup Phone
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center">
                    <Headset className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-[#1157b2]">
                  + 351 936 889 705
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:admin@oceanscore.esi.com"
                className="flex-1 bg-white rounded-[16px] p-5 h-[135px] flex flex-col justify-between hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-foreground">
                    Email
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-[#1157b2]">
                  admin@oceanscore.esi.com
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </a>
            </div>

            {/* Footer text */}
            <p className="text-xs text-[#98a1ae] text-center leading-[1.45] max-w-[635px]">
              As of January 1, 2026, the ESI Foundation has appointed OceanScore (OceanScore Madeira LDA)
              <br />
              as the administrator of the ESI Program. Office Hours 09H00 - 18H00 GMT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
