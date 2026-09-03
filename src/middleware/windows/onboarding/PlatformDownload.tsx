import SolidChip from '@/components/SolidChip';
import { Box, Button } from '@mui/material';
import { DownloadIcon } from 'lucide-react';
import { useEffect, useState } from "react";

type OS =
  | "windows"
  | "macos"
  | "linux"
  | "android"
  | "ios"
  | "unknown";

type Architecture =
  | "x64"
  | "arm64"
  | "arm"
  | "x86"
  | "unknown";

export type PlatformInfo = {
  os: OS;
  architecture: Architecture;
  isMobile: boolean;
  isWindowsArm: boolean;
  isWindowsX64: boolean;
};

type UserAgentData = {
  platform?: string;
  architecture?: string;
  bitness?: string;
  model?: string;
  mobile?: boolean;
  getHighEntropyValues?: (
    hints: string[]
  ) => Promise<{
    platform?: string;
    architecture?: string;
    bitness?: string;
    model?: string;
    uaFullVersion?: string;
  }>;
};

function getUAData(): UserAgentData | undefined {
  return (
    navigator as Navigator & {
      userAgentData?: UserAgentData;
    }
  ).userAgentData;
}

function detectOS(uaData?: UserAgentData): OS {
  const ua = navigator.userAgent;

  const platform = uaData?.platform?.toLowerCase() ?? "";
  const navPlatform = navigator.platform?.toLowerCase() ?? "";

  if (
    platform.includes("windows") ||
    navPlatform.includes("win") ||
    /windows/i.test(ua)
  ) {
    return "windows";
  }

  if (
    platform.includes("mac") ||
    navPlatform.includes("mac") ||
    /macintosh|mac os x/i.test(ua)
  ) {
    return "macos";
  }

  if (/android/i.test(ua)) {
    return "android";
  }

  if (/iphone|ipad|ipod/i.test(ua)) {
    return "ios";
  }

  if (/linux/i.test(ua)) {
    return "linux";
  }

  return "unknown";
}

function normalizeArchitecture(value?: string): Architecture {
  switch (value?.toLowerCase()) {
    case "arm":
      return "arm64";

    case "arm64":
    case "aarch64":
      return "arm64";

    case "x86":
    case "ia32":
      return "x86";

    case "x86-64":
    case "x86_64":
    case "x64":
    case "amd64":
      return "x64";

    default:
      return "unknown";
  }
}

async function detectArchitecture(os: OS): Promise<Architecture> {
  const ua = navigator.userAgent;
  const uaData = getUAData();

  /*
   * ------------------------------------------------------------
   * 1. Chromium User-Agent Client Hints
   * ------------------------------------------------------------
   */

  if (uaData?.getHighEntropyValues) {
    try {
      const data = await uaData.getHighEntropyValues([
        "architecture",
        "bitness",
        "model",
        "platform",
      ]);

      const architecture = normalizeArchitecture(data.architecture);

      if (architecture !== "unknown") {
        /*
         * Windows ARM browsers may report x86/x64 because the
         * browser itself is emulated.
         *
         * "arm64" is trustworthy when explicitly reported.
         */
        if (architecture === "arm64") {
          return "arm64";
        }

        /*
         * ARM Windows machines sometimes expose ARM through the
         * device model rather than the architecture field.
         */
        if (os === "windows") {
          const model = data.model?.toLowerCase() ?? "";

          if (
            /snapdragon|qualcomm|microsoft sq|surface pro x|surface pro 9|surface laptop/i.test(
              model
            )
          ) {
            return "arm64";
          }
        }

        return architecture;
      }
    } catch {
      // Fall through to UA detection.
    }
  }

  /*
   * ------------------------------------------------------------
   * 2. Explicit ARM indicators in the User Agent
   * ------------------------------------------------------------
   */

  if (/arm64|aarch64/i.test(ua)) {
    return "arm64";
  }

  if (/\barm\b/i.test(ua)) {
    return "arm64";
  }

  /*
   * ------------------------------------------------------------
   * 3. Windows ARM-specific browser hints
   * ------------------------------------------------------------
   *
   * Some Chromium builds expose "ARM" through WOW64-related
   * information while still presenting an x64 UA.
   */

  if (os === "windows") {
    const platform = navigator.platform?.toLowerCase() ?? "";

    if (/arm64|aarch64|arm/i.test(platform)) {
      return "arm64";
    }

    /*
     * Windows ARM machines commonly present:
     *
     * Win64; x64
     *
     * because the browser is running under emulation.
     *
     * Unfortunately there is no universally reliable synchronous
     * browser API that distinguishes this from native x64.
     *
     * We therefore inspect known ARM device names.
     */

    if (
      /snapdragon|qualcomm|surface pro x|surface pro 9|surface laptop 7|copilot\+ pc/i.test(
        ua
      )
    ) {
      return "arm64";
    }
  }

  /*
   * ------------------------------------------------------------
   * 4. Standard x64 detection
   * ------------------------------------------------------------
   */

  if (/x86_64|win64|wow64|x64|amd64/i.test(ua)) {
    return "x64";
  }

  /*
   * ------------------------------------------------------------
   * 5. 32-bit x86
   * ------------------------------------------------------------
   */

  if (/x86|i[3-6]86|ia32/i.test(ua)) {
    return "x86";
  }

  /*
   * ------------------------------------------------------------
   * 6. Apple
   * ------------------------------------------------------------
   */

  if (os === "macos") {
    /*
     * Intel Macs explicitly contain "Intel Mac".
     */
    if (/intel mac/i.test(ua)) {
      return "x64";
    }

    /*
     * Modern Macs are Apple Silicon unless explicitly Intel.
     */
    return "arm64";
  }

  return "unknown";
}

