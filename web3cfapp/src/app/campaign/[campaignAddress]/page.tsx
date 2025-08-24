'use client'

import { client } from "@/app/client"
import { useParams } from "next/navigation"
import { useCampaignData } from "@/app/hooks/useCampaignData"
import { lightTheme, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react"
import TierCard from "@/app/components/TierCard"
import { useState } from "react"
import { prepareContractCall, ThirdwebContract } from "thirdweb"


export default function CampaignPage() {
  const  { campaignAddress } = useParams()
  console.log("🚀 ~ CampaignPage ~ campaignAddress:", campaignAddress)
  const [isEditing, setIsEditing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const account = useActiveAccount()

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
        {account?.address === owner && (
          <div className="flex flex-row">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Done" : "Edit"}
            </button>
          </div>
        )}
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
                <TierCard
                  key={index}
                  tier={tier}
                  index={index}
                  contract={contract}
                  isEditing={isEditing}
                />
             ))
            ) : !isEditing && (
              <p>No tiers available for this campaign.</p>
            )
          )}
          {isEditing && (
            <button
              className="max-w-sm flex flex-col justify-center items-center text-center p-6 bg-blue-500 text-white rounded-lg"
              onClick={() => setIsModalOpen(true)}
            >
              + Add Tier
            </button>
          )}
        </div>
        {isModalOpen && (
          <CreateTierModal setIsModalOpen={setIsModalOpen} contract={contract} />
        )}
      </div>
    </main>
  )
}

type CreateTierModalProps = {
  setIsModalOpen: (value: boolean) => void
  contract: ThirdwebContract
}

const CreateTierModal = ({
  setIsModalOpen,
  contract
}: CreateTierModalProps) => {
  const [tierName, setTierName] = useState<string>("")
  const [tierAmount, setTierAmount] = useState<bigint>(1n)

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 backdrop-blur-md">
      <div className="w-1/2 bg-slate-100 p-6 rounded-md">
        <div className="flex justify-between items-center">          
          <p className="text-lg font-semibold">Create a Funding Tier</p>
          <button
            className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="tier-name">Tier Name:</label>
          <input
            type="text"
            id="tier-name"
            className="px-4 py-2 bg-slate-200 rounded-md"
            placeholder="Enter tier name"
            value={tierName}
            onChange={(e) => setTierName(e.target.value)}
          />
          <label htmlFor="tier-amount">Tier Cost:</label>
          <input
            type="number"
            id="tier-amount"
            className="px-4 py-2 bg-slate-200 rounded-md"
            value={tierAmount.toString()}
            onChange={(e) => setTierAmount(BigInt(e.target.value))}
          />
          <TransactionButton
            transaction={() => prepareContractCall({
              contract,
              method: "function addTier(string _name, uint256 _amount)",
              params: [tierName, tierAmount]
            })}
            onTransactionConfirmed={() => {
              alert("Tier added successfully!")
              setIsModalOpen(false)
            }}
            theme={lightTheme()}
          >
            Add Tier
          </TransactionButton>
        </div>
      </div>
    </div>
  )
}
