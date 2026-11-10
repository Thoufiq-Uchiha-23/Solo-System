import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileEditClient } from "@/components/ProfileEditClient";

type SocialLink = { platform: string; url: string };

async function updateProfileAction(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const banner = String(formData.get("banner") ?? "").trim();

  let socialLinks: SocialLink[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("socialLinks") ?? "[]"));
    if (Array.isArray(parsed)) {
      socialLinks = parsed
        .filter((l) => l?.platform?.trim() && l?.url?.trim())
        .slice(0, 10)
        .map((l) => ({ platform: l.platform.trim(), url: l.url.trim() }));
    }
  } catch {
    socialLinks = [];
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name || null,
      image: image || null,
      banner: banner || null,
      socialLinks,
    },
  });

  revalidatePath("/profile");
}

export default async function EditProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, image: true, banner: true, socialLinks: true },
  });
  if (!user) redirect("/login");

  return (
    <ProfileEditClient
      user={{
        name: user.name,
        image: user.image,
        banner: user.banner,
        socialLinks: user.socialLinks as SocialLink[] | null,
      }}
      updateProfileAction={updateProfileAction}
    />
  );
}