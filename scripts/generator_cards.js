// === Constants ===
const pxPerMm = 3.200;
const CARD_RATIO = 3.375 / 2.125;
const DEFAULT_CARD_WIDTH = 54;

// === Helpers ===
const qs = id => document.getElementById(id);
const hide = id => qs(id).style.display = "none";
const show = id => qs(id).style.display = "block";

function getPaperWidthMm() {
  return qs("paperType").value === "Letter" ? 195 : 190;
}

function parseCardWidth(input) {
  const str = input.trim().toLowerCase();
  if (str.endsWith("cm")) return parseFloat(str) * 10 || NaN;
  if (str.endsWith("mm")) return parseFloat(str) || NaN;
  return parseFloat(str) || NaN;
}

// === Main Logic ===
function generate() {
  if (typeof cards === "undefined") {
    alert("Image list not loaded. Please refresh and try again.");
    return;
  }

  const mmWidth = getPaperWidthMm();
  let cardWidthMm = parseCardWidth(qs("cardSize").value);

  if (!cardWidthMm || cardWidthMm <= 0) {
    alert("Invalid width. Resetting to default value.");
    cardWidthMm = DEFAULT_CARD_WIDTH;
    qs("cardSize").value = DEFAULT_CARD_WIDTH + " mm";
  }

  const cardHeightMm = cardWidthMm * CARD_RATIO;
  const cardsPerRow = Math.floor(mmWidth / cardWidthMm);

  hide("start_form");
  show("images");

  const preview = qs("preview-area");
  const print = qs("print-area");
  preview.innerHTML = "";
  print.innerHTML = "";
  print.style.setProperty("--safe-width", mmWidth + "mm");

  let row;

  cards.forEach((src, i) => {
    // Preview image
    const imgPrev = createImage(src, i, cardWidthMm, cardHeightMm, true);
    imgPrev.onclick = () => {
      imgPrev.remove();
      qs("print" + i)?.remove();
      rebuildPrint(print, cardWidthMm, cardHeightMm, mmWidth);
    };
    preview.appendChild(imgPrev);

    // Print image
    if (i % cardsPerRow === 0) {
      row = document.createElement("div");
      row.className = "print-row";
      print.appendChild(row);
    }
    row.appendChild(createImage(src, i, cardWidthMm, cardHeightMm, false));
  });
}

function createImage(src, idx, wMm, hMm, isPreview) {
  const img = document.createElement("img");
  img.src = src;
  img.className = "card";
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
  const imgs = Array.from(print.querySelectorAll("img.card"));
  print.innerHTML = "";
  const cardsPerRow = Math.floor(mmWidth / wMm);
  let row;

  imgs.forEach((img, idx) => {
    if (idx % cardsPerRow === 0) {
      row = document.createElement("div");
      row.className = "print-row";
      print.appendChild(row);
    }
    row.appendChild(img);
  });
}
