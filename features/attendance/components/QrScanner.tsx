"use client";
import { useState } from "react";
import { useQrScanner } from "../hooks/useQrScanner";

type QrScannerProps = {
  enabled: boolean;
};

export default function QrScanner({ enabled }: QrScannerProps) {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useQrScanner({
    enabled,
    onStatus: setStatus,
    onError: setError,
  });

  return (
    <div>
      <div id="qr-reader" />
      <p>{status}</p>
      <p style={{ color: "red" }}>{error}</p>
    </div>
  );
}