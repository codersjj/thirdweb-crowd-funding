'use client'

import Image from "next/image"
import Link from "next/link"
import thirdwebIcon from "@public/thirdweb.svg"
import { ConnectButton, lightTheme, useActiveAccount } from "thirdweb/react"
import { client } from "../client"

const NavBar = () => {
  const account = useActiveAccount()

  return (
    <nav className="bg-slate-100 text-slate-700 border-b-2 border-b-slate-300">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div>
            <Image
              src='/thirdweb.svg'
              alt="Your Company Logo"
              width={32}
              height={32}
              style={{
                filter: 'drop-shadow(0px 0px 12px #a726a9a8)',
              }}
            />
          </div>
          <ul className="flex-1 flex justify-start items-center space-x-8 ml-8">
            <li>
              <Link href='/'>
                <span className="bg-transparent rounded-md px-3 py-2 text-sm text-slate-700 font-medium">Campaign</span>
              </Link>
            </li>
            {account && (
              <li>
                <Link href={`/dashboard/${account.address}`}>
                  <span className="bg-transparent rounded-md px-3 py-2 text-sm text-slate-700 font-medium">Dashboard</span>
                </Link>
              </li>
            )}
          </ul>
          <div className="pr-2 sm:ml-6 sm:pr-0">
            <ConnectButton
              client={client}
              theme={lightTheme()}
              detailsButton={{
                style: {
                  maxHeight: '50px'
                }
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar