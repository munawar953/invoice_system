import React from 'react'
import { Sidebar, SidebarProvider } from '../components/ui/sidebar'

const page = () => {
  return (
    <div>
    <SidebarProvider>
        <Sidebar />
    </SidebarProvider>
    </div>
  )
}

export default page