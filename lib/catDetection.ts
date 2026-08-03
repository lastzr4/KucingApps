// Pengesahan imej kucing di client (TensorFlow.js MobileNet - ImageNet).
// Best-effort sahaja (boleh dipintas jika JS dimatikan) - tapi cukup untuk elak
// spam gambar bukan-kucing dalam komuniti.

export type CatCheckResult = {
  isCat: boolean;
  topLabel: string;
  confidence: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let modelPromise: Promise<any> | null = null;

async function getModel() {
  if (!modelPromise) {
    modelPromise = (async () => {
      const tf = await import("@tensorflow/tfjs");
      await tf.ready();
      const mobilenet = await import("@tensorflow-models/mobilenet");
      return mobilenet.load({ version: 2, alpha: 1.0 });
    })();
  }
  return modelPromise;
}

export async function checkImageIsCat(
  imgEl: HTMLImageElement
): Promise<CatCheckResult> {
  const model = await getModel();
  const predictions: { className: string; probability: number }[] =
    await model.classify(imgEl, 5);

  const catPrediction = predictions.find((p) =>
    p.className.toLowerCase().includes("cat")
  );

  if (catPrediction) {
    return {
      isCat: true,
      topLabel: catPrediction.className,
      confidence: catPrediction.probability,
    };
  }

  return {
    isCat: false,
    topLabel: predictions[0]?.className || "tidak diketahui",
    confidence: predictions[0]?.probability || 0,
  };
}

/** Klasifikasikan imej dari objectURL/dataURL (mencipta elemen <img> sendiri). */
export function checkImageUrlIsCat(url: string): Promise<CatCheckResult> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      checkImageIsCat(img).then(resolve).catch(reject);
    };
    img.onerror = () => reject(new Error("Gagal memuatkan imej untuk semakan"));
    img.src = url;
  });
}
