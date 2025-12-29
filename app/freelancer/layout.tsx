import Header from '@/components/freelancer/header'
import Sidebar from '@/components/freelancer/sidebar'
import React, { ReactNode } from 'react'

export default function layout({ children }: { children: ReactNode }) {
    return (
       <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
             <Sidebar />
             
             <div className="flex-1 flex flex-col overflow-hidden">
               <Header />
               
               <main className="flex-1 overflow-y-auto p-6">
                 <div className="max-w-7xl mx-auto">
                   {children}
                 </div>
               </main>
             </div>
           </div>
    )
}
