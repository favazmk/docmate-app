import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingWizard from "@/components/BookingWizard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function BookingFlowPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  
  const dbDoctor = await prisma.doctor.findUnique({
    where: { slug: params.slug }
  });

  if (!dbDoctor || dbDoctor.status !== "Active") {
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

  const user = session?.user ? {
    name: session.user.name || "",
    email: session.user.email || ""
  } : undefined;

  return (
    <div className="bg-gray-bg min-h-screen py-8 px-4">
      <BookingWizard doctor={doctor} user={user} />
    </div>
  );
}
