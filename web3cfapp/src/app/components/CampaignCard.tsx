'use client'

import { useCampaignData } from "@/app/hooks/useCampaignData"
import Link from "next/link"

type CampaignCardProps = {
  campaignAddress: string
}

export default function CampaignCard({ campaignAddress }: CampaignCardProps) {
  const {
    campaignName,
    campaignDescription,
    campaignGoal,
    campaignBalance,
    isLoadingGoal,
    isLoadingBalance,
    progress,
  } = useCampaignData(campaignAddress)

  return (
    <div className="flex flex-col p-6 bg-white border-slate-200 rounded-lg shadow">
      {!isLoadingGoal && !isLoadingBalance && (
        <div className="relative mb-4 h-6 bg-gray-400 dark:bg-gray-700 rounded-full">
          <div className="h-6 bg-blue-600 dark:bg-blue-500 rounded-full" style={{ width: `${progress}%` }}>
            <p className="text-white text-xs p-1">${campaignBalance?.toString()}</p>
          </div>
          <p className="absolute top-0 right-0 text-white text-xs p-1">{progress.toString()}%</p>
        </div>
      )}
      <h5 className="mb-2 text-2xl font-bold">{campaignName}</h5>
      <p className="mb-3 text-gray-700 dark:text-gray-400 font-normal">{campaignDescription}</p>
      <Link
        className="mt-auto"
        href={`/campaign/${campaignAddress}`}
        passHref
      >
        <p className="inline-flex items-center px-3 py-2 bg-blue-700 rounded-lg text-white text-sm font-medium hover:bg-blue-800 focus:ring-4">
          View Campaign
          <svg className="w-3.5 h-3.5 ms-2" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 640 640"><path stroke="currentColor" strokeWidth="2" d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"/></svg>
        </p>
      </Link>
    </div>
  )
}
