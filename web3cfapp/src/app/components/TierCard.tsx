import { prepareContractCall, ThirdwebContract } from "thirdweb";
import { TransactionButton } from "thirdweb/react";

type Tier = {
  name: string;
  amount: bigint;
  backers: bigint;
}

type TierCardProps = {
  tier: Tier;
  index: number;
  contract: ThirdwebContract;
}

export default function TierCard({ tier, index, contract }: TierCardProps) {
  return (
    <div className="max-w-sm flex flex-col p-6 bg-white border border-slate-200 rounded-lg shadow">
      <div className="flex flex-row justify-between items-center">
        <p className="text-2xl font-semibold">{tier.name}</p>
        <p className="text-2xl font-semibold">
          ${tier.amount.toString()}
        </p>
      </div>
      <div className="flex flex-row justify-between items-end">
        <p className="text-xs font-semibold">Total Backers: {tier.backers.toString()}</p>
        <TransactionButton
          transaction={() => prepareContractCall({
            contract,
            method: "function fund(uint256 _tierIndex) payable",
            params: [BigInt(index)],
            value: tier.amount
          })}
          onTransactionConfirmed={() => alert("Funded successfully!")}
          style={{
            marginTop: '1rem',
            borderRadius: '0.375rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Select
        </TransactionButton>
      </div>
    </div>
  );
}