export async function detectPlatform(): Promise<PlatformInfo> {
  const uaData = getUAData();

  const os = detectOS(uaData);
  const architecture = await detectArchitecture(os);

  return {
    os,
    architecture,
    isMobile:
      uaData?.mobile ??
      /android|iphone|ipad|ipod/i.test(navigator.userAgent),

    isWindowsArm: os === "windows" && architecture === "arm64",
    isWindowsX64: os === "windows" && architecture === "x64",
  };
}

export function usePlatform(): PlatformInfo | null {
  const [platform, setPlatform] = useState<PlatformInfo | null>(null);

  useEffect(() => {
    let cancelled = false;

    detectPlatform().then((result) => {
      if (!cancelled) {
        setPlatform(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return platform;
}

export function PlatformDownloadButton() {
  const platform = usePlatform();

  if (!platform) {
    return null;
  }

  let downloadUrl: string | null = null;

  if (platform.os === "windows") {
    if (platform.architecture === "arm64") {
      downloadUrl = "/downloads/myapp-windows-arm64.exe";
    } else if (platform.architecture === "x64") {
      downloadUrl = "/downloads/myapp-windows-x64.exe";
    }
  }

  if (platform.os === "macos") {
    downloadUrl =
      platform.architecture === "arm64"
        ? "/downloads/myapp-macos-arm64.dmg"
        : "/downloads/myapp-macos-x64.dmg";
  }

  if (platform.os === "linux") {
    downloadUrl =
      platform.architecture === "arm64"
        ? "/downloads/myapp-linux-arm64.AppImage"
        : "/downloads/myapp-linux-x64.AppImage";
  }


  return (<>

    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

      <Button variant="contained" startIcon={<DownloadIcon size={16} />}>Download Indexer</Button>

      {platform.os === 'windows' && <SolidChip label="🪟 Windows" fontSize={13} height={32} minWidth={90} />}
      {platform.os === 'macos' && <SolidChip label="🍎 macOS" fontSize={13} height={32} minWidth={80} />}
      {platform.os === 'linux' && <SolidChip label="🐧 Linux" fontSize={13} height={32} minWidth={80} />}

      <SolidChip count={platform.architecture}  label="Architecture" fontSize={13} height={32} minWidth={130} />

    </Box>


    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

      <Button variant="contained" startIcon={<DownloadIcon size={16} />}>Download Indexer</Button>

      {platform.os === 'windows' && <SolidChip label="🪟 Windows" fontSize={13} height={32} minWidth={90} />}
      {platform.os === 'macos' && <SolidChip label="🍎 macOS" fontSize={13} height={32} minWidth={80} />}
      {platform.os === 'linux' && <SolidChip label="🐧 Linux" fontSize={13} height={32} minWidth={80} />}

      <SolidChip count={platform.architecture}  label="Architecture" fontSize={13} height={32} minWidth={130} />

    </Box>
  </>
  );
}
