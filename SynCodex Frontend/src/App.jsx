import { useState } from 'react'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='container bg-amber-400 mx-auto'>
        <h1 className='text-8xl text-blue-700'>Hello World</h1>
      </div>
    </>
  )
}

export default App
