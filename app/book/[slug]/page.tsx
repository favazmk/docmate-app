import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingWizard from "@/components/BookingWizard";

export const dynamic = "force-dynamic";

export default async function BookingFlowPage({ params }: { params: { slug: string } }) {
  const dbDoctor = await prisma.doctor.findUnique({
    where: { slug: params.slug }
  });

  if (!dbDoctor) {
    notFound();
  }

  const doctor = {
    slug: dbDoctor.slug,
    name: dbDoctor.name,
    specialty: dbDoctor.specialty,
    photoUrl: dbDoctor.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(dbDoctor.name)}&background=2200CC&color=fff`,
    clinicName: dbDoctor.affiliation,
    city: dbDoctor.city
  };

  return (
    <div className="bg-gray-bg min-h-screen py-8 px-4">
      <BookingWizard doctor={doctor} />
    </div>
  );
}
