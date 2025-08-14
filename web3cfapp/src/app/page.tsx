'use client'

import { getContract } from "thirdweb";
import { client } from "./client";
import { baseSepolia } from "thirdweb/chains";
import { CROWDFUNDING_CONTRACT } from "./constants/contracts";
import { useReadContract } from "thirdweb/react";
import CampaignCard from "./components/CampaignCard";

const contract = getContract({
  client: client,
  chain: baseSepolia,
  address: CROWDFUNDING_CONTRACT
})

export default function Home() {
  const { data: campaigns, isLoading } = useReadContract({
    contract,
    method: "function getAllCampaigns() external view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
    params: []
  })
    console.log("🚀 ~ Home ~ campaigns, isLoading:", campaigns, isLoading)

  return (
    <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <h1 className="mb-4 text-4xl font-bold">Campaigns:</h1>
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
      </div>
    </main>
  );
}
