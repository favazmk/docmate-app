import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingWizard from "@/components/BookingWizard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Cached for 5 minutes. Admin actions call revalidatePath(), so edits made
// through the dashboard still appear immediately.
export const revalidate = 300;

export default async function BookingFlowPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  
  const dbDoctor = await prisma.doctor.findUnique({
    where: { slug: params.slug },
    include: {
      clinics: {
        include: {
          hospitalGroup: true
        }
      }
    }
  });

  if (!dbDoctor || dbDoctor.status !== "Active") {
    notFound();
  }

  const doctor = {
    slug: dbDoctor.slug,
    name: dbDoctor.name,
    specialty: dbDoctor.specialty,
    photoUrl: dbDoctor.photoUrl || `https://ui-avatars.com/api/?format=png&name=${encodeURIComponent(dbDoctor.name.replace(/^(Dr\.|Dr|Prof\.|Professor)\s+/i, ''))}&background=2200CC&color=fff`,
    clinics: dbDoctor.clinics.map(c => ({
      id: c.id,
      name: c.name,
      city: c.city,
      hospitalGroup: c.hospitalGroup ? { name: c.hospitalGroup.name } : undefined
    }))
  };

  const user = session?.user ? {
    name: session.user.name || "",
    email: session.user.email || ""
  } : undefined;

  return (
    <div className="min-h-screen py-8 px-4">
      <BookingWizard doctor={doctor} user={user} />
    </div>
  );
}
