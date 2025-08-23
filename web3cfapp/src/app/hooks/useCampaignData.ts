import { getContract } from "thirdweb";
import { useReadContract } from "thirdweb/react";
import { client } from "@/app/client";
import { baseSepolia } from "thirdweb/chains";

export function useCampaignData(campaignAddress: string) {
  const contract = getContract({
    client,
    chain: baseSepolia,
    address: campaignAddress,
  });

  const { data: campaignName } = useReadContract({
    contract,
    method: "function name() view returns (string)",
    params: [],
  });

  const { data: campaignDescription } = useReadContract({
    contract,
    method: "function description() view returns (string)",
    params: [],
  });

  const { data: campaignGoal, isLoading: isLoadingGoal } = useReadContract({
    contract,
    method: "function goal() view returns (uint256)",
    params: [],
  });

  const { data: campaignBalance, isLoading: isLoadingBalance } =
    useReadContract({
      contract,
      method: "function getContractBalance() view returns (uint256)",
      params: [],
    });

  let progress = 0;
  if (campaignGoal && campaignBalance) {
    progress = (Number(campaignBalance) / Number(campaignGoal)) * 100;
    if (progress > 100) progress = 100;
  }

  return {
    contract,
    campaignName,
    campaignDescription,
    campaignGoal,
    campaignBalance,
    isLoadingGoal,
    isLoadingBalance,
    progress,
  };
}
