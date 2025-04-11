"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-32">
          <Skeleton circle height={128} />
        </div>
        <div className="flex-1">
          <Skeleton height={24} width={200} />
          <div className="mt-2">
            <Skeleton count={2} />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Skeleton height={20} width={150} className="mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="mb-4">
            <Skeleton height={100} />
          </div>
        ))}
      </div>
    </div>
  );
}
