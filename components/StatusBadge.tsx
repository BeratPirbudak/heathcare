import { StatusIcon } from '@/constants'
import clsx from 'clsx'
import React from 'react'
import Image from 'next/image'

const StatusBadge = ({status}: {status : Status}) => {
  return (
    <div className={clsx('status-badge', {
        'bg-green-600 ': status === 'pending',
        'bg-blue-600 ': status === 'scheduled',
        'bg-red-600': status === 'cancelled',
    })}>

        <Image 
            src={StatusIcon[status]}
            height={24}
            width={24}
            alt={status}
            className='h-fit w-3'
        />

        <p className={clsx('text-12-semibold capitalize',{
            'text-green-500 ': status === 'pending',
            'text-blue-500 ': status === 'scheduled',
            'text-red-500': status === 'cancelled',
        })}>{status}</p>
            

    </div>
  )
}

export default StatusBadge