import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HospitalsPage() {
  let hospitalGroups: any[] = [];

  try {
    const rawHospitals = await prisma.hospitalGroup.findMany({
      include: {
        clinics: {
          include: {
            _count: {
              select: { doctors: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' }
    });

    hospitalGroups = rawHospitals.map((h) => {
      const doctorCount = h.clinics.reduce((sum, c) => sum + c._count.doctors, 0);
      const branchCount = h.clinics.length;
      return {
        id: h.id,
        name: h.name,
        photoUrl: h.photoUrl ? h.photoUrl.split(",")[0].trim() : `https://ui-avatars.com/api/?name=${encodeURIComponent(h.name)}&background=2200CC&color=fff`,
        branchCount,
        doctorCount,
      };
    });
  } catch (e) {
    console.error("Error fetching hospitals:", e);
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">Hospital Groups & Clinics</h1>
          <p className="text-text-mid text-lg">
            Browse our network of trusted healthcare providers across the UAE.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
          {hospitalGroups.map((h) => (
            <div key={h.id} className="h-full">
              <Link
                href={`/hospitals/${h.id}`}
                className="bg-white/85 border border-gray-border/60 rounded-2xl flex flex-col hover:border-blue-primary/40 hover:shadow-xl hover:shadow-blue-primary/8 transition-[border-color,box-shadow,transform] duration-300 cursor-pointer overflow-hidden group h-full"
              >
                <div className="relative w-full h-48 bg-gray-bg border-b border-gray-border">
                  <Image src={h.photoUrl} alt={h.name} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-text-dark text-lg hover:text-blue-primary transition-colors mb-3 line-clamp-2">
                    {h.name}
                  </h3>
                  <div className="mt-auto text-sm font-semibold text-text-mid flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-primary" />
                    <span>{h.branchCount} {h.branchCount === 1 ? "branch" : "branches"} • {h.doctorCount} {h.doctorCount === 1 ? "doctor" : "doctors"}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
          {hospitalGroups.length === 0 && (
            <div className="col-span-full py-12 text-center text-text-mid">
              No hospitals found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
