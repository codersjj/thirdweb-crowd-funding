'use client'

import { client } from "@/app/client"
import { useParams } from "next/navigation"
import { useCampaignData } from "@/app/hooks/useCampaignData"
import { useReadContract } from "thirdweb/react"
import TierCard from "@/app/components/TierCard"


export default function CampaignPage() {
  const  { campaignAddress } = useParams()
  console.log("🚀 ~ CampaignPage ~ campaignAddress:", campaignAddress)

  const {
    contract,
    campaignName,
    campaignDescription,
    campaignGoal,
    campaignBalance,
    isLoadingGoal,
    isLoadingBalance,
    progress,
  } = useCampaignData(campaignAddress as string)

  const { data: deadline, isLoading: isLoadingDeadline } = useReadContract({
    contract,
    method: "function deadline() view returns (uint256)",
    params: [],
  })

  const deadlineDate = new Date(Number(deadline ?? 0) * 1000)
  console.log("🚀 ~ CampaignPage ~ deadlineDate:", deadlineDate)
  const deadlineDatePassed = deadlineDate < new Date()

  const { data: tiers, isLoading: isLoadingTiers } = useReadContract({
    contract,
    method: "function getTiers() view returns ((string name, uint256 amount, uint256 backers)[])",
    params: [],
  })

  const { data: owner, isLoading: isLoadingOwner } = useReadContract({
    contract,
    method: "function owner() view returns (address)",
    params: [],
  })

  const { data: state, isLoading: isLoadingState } = useReadContract({
    contract,
    method: "function state() view returns (uint8)",
    params: [],
  })

  return (
    <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
      <div className="flex flex-row justify-between items-center">
        <p className="text-4xl font-bold">{campaignName}</p>
      </div>
      <div className="my-4">
        <p className="text-lg font-semibold">Description:</p>
        <p>{campaignDescription}</p>
      </div>
      <div className="">
        <p className="text-lg font-semibold">Deadline:</p>
        {!isLoadingDeadline && (
          <p>{deadlineDate.toDateString()}</p>
        )}
      </div>
      {!isLoadingGoal && !isLoadingBalance && (
        <div className="mt-4">
          <p className="font-bold mb-2">Campaign Goal: ${campaignGoal?.toString()}</p>
          <div className="relative mb-4 h-6 bg-gray-400 dark:bg-gray-700 rounded-full">
            <div className="h-6 bg-blue-600 dark:bg-blue-500 rounded-full" style={{ width: `${progress}%` }}>
              <p className="text-white text-xs p-1">${campaignBalance?.toString()}</p>
            </div>
            <p className="absolute top-0 right-0 text-white text-xs p-1">{progress.toString()}%</p>
          </div>
        </div>
      )}
      <div>
        <p className="text-lg font-semibold">Tiers:</p>
        <div className="grid grid-cols-3 gap-4">
          {isLoadingTiers ? (
            <p>Loading tiers...</p>
          ) : (
            tiers && tiers.length ? (
              tiers.map((tier, index) => (
                <TierCard key={index} tier={tier} index={index} contract={contract} />
             ))
            ) : (
              <p>No tiers available for this campaign.</p>
            )
          )}
        </div>
      </div>
    </main>
  )
}