"use client";

import { useState } from "react";
import CountryCard from "./CountryCard";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Area {
  flag: string;
  name: string;
  cities: string;
  href: string;
  image: string;
}

export default function CitiesGrid({ areas }: { areas: Area[] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Desktop view: always show all */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 w-full text-left">
        {areas.map((area, i) => (
          <CountryCard key={i} flag={area.flag} name={area.name} cities={area.cities} href={area.href} image={area.image} />
        ))}
      </div>

      {/* Mobile view: conditional rendering */}
      <div className="grid md:hidden grid-cols-1 gap-4 w-full text-left">
        {(expanded ? areas : areas.slice(0, 3)).map((area, i) => (
          <CountryCard key={i} flag={area.flag} name={area.name} cities={area.cities} href={area.href} image={area.image} />
        ))}
      </div>

      {/* Toggle Button for mobile only */}
      {areas.length > 3 && (
        <Button
          variant="outline"
          onClick={() => setExpanded(!expanded)}
          className="mt-6 md:hidden border-2 border-blue-primary text-blue-primary hover:bg-blue-light h-10 px-6 rounded-xl font-semibold flex items-center gap-2"
        >
          {expanded ? (
            <>
              Show Less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              More Cities <ChevronDown className="w-4 h-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}
