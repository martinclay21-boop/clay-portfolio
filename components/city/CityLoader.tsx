"use client";

import dynamic from "next/dynamic";

const CityExperience = dynamic(
  () => import("@/components/city/CityExperience"),
  { ssr: false }
);

export default function CityLoader() {
  return <CityExperience />;
}
