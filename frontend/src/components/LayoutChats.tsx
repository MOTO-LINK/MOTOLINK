import React from 'react'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
const LayoutChats = () => {

  return (
    <div className="flex items-center justify-between w-[27rem] m-auto  pt-3 pb-2  text-textWhite">
        <div className="">
            <h1 className='text-3xl '>chats</h1>
        </div>
        <div className="flex gap-4 cursor-pointer">
            <MoreHorizIcon fontSize='large' />
        </div>
    </div>
  )
}

export default LayoutChats