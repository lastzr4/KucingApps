import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { getOrCreateGuestUser } from "@/lib/session";
import { applyExpGain } from "@/lib/gamification";

const USER_EXP_GAIN = 10;
const CAT_EXP_GAIN = 5;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const catName = ((formData.get("catName") as string) || "").trim();
    const block = ((formData.get("block") as string) || "").trim();
    const note = (formData.get("note") as string) || null;

    if (!file || !catName || !block) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const user = await getOrCreateGuestUser();

    // Upload imej ke Cloudinary
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;
    const imageUrl = await uploadImageToCloudinary(dataUri);

    // Cari kucing sedia ada (nama sama, case-insensitive) atau daftar kucing baru
    let cat = await prisma.cat.findFirst({
      where: { name: { equals: catName, mode: "insensitive" } },
    });

    if (!cat) {
      cat = await prisma.cat.create({
        data: {
          name: catName,
          primaryImageUrl: imageUrl,
          currentBlock: block,
          addedByUserId: user.id,
        },
      });
    } else {
      cat = await prisma.cat.update({
        where: { id: cat.id },
        data: {
          currentBlock: block,
          primaryImageUrl: cat.primaryImageUrl ?? imageUrl,
        },
      });
    }

    await prisma.catSighting.create({
      data: {
        catId: cat.id,
        userId: user.id,
        locationBlock: block,
        imageUrl,
        note: note || undefined,
      },
    });

    // Kira EXP baru untuk user & kucing
    const userProgress = applyExpGain(user.level, user.exp, USER_EXP_GAIN);
    const catProgress = applyExpGain(cat.level, cat.exp, CAT_EXP_GAIN);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { level: userProgress.level, exp: userProgress.exp },
    });

    await prisma.cat.update({
      where: { id: cat.id },
      data: { level: catProgress.level, exp: catProgress.exp },
    });

    return NextResponse.json({
      success: true,
      cat: { id: cat.id, name: cat.name },
      user: {
        level: updatedUser.level,
        exp: updatedUser.exp,
        expGained: USER_EXP_GAIN,
      },
    });
  } catch (err) {
    console.error("[api/sightings] error", err);
    return NextResponse.json(
      { error: "Gagal menghantar sighting. Sila cuba lagi." },
      { status: 500 }
    );
  }
}
