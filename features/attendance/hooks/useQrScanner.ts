"use client";
import { useEffect, useRef } from "react";
import api from "@/lib/api";

export function useQrScanner({
  enabled,
  onStatus,
  onError,
}: {
  enabled: boolean;
  onStatus: (msg: string) => void;
  onError?: (msg: string) => void;
}) {
  const scannerRef = useRef<any>(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      scannerRef.current?.clear();
      scannerRef.current = null;
      return;
    }

    let scannerInstance: any;

    import("html5-qrcode").then(({ Html5QrcodeScanner }) => {
      scannerInstance = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: 250 },
        false
      );

      scannerInstance.render(
        async (decodedText: string) => {
          if (isProcessingRef.current) return;
          isProcessingRef.current = true;

          try {
            const { data } = await api.post("/auth/qr", {
              qr_token: decodedText,
            });

            onStatus(
              `${data.action === "clock_in" ? "Clocked in" : "Clocked out"}: ${
                data.employee.first_name
              } — ${data.time}`
            );

            scannerInstance.clear();
          } catch (err) {
            onError?.("Invalid QR");
          } finally {
            setTimeout(() => {
              isProcessingRef.current = false;
            }, 2000);
          }
        },
        () => {}
      );

      scannerRef.current = scannerInstance;
    });

    return () => {
      scannerRef.current?.clear();
      scannerRef.current = null;
    };
  }, [enabled]);
}