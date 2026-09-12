"use client";

import { useEffect } from "react";
import { initPageTracking } from "@/lib/tracking";

/**
 * Initialise le tracking au chargement de la page :
 * — capture et persistance des UTM (instagram / tiktok / facebook ads…)
 * — événement PageView (Meta Pixel + GA4)
 */
export default function TrackingInit() {
  useEffect(() => {
    initPageTracking();
  }, []);

  return null;
}
