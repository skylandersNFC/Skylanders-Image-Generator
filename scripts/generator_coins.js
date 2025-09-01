// === Constants ===
const pxPerMm = 7;
const DEFAULT_COINS_WIDTH = 26;

// === Helpers ===
const qs = id => document.getElementById(id);
const hide = id => qs(id).style.display = "none";
const show = id => qs(id).style.display = "block";

function getPaperWidthMm() {
  return qs("paperType").value === "Letter" ? 195 : 190;
}

function parseCoinWidth(input) {
  const str = input.trim().toLowerCase();
  if (str.endsWith("cm")) return parseFloat(str) * 10 || NaN;
  if (str.endsWith("mm")) return parseFloat(str) || NaN;
  return parseFloat(str) || NaN;
}

// === Main Logic ===
function generate() {
  if (typeof coins === "undefined") {
    alert("Image list not loaded. Please refresh and try again.");
    return;
  }

  const mmWidth = getPaperWidthMm();
  let coinWidthMm = parseCoinWidth(qs("coinSize").value);

  if (!coinWidthMm || coinWidthMm <= 0) {
    alert("Invalid width. Resetting to default value.");
    coinWidthMm = DEFAULT_COINS_WIDTH;
    qs("coinSize").value = DEFAULT_COINS_WIDTH + " mm";
  }

  const coinHeightMm = coinWidthMm;
  const coinsPerRow = Math.floor(mmWidth / coinWidthMm);

  hide("start_form");
  show("images");

  const preview = qs("preview-area");
  const print = qs("print-area");
  preview.innerHTML = "";
  print.innerHTML = "";
  print.style.setProperty("--safe-width", mmWidth + "mm");

  let row;

  coins.forEach((src, i) => {
    // Preview image
    const imgPrev = createImage(src, i, coinWidthMm, coinHeightMm, true);
    imgPrev.onclick = () => {
      imgPrev.remove();
      qs("print" + i)?.remove();
      rebuildPrint(print, coinWidthMm, coinHeightMm, mmWidth);
    };
    preview.appendChild(imgPrev);

    // Print image
    if (i % coinsPerRow === 0) {
      row = document.createElement("div");
      row.className = "print-row";
      print.appendChild(row);
    }
    row.appendChild(createImage(src, i, coinWidthMm, coinHeightMm, false));
  });
}

function createImage(src, idx, wMm, hMm, isPreview) {
  const img = document.createElement("img");
  img.src = src;
  img.className = "coin";
  img.id = (isPreview ? "prev" : "print") + idx;

  if (isPreview) {
    img.style.width  = (wMm * pxPerMm) + "px";
    img.style.height = (hMm * pxPerMm) + "px";
  } else {
    img.style.setProperty("--w-mm", wMm + "mm");
    img.style.setProperty("--h-mm", hMm + "mm");
  }
  return img;
}

function rebuildPrint(print, wMm, hMm, mmWidth) {
  const imgs = Array.from(print.querySelectorAll("img.coin"));
  print.innerHTML = "";
  const coinsPerRow = Math.floor(mmWidth / wMm);
  let row;

  imgs.forEach((img, idx) => {
    if (idx % coinsPerRow === 0) {
      row = document.createElement("div");
      row.className = "print-row";
      print.appendChild(row);
    }
    row.appendChild(img);
  });
}
