'use client'

import { getContract } from "thirdweb";
import { useActiveAccount, useReadContract } from "thirdweb/react"
import { client } from "@/app/client"
import { baseSepolia } from "thirdweb/chains"
import { CROWDFUNDING_CONTRACT } from "@/app/constants/contracts"
import CampaignCard from "@/app/components/CampaignCard";
import { useState } from "react";
import { deployPublishedContract } from "thirdweb/deploys";

export default function DashboardPage() {
  const account = useActiveAccount()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const contract = getContract({
    client,
    chain: baseSepolia,
    address: CROWDFUNDING_CONTRACT,
  });

  const { data: campaigns, isLoading } = useReadContract({
    contract,
    method: "function getUserCampaigns(address _user) view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
    params: [account?.address as string]
  })

  return (
    <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <div className="flex flex-row justify-between items-center">
          <h1 className="mb-4 text-4xl font-bold">Dashboard</h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => setIsModalOpen(true)}
          >
            Create Campaign
          </button>
        </div>
        <h2 className="my-4 text-2xl font-semibold">My Campaigns:</h2>
        <div className="grid grid-cols-3 gap-4">
          {!isLoading && campaigns && campaigns.length ? (
            campaigns.map(campaign => (
              <CampaignCard
                key={campaign.campaignAddress}
                campaignAddress={campaign.campaignAddress}
              />
            ))
          ) : (
            <p>No campaigns found</p>
          )}
        </div>
        {isModalOpen && <CreateCampaignModal setIsModalOpen={setIsModalOpen} />}
      </div>
    </main>
  )
}

type CreateCampaignModalProps = {
  setIsModalOpen: (isOpen: boolean) => void;
}

const CreateCampaignModal = ({ setIsModalOpen }: CreateCampaignModalProps) => {
  const account = useActiveAccount()
  const [campaignName, setCampaignName] = useState<string>("")
  const [campaignDescription, setCampaignDescription] = useState<string>("")
  const [campaignGoal, setCampaignGoal] = useState<number>(1)
  const [campaignDurationInDays, setCampaignDurationInDays] = useState<number>(1)
  const [isDeployingContract, setIsDeployingContract] = useState<boolean>(false)

  const handleCampaignGoal = (value: number) => {
    if (value < 1) {
      setCampaignGoal(1)
    } else {
      setCampaignGoal(value)
    }
  }

  const handleCampaignLength = (value: number) => {
    if (value < 1) {
      setCampaignDurationInDays(1)
    } else {
      setCampaignDurationInDays(value)
    }
  }

  const handleDeployContract = async () => {
    setIsDeployingContract(true)

    try {
      const contractAddress = await deployPublishedContract({
        client,
        chain: baseSepolia,
        account: account!,
        contractId: "Crowdfunding",
        contractParams: {
          _name: campaignName,
          _description: campaignDescription,
          _goal: campaignGoal,
          _durationInDays: campaignDurationInDays
        },
        publisher: '0xEe29620D0c544F00385032dfCd3Da3f99Affb8B2',
        version: '1.0.7',
      })
      console.log("🚀 ~ handleDeployContract ~ contractAddress:", contractAddress)
      alert(`Campaign created successfully`)
    } catch (error) {
      console.error(error)
    } finally {
      setIsDeployingContract(false)
      setIsModalOpen(false)
    }
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 backdrop-blur-md">
      <div className="w-1/2 bg-slate-100 p-6 rounded-md">
        <div className="flex justify-between items-center">          
          <p className="text-lg font-semibold">Create a campaign</p>
          <button
            className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="campaign-name">Campaign Name:</label>
          <input
            type="text"
            id="campaign-name"
            className="px-4 py-2 bg-slate-200 rounded-md"
            placeholder="Enter campaign name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />
          <label htmlFor="campaign-description">Campaign Description:</label>
          <textarea
            id="campaign-description"
            className="px-4 py-2 bg-slate-200 rounded-md"
            placeholder="Enter campaign description"
            value={campaignDescription}
            onChange={(e) => setCampaignDescription(e.target.value)}
          ></textarea>
          <label htmlFor="campaign-goal">Campaign Goal:</label>
          <input
            type="number"
            id="campaign-goal"
            className="px-4 py-2 bg-slate-200 rounded-md"
            value={campaignGoal}
            onChange={(e) => handleCampaignGoal(parseInt(e.target.value))}
          />
          <label htmlFor="campaign-length">Campaign Length (Days):</label>
          <input
            type="number"
            id="campaign-length"
            className="px-4 py-2 bg-slate-200 rounded-md"
            value={campaignDurationInDays}
            onChange={(e) => handleCampaignLength(parseInt(e.target.value))}
          />
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDeployContract}
            disabled={isDeployingContract}
          >
            {isDeployingContract ? 'Creating Campaign...' : 'Create Campaign'}
          </button>
        </div>
      </div>
    </div>
  )
}
