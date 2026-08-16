'use client'

import React from 'react'
import ChatList from './chat-list'

const Sidebar = () => {
    return (
        <div className='border-r border-zinc-200 p-3 dark:border-zinc-800'>
            <button>Menu</button>
            <ChatList />
        </div>
    )
}

export default Sidebar
