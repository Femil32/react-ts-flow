import { FC } from 'react'
import { Handle, Position } from 'reactflow';

export type NodeProps<T = any> = {
  id: string;
  data: T;
  dragHandle?: boolean;
  type?: string;
  selected?: boolean;
  isConnectable?: boolean;
  zIndex?: number;
  xPos: number;
  yPos: number;
  dragging: boolean;
  targetPosition?: Position;
  sourcePosition?: Position;
};

interface CustomNodeHOCProps extends NodeProps { }

const CustomNodeHOC = ({ }) => {
  return <div>
    <div className='flex h-full max-w-96 bg-red-100'>
      <div className='flex flex-col h-full'>
        <div className='flex'>
          <span>drag</span>
          <h5>Filter</h5>
        </div>
        <div>22</div>
        <div>Run</div>
      </div>
      {/* <div className='h-full bg-gray-400'>sdsd</div> */}
    </div>
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
  </div>
}

export default CustomNodeHOC