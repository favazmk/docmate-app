import { Search, MapPin, ShieldPlus } from "lucide-react";
import { Button } from "./ui/button";

export default function SearchBar() {
  return (
    <form action="/search" method="GET" className="bg-white rounded-2xl p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-border w-full max-w-4xl mx-auto -mt-16 md:-mt-24 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4">
        {/* Field 1: Specialty */}
        <div className="flex flex-col bg-gray-bg rounded-xl p-3 border border-gray-border focus-within:border-blue-primary transition-colors">
          <div className="flex items-center gap-1.5 mb-1 text-blue-primary">
            <Search className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Specialty or doctor</span>
          </div>
          <input 
            type="text" 
            name="specialty"
            placeholder="e.g. Dermatologist" 
            className="bg-transparent border-none outline-none text-text-dark font-medium placeholder:text-text-light w-full"
          />
        </div>

        {/* Field 2: City */}
        <div className="flex flex-col bg-gray-bg rounded-xl p-3 border border-gray-border focus-within:border-blue-primary transition-colors">
          <div className="flex items-center gap-1.5 mb-1 text-blue-primary">
            <MapPin className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">City</span>
          </div>
          <input 
            type="text" 
            name="city"
            placeholder="Dubai, Riyadh..." 
            className="bg-transparent border-none outline-none text-text-dark font-medium placeholder:text-text-light w-full"
          />
        </div>

        {/* Field 3: Insurance */}
        <div className="flex flex-col bg-gray-bg rounded-xl p-3 border border-gray-border focus-within:border-blue-primary transition-colors">
          <div className="flex items-center gap-1.5 mb-1 text-blue-primary">
            <ShieldPlus className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Insurance</span>
          </div>
          <input 
            type="text" 
            name="insurance"
            placeholder="Select plan" 
            className="bg-transparent border-none outline-none text-text-dark font-medium placeholder:text-text-light w-full"
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full bg-blue-primary hover:bg-blue-hover text-white rounded-xl h-12 text-base font-semibold">
        <Search className="w-5 h-5 mr-2" />
        Search doctors
      </Button>
    </form>
  );
}
