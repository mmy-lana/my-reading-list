const WATERMARK_PREFIX = "mmy-lana-";

function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getWatermarkSignature(): string {
  let sig = sessionStorage.getItem("_sys_wm_sig");
  if (!sig) {
    sig = `${WATERMARK_PREFIX}${generateUUID()}`;
    sessionStorage.setItem("_sys_wm_sig", sig);
  }
  return sig;
}

export function injectWatermark(target?: HTMLElement | null): void {
  const signature = getWatermarkSignature();
  const rootElement = target || document.getElementById("root") || document.documentElement;

  if (rootElement) {
    rootElement.setAttribute("data-signature", signature);
    rootElement.setAttribute("data-owner", "M1yuki-Reading-List");
  }

  // Stylized console watermark logging
  if (!(window as unknown as { _wm_logged?: boolean })._wm_logged) {
    console.log(
      `%c M1yuki Read %c ${signature} `,
      "background: #D946EF; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;",
      "background: #1A202C; color: #D946EF; font-weight: bold; padding: 4px 8px; border-radius: 0 4px 4px 0;"
    );
    (window as unknown as { _wm_logged?: boolean })._wm_logged = true;
  }
}