"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { MapProps } from "./index";

const ClientSideMapView = dynamic(() => import("./index"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded-lg animate-pulse" />
  ),
});

const DynamicMapView: React.FC<MapProps> = (props) => {
  return (
    <Suspense
      fallback={<div className="w-full h-full bg-gray-100 rounded-lg" />}
    >
      <ClientSideMapView {...props} />
    </Suspense>
  );
};

export default DynamicMapView;
