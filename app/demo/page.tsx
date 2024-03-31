'use client'

import CustomNodeHOC from '@/components/custom/CustomNodeHOC'
import { FC } from 'react'
import { ReactFlowProvider } from 'reactflow'

interface pageProps {

}

const page: FC<pageProps> = ({ }) => {
  return <ReactFlowProvider>
    {/* <CustomNodeHOC /> */}

  </ReactFlowProvider>
}

export default page